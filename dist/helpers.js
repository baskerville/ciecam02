"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _moutObject = require("mout/object");

var abs = Math.abs;
var PI = Math.PI;

function degree(r) {
	var a = r * 180 / PI;
	while (a < 0) {
		a += 360;
	}
	while (a > 360) {
		a -= 360;
	}
	return a;
}

function radian(d) {
	return PI * d / 180;
}

var hueMax = {
	h: 360,
	H: 400
};

function lerp(a, b, t, cor) {
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

function cfs(str) {
	return _moutObject.merge.apply(undefined, _toConsumableArray(str.split("").map(function (v) {
		return _defineProperty({}, v, true);
	})));
}

exports.degree = degree;
exports.radian = radian;
exports.lerp = lerp;
exports.cfs = cfs;