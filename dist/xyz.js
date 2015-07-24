"use strict";

var matrix = require("./matrix"),
    illuminant = require("./illuminant"),
    workspace = require("./workspace");

// http://www.brucelindbloom.com/Eqn_RGB_XYZ_Matrix.html
function Converter() {
	var rgbSpace = arguments.length <= 0 || arguments[0] === undefined ? workspace.sRGB : arguments[0];
	var whitePoint = arguments.length <= 1 || arguments[1] === undefined ? illuminant.D65 : arguments[1];

	var primaries = [rgbSpace.r, rgbSpace.g, rgbSpace.b];

	var M_P = matrix.transpose(primaries.map(function (v) {
		var X = v.x / v.y,
		    Y = 1,
		    Z = (1 - v.x - v.y) / v.y;
		return [X, Y, Z];
	}));

	var gamma = rgbSpace.gamma,
	    M_S = matrix.multiply(matrix.inverse(M_P), whitePoint),
	    M_RGB_XYZ = matrix.scalar(M_P, M_S),
	    M_XYZ_RGB = matrix.inverse(M_RGB_XYZ);

	return {
		fromRgb: function fromRgb(RGB) {
			return matrix.multiply(M_RGB_XYZ, RGB.map(gamma.decode));
		},
		toRgb: function toRgb(XYZ) {
			return matrix.multiply(M_XYZ_RGB, XYZ).map(gamma.encode);
		}
	};
}

module.exports = Converter;