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