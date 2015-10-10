# API

## Converters

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
		toHue(H) -> h,
		fromNotation(N) -> H,
		toNotation(H) -> N
	}

## Default viewing conditions

	{
		whitePoint: illuminant.D65,
		adaptingLuminance: 40,
		backgroundLuminance: 20,
		surroundType: "average",
		discounting: false
	}

## Gamut helpers

	gamut(xyz, cam, epsilon?=1e-6) -> {
		contains(CAM) -> (boolean, RGB),
		limit(camIn, camOut, prec?=1e-3) -> CAM,
		spine(t) -> CAM
	}

## Misc helpers

	cfs(str) -> correlates,
	lerp(CAM1, CAM2, t) -> CAM

# Examples

## Getting back into the gamut

```javascript
// The reference for understanding CIECAM02 is:
// http://www.springer.com/cda/content/document/cda_downloaddocument/9781441961891-c1.pdf

import * as ciebase from "ciebase";
import * as ciecam02 from "ciecam02";
import {merge} from "mout/object";

var {rgb, workspace, illuminant} = ciebase,
    {cfs} = ciecam02,
    xyz = ciebase.xyz(workspace.sRGB, illuminant.D65);

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

function crop (v) {
	return max(0, min(1, v));
}

var camSand = hexToCam("e0cda9"),                       // {J: 77.82, C: 16.99, h: 81.01}
    camOrange = merge(camSand, {C: 90}),                // {J: 77.82, C: 90.00, h: 81.01}
    [isInside, rgbOrange] = gamut.contains(camOrange);  // [false, [1.09, 0.73, -0.7]]

if (!isInside) {
	// The gamut.limit function interpolates between an inside and an outside point
	// and return an inside point as close as possible to the boundary.
	// (The gamut is the set of CAM values that maps to valid RGB coordinates.)
	let camOrange1 = gamut.limit(camSand, camOrange),                // {J: 77.82, C: 55.23, h: 81.01}
	// The alternative method is to simply crop the RGB coordinates
	    camOrange2 = cam.fromXyz(xyz.fromRgb(rgbOrange.map(crop)));  // {J: 74.43, C: 67.60, h: 81.30}
	console.log([camOrange1, camOrange2].map(camToHex));             // #ffc447   #ffb900
} else {
	console.log(rgb.toHex(rgbOrange));
}
```

![Example 1 Output](img/ex1.png)

## Gradient

```javascript

var {lerp} = ciecam02,
    camStart = hexToCam("17657d"),
    camEnd = hexToCam("fee7f0");

function gradient (camStart, camEnd, steps=3) {
	var result = [];
	for (var ε = 1/(steps+1), t = 0; steps > -2; t += ε, steps -= 1) {
		let camBetween = lerp(camStart, camEnd, crop(t)),
		    hex = rgb.toHex(xyz.toRgb(cam.toXyz(camBetween)).map(crop));
		result.push(hex);
	}
	return result;
}

var hexCodes = gradient(camStart, camEnd, 8);
```

![Example 2 Output](img/ex2.png)

## Chroma maximization

```javascript
import {map} from "mout/object";

var {hq} = ciecam02,
    ucs = ciecam02.ucs();

function ucsLimit (camIn, camOut, prec=1e-3) {
	// UCS is based on the JMh correlates
	var [ucsIn, ucsOut] = [camIn, camOut].map(v => ucs.fromCam(cam.fillOut(cfs("JMh"), v)));
	while (ucs.distance(ucsIn, ucsOut) > prec) {
		let ucsMid = lerp(ucsIn, ucsOut, 0.5),
		    [isInside,] = gamut.contains(ucs.toCam(ucsMid));
		if (isInside) {
			ucsIn = ucsMid;
		} else {
			ucsOut = ucsMid;
		}
	}
	return cam.fillOut(map(camIn, v => true), ucs.toCam(ucsIn));
}

// The hue notation is a different writting of the hue quadrant,
// of the form a(p?b)? where a and b are in {R, Y, G, B} (a ≠ b)
// and p is in ]0, 100[. apb = b(100-p)a, ab = a50b.
function hue (N) {
	return hq.toHue(hq.fromNotation(N));
}

var topChroma = max(...["f00", "0f0", "00f"].map(v => hexToCam(v).C)),
    camRed = {J: 60, h: hue("R")},
    camYellow = {J: 90, h: hue("Y")},
    camGreen = {J: 90, h: hue("G")},
    camBlue = {J: 70, h: hue("B")};

var hexCodes = [camRed, camYellow, camGreen, camBlue].map(function (CAM) {
	CAM = merge(CAM, {C: topChroma+1});
	CAM = ucsLimit(gamut.spine(CAM.J/100), CAM);
	return camToHex(CAM);
});
```

![Example 3 Output](img/ex3.png)
