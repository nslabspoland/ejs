// Date (in local format)
export const currentDate = Date.now().toLocaleString();

// Bool if user is admin
export const isAdmin = process.env.isAdmin;

// Logged in user
export const userLoggedIn = process.env('loggedInUserId');

/**
 * @description Definition of error strings
 * @author @wojtekxtx
 * @todo #11 Move to separate file
 */
export const lockOutMessage = "This account has been locked out";

// Loginrelated info
export const lockOutTime = 3600;
export const maxFailedLoginAttempts = 3;

// DB
export const dbHost = "127.0.0.1";
export const dbPort = 27017;

/**
 * @author @wojtekxtx
 * @description is SW ready?
 * @returns bool
 * @todo #12 Decide upon usage of export vs. module.exports at the EOF
 */
export let isSWReady = navigator.serviceWorker.ready();

// Get template info
export function getTemplate(template, specialTags, pipeBeforeTags) {
  specialTags = specialTags || ["fragment"];
  pipeBeforeTags = pipeBeforeTags || [];
  return (
    parseTemplate(specialTags, pipeBeforeTags)(template) ||
    console.error({
      error: errTemplateNotParseable, // <- Error message
      Date: currentDate, // <- Current date (of LOGGING)
      Timestamp: Math.floor(currentDate / 1000) // <- Timestamp (date) of event OCCURANCE (in Unix format)
    })
  );
}

export function getKeyByID(key, run = Promise.resolve(), time = 500) {
  if (this.keys[key] && Date.now() < this.keys[key].expire) {
    return Promise.resolve(this.keys[key].value);
  }

  // If we already have one caching in progress try again in 100 ms
  if (this.keys[key] && this.keys[key].fetching) {
    return new Promise((resolve) =>
      setTimeout(() => resolve(this.get(key, run, time)), 100)
    );
  }

  this.keys[key] = {
    fetching: true,
  };

  return run().then((value) => {
    this.keys[key] = {
      value: value,
      expire: currentDate + time,
      comments: document.getElementById("comments_section"),
    };
    return value;
  });
}

/**
 * @author @wojtekxtx
 */
// @ts-ignore
function setEnviromentVariables() {}
