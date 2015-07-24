var {floor} = Math;

var uniqueHues = [
	{s: "R", h: 20.14, e: 0.8, H: 0},
	{s: "Y", h: 90.00, e: 0.7, H: 100},
	{s: "G", h: 164.25, e: 1.0, H: 200},
	{s: "B", h: 237.53, e: 1.2, H: 300},
	{s: "R", h: 380.14, e: 0.8, H: 400}
];

module.exports = {
	fromHue (h) {
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
	},
	toHue (H) {
		var j = floor(H / 100),
		    amt = H % 100,
		    [{e: e_j, h: h_j}, {e: e_k, h: h_k}] = uniqueHues.slice(j, j+2),
		    h = ((amt * (e_k * h_j - e_j * h_k) - 100 * h_j * e_k) / (amt * (e_k - e_j) - 100 * e_k));
		return h;
	}
};
