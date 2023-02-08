"use strict";

/*
 * Logger module: ability to dynamically turn on/off logging for http requests & socket.io events
 */

import { statSync, createWriteStream } from "fs";
import { join } from "path";
import { error, info } from "winston";
import { inspect } from "util";
import morgan from "morgan";
import { existsSync } from "./file";
import { config } from "./meta";

const opts = {
  /*
   * state used by Logger
   */
  express: {
    app: {},
    set: 0,
    ofn: null,
  },
  streams: {
    log: { f: process.stdout },
  },
};

/* -- Logger -- */


export function init (app) {
  opts.express.app = app;
  /* Open log file stream & initialize express logging if meta.config.logger* variables are set */
  setup();
}

export function setup () {
  setup_one("loggerPath", config.loggerPath);
}

export function setup_one (key, value) {
  /*
   * 1. Open the logger stream: stdout or file
   * 2. Re-initialize the express logger hijack
   */
  if (key === "loggerPath") {
    setup_one_log(value);
    express_open();
  }
}

export function setup_one_log (value) {
  /*
   * If logging is currently enabled, create a stream.
   * Otherwise, close the current stream
   */
  if (config.loggerStatus > 0 || config.loggerIOStatus) {
    const stream = open(value);
    if (stream) {
      opts.streams.log.f = stream;
    } else {
      opts.streams.log.f = process.stdout;
    }
  } else {
    close(opts.streams.log);
  }
}

export function open (value) {
  /* Open the streams to log to: either a path or stdout */
  let stream;
  if (value) {
    if (existsSync(value)) {
      const stats = statSync(value);
      if (stats) {
        if (stats.isDirectory()) {
          stream = createWriteStream(join(value, "nodebb.log"), {
            flags: "a",
          });
        } else {
          stream = createWriteStream(value, { flags: "a" });
        }
      }
    } else {
      stream = createWriteStream(value, { flags: "a" });
    }

    if (stream) {
      stream.on("error", (err) => {
        error(err.stack);
      });
    }
  } else {
    stream = process.stdout;
  }
  return stream;
}

export function close (stream) {
  if (stream.f !== process.stdout && stream.f) {
    stream.end();
  }
  stream.f = null;
}

export function monitorConfig (socket, data) {
  /*
   * This monitor's when a user clicks "save" in the Logger section of the admin panel
   */
  setup_one(data.key, data.value);
  io_close(socket);
  io(socket);
}

export function express_open () {
  if (opts.express.set !== 1) {
    opts.express.set = 1;
    opts.express.app.use(expressLogger);
  }
  /*
   * Always initialize "ofn" (original function) with the original logger function
   */
  opts.express.ofn = morgan("combined", { stream: opts.streams.log.f });
}

export function expressLogger (req, res, next) {
  /*
   * The new express.logger
   *
   * This hijack allows us to turn logger on/off dynamically within express
   */
  if (config.loggerStatus > 0) {
    return opts.express.ofn(req, res, next);
  }
  return next();
}

export function prepare_io_string (_type, _uid, _args) {
  /*
   * This prepares the output string for intercepted socket.io events
   *
   * The format is: io: <uid> <event> <args>
   */
  try {
    return `io: ${_uid} ${_type} ${inspect(
      Array.prototype.slice.call(_args),
      { depth: 3 }
    )}\n`;
  } catch (err) {
    info("Logger.prepare_io_string: Failed", err);
    return "error";
  }
}

/**
 * @todo #10
 * @description Restores all hijacked sockets to their original emit/on functions
 */
export function io_close (socket) {
  if (
    !socket ||
    !socket.io ||
    !socket.io.sockets ||
    !socket.io.sockets.sockets
  ) {
    return;
  }

  const clientsMap = socket.io.sockets.sockets;

  for (const [, client] of clientsMap) {
    if (client.oEmit && client.oEmit !== client.emit) {
      client.emit = client.oEmit;
    }

    if (client.$onevent && client.$onevent !== client.onevent) {
      client.onevent = client.$onevent;
    }
  }
}

export function io (socket) {
  /*
   * Go through all of the currently established sockets & hook their .emit/.on
   */

  if (
    !socket ||
    !socket.io ||
    !socket.io.sockets ||
    !socket.io.sockets.sockets
  ) {
    return;
  }

  const clientsMap = socket.io.sockets.sockets;
  for (const [, socketObj] of clientsMap) {
    io_one(socketObj, socketObj.uid);
  }
}

export function io_one (socket, uid) {
  /*
   * This function replaces a socket's .emit/.on functions in order to intercept events
   */
  function override(method, name, errorMsg) {
    return (...args) => {
      if (opts.streams.log.f) {
        opts.streams.log.f.write(prepare_io_string(name, uid, args));
      }

      try {
        method.apply(socket, args);
      } catch (err) {
        info(errorMsg, err);
      }
    };
  }

  if (socket && config.loggerIOStatus > 0) {
    // courtesy of: http://stackoverflow.com/a/9674248
    socket.oEmit = socket.emit;
    const { emit } = socket;
    socket.emit = override(emit, "emit", "Logger.io_one: emit.apply: Failed");

    socket.$onvent = socket.onevent;
    const $onevent = socket.onevent;
    socket.onevent = override(
      $onevent,
      "on",
      "Logger.io_one: $emit.apply: Failed"
    );
  }
}
