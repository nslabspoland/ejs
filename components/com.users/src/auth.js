"use strict";

import { flatten } from "lodash";
import { promisify } from "util";
import { escape } from "validator";
import { verbose } from "winston";
import {
  elementNotParseable,
  lockOutMessage,
  lockOutTime,
  maxFailedLoginAttempts,
} from "../../../config/dev-env";
import {
  exists as _exists,
  deleteAll,
  deleteObjectField,
  deleteObjectFields,
  getObject,
  getObjectField,
  getSortedSetRange,
  getSortedSetRevRange,
  getSortedSetsMembers,
  increment,
  pexpire,
  sessionStore,
  set,
  sortedSetAdd,
  sortedSetRemove,
} from "../database";

export default function (User) {
  User.auth = {};

  User.auth.logAttempt = async function (uid, ip) {
    if (!(parseInt(uid, 10) > 0)) {
      return elementNotParseable;
    }
    const exists = await _exists(lockOutTime);
    if (exists) {
      throw new Error(lockOutMessage);
    }
    const attempts = await increment(`loginAttempts:${uid}`);
    if (attempts <= maxFailedLoginAttempts) {
      return await pexpire(`loginAttempts:${uid}`, 1000 * 60 * 60);
    }
    // Lock out the account
    await set(`lockout:${uid}`, "");
    const duration = lockOutTime;

    await delete `loginAttempts:${uid}`;
    await pexpire(`lockout:${uid}`, duration);
    await events.log({
      type: "account-locked",
      uid: uid,
      ip: ip,
    });
    throw new Error(lockOutMessage);
  };

  User.auth.getFeedToken = async function (uid) {
    if (!(parseInt(uid, 10) > 0)) {
      return;
    }
    const _token = await getObjectField(`user:${uid}`, "rss_token");
    const token = _token || utils.generateUUID();
    if (!_token) {
      await User.setUserField(uid, "rss_token", token);
    }
    return token;
  };

  User.auth.clearLoginAttempts = async function (uid) {
    await delete `loginAttempts:${uid}`;
  };

  User.auth.resetLockout = async function (uid) {
    await deleteAll([`loginAttempts:${uid}`, `lockout:${uid}`]);
  };

  const getSessionFromStore = promisify((sid, callback) =>
    sessionStore.get(sid, (err, sessObj) => callback(err, sessObj || null))
  );
  const sessionStoreDestroy = promisify((sid, callback) =>
    sessionStore.destroy(sid, (err) => callback(err))
  );

  User.auth.getSessions = async function (uid, curSessionId) {
    await cleanExpiredSessions(uid);
    const sids = await getSortedSetRevRange(`uid:${uid}:sessions`, 0, 19);
    let sessions = await Promise.all(
      sids.map((sid) => getSessionFromStore(sid))
    );
    sessions = sessions
      .map((sessObj, idx) => {
        if (sessObj && sessObj.meta) {
          sessObj.meta.current = curSessionId === sids[idx];
          sessObj.meta.datetimeISO = new Date(
            sessObj.meta.datetime
          ).toISOString();
          sessObj.meta.ip = escape(String(sessObj.meta.ip));
        }
        return sessObj && sessObj.meta;
      })
      .filter(Boolean);
    return sessions;
  };

  async function cleanExpiredSessions(uid) {
    const uuidMapping = await getObject(`uid:${uid}:sessionUUID:sessionId`);
    if (!uuidMapping) {
      return;
    }
    const expiredUUIDs = [];
    const expiredSids = [];
    await Promise.all(
      Object.keys(uuidMapping).map(async (uuid) => {
        const sid = uuidMapping[uuid];
        const sessionObj = await getSessionFromStore(sid);
        const expired =
          !sessionObj ||
          !sessionObj.hasOwnProperty("passport") ||
          !sessionObj.passport.hasOwnProperty("user") ||
          parseInt(sessionObj.passport.user, 10) !== parseInt(uid, 10);
        if (expired) {
          expiredUUIDs.push(uuid);
          expiredSids.push(sid);
        }
      })
    );
    await deleteObjectFields(`uid:${uid}:sessionUUID:sessionId`, expiredUUIDs);
    await sortedSetRemove(`uid:${uid}:sessions`, expiredSids);
  }

  User.auth.addSession = async function (uid, sessionId) {
    if (!(parseInt(uid, 10) > 0)) {
      return;
    }
    await cleanExpiredSessions(uid);
    await sortedSetAdd(`uid:${uid}:sessions`, Date.now(), sessionId);
    await revokeSessionsAboveThreshold(uid, meta.config.maxUserSessions);
  };

  async function revokeSessionsAboveThreshold(uid, maxUserSessions) {
    const activeSessions = await getSortedSetRange(
      `uid:${uid}:sessions`,
      0,
      -1
    );
    if (activeSessions.length > maxUserSessions) {
      const sessionsToRevoke = activeSessions.slice(
        0,
        activeSessions.length - maxUserSessions
      );
      await Promise.all(
        sessionsToRevoke.map((sessionId) =>
          User.auth.revokeSession(sessionId, uid)
        )
      );
    }
  }

  User.auth.revokeSession = async function (sessionId, uid) {
    verbose(`[user.auth] Revoking session ${sessionId} for user ${uid}`);
    const sessionObj = await getSessionFromStore(sessionId);
    if (sessionObj && sessionObj.meta && sessionObj.meta.uuid) {
      await deleteObjectField(
        `uid:${uid}:sessionUUID:sessionId`,
        sessionObj.meta.uuid
      );
    }
    await Promise.all([
      sortedSetRemove(`uid:${uid}:sessions`, sessionId),
      sessionStoreDestroy(sessionId),
    ]);
  };

  User.auth.revokeAllSessions = async function (uids, except) {
    uids = Array.isArray(uids) ? uids : [uids];
    const sids = await getSortedSetsMembers(
      uids.map((uid) => `uid:${uid}:sessions`)
    );
    const promises = [];
    uids.forEach((uid, index) => {
      const ids = sids[index].filter((id) => id !== except);
      if (ids.length) {
        promises.push(ids.map((s) => User.auth.revokeSession(s, uid)));
      }
    });
    await Promise.all(promises);
  };

  User.auth.deleteAllSessions = async function () {
    await batch.processSortedSet(
      "users:joindate",
      async (uids) => {
        const sessionKeys = uids.map((uid) => `uid:${uid}:sessions`);
        const sessionUUIDKeys = uids.map(
          (uid) => `uid:${uid}:sessionUUID:sessionId`
        );
        const sids = flatten(await getSortedSetRange(sessionKeys, 0, -1));

        await Promise.all([
          deleteAll(sessionKeys.concat(sessionUUIDKeys)),
          ...sids.map((sid) => sessionStoreDestroy(sid)),
        ]);
      },
      { batch: 1000 }
    );
  };
}
