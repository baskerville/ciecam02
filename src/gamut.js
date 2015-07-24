var ucs = require("./ucs")(),
    rgb = require("./rgb"),
    {cfs} = require("./helpers"),
    map = require("mout/object/map");

function Gamut (xyz, cam) {
	var [ucsBlack, ucsWhite] = ["000", "fff"].map(function (hex) {
		return ucs.fromCam(cam.fillOut(cfs("JhM"), cam.fromXyz(xyz.fromRgb(rgb.fromHex(hex)))));
	});

	function contains (CAM, epsilon=Number.EPSILON) {
		var RGB = xyz.toRgb(cam.toXyz(CAM)),
		    zero = -epsilon,
		    one = 1 + epsilon,
		    isInside = RGB.map(v => (v >= zero && v <= one)).reduce((a, b) => a && b);
		return [isInside, RGB];
	}

	function limit (inCam, outCam, prec=1e-3) {
		var [inUcs, outUcs] = [inCam, outCam].map(function (CAM) {
			return ucs.fromCam(cam.fillOut(cfs("JhM"), CAM));
		});
		while (ucs.distance(inUcs, outUcs) > prec) {
			var midUcs = ucs.lerp(inUcs, outUcs, 0.5),
			    [isInside,] = contains(ucs.toCam(midUcs));
			if (isInside) {
				inUcs = midUcs;
			} else {
				outUcs = midUcs;
			}
		}
		return cam.fillOut(map(inCam, v => true), ucs.toCam(inUcs));
	}

	function spine (t) {
		return cam.fillOut(cfs("JhC"), ucs.toCam(ucs.lerp(ucsBlack, ucsWhite, t)));
	}

	return {
		contains: contains,
		limit: limit,
		spine: spine
	};
}

module.exports = Gamut;
