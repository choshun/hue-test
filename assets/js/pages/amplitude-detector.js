$(function() {
	var light1 = new HueLight({
		lightId: 1
	});

	var mic = new Microphone({
		onProcessAudio: function(e) {
			var amplitude = mic.getAmplitude(e),
				lightOn = true;

			light1.changeLight(lightOn, amplitude);
		}
	});
});