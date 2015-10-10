var helpers = require("./dist/helpers"),
    gamut = require("./dist/gamut"),
    cam = require("./dist/cam"),
    ucs = require("./dist/ucs"),
    hq = require("./dist/hq");

module.exports = {
	gamut: gamut,
	cfs: helpers.cfs,
	lerp: helpers.lerp,
	cam: cam,
	ucs: ucs,
	hq: hq
};
