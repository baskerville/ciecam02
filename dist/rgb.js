"use strict";

var round = Math.round;

module.exports = {
	fromHex: function fromHex(hex) {
		if (hex[0] == "#") {
			hex = hex.slice(1);
		}
		return hex.match(/../g).map(function (v) {
			return parseInt(v, 16) / 255;
		});
	},
	toHex: function toHex(RGB) {
		var hex = RGB.map(function (v) {
			v = round(255 * v).toString(16);
			if (v.length < 2) {
				v = "0" + v;
			}
			return v;
		}).join("");
		return "#" + hex;
	}
};