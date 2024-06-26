'use strict';
/**
 * @fileoverview WebRTC
 */

var peerconn = require('./WebRTC/traceablepeerconnection');

module.exports = function (SIP, environment) {
  var WebRTC;

  WebRTC = {};

  WebRTC.MediaHandler = require('./WebRTC/MediaHandler')(SIP);
  WebRTC.MediaStreamManager = require('./WebRTC/MediaStreamManager')(
    SIP,
    environment,
  );

  var _isSupported;

  WebRTC.isSupported = function () {
    if (_isSupported !== undefined) {
      return _isSupported;
    }

    WebRTC.MediaStream = environment.MediaStream;
    WebRTC.getUserMedia = navigator.mediaDevices.getUserMedia;
    WebRTC.RTCPeerConnection = peerconn;
    WebRTC.RTCSessionDescription = environment.RTCSessionDescription;

    if (WebRTC.RTCPeerConnection && WebRTC.RTCSessionDescription) {
      if (WebRTC.getUserMedia) {
        const isReactNative = window.navigator.product === 'ReactNative';
        const cordova = window.cordova;
        const isCordova = !!cordova;
        const isCordovaAndroid = isCordova && cordova.platformId === 'android';
        if ((!isReactNative && !isCordova) || isCordovaAndroid) {
          WebRTC.getUserMedia = SIP.Utils.promisify(
            environment,
            'getUserMedia',
          );
        }
      }
      _isSupported = true;
    } else {
      _isSupported = false;
    }
    return _isSupported;
  };

  return WebRTC;
};
