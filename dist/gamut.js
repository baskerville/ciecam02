"use strict";

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var merge = require("mout/object/merge");
var abs = Math.abs;

function Gamut(xyz, cam) {
	function contains(CAM) {
		var epsilon = arguments[1] === undefined ? Number.EPSILON : arguments[1];

		var RGB = xyz.toRgb(cam.toXyz(CAM)),
		    zero = -epsilon,
		    one = 1 + epsilon,
		    isInside = RGB.map(function (v) {
			return v >= zero && v <= one;
		}).reduce(function (a, b) {
			return a && b;
		});
		return [isInside, RGB];
	}

	function limit(inCam, outCam) {
		var cor = arguments[2] === undefined ? "C" : arguments[2];
		var prec = arguments[3] === undefined ? 1e-3 : arguments[3];

		var bot = inCam[cor],
		    top = outCam[cor];
		while (abs(top - bot) > prec) {
			var mid = (bot + top) / 2;

			var _contains = contains(merge(inCam, _defineProperty({}, cor, mid)));

			var _contains2 = _slicedToArray(_contains, 1);

			var isInside = _contains2[0];

			if (isInside) {
				bot = mid;
			} else {
				top = mid;
			}
		}
		return merge(inCam, _defineProperty({}, cor, bot));
	}

	return {
		contains: contains,
		limit: limit
	};
}

module.exports = Gamut;