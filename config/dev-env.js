export const repoaddress = "https://github.com/nslabspl/ejs";
export const thisAppName = "Everything JS";
export const instanceType = "dev";

// Date
export const currentDate = Date.now();

/** Experimental.
 *  May cause instability.
 *  Use with caution
 */

export const ctxStatusOK = "200, OK";
export const ctxStatusRedirected = "301, Redirected";

// Is S/W ready?
export let isSWReady = navigator.serviceWorker.ready();

// Get template info
export function getTemplate(template, specialTags, pipeBeforeTags) {
  specialTags = specialTags || ["fragment"];
  pipeBeforeTags = pipeBeforeTags || [];
  return parseTemplate(specialTags, pipeBeforeTags)(template);
}

export function getKeyByID(key, run = Promise.resolve(), time = 500) {
    if (this.keys[key] && Date.now() < this.keys[key].expire) {
        return Promise.resolve(this.keys[key].value);
    }

    // If we already have one caching in progress try again in 100 ms
    if (this.keys[key] && this.keys[key].fetching) {
        return new Promise(resolve => setTimeout(() => resolve(this.get(key, run, time)), 100));
    }

    this.keys[key] = {
        fetching: true
    };

    return run().then(value => {
        this.keys[key] = {
            value: value,
            expire: Date.now() + time
        };

        return value;
    });
}

/**
 * @author @wojtekxtx
 */
// @ts-ignore
function setEnviromentVariables() {
}