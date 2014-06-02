
var HueLight = function(params) {
	var opts = $.extend({
		lightId: null
	}, params);

	var MAX_VALUE = 65535,
		previousValue = 0.1,
		RESTING_STATE = 0.2,
		changeTimeout = null;

	var lightData = {
		"on":true,
		"sat":255,
		"bri":255,
		"hue":0
	};

	function init() {
		gotoRestingState();
	}

	function changeLight(state, amplitude, forceUpdate) {
		var delta = Math.abs(previousValue - amplitude),
			THRESHOLD = 0.5;

		// console.log("delta: ", delta, " threshold: ", THRESHOLD);
		lightData.on = state;
		lightData.transitiontime = 2;

		if( delta > THRESHOLD || forceUpdate === true) {
			console.clear();
			console.log('CHANGE STATE');

			if( forceUpdate ) {
				lightData.hue = parseInt(MAX_VALUE * RESTING_STATE, 10);
				lightData.bri = parseInt(100, 10);
				lightData.sat = parseInt(0, 10);
			} else {
				lightData.hue = parseInt(MAX_VALUE * amplitude, 10);
				lightData.bri = parseInt(100, 10);
				lightData.sat = parseInt(255, 10);
			}	

			$.ajax({
				type: "PUT",
				url: "http://10.10.2.163/api/newdeveloper/lights/" + opts.lightId + "/state",
				data: JSON.stringify(lightData),
				success: function(data){
					//console.log('DATA?', data);
					// console.log(lightData.hue);
					previousValue = amplitude;
					clearTimeout(changeTimeout);
					setChangeTimeout();
				},
				dataType: "json",
				contentType : "application/json"
			});
		}
	}

	function setChangeTimeout() {
		changeTimeout = setTimeout(function() {
			gotoRestingState();
		}, 5000);
	}

	function gotoRestingState() {
		changeLight("on", RESTING_STATE, true);
	}

	init();

	return {
		changeLight: changeLight
	};
};

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

$(function() {
	var light1 = new HueLight({
		lightId: 1
	});

	var mic = new Microphone({
		onProcessAudio: function(e) {
			var amplitude = mic.getAmplitude(e),
				lightOn = true;

			console.log(amplitude);
			// var lightOn = (amplitude >= 0.2) ? true : false;

			light1.changeLight(lightOn, amplitude);	
		}
	});
});