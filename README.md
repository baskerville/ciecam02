# API

Converters:

	rgb: {
		fromHex(hex) -> RGB,
		toHex(RGB) -> hex,
		inGamut(RGB) -> boolean
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
		distance(UCS1, UCS2) -> number
	}

	hq: {
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
		contains(CAM) -> boolean,
		limit(inCam, outCam, cor?="C", prec?=1e-3) -> CAM
	}
