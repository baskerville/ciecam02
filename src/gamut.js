import * as rgb from "./rgb";
import {lerp, distance} from "./helpers";

function Gamut (xyz, cam) {
	var [camBlack, camWhite] = ["000", "fff"].map(function (hex) {
		return cam.fromXyz(xyz.fromRgb(rgb.fromHex(hex)));
	});

	function contains (CAM, epsilon=1e-6) {
		var RGB = xyz.toRgb(cam.toXyz(CAM)),
		    zero = -epsilon,
		    one = 1 + epsilon,
		    isInside = RGB.map(v => (v >= zero && v <= one)).reduce((a, b) => a && b);
		return [isInside, RGB];
	}

	function limit (inCam, outCam, prec=1e-3) {
		while (distance(inCam, outCam) > prec) {
			var midCam = lerp(inCam, outCam, 0.5),
			    [isInside,] = contains(midCam);
			if (isInside) {
				inCam = midCam;
			} else {
				outCam = midCam;
			}
		}
		return inCam;
	}

	function spine (t) {
		return lerp(camBlack, camWhite, t);
	}

	return {
		contains: contains,
		limit: limit,
		spine: spine
	};
}

export default Gamut;
