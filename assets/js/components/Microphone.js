// http://www.jjask.com/379926/get-audio-levels-from-html5-audio-microphone-stream
// http://stackoverflow.com/questions/15900103/html5-audio-buffer-getting-stuck

var Microphone = function(params) {
	var opts = $.extend({
		onProcessAudo: $.noop
	}, params);

	function init() {
		var context = new webkitAudioContext();

		// console.log( typeof context );
		// console.log( typeof context.createScriptProcessor );

		navigator.webkitGetUserMedia({audio: true}, function(stream) {
			liveSource = context.createMediaStreamSource(stream);
			liveSource.connect(context.destination);

			var levelChecker = context.createScriptProcessor(4096, 1 ,1);
			liveSource.connect(levelChecker);

			levelChecker.connect(context.destination);

			levelChecker.onaudioprocess = window.audioProcess = opts.onProcessAudio;
		}, function() {
			// error state
		});
	}

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