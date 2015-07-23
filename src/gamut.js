var merge = require("mout/object/merge"),
    {abs} = Math;

function Gamut (xyz, cam) {
	function contains (CAM, epsilon=Number.EPSILON) {
		var RGB = xyz.toRgb(cam.toXyz(CAM)),
		    zero = -epsilon,
		    one = 1 + epsilon,
		    isInside = RGB.map(v => (v >= zero && v <= one)).reduce((a, b) => a && b);
		return [isInside, RGB];
	}

	function limit (inCam, outCam, cor="C", prec=1e-3) {
		var bot = inCam[cor],
		    top = outCam[cor];
		while (abs(top-bot) > prec) {
			var mid = (bot + top) / 2,
			    [isInside,] = contains(merge(inCam, {[cor]: mid}));
			if (isInside) {
				bot = mid;
			} else {
				top = mid;
			}
		}
		return merge(inCam, {[cor]: bot});
	}

	return {
		contains: contains,
		limit: limit
	};
}

module.exports = Gamut;
