var matrix = require("./matrix");

// sRGB primaries
// http://www.brucelindbloom.com/index.html?WorkingSpaceInfo.html
var x_r = 0.64;
    y_r = 0.33;
    x_g = 0.30;
    y_g = 0.60;
    x_b = 0.15;
    y_b = 0.06;

// D65 illuminant
var refX = 0.95047,
	refY = 1.00000,
	refZ = 1.08883,
	refU = (4 * refX) / (refX + (15 * refY) + (3 * refZ)),
	refV = (9 * refY) / (refX + (15 * refY) + (3 * refZ));

// RGB<->XYZ conversion matrices
// http://www.brucelindbloom.com/Eqn_RGB_XYZ_Matrix.html
var X_r = x_r / y_r;
    Y_r = 1;
    Z_r = (1 - x_r - y_r) / y_r;

var X_g = x_g / y_g;
    Y_g = 1;
    Z_g = (1 - x_g - y_g) / y_g;

var X_b = x_b / y_b;
    Y_b = 1;
    Z_b = (1 - x_b - y_b) / y_b;

var M_P = [[X_r, X_g, X_b],
           [Y_r, Y_g, Y_b],
           [Z_r, Z_g, Z_b]];

var M_S = matrix.multiply(matrix.inverse(M_P), [refX, refY, refZ]),
    M_RGB_XYZ = matrix.scalar(M_P, M_S),
    M_XYZ_RGB = matrix.inverse(M_RGB_XYZ);

// CIE standard constants
var epsilon = Math.pow(6 / 29, 3),
	kappa = Math.pow(29 / 3, 3);

var sRGBGamma = {
	encode: function (v) {
		return (v <= 0.0031308 ? 12.92*v : 1.055*Math.pow(v, 1/2.4)-0.055);
	},
	decode: function (v) {
		return (v <= 0.04045 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4));
	}
};

function rgbToXyz (R, G, B) {
	var rgb = [R, G, B].map(sRGBGamma.decode),
		xyz = matrix.multiply(M_RGB_XYZ, rgb);
	return xyz;
}

function xyzToRgb (X, Y, Z) {
	var xyz = [X, Y, Z],
		rgb = matrix.multiply(M_XYZ_RGB, xyz);
	return rgb.map(sRGBGamma.encode);
}

function xyzToLuv (X, Y, Z) {
	var y = Y / refY,
		L = (y <= epsilon ? kappa*y : 116*Math.pow(y, 1/3)-16);
	if (L === 0) {
		return [0, 0, 0];
	}
	var u = 4 * X / (X + 15 * Y + 3 * Z),
		v = 9 * Y / (X + 15 * Y + 3 * Z),
		U = 13 * L * (u - refU),
		V = 13 * L * (v - refV);
	return [L, U, V];
}

function luvToXyz (L, U, V) {
	if (L === 0) {
		return [0, 0, 0];
	}
	var u = refU + U / (13 * L),
		v = refV + V / (13 * L),
		Y = refY * (L > kappa*epsilon ? Math.pow((L+16)/116, 3) : L/kappa),
		X = Y * (9 * u) / (4 * v),
		Z = Y * (12 - 3 * u - 20 * v) / (4 * v);
	return [X, Y, Z];
}

var NEAR_ZERO = 1e-13;

function luvToLhc (L, U, V) {
	if (L === 0 || L === 100) {
		return [L, 0, 0];
	}
	var C = Math.sqrt(Math.pow(U, 2) + Math.pow(V, 2)),
		H = 180 * Math.atan2(V, U) / Math.PI;
	while (H < 0) {
		H += 360;
	}
	while (H > 360) {
		H -= 360;
	}
	if (C < NEAR_ZERO) {
		C = 0;
		H = 0;
	}
	return [L, H, C];
}

function lhcToLuv (L, H, C) {
	var rad = Math.PI * H / 180,
		U = C * Math.cos(rad),
		V = C * Math.sin(rad);
	return [L, U, V];
}

function chroma (L, H, m1, m2, m3, t) {
	var psi = (L > kappa*epsilon ? Math.pow(L+16, 3)/1560896 : L/kappa),
		rad = Math.PI * H / 180,
		cos = Math.cos(rad),
		sin = Math.sin(rad),
		top1 = 11120499 * m1 + 11700000 * m2 + 12739311 * m3,
		top2 = t * 11700000 * L,
		bot1 = 9608480 * m3 - 1921696 * m2,
		bot2 = 1441272 * m3 - 4323816 * m1,
		bot3 = t * 1921696 * sin;
	return (top1 * L * psi - top2) / ((bot1 * sin + bot2 * cos) * psi + bot3);
}

function maxChroma (L, H) {
	if (L === 0 || L === 100) {
		return 0;
	}
	var max = Infinity,
		limits = [0, 1];
	for (var i = 0; i < M_XYZ_RGB.length; i++) {
		var row = M_XYZ_RGB[i];
		for (var j = 0; j < limits.length; j++) {
			var C = chroma(L, H, row[0], row[1], row[2], limits[j]);
			if (C > 0 && C < max) {
				max = C;
			}
		}
	}
	return max;
}

function hexToRgb (hex) {
	var rgb = [];
	for (var i = 0; i < 3; i++) {
		rgb.push(parseInt(hex.substr(1 + 2 * i, 2), 16) / 255);
	}
	return rgb;
}

function hexToLuv (hex) {
	var rgb = hexToRgb(hex),
		xyz = rgbToXyz(rgb[0], rgb[1], rgb[2]),
		luv = xyzToLuv(xyz[0], xyz[1], xyz[2]);
	return luv;
}

function fromHex (hex) {
	var luv = hexToLuv(hex),
		lhc = luvToLhc(luv[0], luv[1], luv[2]);
	return {L: lhc[0], H: lhc[1], C: lhc[2]};
}

function toHex (LHC) {
	var luv = lhcToLuv(LHC.L, LHC.H, LHC.C),
		xyz = luvToXyz(luv[0], luv[1], luv[2]),
		rgb = xyzToRgb(xyz[0], xyz[1], xyz[2]);
	var hex = "";
	for (var i = 0; i < rgb.length; i++) {
		var c = Math.round(rgb[i] * 255).toString(16);
		if (c.length == 1) {
			c = "0" + c;
		}
		hex += c;
	}
	return "#" + hex;
}

function distance (hex1, hex2) {
	var v1 = hexToLuv(hex1),
		v2 = hexToLuv(hex2);
	return Math.sqrt(Math.pow(v1[0]-v2[0], 2)+Math.pow(v1[1]-v2[1], 2)+Math.pow(v1[2]-v2[2], 2));
}

module.exports = {
	toHex: toHex,
	fromHex: fromHex,
	distance: distance,
	maxChroma: maxChroma
};
