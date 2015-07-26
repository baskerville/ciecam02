var hq = require("./hq"),
    {lerp} = require("./helpers"),
    {floor} = Math,
    uniqueSymbols = "rygb";

module.exports = {
	fromHue (h) {
		var H = hq.fromHue(h),
		    i = floor(H / 100),
		    j = (i + 1) % uniqueSymbols.length,
		    p = (H - i * 100);
		if (p > 50) {
			[i, j] = [j, i];
			p = 100 - p;
		}
		if (p < 1) {
			return uniqueSymbols[i];
		} else {
			return uniqueSymbols[i] + p.toFixed() + uniqueSymbols[j];
		}
	},
	toHue (N) {
		var m = N.match(/^([a-z])(?:(.+)([a-z]))?$/),
		    [H1, H2] = [m[1], m[3]].map(v => 100*uniqueSymbols.indexOf(v)),
		    t = parseFloat(m[2]) / 100;
		if (H2 < 0) {
			H2 = H1;
			t = 0;
		}
		return hq.toHue(lerp(H1, H2, t, "H"));
	}
};
