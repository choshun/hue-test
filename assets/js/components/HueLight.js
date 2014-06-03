/**
 * Single instance of a Hue Light, can be used to control 
 * it's various properties.
 *
 * @class HueLight
 * @typedef  {config}  params - configuration parameters.
 * @property {Integer} lightId - the unique id for a light
 */

var HueLight = function(params) {
	var opts = $.extend({
		lightId: null
	}, params);

	var MAX_VALUE = 65535,
		RESTING_STATE = 0.2,
		previousValue = 0.1,
		changeTimeout = null,
		lightData = {
			"on":true,
			"sat":255,
			"bri":255,
			"hue":0
		};
	
	/**
     * @constructor
     */

	function init() {
		gotoRestingState();
	}

	/**
	 * Sets the hue light to a new state 
	 *
	 * @param {Boolean} state
	 * @param {Number} amplitude - value between 0 and 1 indicating volume
	 * @param {Boolean} forceUpdate
     * @public
     */

	function changeLight(state, amplitude, forceUpdate) {
		var delta = Math.abs(previousValue - amplitude),
			THRESHOLD = 0.5;

		lightData.on = state;
		lightData.transitiontime = 2;

		/* 
			TODO: make changeLight more generic by removing amplitude since that
			is implementation specific
		*/
		if( delta > THRESHOLD || forceUpdate === true) {
			if( forceUpdate ) {
				lightData.hue = parseInt(MAX_VALUE * RESTING_STATE, 10);
				lightData.bri = parseInt(100, 10);
				lightData.sat = parseInt(0, 10);
			} else {
				lightData.hue = parseInt(MAX_VALUE * amplitude, 10);
				lightData.bri = parseInt(100, 10);
				lightData.sat = parseInt(255, 10);
			}

			/*
			 * TODO: remove hardcoded ip address
			 * TODO: add debug mode where a dom element can be updated to simulate the light
			 * TODO: break success out into a callback instances can execute
			 */
			$.ajax({
				type: "PUT",
				url: "http://10.10.2.163/api/newdeveloper/lights/" + opts.lightId + "/state",
				data: JSON.stringify(lightData),
				success: function(data){
					previousValue = amplitude;
					clearTimeout(changeTimeout);
					setChangeTimeout();
				},
				dataType: "json",
				contentType : "application/json"
			});
		}
	}

	/**
	 * Sets timeout used to throttle hue light by preventing it
	 * from returning to default state until a duration is elapsed
	 *
     * @private
     */

	function setChangeTimeout() {
		changeTimeout = setTimeout(function() {
			gotoRestingState();
		}, 5000);
	}

	/**
	 * Returns light back to pre-defined default state
	 *
     * @private
     */

	function gotoRestingState() {
		changeLight("on", RESTING_STATE, true);
	}

	init();

	return {
		changeLight: changeLight
	};
};