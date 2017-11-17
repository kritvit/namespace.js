(function Initialize (settings) {

	'use strict';

	var SETTINGS 	= settings || {NAMESPACE: 'NS'};

	var NAMESPACE 	= SETTINGS.NAMESPACE || 'NS';

	if (window[NAMESPACE]) {

		log('error', 'window.'+NAMESPACE+' is already defined.');

		return false;

	} else {

		window[NAMESPACE] = new Namespace();

	}

	function Namespace () {
	
		var namespace = this,
			key;

		// Setup features
		for (key in SETTINGS.define) {

			if (isDefined(SETTINGS.define[key])) {

				namespace[key] = SETTINGS.define[key];

			}

		}

	}

	Namespace.prototype.SETTINGS 	= SETTINGS;

	Namespace.prototype.Initialize 	= Initialize;

	Namespace.prototype.define 		= function define (name, value, force) {

		var scope 			= this,
			scopeArray 		= name.split('.'),
			reservedScopes 	= SETTINGS.reservedScopes || null,
			index;

		for (index = 0; index < scopeArray.length; index++) {

			if (reservedScopes && reservedScopes.indexOf(scopeArray[0]) > -1 && !force) {

				// First scope level is blocked from being added. Defined in '+NAMESPACE+'.CORE.reservedScopes.SCOPE.
				log('error', NAMESPACE+'.define(\''+scopeArray[0]+'\'); is blocked from being added.');

				break;

			} else {

				if (!isDefined(scope[scopeArray[index]])) {

					// if property doesn't exist. Add new property.
					scope[scopeArray[index]] = scopeArray.length === index+1 && isDefined(value) ? value : {};

					scope = scope[scopeArray[index]];

				} else if (typeof scope[scopeArray[index]] === 'object' && value !== null && scopeArray.length !== index+1) {

					// If property is defined and is object and not the last in loop, update scope for next loop iteration.
					scope = scope[scopeArray[index]];

				} else {

					var errorArray 		= scopeArray.slice(),
						errorIndex 		= index+1,
						errorSurplus 	= errorArray.length - errorIndex;

					errorArray.splice(errorIndex, errorSurplus);

					log('warn', NAMESPACE+'.define(\''+scopeArray.join('.')+'\', ..); is already defined.');

					break;
				}
			}
		}
	};

	function isDefined (value) {

		return typeof value !== 'undefined';

	}

	function log (type, msg) {

		if (window.console && window.console[type]) {

			window.console[type](msg);

		}

	}

}(window.NAMESPACE_SETTINGS));