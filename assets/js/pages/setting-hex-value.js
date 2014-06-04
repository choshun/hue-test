(function() {
	var hue = jsHue(),
		user = null;

	$(function() {
		hue.discover(onDiscoverSuccess, onDiscoverError);
		setupHexForm();
	});

	/**
	 * Callback executed after successful discovery
	 */
	
	function onLightsReady() {
		// 65535
		// (240 / 255) * 65535
		user.setLightState(2, {
			hue: 56470,
			sat: 255,
			bri: 102,
			on: false
		});
	}
	
	/**
	 * 
	 */

	function setupHexForm() {
		$("form").submit(onHexFormSubmit);
	}
	
	/**
	 * 
	 */

	function onHexFormSubmit(e) {
		var $form = $(e.target),
			$colorField = $form.find("input[name=color]");

		console.log( tinycolor($colorField.val()).toHslString() );

		return false;
	}

	/**
	 * Executed when hue discovery is successful
	 */

	function onDiscoverSuccess(bridges) {
		if(bridges.length === 0) {
			throw new Error("Bridge not found");
		} else {
			user = getUser(bridges);
			onLightsReady();
		}
	}
	
	/**
	 * Examines the full state for lights that are on
	 *
	 * @deprecated
	 */

	function findActiveLights(callback) {
		var lights = [];

		user.getFullState(function(fullstate) {
			for( var i in fullstate.lights ) {
				if( fullstate.lights[i].state.on === true ) {
					lights.push(i);
				}
			}

			callback(lights);
		});
	}

	/**
	 * Executed when hue discovery fails
	 */

	function onDiscoverError(error) {
		throw new Error("An error occurred discovering the bridge");
	}

	/**
	 * Executed when hue discovery fails
	 */

	function getUser(bridges) {
		var user = null;

		bridges.forEach(function(bridge) {
			user = hue.bridge(bridge.internalipaddress).user('newdeveloper');
			return false;
		});

		return user;
	}
})();