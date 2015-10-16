var assert = require('chai').assert,
    ε = 0.05;

describe("Roundtrips", function () {
	var rgb = require("ciebase").rgb,
	    xyz = require("ciebase").xyz(),
	    cam = require("../dist/cam")(),
	    ucs = require("../dist/ucs")(),
	    hq = require("../dist/hq"),
	    hex = "#e73e01",
	    RGB = rgb.fromHex(hex),
	    XYZ = xyz.fromRgb(RGB),
	    CAM = cam.fromXyz(XYZ),
	    UCS = ucs.fromCam(CAM);
	it("Cam", function () {
		var rXYZ = cam.toXyz(CAM);
		assert.closeTo(XYZ[0], rXYZ[0], ε);
		assert.closeTo(XYZ[1], rXYZ[1], ε);
		assert.closeTo(XYZ[2], rXYZ[2], ε);
	});
	it("Ucs", function () {
		var rCAM = ucs.toCam(UCS);
		assert.closeTo(CAM.J, rCAM.J, ε);
		assert.closeTo(CAM.M, rCAM.M, ε);
		assert.closeTo(CAM.h, rCAM.h, ε);
	});
	it("Hq", function () {
		var h = 237,
		    N = "R46B";
		assert.closeTo(h, hq.toHue(hq.fromHue(h)), ε);
		assert.equal(N, hq.toNotation(hq.fromNotation(N)));
	});
});

describe("Gamut", function () {
	var rgb = require("ciebase").rgb,
	    xyz = require("ciebase").xyz(),
	    cam = require("../dist/cam")(),
	    gamut = require("../dist/gamut")(xyz, cam),
	    camRed = cam.fromXyz(xyz.fromRgb(rgb.fromHex("f00"))),
	    camBlue = cam.fromXyz(xyz.fromRgb(rgb.fromHex("00f")));
	it("Contains", function () {
		assert.ok(gamut.contains(camRed)[0]);
		assert.ok(gamut.contains(camBlue)[0]);
		camRed.C += 1;
		camBlue.C -= 1;
		assert.notOk(gamut.contains(camRed)[0]);
		assert.notOk(gamut.contains(camBlue)[0]);
	});
});

// http://rit-mcsl.org/fairchild/files/AppModEx.xls
describe("Fairchild examples", function () {
	var CamConv = require("../dist/cam");
	it("Case 1", function () {
		var cc = CamConv({
			whitePoint: [95.05, 100.00, 108.88],
			adaptingLuminance: 318.31,
			backgroundLuminance: 20,
			surroundType: "average",
			discounting: false
		});
		var CAM = cc.fromXyz([19.01, 20.00, 21.78]);
		assert.closeTo(CAM.Q, 195.35, ε);
		assert.closeTo(CAM.J, 41.73, ε);
		assert.closeTo(CAM.M, 0.11, ε);
		assert.closeTo(CAM.C, 0.10, ε);
		assert.closeTo(CAM.s, 2.36, ε);
		assert.closeTo(CAM.h, 219.0, ε);
		assert.closeTo(CAM.H, 278.1, ε);
	});
	it("Case 2", function () {
		var cc = CamConv({
			whitePoint: [95.05, 100.00, 108.88],
			adaptingLuminance: 31.83,
			backgroundLuminance: 20,
			surroundType: "average",
			discounting: false
		});
		var CAM = cc.fromXyz([57.06, 43.06, 31.96]);
		assert.closeTo(CAM.Q, 152.67, ε);
		assert.closeTo(CAM.J, 65.96, ε);
		assert.closeTo(CAM.M, 41.67, ε);
		assert.closeTo(CAM.C, 48.57, ε);
		assert.closeTo(CAM.s, 52.25, ε);
		assert.closeTo(CAM.h, 19.6, ε);
		// Fairchild gives an incorrect value of 393.9
		assert.closeTo(CAM.H, 399.4, ε);
	});
	it("Case 3", function () {
		var cc = CamConv({
			whitePoint: [109.85, 100.00, 35.58],
			adaptingLuminance: 318.31,
			backgroundLuminance: 20,
			surroundType: "average",
			discounting: false
		});
		var CAM = cc.fromXyz([3.53, 6.56, 2.14]);
		assert.closeTo(CAM.Q, 141.17, ε);
		assert.closeTo(CAM.J, 21.79, ε);
		assert.closeTo(CAM.M, 48.80, ε);
		assert.closeTo(CAM.C, 46.94, ε);
		assert.closeTo(CAM.s, 58.79, ε);
		assert.closeTo(CAM.h, 177.1, ε);
		assert.closeTo(CAM.H, 220.4, ε);
	});
	it("Case 4", function () {
		var cc = CamConv({
			whitePoint: [109.85, 100.00, 35.58],
			adaptingLuminance: 31.83,
			backgroundLuminance: 20,
			surroundType: "average",
			discounting: false
		});
		var CAM = cc.fromXyz([19.01, 20.00, 21.78]);
		assert.closeTo(CAM.Q, 122.83, ε);
		assert.closeTo(CAM.J, 42.53, ε);
		assert.closeTo(CAM.M, 44.54, ε);
		assert.closeTo(CAM.C, 51.92, ε);
		assert.closeTo(CAM.s, 60.22, ε);
		assert.closeTo(CAM.h, 248.9, ε);
		// Fairchild gives an incorrect value of 305.8
		assert.closeTo(CAM.H, 305.5, ε);
	});
});
