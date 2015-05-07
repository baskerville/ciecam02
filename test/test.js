var lhc = require('..'),
    expect = require('chai').expect,
    comp = [];

for (var i = 0; i < 16; i++) {
	var h = i.toString(16);
	comp.push(h + h);
}

var black = "#000000",
    grey = "#777777",
    white = "#ffffff",
    red = "#ff0000",
    green = "#00ff00",
    blue = "#0000ff",
    yellow = "#ffff00",
    cyan = "#00ffff",
    magenta = "#ff00ff";

describe("lhc", function () {
	it("lightness order", function () {
		expect(lhc.fromHex(black).L).to.be.below(lhc.fromHex(grey).L);
		expect(lhc.fromHex(grey).L).to.be.below(lhc.fromHex(white).L);
		expect(lhc.fromHex(blue).L).to.be.below(lhc.fromHex(red).L);
		expect(lhc.fromHex(red).L).to.be.below(lhc.fromHex(green).L);
	});
	it("lightness accuracy", function () {
		expect(lhc.fromHex(white).L).to.equal(100);
	});
	it("hue order", function () {
		expect(lhc.fromHex(red).H).to.be.below(lhc.fromHex(green).H);
		expect(lhc.fromHex(green).H).to.be.below(lhc.fromHex(blue).H);
	});
	it("chroma order", function () {
		expect(lhc.fromHex(grey).C).to.be.below(lhc.fromHex(red).C);
	});
	it("chroma upper bound", function () {
		comp.forEach(function (r) {
			comp.forEach(function (g) {
				comp.forEach(function (b) {
					var hex = "#" + r + g + b,
					    LHC = lhc.fromHex("#" + r + g + b);
					expect(LHC.C-lhc.maxChroma(LHC.L, LHC.H)).to.be.below(1e-10);
				});
			});
		});
	});
	it("idempotent", function () {
		[red, green, blue].forEach(function (hex) {
			expect(lhc.toHex(lhc.fromHex(hex))).to.equal(hex);
		});
	});
	it("distance", function () {
		expect(lhc.distance(grey, black)).to.be.below(lhc.distance(black, white));
		expect(lhc.distance(red, yellow)).to.be.below(lhc.distance(red, green));
		expect(lhc.distance(green, cyan)).to.be.below(lhc.distance(green, blue));
		expect(lhc.distance(blue, magenta)).to.be.below(lhc.distance(blue, red));
	});
	it("maxChroma", function () {
		expect(lhc.maxChroma(20, 60)).to.be.below(lhc.maxChroma(50, 30));
		expect(lhc.maxChroma(0, 0)).to.equal(0);
		expect(lhc.maxChroma(100, 0)).to.equal(0);
	});
});
