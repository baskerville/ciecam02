import {map} from "mout/object";

// CIE 15-2004 Colorimetry, 3rd Edition
var coordinates = {
	A: {x: 0.44758, y: 0.40745},    // tungsten lamp
	C: {x: 0.31006, y: 0.31616},    // average daylight
	D50: {x: 0.34567, y: 0.35851},  // horizon light
	D65: {x: 0.31272, y: 0.32903},  // noon daylight
	D55: {x: 0.33243, y: 0.34744},  // mid-morning / mid-afternoon daylight
	D75: {x: 0.29903, y: 0.31488}   // north sky daylight
};

var illuminants = map(coordinates, function (v) {
	var X = 100 * (v.x / v.y),
	    Y = 100,
	    Z = 100 * (1 - v.x - v.y) / v.y;
	return [X, Y, Z];
});

export default illuminants;
