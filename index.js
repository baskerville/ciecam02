var illuminant = require("./dist/illuminant"),
    workspace = require("./dist/workspace"),
    gamut = require("./dist/gamut"),
    rgb = require("./dist/rgb"),
    xyz = require("./dist/xyz"),
    cam = require("./dist/cam"),
    ucs = require("./dist/ucs"),
    cfs = require("./dist/helpers").cfs,
    hq = require("./dist/hq"),
    hn = require("./dist/hn");

module.exports = {
	illuminant: illuminant,
	workspace: workspace,
	gamut: gamut,
	cfs: cfs,
	rgb: rgb,
	xyz: xyz,
	cam: cam,
	ucs: ucs,
	hq: hq,
	hn: hn
};
