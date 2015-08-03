"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _hq = require("./hq");

var hq = _interopRequireWildcard(_hq);

var _helpers = require("./helpers");

var floor = Math.floor;
var uniqueSymbols = "rygb";

function fromHue(h) {
	var H = hq.fromHue(h),
	    i = floor(H / 100),
	    j = (i + 1) % uniqueSymbols.length,
	    p = H - i * 100;
	if (p > 50) {
		var _ref = [j, i];
		i = _ref[0];
		j = _ref[1];

		p = 100 - p;
	}
	if (p < 1) {
		return uniqueSymbols[i];
	} else {
		return uniqueSymbols[i] + p.toFixed() + uniqueSymbols[j];
	}
}

function toHue(N) {
	var m = N.match(/^([a-z])(?:(.+)([a-z]))?$/);

	var _map = [m[1], m[3]].map(function (v) {
		return 100 * uniqueSymbols.indexOf(v);
	});

	var _map2 = _slicedToArray(_map, 2);

	var H1 = _map2[0];
	var H2 = _map2[1];
	var t = parseFloat(m[2]) / 100;
	if (H2 < 0) {
		H2 = H1;
		t = 0;
	}
	return hq.toHue((0, _helpers.corLerp)(H1, H2, t, "H"));
}

exports.fromHue = fromHue;
exports.toHue = toHue;