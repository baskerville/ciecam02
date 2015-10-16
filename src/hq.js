import {corLerp} from "./helpers";

var {floor} = Math;

var uniqueHues = [
	{s: "R", h: 20.14, e: 0.8, H: 0},
	{s: "Y", h: 90.00, e: 0.7, H: 100},
	{s: "G", h: 164.25, e: 1.0, H: 200},
	{s: "B", h: 237.53, e: 1.2, H: 300},
	{s: "R", h: 380.14, e: 0.8, H: 400}
];

var hueSymbols = uniqueHues.map(v => v.s).slice(0, -1).join("");

function fromHue (h) {
	if (h < uniqueHues[0].h) {
		h += 360;
	}
	var j = 0;
	while (uniqueHues[j+1].h < h) {
		j++;
	}
	var d_j = (h - uniqueHues[j].h) / uniqueHues[j].e,
	    d_k = (uniqueHues[j+1].h - h) / uniqueHues[j+1].e,
	    H_j = uniqueHues[j].H;
	return H_j + 100 * d_j / (d_j + d_k);
}

function toHue (H) {
	var j = floor(H / 100),
	    amt = H % 100,
	    [{e: e_j, h: h_j}, {e: e_k, h: h_k}] = uniqueHues.slice(j, j+2),
	    h = ((amt * (e_k * h_j - e_j * h_k) - 100 * h_j * e_k) / (amt * (e_k - e_j) - 100 * e_k));
	return h;
}

var shortcuts = {
	O: "RY",
	S: "YG",
	T: "G25B",
	C: "GB",
	A: "B25G",
	V: "B25R",
	M: "BR",
	P: "R25B"
};

function fromNotation (N) {
	var [, H1, P, H2] = N.match(/^([a-z])(?:(.+)?([a-z]))?$/i);
	if (H2 === undefined) {
		H2 = H1;
	}
	if (P === undefined) {
		P = "50";
	}
	[H1, H2] = [H1, H2].map(function (v) {
		v = v.toUpperCase();
		var sc = shortcuts[v];
		return sc ? fromNotation(sc) : 100*hueSymbols.indexOf(v);
	});
	P = parseFloat(P) / 100;
	return corLerp(H1, H2, P, "H");
}

function toNotation (H) {
	var i = floor(H / 100),
	    j = (i + 1) % hueSymbols.length,
	    p = (H - i * 100);
	if (p > 50) {
		[i, j] = [j, i];
		p = 100 - p;
	}
	if (p < 1) {
		return hueSymbols[i];
	} else {
		return hueSymbols[i] + p.toFixed() + hueSymbols[j];
	}
}

export {fromHue, toHue, fromNotation, toNotation};
