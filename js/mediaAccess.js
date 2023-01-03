/**
 * @author @wojtekxtx
 * @class media/access
 * @description Defines access to user media devices and controls app permissions.
 * @todo set more granular properties for each device
 * @see https://4programmers.net/Forum/JavaScript/365524-dostep_do_mikrofonu_i_co_dalej_jak_korzystac_z_webrtc
 * @version 0.0.1
 */
function getAllAvailableUserMedia() {
  return [
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: false,
      })
      .then(function Stream() {
        // Do sth with media stream
      })
      .catch(function (error) {
        // Handle error
      }),
  ];
}