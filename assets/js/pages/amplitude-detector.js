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