var husl = require('../husl');
var expect = require('chai').expect;

var black = "#000000",
    grey = "#777777",
    white = "#FFFFFF",
    red = "#FF0000",
    green = "#00FF00",
    blue = "#0000FF";

describe('HuSL', function () {
	it('hue order', function () {
		expect(husl.fromHex(red)[0]).to.be.below(husl.fromHex(green)[0]);
		expect(husl.fromHex(green)[0]).to.be.below(husl.fromHex(blue)[0]);
	});
	it('saturation order', function () {
		expect(husl.fromHex(grey)[1]).to.be.below(husl.fromHex(red)[1]);
	});
	it('lightness order', function () {
		expect(husl.fromHex(black)[2]).to.be.below(husl.fromHex(grey)[2]);
		expect(husl.fromHex(grey)[2]).to.be.below(husl.fromHex(white)[2]);
		expect(husl.fromHex(blue)[2]).to.be.below(husl.fromHex(red)[2]);
		expect(husl.fromHex(red)[2]).to.be.below(husl.fromHex(green)[2]);
	});
});
