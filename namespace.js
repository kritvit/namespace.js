
/*!
 * namespace.js v1.1.1
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

(function InitNS (nsSettings) {

	'use strict';

	var win 				= window,
		keyDefine 			= 'define',
		keyInitNS 			= 'InitNS',
		keyGlobal 			= 'global',
		keyNS_SETTINGS 		= 'NAMESPACE_SETTINGS',
		keyPrototype 		= 'prototype',
		keyConsole 			= 'console',
		keyLength 			= 'length',
		keyPush 			= 'push',
		minTrue 			= !0,
		minLogType 			= 'warn',
		minIsAlreadyDefined = ' is already defined',
		settings 			= isObject(nsSettings) ? nsSettings : (isObject(win[keyNS_SETTINGS]) ? win[keyNS_SETTINGS] : {}),
		namespace 			= settings.NS || 'NS',
		minLogDefine 		= namespace+'.'+keyDefine,
		reservedKeywords 	= settings.reserve || [];

	if (win[namespace]) {

		log(namespace+minIsAlreadyDefined);

		return;

	} else {

		win[namespace] = new Namespace();

	}

	function Namespace () {

		// Setup features
		for (var key in settings[keyDefine]) {

			if (isDefined(settings[keyDefine][key])) {

				this[key] = settings[keyDefine][key];

			}

		}

	}

	reservedKeywords[keyPush](keyDefine);

	Namespace[keyPrototype][keyDefine] = function define (name, value, force) {

		name = trim(name);

		if (!name[keyLength]) {

			return;

		}

		var scope 	= this,
			path 	= name.split('.'),
			isLast,
			index;

		for (index = 0; index < path[keyLength]; index++) {
			
			if (isReserved(path[0], force)) {

				// First scope level is blocked from being added. Defined in '+namespace+'.CORE.reservedKeywords.SCOPE.
				log(minLogDefine+'(\''+path[0]+'\') is reserved');

				break;

			}

			isLast = path[keyLength] === index+1;

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
					errorSurplus 	= errorArray[keyLength] - errorIndex;

				errorArray.splice(errorIndex, errorSurplus);

				log(minLogDefine+'(\''+path.join('.')+'\')'+minIsAlreadyDefined);

				break;
			}

		}
	};

	// prototype.InitNS
	reservedKeywords[keyPush](keyInitNS);
	Namespace[keyPrototype][keyInitNS] = InitNS;

	// prototype.global
	Namespace[keyPrototype][keyGlobal] = {};

	function trim (str) {

		return typeof str === 'string' ? str.replace(/\s+/g, '') : '';

	}

	function isDefined (value) {

		return typeof value !== 'undefined';

	}

	function isObject (value) {

		return (isDefined(value) && value.constructor === Object);

	}

	function isReserved (word, force) {

		var returnVal = !minTrue;

		if (force !== minTrue) {

			for (var i = 0; i < reservedKeywords[keyLength]; i++) {
				if (reservedKeywords[i] === word) {
					returnVal = minTrue;
					break;
				}
			}

		}

		return returnVal;
	}

	function log (msg) {

		if (settings.debug === minTrue && win[keyConsole] && win[keyConsole][minLogType]) {

			win[keyConsole][minLogType](msg);

		}

	}

}(NAMESPACE_SETTINGS));
