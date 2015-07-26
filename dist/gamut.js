"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _rgb = require("./rgb");

var rgb = _interopRequireWildcard(_rgb);

var _ucs = require("./ucs");

var _ucs2 = _interopRequireDefault(_ucs);

var _helpers = require("./helpers");

var _moutObject = require("mout/object");

var ucs = (0, _ucs2["default"])();

function Gamut(xyz, cam) {
	var _map = ["000", "fff"].map(function (hex) {
		return cam.fromXyz(xyz.fromRgb(rgb.fromHex(hex)));
	});

	var _map2 = _slicedToArray(_map, 2);

	var camBlack = _map2[0];
	var camWhite = _map2[1];

	function contains(CAM) {
		var epsilon = arguments.length <= 1 || arguments[1] === undefined ? Number.EPSILON : arguments[1];

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
		var prec = arguments.length <= 2 || arguments[2] === undefined ? 1e-3 : arguments[2];

		var _map3 = [inCam, outCam].map(function (CAM) {
			return ucs.fromCam(cam.fillOut((0, _helpers.cfs)("JhM"), CAM));
		});

		var _map32 = _slicedToArray(_map3, 2);

		var inUcs = _map32[0];
		var outUcs = _map32[1];

		while (ucs.distance(inUcs, outUcs) > prec) {
			var midUcs = ucs.lerp(inUcs, outUcs, 0.5);

			var _contains = contains(ucs.toCam(midUcs));

			var _contains2 = _slicedToArray(_contains, 1);

			var isInside = _contains2[0];

			if (isInside) {
				inUcs = midUcs;
			} else {
				outUcs = midUcs;
			}
		}
		return cam.fillOut((0, _moutObject.map)(inCam, function (v) {
			return true;
		}), ucs.toCam(inUcs));
	}

	function spine(t) {
		var CAM = {};
		for (var cor in camBlack) {
			CAM[cor] = (0, _helpers.lerp)(camBlack[cor], camWhite[cor], t, cor);
		}
		return CAM;
	}

	return {
		contains: contains,
		limit: limit,
		spine: spine
	};
}

exports["default"] = Gamut;
module.exports = exports["default"];