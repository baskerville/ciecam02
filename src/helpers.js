import {merge} from "mout/object";

var {abs, pow, sqrt, PI} = Math;

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

var hueMax = {
       h: 360,
       H: 400
};

function corLerp(a, b, t, cor) {
	var m = hueMax[cor];
	if (m) {
		var d = abs(a - b);
		if (d > m / 2) {
			if (a > b) {
				b += m;
			} else {
				a += m;
			}
		}
	}
	return ((1 - t) * a + t * b) % (m || Infinity);
}

function lerp (start, end, t) {
	var CAM = {};
	for (var cor in start) {
		CAM[cor] = corLerp(start[cor], end[cor], t, cor);
	}
	return CAM;
}

function distance (start, end) {
	var d = 0;
	for (var cor in start) {
		d += pow(start[cor]-end[cor], 2);
	}
	return sqrt(d);
}

function cfs (str) {
	return merge(...str.split("").map(v => ({[v]: true})));
}

export {degree, radian, corLerp, lerp, distance, cfs};
