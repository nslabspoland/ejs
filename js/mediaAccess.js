/**
 * @author @wojtekxtx
 * @class media/access
 * @description Defines access to user media devices and controls app permissions.
 * @see https://4programmers.net/Forum/JavaScript/365524-dostep_do_mikrofonu_i_co_dalej_jak_korzystac_z_webrtc
 * @version 0.0.1
 */
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
      })
    .then(deleteElement(element))
  ];
}