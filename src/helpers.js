var {PI} = Math;

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

module.exports = {
	degree: degree,
	radian: radian
};
