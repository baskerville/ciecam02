import {illuminant, matrix, degree} from "ciebase";
import * as hq from "./hq";
import {cfs} from "./helpers";
import {merge} from "mout/object";

var {pow, sqrt, exp, abs, sign} = Math,
    {sin, cos, atan2} = Math;

var surrounds = {
	average: {F: 1.0, c: 0.69, N_c: 1.0},
	dim: {F: 0.9, c: 0.59, N_c: 0.9},
	dark: {F: 0.8, c: 0.535, N_c: 0.8}
};

var M_CAT02 = [
	[0.7328,  0.4296, -0.1624],
	[-0.7036, 1.6975,  0.0061],
	[0.0030,  0.0136,  0.9834]
];

var M_HPE = [
	[0.38971,  0.68898, -0.07868],
	[-0.22981, 1.18340,  0.04641],
	[0.00000,  0.00000, 1.00000]
];

var XYZ_to_CAT02 = M_CAT02,
    CAT02_to_XYZ = matrix.inverse(M_CAT02),
    CAT02_to_HPE = matrix.product(M_HPE, matrix.inverse(M_CAT02)),
    HPE_to_CAT02 = matrix.product(M_CAT02, matrix.inverse(M_HPE));

var defaultViewingConditions = {
	whitePoint: illuminant.D65,
	adaptingLuminance: 40,
	backgroundLuminance: 20,
	surroundType: "average",
	discounting: false
};

var defaultCorrelates = cfs("QJMCshH"),
    vitalCorrelates = cfs("JCh");

// CIECAM02 and Its Recent Developments - Ming Ronnier Luo and Changjun Li
function Converter (viewingConditions={}, correlates=defaultCorrelates) {
	viewingConditions = merge(defaultViewingConditions, viewingConditions);

	var XYZ_w = viewingConditions.whitePoint,
	    L_A = viewingConditions.adaptingLuminance,
	    Y_b = viewingConditions.backgroundLuminance,
	    {F, c, N_c} = surrounds[viewingConditions.surroundType],
	    Y_w = XYZ_w[1];

	var k = 1 / (5*L_A + 1),
	    F_L = 0.2 * pow(k, 4) * 5 * L_A + 0.1 * pow(1 - pow(k, 4), 2) * pow(5 * L_A, 1/3),
	    n = Y_b / Y_w,
	    N_bb = 0.725 * pow(1/n, 0.2),
	    N_cb = N_bb,
	    z = 1.48 + sqrt(n),
	    D = viewingConditions.discounting ? 1 : F * (1 - 1 / 3.6 * exp(-(L_A + 42) / 92));

	var RGB_w = matrix.multiply(M_CAT02, XYZ_w),
	    [D_R, D_G, D_B] = RGB_w.map(v => D * Y_w / v + 1 - D),
	    RGB_cw = correspondingColors(XYZ_w),
	    RGB_aw = adaptedResponses(RGB_cw),
	    A_w = achromaticResponse(RGB_aw);

	function correspondingColors (XYZ) {
		var [R, G, B] = matrix.multiply(XYZ_to_CAT02, XYZ);
		return [D_R*R, D_G*G, D_B*B];
	}

	function reverseCorrespondingColors (RGB_c) {
		var [R_c, G_c, B_c] = RGB_c;
		return matrix.multiply(CAT02_to_XYZ, [R_c/D_R, G_c/D_G, B_c/D_B]);
	}

	function adaptedResponses (RGB_c) {
		return matrix.multiply(CAT02_to_HPE, RGB_c).map(function (v) {
			var x = pow(F_L * abs(v) / 100, 0.42);
			return sign(v) * 400 * x / (27.13 + x) + 0.1;
		});
	}

	function reverseAdaptedResponses (RGB_a) {
		return matrix.multiply(HPE_to_CAT02, RGB_a.map(function (v) {
			var x = v - 0.1;
			return sign(x) * 100 / F_L * pow(27.13 * abs(x) / (400 - abs(x)), 1/0.42);
		}));
	}

	function achromaticResponse (RGB_a) {
		var [R_a, G_a, B_a] = RGB_a;
		return (R_a * 2 + G_a + B_a / 20 - 0.305) * N_bb;
	}

	function brightness (J) {
		return 4/c * sqrt(J/100) * (A_w + 4) * pow(F_L, 0.25);
	}

	function lightness (Q) {
		return 6.25 * pow(c * Q / ((A_w + 4) * pow(F_L, 0.25)), 2);
	}

	function colorfulness (C) {
		return C * pow(F_L, 0.25);
	}

	function chromaFromSaturationBrightness (s, Q) {
		return pow(s / 100, 2) * Q / pow(F_L, 0.25);
	}

	function chromaFromColorfulness (M) {
		return M / pow(F_L, 0.25);
	}

	function saturation (M, Q) {
		return 100 * sqrt(M / Q);
	}

	function fillOut (correlates, inputs) {
		var {Q, J, M, C, s, h, H} = inputs,
		    outputs = {};

		if (correlates.J) {
			outputs.J = isNaN(J) ? lightness(Q) : J;
		}
		if (correlates.C) {
			if (isNaN(C)) {
				if (isNaN(M)) {
					Q = isNaN(Q) ? brightness(J) : Q;
					outputs.C = chromaFromSaturationBrightness(s, Q);
				} else {
					outputs.C = chromaFromColorfulness(M);
				}
			} else {
				outputs.C = inputs.C;
			}
		}
		if (correlates.h) {
			outputs.h = isNaN(h) ? hq.toHue(H) : h;
		}
		if (correlates.Q) {
			outputs.Q = isNaN(Q) ? brightness(J) : Q;
		}
		if (correlates.M) {
			outputs.M = isNaN(M) ? colorfulness(C) : M;
		}
		if (correlates.s) {
			if (isNaN(s)) {
				Q = isNaN(Q) ? brightness(J) : Q;
				M = isNaN(M) ? colorfulness(C) : M;
				outputs.s = saturation(M, Q);
			} else {
				outputs.s = s;
			}
		}
		if (correlates.H) {
			outputs.H = isNaN(H) ? hq.fromHue(h) : H;
		}

		return outputs;
	}

	function fromXyz (XYZ) {
		var RGB_c = correspondingColors(XYZ),
		    RGB_a = adaptedResponses(RGB_c),
		    [R_a, G_a, B_a] = RGB_a;

		var a = R_a - G_a * 12 / 11 + B_a / 11,
		    b = (R_a + G_a - 2 * B_a) / 9,
		    h_rad = atan2(b, a),
		    h = degree.fromRadian(h_rad),
		    e_t = 1/4 * (cos(h_rad + 2) + 3.8),
		    A = achromaticResponse(RGB_a),
		    J = 100 * pow(A / A_w, c * z),
		    t = (5e4 / 13 * N_c * N_cb * e_t * sqrt(a*a + b*b) / (R_a + G_a + 21 / 20 * B_a)),
		    C = pow(t, 0.9) * sqrt(J / 100) * pow(1.64 - pow(0.29, n), 0.73);

		return fillOut(correlates, {J, C, h});
	}

	function toXyz (CAM) {
		var {J, C, h} = fillOut(vitalCorrelates, CAM),
		    h_rad = degree.toRadian(h),
		    t = pow(C / (sqrt(J / 100) * pow(1.64 - pow(0.29, n), 0.73)), 10 / 9),
		    e_t = 1 / 4 * (cos(h_rad + 2) + 3.8),
		    A = A_w * pow(J / 100, 1 / c / z);

		var p_1 = 5e4 / 13 * N_c * N_cb * e_t / t,
		    p_2 = A / N_bb + 0.305,
		    q_1 = p_2 * 61/20 * 460/1403,
		    q_2 = 61/20 * 220/1403,
		    q_3 = 21/20 * 6300/1403 - 27/1403;

		var sin_h = sin(h_rad),
		    cos_h = cos(h_rad);

		var a, b;

		if (t === 0 || isNaN(t)) {
			a = b = 0;
		} else if (abs(sin_h) >= abs(cos_h)) {
			b = q_1 / (p_1 / sin_h + q_2 * cos_h / sin_h + q_3);
			a = b * cos_h / sin_h;
		} else {
			a = q_1 / (p_1 / cos_h + q_2 + q_3 * sin_h / cos_h);
			b = a * sin_h / cos_h;
		}

		var RGB_a = [
			20/61 * p_2 + 451/1403 * a +  288/1403 * b,
			20/61 * p_2 - 891/1403 * a -  261/1403 * b,
			20/61 * p_2 - 220/1403 * a - 6300/1403 * b
		];

		var RGB_c = reverseAdaptedResponses(RGB_a),
		    XYZ = reverseCorrespondingColors(RGB_c);

		return XYZ;
	}

	return {fromXyz, toXyz, fillOut};
}

export default Converter;
