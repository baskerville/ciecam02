var husl = require('../husl');
var expect = require('chai').expect;

describe('HuSL', function () {
	it('hue order', function () {
		expect(husl.fromHex('#FF0000')[0]).to.be.below(husl.fromHex('#00FF00')[0]);
		expect(husl.fromHex('#00FF00')[0]).to.be.below(husl.fromHex('#0000FF')[0]);
	});
	it('saturation order', function () {
		expect(husl.fromHex('#777777')[1]).to.be.below(husl.fromHex('#FF0000')[1]);
	});
	it('lightness order', function () {
		expect(husl.fromHex('#000000')[2]).to.be.below(husl.fromHex('#777777')[2]);
		expect(husl.fromHex('#777777')[2]).to.be.below(husl.fromHex('#FFFFFF')[2]);
		expect(husl.fromHex('#0000FF')[2]).to.be.below(husl.fromHex('#FF0000')[2]);
		expect(husl.fromHex('#FF0000')[2]).to.be.below(husl.fromHex('#00FF00')[2]);
	});
});
