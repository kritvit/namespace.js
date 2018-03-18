/*!
 * namespace.js v1.0.0
 *
 * @ https://github.com/kritvit/namespace.js
 *
 * License
 * -------
 * Copyright 2017-2018 Andreas Viklund
 * Released under the MIT license
 * https://raw.githubusercontent.com/kritvit/namespace.js/master/LICENSE
 *
 */

(function Initialize () {

	'use strict';

	var SETTINGS = {};

	if (typeof NAMESPACE_SETTINGS !== 'undefined' && isObject(NAMESPACE_SETTINGS)) {

		SETTINGS = NAMESPACE_SETTINGS;

	} else if (isObject(window.NAMESPACE_SETTINGS)) {

		SETTINGS = window.NAMESPACE_SETTINGS;

	}

	var NAMESPACE 		= SETTINGS.NAMESPACE || 'NS';

	var rename 			= SETTINGS.rename 	|| {},
		remove 			= SETTINGS.remove 	|| {},
		keyDefine 		= rename.define 	|| 'define',
		keyInitialize 	= rename.initialize || 'Initialize',
		keyGlobal 		= rename.global 	|| 'global';

	var reservedKeywords = SETTINGS.reservedKeywords || [];

	reservedKeywords.push(keyDefine);

	if (window[NAMESPACE]) {

		log('error', NAMESPACE+' is already defined.');

		return;

	} else {

		window[NAMESPACE] = new Namespace();

	}

	function Namespace () {
	
		var namespace = this,
			key;

		// Setup features
		for (key in SETTINGS.predefine) {

			if (isDefined(SETTINGS.predefine[key])) {

				namespace[key] = SETTINGS.predefine[key];

			}

		}

	}

	Namespace.prototype[keyDefine] = function define (name, value, force) {

		var scope 	= this,
			path 	= name.split('.'),
			isLast,
			index;

		for (index = 0; index < path.length; index++) {
			
			if (isReserved(path[0], force)) {

				// First scope level is blocked from being added. Defined in '+NAMESPACE+'.CORE.reservedKeywords.SCOPE.
				log('warn', NAMESPACE+'.'+keyDefine+'(\''+path[0]+'\'); is a reserved keyword.');

				break;

			} else {

				isLast = path.length === index+1;

				if (!isDefined(scope[path[index]])) {

					// if property doesn't exist. Add new property.
					scope[path[index]] = isLast && isDefined(value) ? value : {};

					scope = scope[path[index]];

				} else if (isObject(scope[path[index]]) && !isLast) {

					// If property is defined and is object and not the last in loop, update scope for next loop iteration.
					scope = scope[path[index]];

				} else {

					var errorArray 		= path.slice(),
						errorIndex 		= index+1,
						errorSurplus 	= errorArray.length - errorIndex;

					errorArray.splice(errorIndex, errorSurplus);

					log('info', NAMESPACE+'.'+keyDefine+'(\''+path.join('.')+'\', ..); is already defined.');

					break;
				}
			}
		}
	};

	// prototype.Initialize
	if (remove[keyInitialize] !== true) {

		reservedKeywords.push(keyInitialize);

		Namespace.prototype[keyInitialize] = Initialize;

	}

	// prototype.global
	if (remove[keyGlobal] !== true) {

		Namespace.prototype[keyGlobal] = {};

	}

	function isDefined (value) {

		return typeof value !== 'undefined';

	}

	function isObject (value) {

		return !!(value && value.constructor === Object);

	}

	function isReserved (word, force) {

		var returnVal = false;

		if (force !== true) {

			for (var i = 0; i < reservedKeywords.length; i++) {
				if (reservedKeywords[i] === word) {
					returnVal = true;
					break;
				}
			}

		}

		return returnVal;
	}

	function log (type, msg) {

		if (SETTINGS.debug === true && window.console && window.console[type]) {

			window.console[type](msg);

		}

	}

}());