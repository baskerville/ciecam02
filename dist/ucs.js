"use strict";

var _require = require("./helpers");

var degree = _require.degree;
var radian = _require.radian;
var sqrt = Math.sqrt;
var pow = Math.pow;
var exp = Math.exp;
var log = Math.log;
var cos = Math.cos;
var sin = Math.sin;
var atan2 = Math.atan2;

var uniformSpaces = {
	LCD: { K_L: 0.77, c_1: 0.007, c_2: 0.0053 },
	SCD: { K_L: 1.24, c_1: 0.007, c_2: 0.0363 },
	UCS: { K_L: 1, c_1: 0.007, c_2: 0.0228 }
};

function Converter() {
	var name = arguments[0] === undefined ? "UCS" : arguments[0];
	var _uniformSpaces$name = uniformSpaces[name];
	var K_L = _uniformSpaces$name.K_L;
	var c_1 = _uniformSpaces$name.c_1;
	var c_2 = _uniformSpaces$name.c_2;

	function fromCorrelates(correlates) {
		var J = correlates.J;
		var M = correlates.M;
		var h = correlates.h;
		var h_rad = radian(h);
		var J_p = (1 + 100 * c_1) * J / (1 + c_1 * J);
		var M_p = 1 / c_2 * log(1 + c_2 * M);
		var a_p = M_p * cos(h_rad);
		var b_p = M_p * sin(h_rad);
		return { J_p: J_p, a_p: a_p, b_p: b_p };
	}

	function toCorrelates(unif) {
		var J_p = unif.J_p;
		var a_p = unif.a_p;
		var b_p = unif.b_p;
		var J = -J_p / (c_1 * J_p - 100 * c_1 - 1);
		var M_p = sqrt(pow(a_p, 2) + pow(b_p, 2));
		var M = (exp(c_2 * M_p) - 1) / c_2;
		var h_rad = atan2(b_p, a_p);
		var h = degree(h_rad);
		return { J: J, M: M, h: h };
	}

	function distance(u1, u2) {
		return sqrt(pow((u1.J_p - u2.J_p) / K_L, 2) + pow(u1.a_p - u2.a_p, 2) + pow(u1.b_p - u2.b_p, 2));
	}

	return {
		fromCorrelates: fromCorrelates,
		toCorrelates: toCorrelates,
		distance: distance
	};
}

module.exports = Converter;