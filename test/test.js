var CamConv = require("../dist/cam"),
    XyzConv = require("../dist/xyz"),
    UcsConv = require("../dist/ucs"),
    assert = require('chai').assert,
    ε = 0.05;

describe("Roundtrips", function () {
	var rc = require("../dist/rgb"),
	    xc = XyzConv(),
	    cc = CamConv(),
	    uc = UcsConv(),
	    hex = "#e73e01",
	    XYZ = xc.fromRgb(rc.fromHex(hex)),
	    correlates = cc.fromXyz(XYZ);
	it("Xyz", function () {
		assert.equal(hex, rc.toHex(xc.toRgb(XYZ)));
	});
	it("Cam", function () {
		var rXYZ = cc.toXyz(correlates);
		assert.closeTo(XYZ[0], rXYZ[0], ε);
		assert.closeTo(XYZ[1], rXYZ[1], ε);
		assert.closeTo(XYZ[2], rXYZ[2], ε);
	});
	it("Ucs", function () {
		var rCorrelates = uc.toCorrelates(uc.fromCorrelates(correlates));
		assert.closeTo(correlates.J, rCorrelates.J, ε);
		assert.closeTo(correlates.M, rCorrelates.M, ε);
		assert.closeTo(correlates.h, rCorrelates.h, ε);
	});
});

// http://rit-mcsl.org/fairchild/files/AppModEx.xls
describe("Fairchild examples", function () {
	it("Case 1", function () {
		var cc = CamConv({
			whitePoint: [95.05, 100.00, 108.88],
			adaptingLuminance: 318.31,
			backgroundLuminance: 20,
			surroundType: "average",
			discounting: false
		});
		var correlates = cc.fromXyz([19.01, 20.00, 21.78]);
		assert.closeTo(correlates.Q, 195.35, ε);
		assert.closeTo(correlates.J, 41.73, ε);
		assert.closeTo(correlates.M, 0.11, ε);
		assert.closeTo(correlates.C, 0.10, ε);
		assert.closeTo(correlates.s, 2.36, ε);
		assert.closeTo(correlates.h, 219.0, ε);
		assert.closeTo(correlates.H, 278.1, ε);
	});
	it("Case 2", function () {
		var cc = CamConv({
			whitePoint: [95.05, 100.00, 108.88],
			adaptingLuminance: 31.83,
			backgroundLuminance: 20,
			surroundType: "average",
			discounting: false
		});
		var correlates = cc.fromXyz([57.06, 43.06, 31.96]);
		assert.closeTo(correlates.Q, 152.67, ε);
		assert.closeTo(correlates.J, 65.96, ε);
		assert.closeTo(correlates.M, 41.67, ε);
		assert.closeTo(correlates.C, 48.57, ε);
		assert.closeTo(correlates.s, 52.25, ε);
		assert.closeTo(correlates.h, 19.6, ε);
		// Fairchild gives an incorrect value of 393.9
		assert.closeTo(correlates.H, 399.4, ε);
	});
	it("Case 3", function () {
		var cc = CamConv({
			whitePoint: [109.85, 100.00, 35.58],
			adaptingLuminance: 318.31,
			backgroundLuminance: 20,
			surroundType: "average",
			discounting: false
		});
		var correlates = cc.fromXyz([3.53, 6.56, 2.14]);
		assert.closeTo(correlates.Q, 141.17, ε);
		assert.closeTo(correlates.J, 21.79, ε);
		assert.closeTo(correlates.M, 48.80, ε);
		assert.closeTo(correlates.C, 46.94, ε);
		assert.closeTo(correlates.s, 58.79, ε);
		assert.closeTo(correlates.h, 177.1, ε);
		assert.closeTo(correlates.H, 220.4, ε);
	});
	it("Case 4", function () {
		var cc = CamConv({
			whitePoint: [109.85, 100.00, 35.58],
			adaptingLuminance: 31.83,
			backgroundLuminance: 20,
			surroundType: "average",
			discounting: false
		});
		var correlates = cc.fromXyz([19.01, 20.00, 21.78]);
		assert.closeTo(correlates.Q, 122.83, ε);
		assert.closeTo(correlates.J, 42.53, ε);
		assert.closeTo(correlates.M, 44.54, ε);
		assert.closeTo(correlates.C, 51.92, ε);
		assert.closeTo(correlates.s, 60.22, ε);
		assert.closeTo(correlates.h, 248.9, ε);
		// Fairchild gives an incorrect value of 305.8
		assert.closeTo(correlates.H, 305.5, ε);
	});
});
