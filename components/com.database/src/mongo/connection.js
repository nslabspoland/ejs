"use strict";

const nconf = require("nconf");
const winston = require("winston");
const _ = require("lodash");
const { noDbCredentials } = require("../../../com.errors/errors/errorHandler");
const { dbHost, dbPort, noDefaultDbName } = require("../../../../config/dev-env");

const connection = module.exports;

connection.getConnectionString = function (mongo) {
  mongo = mongo || nconf.get("mongo");
  let usernamePassword = "";
  const uri = mongo.uri || "";
  if (mongo.username && mongo.password) {
    usernamePassword = `${mongo.username}:${encodeURIComponent(
      mongo.password
    )}@`;
  } else if (
    !uri.includes("@") ||
    !uri.slice(uri.indexOf("://") + 3, uri.indexOf("@"))
  ) {
    winston.warn(noDbCredentials);
  }

  // Sensible defaults for Mongo, if not set
  if (!mongo.host) {
    mongo.host = dbHost;
  }
  if (!mongo.port) {
    mongo.port = dbPort;
  }
  const dbName = mongo.database;
  if (dbName === undefined || dbName === "") {
    winston.warn(noDefaultDbName);
    mongo.database = "nodebb";
  }

  const hosts = mongo.host.split(",");
  const ports = mongo.port.toString().split(",");
  const servers = [];

  for (let i = 0; i < hosts.length; i += 1) {
    servers.push(`${hosts[i]}:${ports[i]}`);
  }

  return (
    uri || `mongodb://${usernamePassword}${servers.join()}/${mongo.database}`
  );
};

connection.getConnectionOptions = function (mongo) {
  mongo = mongo || nconf.get("mongo");
  const connOptions = {
    maxPoolSize: 10,
    minPoolSize: 3,
    connectTimeoutMS: 90000,
  };

  return _.merge(connOptions, mongo.options || {});
};

connection.connect = async function (options) {
  const mongoClient = require("mongodb").MongoClient;
  const connString = connection.getConnectionString(options);
  const connOptions = connection.getConnectionOptions(options);

  return await mongoClient.connect(connString, connOptions);
};
