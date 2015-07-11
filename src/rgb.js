var {round} = Math;

module.exports = {
	fromHex (hex) {
		if (hex[0] == "#") {
			hex = hex.slice(1);
		}
		if (hex.length < 6) {
			hex = hex.split("").map(v => v+v).join("");
		}
		return hex.match(/../g).map(v => parseInt(v, 16)/255);
	},
	toHex (RGB) {
		var hex = RGB.map(function (v) {
			v = round(255*v).toString(16);
			if (v.length < 2) {
				v = "0" + v;
			}
			return v;
		}).join("");
		return "#" + hex;
	},
	inGamut (RGB) {
		return (RGB[0] >= 0 && RGB[0] <= 1 && RGB[1] >= 0 && RGB[1] <= 1 && RGB[2] >= 0 && RGB[2] <= 1);
	}
};
