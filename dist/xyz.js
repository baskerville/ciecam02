"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _matrix = require("./matrix");

var matrix = _interopRequireWildcard(_matrix);

var _illuminant = require("./illuminant");

var _illuminant2 = _interopRequireDefault(_illuminant);

var _workspace = require("./workspace");

// http://www.brucelindbloom.com/Eqn_RGB_XYZ_Matrix.html

var _workspace2 = _interopRequireDefault(_workspace);

function Converter() {
	var rgbSpace = arguments.length <= 0 || arguments[0] === undefined ? _workspace2["default"].sRGB : arguments[0];
	var whitePoint = arguments.length <= 1 || arguments[1] === undefined ? _illuminant2["default"].D65 : arguments[1];

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

exports["default"] = Converter;
module.exports = exports["default"];