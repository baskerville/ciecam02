"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var floor = Math.floor;

var uniqueHues = [{ s: "R", h: 20.14, e: 0.8, H: 0 }, { s: "Y", h: 90.00, e: 0.7, H: 100 }, { s: "G", h: 164.25, e: 1.0, H: 200 }, { s: "B", h: 237.53, e: 1.2, H: 300 }, { s: "R", h: 380.14, e: 0.8, H: 400 }];

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

	var _uniqueHues$slice2$0 = _uniqueHues$slice2[0];
	var e_j = _uniqueHues$slice2$0.e;
	var h_j = _uniqueHues$slice2$0.h;
	var _uniqueHues$slice2$1 = _uniqueHues$slice2[1];
	var e_k = _uniqueHues$slice2$1.e;
	var h_k = _uniqueHues$slice2$1.h;
	var h = (amt * (e_k * h_j - e_j * h_k) - 100 * h_j * e_k) / (amt * (e_k - e_j) - 100 * e_k);
	return h;
}

exports.fromHue = fromHue;
exports.toHue = toHue;