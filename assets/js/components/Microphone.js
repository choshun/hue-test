/**
 * see: http://www.jjask.com/379926/get-audio-levels-from-html5-audio-microphone-stream
 * see: http://stackoverflow.com/questions/15900103/html5-audio-buffer-getting-stuck
 *
 * @class Microphone
 * @typedef  {config}  params - configuration parameters.
 * @property {Function} onProcessAudio - method for processing microphone input
 */

var Microphone = function(params) {
	var opts = $.extend({
		onProcessAudio: $.noop
	}, params);

	var context = null;

	/**
     * @constructor
     */

	function init() {
		context = new webkitAudioContext();

		navigator.webkitGetUserMedia({audio: true}, onGetUserMediaSuccess, onGetUserMediaError);
	}

	/**
	 * Callback executed when navigator.webkitGetUserMedia is supported
	 *
	 * @param {Object} stream - audio stream object
     * @private
     */

	function onGetUserMediaSuccess(stream) {
		var liveSource = context.createMediaStreamSource(stream);
		liveSource.connect(context.destination);

		var levelChecker = context.createScriptProcessor(4096, 1 ,1);
		liveSource.connect(levelChecker);

		levelChecker.connect(context.destination);
		levelChecker.onaudioprocess = window.audioProcess = opts.onProcessAudio;
	}

	/**
	 * Callback executed when navigator.webkitGetUserMedia runs into an issue
	 *
	 * @param 
     * @private
     */

	function onGetUserMediaError() {
		throw new Error("webkitGetUserMedia is not available!");
	}

	/**
	 * Looks at the audio buffer and returns a value between 0 and 1 with 
	 * the stream's amplitude. 
	 *
	 * @param {Event} e - audio data
	 * @returns maxAmplitude - the maximum amplitude in the buffer
     * @public
     */

	function getAmplitude(e) {
		var buffer = e.inputBuffer.getChannelData(0),
			maxVal = 0;
		
		for (var i = 0; i < buffer.length; i++) {
			if (maxVal < buffer[i]) {
				maxVal = buffer[i];
			}
		}

		return maxVal;
	}

	init();

	return {
		getAmplitude: getAmplitude
	};
};