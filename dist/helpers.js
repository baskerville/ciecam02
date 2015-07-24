"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var merge = require("mout/object/merge");
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

function cfs(str) {
	return merge.apply(undefined, _toConsumableArray(str.split("").map(function (v) {
		return _defineProperty({}, v, true);
	})));
}

module.exports = {
	degree: degree,
	radian: radian,
	cfs: cfs
};