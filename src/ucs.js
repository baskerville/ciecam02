var {degree, radian} = require("./helpers"),
    {sqrt, pow, exp, log, cos, sin, atan2} = Math;

var uniformSpaces = {
	LCD: {K_L: 0.77, c_1: 0.007, c_2: 0.0053},
	SCD: {K_L: 1.24, c_1: 0.007, c_2: 0.0363},
	UCS: {K_L: 1.00, c_1: 0.007, c_2: 0.0228}
};

function Converter (name="UCS") {
	var {K_L, c_1, c_2} = uniformSpaces[name];

	function toUniform (correlates) {
		var {J, M, h} = correlates,
		    h_rad = radian(h),
		    J_p = (1 + 100 * c_1) * J / (1 + c_1 * J),
		    M_p = (1 / c_2) * log(1 + c_2 * M),
		    a_p = M_p * cos(h_rad),
		    b_p = M_p * sin(h_rad);
		return {J_p: J_p, a_p: a_p, b_p: b_p};
	}

	function fromUniform (correlates) {
		var {J_p, a_p, b_p} = correlates,
		    J = -J_p / (c_1 * J_p - 100 * c_1 - 1),
		    M_p = sqrt(pow(a_p, 2) + pow(b_p, 2)),
		    M = (exp(c_2 * M_p) - 1) / c_2,
		    h_rad = atan2(b_p, a_p),
		    h = degree(h_rad);
		return {J: J, M: M, h: h};
	}

	function distance (u1, u2) {
		return sqrt(pow((u1.J_p - u2.J_p)/K_L, 2) + pow(u1.a_p - u2.a_p, 2) + pow(u1.b_p - u2.b_p, 2));
	}

	return {
		toUniform: toUniform,
		fromUniform: fromUniform,
		distance: distance
	};
}

module.exports = Converter;
