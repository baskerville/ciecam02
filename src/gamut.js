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

	function limit (camIn, camOut, prec=1e-3) {
		while (distance(camIn, camOut) > prec) {
			var camMid = lerp(camIn, camOut, 0.5),
			    [isInside,] = contains(camMid);
			if (isInside) {
				camIn = camMid;
			} else {
				camOut = camMid;
			}
		}
		return camIn;
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
