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

# Example

```javascript
// The reference for understanding CIECAM02 is:
// http://www.springer.com/cda/content/document/cda_downloaddocument/9781441961891-c1.pdf

import * as ciecam02 from "ciecam02";
import {merge} from "mout/object";

var {cfs, rgb, workspace, illuminant} = ciecam02,
    xyz = ciecam02.xyz(workspace.sRGB, illuminant.D65);

var viewingConditions = {
	whitePoint: illuminant.D65,
	adaptingLuminance: 40,
	backgroundLuminance: 20,
	surroundType: "average",
	discounting: false
};

// By default, 7 correlates are returned when converting from XYZ to CAM.
// For the purpose of this example, we will limit ourselves to the JCh correlates.
// (J is the lightness, C the chroma and h the hue.)
var cam = ciecam02.cam(viewingConditions, cfs("JCh")),
    gamut = ciecam02.gamut(xyz, cam),
    {min, max} = Math;

function hexToCam(hex) {
	return cam.fromXyz(xyz.fromRgb(rgb.fromHex(hex)));
}

function camToHex(CAM) {
	return rgb.toHex(xyz.toRgb(cam.toXyz(CAM)));
}

// This is a naïve method for getting back inside the gamut.
// (The gamut is the set of CAM values that maps to valid RGB coordinates.)
function crop (RGB) {
	return RGB.map(v => max(0, min(1, v)));
}

var camSand = hexToCam("e0cda9"),                       // {J: 77.82, C: 16.99, h: 81.01}
    camOrange = merge(camSand, {C: 90}),                // {J: 77.82, C: 90.00, h: 81.01}
    [isInside, rgbOrange] = gamut.contains(camOrange);  // [false, [1.09, 0.73, -0.7]]

if (!isInside) {
	// The gamut.limit function interpolates between an inside and an outside point
	// and return an inside point as close as possible to the boundary.
	let camOrange1 = gamut.limit(camSand, camOrange),            // {J: 77.82, C: 55.22, h: 81.01}
	    // The naïve method might cause significant changes to the lightness and hue correlates
	    camOrange2 = cam.fromXyz(xyz.fromRgb(crop(rgbOrange)));  // {J: 74.43, C: 67.60, h: 81.30}
	console.log([camOrange1, camOrange2].map(camToHex));         // #ffc447   #ffb900
} else {
	console.log(rgb.toHex(rgbOrange));
}
```
