# API

Converters:

	rgb: {
		fromHex(hex) -> RGB,
		toHex(RGB) -> hex
	}

	xyz(rgbSpace?=workspace.sRGB, whitePoint?=illuminant.D65) -> {
		fromRgb(RGB) -> XYZ,
		toRgb(XYZ) -> RGB
	}

	cam(viewingConditions?, correlates?) -> {
		fromXyz(XYZ) -> CAM,
		toXyz(CAM) -> XYZ,
		fillOut(correlates, inputs) -> outputs
	}

	ucs(name?="UCS") -> {
		fromCam(CAM) -> UCS,
		toCam(UCS) -> CAM,
		distance(UCS1, UCS2) -> number,
		lerp(UCS1, UCS2, t) -> UCS
	}

	hq, hn: {
		fromHue(h) -> H,
		toHue(H) -> h
	}

Default viewing conditions:

	{
		whitePoint: illuminant.D65,
		adaptingLuminance: 40,
		backgroundLuminance: 20,
		surroundType: "average",
		discounting: false
	}

Gamut helpers:

	gamut(xyz, cam) -> {
		contains(CAM, epsilon?=Number.EPSILON) -> (boolean, RGB),
		limit(inCam, outCam, prec?=1e-3) -> CAM,
		spine(t) -> CAM
	}

Misc helpers:

	cfs(str) -> correlates
