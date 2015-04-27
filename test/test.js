var lhs = require('..'),
    expect = require('chai').expect,
    comp = [];

for (var i = 0; i < 16; i++) {
	var h = i.toString(16);
	comp.push(h + h);
}

var black = "#000000",
    grey = "#777777",
    white = "#FFFFFF",
    red = "#FF0000",
    green = "#00FF00",
    blue = "#0000FF",
    yellow = "#FFFF00",
    cyan = "#00FFFF",
    magenta = "#FF00FF";

describe('LHS', function () {
	it('lightness order', function () {
		expect(lhs.fromHex(black)[0]).to.be.below(lhs.fromHex(grey)[0]);
		expect(lhs.fromHex(grey)[0]).to.be.below(lhs.fromHex(white)[0]);
		expect(lhs.fromHex(blue)[0]).to.be.below(lhs.fromHex(red)[0]);
		expect(lhs.fromHex(red)[0]).to.be.below(lhs.fromHex(green)[0]);
	});
	it('hue order', function () {
		expect(lhs.fromHex(red)[1]).to.be.below(lhs.fromHex(green)[1]);
		expect(lhs.fromHex(green)[1]).to.be.below(lhs.fromHex(blue)[1]);
	});
	it('saturation order', function () {
		expect(lhs.fromHex(grey)[2]).to.be.below(lhs.fromHex(red)[2]);
	});
	it('saturation upper bound', function () {
		comp.forEach(function (r) {
			comp.forEach(function (g) {
				comp.forEach(function (b) {
					var c = lhs.fromHex("#" + r + g + b);
					expect(c[2]).to.be.below(100.1);
				});
			});
		});
	});
	it('distance', function () {
		expect(lhs.distance(grey, black)).to.be.below(lhs.distance(black, white));
		expect(lhs.distance(red, yellow)).to.be.below(lhs.distance(red, green));
		expect(lhs.distance(green, cyan)).to.be.below(lhs.distance(green, blue));
		expect(lhs.distance(blue, magenta)).to.be.below(lhs.distance(blue, red));
	});
	it('maxChroma', function () {
		expect(lhs.maxChroma(20, 60)).to.be.below(lhs.maxChroma(50, 30));
	});
});
