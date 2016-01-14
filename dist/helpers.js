"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.cfs = exports.distance = exports.lerp = exports.corLerp = undefined;

var _object = require("mout/object");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _Math = Math;
var abs = _Math.abs;
var pow = _Math.pow;
var sqrt = _Math.sqrt;

var hueMax = {
	h: 360,
	H: 400
};

function corLerp(a, b, t, cor) {
	var m = hueMax[cor];
	if (m) {
		var d = abs(a - b);
		if (d > m / 2) {
			if (a > b) {
				b += m;
			} else {
				a += m;
			}
		}
	}
	return ((1 - t) * a + t * b) % (m || Infinity);
}

function lerp(start, end, t) {
	var CAM = {};
	for (var cor in start) {
		CAM[cor] = corLerp(start[cor], end[cor], t, cor);
	}
	return CAM;
}

function distance(start, end) {
	var d = 0;
	for (var cor in start) {
		d += pow(start[cor] - end[cor], 2);
	}
	return sqrt(d);
}

function cfs(str) {
	return _object.merge.apply(undefined, _toConsumableArray(str.split("").map(function (v) {
		return _defineProperty({}, v, true);
	})));
}

exports.corLerp = corLerp;
exports.lerp = lerp;
exports.distance = distance;
exports.cfs = cfs;