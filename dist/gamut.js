"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ciebase = require("ciebase");

var _helpers = require("./helpers");

function Gamut(xyz, cam) {
	var epsilon = arguments.length <= 2 || arguments[2] === undefined ? 1e-6 : arguments[2];
	var ZERO = -epsilon;
	var ONE = 1 + epsilon;
	var _Math = Math;
	var min = _Math.min;
	var max = _Math.max;

	var _map = ["000", "fff"].map(function (hex) {
		return cam.fromXyz(xyz.fromRgb(_ciebase.rgb.fromHex(hex)));
	});

	var _map2 = _slicedToArray(_map, 2);

	var camBlack = _map2[0];
	var camWhite = _map2[1];

	function contains(CAM) {
		var RGB = xyz.toRgb(cam.toXyz(CAM)),
		    isInside = RGB.map(function (v) {
			return v >= ZERO && v <= ONE;
		}).reduce(function (a, b) {
			return a && b;
		}, true);
		return [isInside, RGB];
	}

	function limit(camIn, camOut) {
		var prec = arguments.length <= 2 || arguments[2] === undefined ? 1e-3 : arguments[2];

		while ((0, _helpers.distance)(camIn, camOut) > prec) {
			var camMid = (0, _helpers.lerp)(camIn, camOut, 0.5);

			var _contains = contains(camMid);

			var _contains2 = _slicedToArray(_contains, 1);

			var isInside = _contains2[0];

			if (isInside) {
				camIn = camMid;
			} else {
				camOut = camMid;
			}
		}
		return camIn;
	}

	function spine(t) {
		return (0, _helpers.lerp)(camBlack, camWhite, t);
	}

	function crop(RGB) {
		return RGB.map(function (v) {
			return max(ZERO, min(ONE, v));
		});
	}

	return { contains: contains, limit: limit, spine: spine, crop: crop };
}

exports.default = Gamut;
module.exports = exports['default'];