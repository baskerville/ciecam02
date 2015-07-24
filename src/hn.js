var hq = require("./hq"),
    {abs, floor} = Math,
    letters = "rygb";

module.exports = {
	fromHue (h) {
		var H = hq.fromHue(h),
		    i = floor(H / 100),
		    j = (i + 1) % letters.length,
		    p = (H - i * 100);
		if (p > 50) {
			[i, j] = [j, i];
			p = 100 - p;
		}
		if (p < 1) {
			return letters[i];
		} else {
			return letters[i] + p.toFixed() + letters[j];
		}
	},
	toHue (n) {
		var m = n.match(/^([a-z])(?:(.+)([a-z]))?$/),
		    [H1, H2] = [m[1], m[3]].map(v => 100*letters.indexOf(v)),
		    t = parseFloat(m[2]) / 100;
		if (H2 < 0) {
			H2 = H1;
			t = 0;
		}
		var d = abs(H2-H1);
		if (d > 200) {
			if (H1 > H2) {
				H2 += 400;
			} else {
				H1 += 400;
			}
		}
		var H = ((1-t) * H1 + t * H2) % 400;
		return hq.toHue(H);
	}
};
