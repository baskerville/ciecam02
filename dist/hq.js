"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.toNotation = exports.fromNotation = exports.toHue = exports.fromHue = undefined;

var _helpers = require("./helpers");

var _Math = Math;
var floor = _Math.floor;

var uniqueHues = [{ s: "R", h: 20.14, e: 0.8, H: 0 }, { s: "Y", h: 90.00, e: 0.7, H: 100 }, { s: "G", h: 164.25, e: 1.0, H: 200 }, { s: "B", h: 237.53, e: 1.2, H: 300 }, { s: "R", h: 380.14, e: 0.8, H: 400 }];

var hueSymbols = uniqueHues.map(function (v) {
	return v.s;
}).slice(0, -1).join("");

function fromHue(h) {
	if (h < uniqueHues[0].h) {
		h += 360;
	}
	var j = 0;
	while (uniqueHues[j + 1].h < h) {
		j++;
	}
	var d_j = (h - uniqueHues[j].h) / uniqueHues[j].e,
	    d_k = (uniqueHues[j + 1].h - h) / uniqueHues[j + 1].e,
	    H_j = uniqueHues[j].H;
	return H_j + 100 * d_j / (d_j + d_k);
}

function toHue(H) {
	var j = floor(H / 100);
	var amt = H % 100;

	var _uniqueHues$slice = uniqueHues.slice(j, j + 2);

	var _uniqueHues$slice2 = _slicedToArray(_uniqueHues$slice, 2);

	var _uniqueHues$slice2$ = _uniqueHues$slice2[0];
	var e_j = _uniqueHues$slice2$.e;
	var h_j = _uniqueHues$slice2$.h;
	var _uniqueHues$slice2$2 = _uniqueHues$slice2[1];
	var e_k = _uniqueHues$slice2$2.e;
	var h_k = _uniqueHues$slice2$2.h;
	var h = (amt * (e_k * h_j - e_j * h_k) - 100 * h_j * e_k) / (amt * (e_k - e_j) - 100 * e_k);
	return h;
}

var shortcuts = {
	O: "RY",
	S: "YG",
	T: "G25B",
	C: "GB",
	A: "B25G",
	V: "B25R",
	M: "BR",
	P: "R25B"
};

function fromNotation(N) {
	var _N$match = N.match(/^([a-z])(?:(.+)?([a-z]))?$/i);

	var _N$match2 = _slicedToArray(_N$match, 4);

	var H1 = _N$match2[1];
	var P = _N$match2[2];
	var H2 = _N$match2[3];

	if (H2 === undefined) {
		H2 = H1;
	}
	if (P === undefined) {
		P = "50";
	}

	var _map = [H1, H2].map(function (v) {
		v = v.toUpperCase();
		var sc = shortcuts[v];
		return sc ? fromNotation(sc) : 100 * hueSymbols.indexOf(v);
	});

	var _map2 = _slicedToArray(_map, 2);

	H1 = _map2[0];
	H2 = _map2[1];

	P = parseFloat(P) / 100;
	return (0, _helpers.corLerp)(H1, H2, P, "H");
}

function toNotation(H) {
	var i = floor(H / 100),
	    j = (i + 1) % hueSymbols.length,
	    p = H - i * 100;
	if (p > 50) {
		var _ref = [j, i];
		i = _ref[0];
		j = _ref[1];

		p = 100 - p;
	}
	if (p < 1) {
		return hueSymbols[i];
	} else {
		return hueSymbols[i] + p.toFixed() + hueSymbols[j];
	}
}

exports.fromHue = fromHue;
exports.toHue = toHue;
exports.fromNotation = fromNotation;
exports.toNotation = toNotation;