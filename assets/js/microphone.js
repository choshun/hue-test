//http://www.jjask.com/379926/get-audio-levels-from-html5-audio-microphone-stream
//http://stackoverflow.com/questions/15900103/html5-audio-buffer-getting-stuck
var context = new webkitAudioContext();

navigator.webkitGetUserMedia({audio: true}, function(stream) {
	liveSource = context.createMediaStreamSource(stream);
	liveSource.connect(context.destination);

	var levelChecker = context.createJavaScriptNode(4096, 1 ,1);
	liveSource.connect(levelChecker);

	levelChecker.connect(context.destination);

	levelChecker.onaudioprocess = window.audioProcess = function(e) {
		var buffer = e.inputBuffer.getChannelData(0);

		var maxVal = 0;
		
		for (var i = 0; i < buffer.length; i++) {
			if (maxVal < buffer[i]) {
				maxVal = buffer[i];
			}
		}

		// if(maxVal <= 0.01){
		//     console.log(0.0);
		// } else if(maxVal > 1){
		//     console.log(1);
		// } else if(maxVal > 0.2){
		//     console.log(0.2);
		// } else if(maxVal > 0.1){
		//     console.log(0.1);
		// } else if(maxVal > 0.05){
		//     console.log(0.05);
		// } else if(maxVal > 0.025){
		//     console.log(0.025);
		// } else if(maxVal > 0.01){
		//     console.log(0.01);
		// }

		if (maxVal <= 0.1) {
			changeLight('off', maxVal);
		} else {
			changeLight('on', maxVal);
		}
	};
});

function changeLight(state, maxVal) {
	var lightData = {
		"on":true,
		"sat":255,
		"bri":255,
		"hue":10000
	};

	if (state === 'on') {
		lightData.on = false;
		lightData.hue = parseInt(maxVal * 400000, 10);
		lightData.bri = parseInt(maxVal * 5000, 10);
		lightData.sat = parseInt(maxVal * 100000, 10);
	} else {
		lightData.on = true;
		lightData.hue = parseInt(maxVal * 10000, 10);
		lightData.bri = parseInt(maxVal * 10000, 10);
		lightData.sat = parseInt(maxVal * 10000, 10);
	}

	$.ajax({
		type: "PUT",
		url: "http://10.10.2.163/api/newdeveloper/lights/1/state",
		data: JSON.stringify(lightData),
		success: function(data){
			//console.log('DATA?', data);
			console.log(lightData.hue);
		},
		dataType: "json",
		contentType : "application/json"
	});
}