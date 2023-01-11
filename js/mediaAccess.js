/**
 * @author @wojtekxtx
 * @class media/access
 * @description Defines access to user media devices and controls app permissions.
 * @version 0.0.1
 */

import * as dotenv from 'dotenv';

function getAllAvailableUserMedia() {
  return [
    element = document.querySelector('video'),
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then(function Stream() {
        dotenv.config();
        document.getElementById('playvid_btn') = element.play();
        element.height = 1280;
        element.width = 960;
        element.autoplay = process.env.V_AUTOPLAY;
      })
      .catch(function (e) {
        e = Error.prototype.message();
        console.error(e);
        document.getElementById('error_banner').innerHTML = e;
      })
    .then(deleteElement(element))
  ];
}