"use strict";

var pow = Math.pow;

var sRgbGamma = {
	decode: function decode(x) {
		return x <= 0.04045 ? x / 12.92 : pow((x + 0.055) / 1.055, 2.4);
	},
	encode: function encode(x) {
		return x <= 0.0031308 ? 12.92 * x : 1.055 * pow(x, 1 / 2.4) - 0.055;
	}
};

var proPhotoGamma = {
	encode: function encode(x) {
		return x < 0.001953125 ? 16 * x : pow(x, 1 / 1.8);
	},
	decode: function decode(x) {
		return x < 16 * 0.001953125 ? x / 16 : pow(x, 1.8);
	}
};

function simpleGamma(g) {
	return {
		decode: function decode(x) {
			return pow(x, g);
		},
		encode: function encode(x) {
			return pow(x, 1 / g);
		}
	};
}

var workspaces = {
	"sRGB": {
		r: { x: 0.64, y: 0.33 },
		g: { x: 0.3, y: 0.6 },
		b: { x: 0.15, y: 0.06 },
		gamma: sRgbGamma
	},
	"Adobe RGB": {
		r: { x: 0.64, y: 0.33 },
		g: { x: 0.21, y: 0.71 },
		b: { x: 0.15, y: 0.06 },
		gamma: simpleGamma(2.2)
	},
	"Wide Gamut RGB": {
		r: { x: 0.7347, y: 0.2653 },
		g: { x: 0.1152, y: 0.8264 },
		b: { x: 0.1566, y: 0.0177 },
		gamma: simpleGamma(563 / 256)
	},
	"ProPhoto RGB": {
		r: { x: 0.7347, y: 0.2653 },
		g: { x: 0.1596, y: 0.8404 },
		b: { x: 0.0366, y: 0.0001 },
		gamma: proPhotoGamma
	}
};

module.exports = workspaces;