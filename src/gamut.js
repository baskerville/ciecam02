import * as rgb from "./rgb";
import {lerp, distance} from "./helpers";

function Gamut (xyz, cam, epsilon=1e-6) {
	var ZERO = -epsilon,
	    ONE = 1 + epsilon;
	var [camBlack, camWhite] = ["000", "fff"].map(function (hex) {
		return cam.fromXyz(xyz.fromRgb(rgb.fromHex(hex)));
	});

	function contains (CAM) {
		var RGB = xyz.toRgb(cam.toXyz(CAM)),
		    isInside = RGB.map(v => (v >= ZERO && v <= ONE)).reduce((a, b) => a && b);
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
