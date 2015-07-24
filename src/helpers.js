var merge = require("mout/object/merge"),
    {PI} = Math;

function degree (r) {
	var a = r * 180 / PI;
	while (a < 0) {
		a += 360;
	}
	while (a > 360) {
		a -= 360;
	}
	return a;
}

function radian (d) {
	return PI * d / 180;
}

function cfs (str) {
	return merge(...str.split("").map(v => ({[v]: true})));
}

module.exports = {
	degree: degree,
	radian: radian,
	cfs: cfs
};
