var merge = require("mout/object/merge"),
    {lerp} = require("./helpers"),
    {abs} = Math;

function Gamut (xyz, cam) {
	var camBlack = cam.fromXyz(xyz.fromRgb([0.0, 0.0, 0.0])),
	    camWhite = cam.fromXyz(xyz.fromRgb([1.0, 1.0, 1.0]));

	function contains (CAM, epsilon=Number.EPSILON) {
		var RGB = xyz.toRgb(cam.toXyz(CAM)),
		    zero = -epsilon,
		    one = 1 + epsilon,
		    isInside = RGB.map(v => (v >= zero && v <= one)).reduce((a, b) => a && b);
		return [isInside, RGB];
	}

	function limit (inCam, outCam, cor="C", prec=1e-3) {
		var inVal = inCam[cor],
		    outVal = outCam[cor];
		while (abs(inVal-outVal) > prec) {
			var midVal = lerp(inVal, outVal, 0.5, cor),
			    [isInside,] = contains(merge(inCam, {[cor]: midVal}));
			if (isInside) {
				inVal = midVal;
			} else {
				outVal = midVal;
			}
		}
		return merge(inCam, {[cor]: inVal});
	}

	function spine (t) {
		var CAM = {};
		for (var cor in camBlack) {
			CAM[cor] = lerp(camBlack[cor], camWhite[cor], t, cor);
		}
		return CAM;
	}

	return {
		contains: contains,
		limit: limit,
		spine: spine
	};
}

module.exports = Gamut;
