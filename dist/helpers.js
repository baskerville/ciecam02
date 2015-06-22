"use strict";

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

function asObject(a) {
	var o = {};
	a.forEach(function (e) {
		o[e] = true;
	});
	return o;
}

module.exports = {
	degree: degree,
	radian: radian,
	asObject: asObject
};