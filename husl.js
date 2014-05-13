(function () {
	// D65 illuminant
	var refX = 0.95047,
	    refY = 1.00000,
	    refZ = 1.08883,
	    refU = (4 * refX) / (refX + (15 * refY) + (3 * refZ)),
	    refV = (9 * refY) / (refX + (15 * refY) + (3 * refZ));

	// CIE standard constants
	var epsilon = Math.pow(6 / 29, 3),
	    kappa = Math.pow(29 / 3, 3);

	// sRGB D65 matrices
	// Their product should be as close as possible to the unit matrix

	var M_RGB_XYZ = [[.4124564391, .3575760776, .1804374833],
	                 [.2126728514, .7151521553, .07217499331],
	                 [.01933389558, .1191920259, .9503040785]];

	var M_XYZ_RGB = [[3.240454162, -1.537138513, -.4985314096],
	                 [-.9692660305, 1.876010845, .04155601753],
	                 [.05564343096, -.2040259135, 1.057225188]];

	// Inverse sRGB Companding
	function toLinear(v) { 
		return (v <= 0.04045 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4));
	}

	// sRGB Companding
	function fromLinear(v) { 
		return (v <= 0.0031308 ? 12.92*v : 1.055*Math.pow(v, 1/2.4)-0.055);
	}

	function rgbToXyz(R, G, B) {
		var rgb = [R, G, B].map(toLinear),
		    xyz = [];
		for (var i = 0; i < M_RGB_XYZ.length; i++) {
			var row = M_RGB_XYZ[i],
			    sum = 0;
			for (var j = 0; j < row.length; j++)
				sum += row[j] * rgb[j];
			xyz.push(sum);
		}
		return xyz;
	}

	function xyzToRgb(X, Y, Z) {
		var xyz = [X, Y, Z],
		    rgb = [];
		for (var i = 0; i < M_XYZ_RGB.length; i++) {
			var row = M_XYZ_RGB[i],
				sum = 0;
			for (var j = 0; j < row.length; j++)
				sum += row[j] * xyz[j];
			rgb.push(sum);
		}
		return rgb.map(fromLinear);
	}

	function xyzToLuv(X, Y, Z) {
		var y = Y / refY,
		    L = (y <= epsilon ? kappa*y : 116*Math.pow(y, 1/3)-16);
		if (L == 0)
			return [0, 0, 0];
		var u = 4 * X / (X + 15 * Y + 3 * Z),
		    v = 9 * Y / (X + 15 * Y + 3 * Z),
		    U = 13 * L * (u - refU),
		    V = 13 * L * (v - refV);
		return [L, U, V];
	}

	function luvToXyz(L, U, V) {
		if (L == 0)
			return [0, 0, 0];
		var u = refU + U / (13 * L),
		    v = refV + V / (13 * L),
		    Y = refY * (L > kappa*epsilon ? Math.pow((L+16)/116, 3) : L/kappa),
		    X = Y * (9 * u) / (4 * v),
		    Z = Y * (12 - 3 * u - 20 * v) / (4 * v);
		return [X, Y, Z];
	}

	function luvToLch(L, U, V) {
		var C = Math.sqrt(Math.pow(U, 2) + Math.pow(V, 2)),
		    H = 180 * Math.atan2(V, U) / Math.PI;
		if (H < 0)
			H += 360;
		return [L, C, H];
	}

	function lchToLuv(L, C, H) {
		var rad = Math.PI * H / 180,
		    U = C * Math.cos(rad),
		    V = C * Math.sin(rad);
		return [L, U, V];
	}

	function chroma(L, H, m1, m2, m3, t) {
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

	function maxChroma(L, H) {
		var maxChroma = Infinity,
		    limits = [0, 1];
		for (var i = 0; i < M_XYZ_RGB.length; i++) {
			var row = M_XYZ_RGB[i];
			for (var j = 0; j < limits.length; j++) {
				var C = chroma(L, H, row[0], row[1], row[2], limits[j]);
				if (C > 0 && C < maxChroma)
					maxChroma = C;
			}
		}
		return maxChroma;
	}

	function lchToHusl(L, C, H) {
		return [H, 100 * C / maxChroma(L, H), L];
	}

	function huslToLch(H, S, L) {
		return [L, S * maxChroma(L, H) / 100, H];
	}

	function fromHex(hex) {
		var rgb = [];
		for (var i = 0; i < 3; i++)
			rgb.push(parseInt(hex.substr(1 + 2 * i, 2), 16) / 255);
		var xyz = rgbToXyz(rgb[0], rgb[1], rgb[2]),
		    luv = xyzToLuv(xyz[0], xyz[1], xyz[2]),
		    lch = luvToLch(luv[0], luv[1], luv[2]);
		return lchToHusl(lch[0], lch[1], lch[2]);
	}

	function toHex(H, S, L) {
		var lch = huslToLch(H, S, L),
		    luv = lchToLuv(lch[0], lch[1], lch[2]),
		    xyz = luvToXyz(luv[0], luv[1], luv[2]),
		    rgb = xyzToRgb(xyz[0], xyz[1], xyz[2]);
		var hex = '';
		for (var i = 0; i < rgb.length; i++) {
			var c = Math.round(rgb[i] * 255).toString(16);
			if (c.length == 1)
				c = '0' + c;
			hex += c;
		}
		return '#' + hex;
	}

	var root = {
		'toHex': toHex,
		'fromHex': fromHex
	};

	if (typeof module == "object" && module != null)
		module.exports = root;

	this.husl = root;

})();
