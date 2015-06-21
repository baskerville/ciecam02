# API

Converters:

	rgb: {
		fromHex(hex) -> RGB,
		toHex(RGB) -> hex
	}
	xyz([rgbSpace=workspace.sRGB], [whitePoint=illuminant.D65]) -> {
		fromRgb(RGB) -> XYZ,
		toRgb(XYZ) -> RGB,
	},
	cam([viewingConditions]) -> {
		fromXyz(XYZ) -> correlates,
		toXyz(correlates) -> XYZ
	},
	ucs([name="UCS"]) -> {
		fromCorrelates(correlates) -> unif,
		toCorrelates(unif) -> correlates,
		distance(unif1, unif2) -> number
	}

Default viewing conditions:

	{
		whitePoint: illuminant.D65,
		adaptingLuminance: 40,
		backgroundLuminance: 20,
		surroundType: "average",
		discounting: false
	}
