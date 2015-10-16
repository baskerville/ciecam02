import {degree} from "ciebase";

var {sqrt, pow, exp, log, cos, sin, atan2} = Math;

var uniformSpaces = {
	LCD: {K_L: 0.77, c_1: 0.007, c_2: 0.0053},
	SCD: {K_L: 1.24, c_1: 0.007, c_2: 0.0363},
	UCS: {K_L: 1.00, c_1: 0.007, c_2: 0.0228}
};

function Converter (name="UCS") {
	var {K_L, c_1, c_2} = uniformSpaces[name];

	function fromCam (CAM) {
		var {J, M, h} = CAM,
		    h_rad = degree.toRadian(h),
		    J_p = (1 + 100 * c_1) * J / (1 + c_1 * J),
		    M_p = (1 / c_2) * log(1 + c_2 * M),
		    a_p = M_p * cos(h_rad),
		    b_p = M_p * sin(h_rad);
		return {J_p, a_p, b_p};
	}

	function toCam (UCS) {
		var {J_p, a_p, b_p} = UCS,
		    J = -J_p / (c_1 * J_p - 100 * c_1 - 1),
		    M_p = sqrt(pow(a_p, 2) + pow(b_p, 2)),
		    M = (exp(c_2 * M_p) - 1) / c_2,
		    h_rad = atan2(b_p, a_p),
		    h = degree.fromRadian(h_rad);
		return {J, M, h};
	}

	function distance (UCS1, UCS2) {
		return sqrt(pow((UCS1.J_p - UCS2.J_p)/K_L, 2) + pow(UCS1.a_p - UCS2.a_p, 2) + pow(UCS1.b_p - UCS2.b_p, 2));
	}

	return {fromCam, toCam, distance};
}

export default Converter;
