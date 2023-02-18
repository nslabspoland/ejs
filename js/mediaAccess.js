/**
 * @author @wojtekxtx & @emabrey
 * @class media/access
 * @description Defines access to user media devices and controls app permissions.
 * @version 0.0.3
 */

import * as dotenv from 'dotenv';

export default function getAllAvailableUserMedia() {
  return [
    element = document.querySelector('video'),
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then(function Stream() {
        dotenv.config();

        /**
         * @todo: #7 rebuild using actionListener()
         * @todo: #8 make some logic that will handle playing video
         * @author: @wojtekxtx
         * @author: @emabrey
         * @var vid
         * @var video
         */
        var vid = document.getElementById('video');
        vid.addEventListener('click', function (Event) {
          Event.preventDefault();
          // See #8 on GitHub
        })


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