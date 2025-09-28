(() => {
	const Base = {
		// double-quotes
		"\u201c": '"',
		"\u201d": '"',
		"\u201e": '"',
		"\u00ab": '"',
		"\u00bb": '"',
		"\u275d": '"',
		"\u275e": '"',
		"\u2033": '"',

		// single-quotes
		"\u2018": "'",
		"\u2019": "'",
		"\u201a": "'",
		"\u2039": "'",
		"\u203a": "'",
		"\u2032": "'",
		"\u201b": "'",

		// spaces
		"\u00A0": " ",
		"\u2000": " ",
		"\u2001": " ",
		"\u2002": " ",
		"\u2003": " ",
		"\u2004": " ",
		"\u2005": " ",
		"\u2006": " ",
		"\u2007": " ",
		"\u2008": " ",
		"\u2009": " ",
		"\u200A": " ",
		"\u202F": " ",
		"\u205F": " ",
		"\u3000": " ",
		"\u200B": "",
		"\u200C": "",
		"\u200D": "",
		"\uFEFF": "",

		"\u2550": "=",

		// dots
		"\u00b7": ".",
		"\u2022": "-",

		// math
		"\u00d7": "x",
		"\u00f7": "/",
		"\u2044": "/",
		"\u2217": "*",
		"\u00b1": "+/-",
		"\u2248": "~",
		"\u2245": "~",
		"\u2246": "~",
		"\u224a": "~",
		"\u223c": "~",
		"\u2255": "=:",
		"\u2254": ":=",
		"\u2260": "!=",
		"\u2263": "===",
		"\u2261": "==",
		"\u2264": "<=",
		"\u2266": "<=",
		"\u2a7d": "<=",
		"\u22dc": "<=",
		"\u2265": ">=",
		"\u2267": ">=",
		"\u2a7e": ">=",
		"\u22dd": ">=",
		"\u22d9": ">>>",
		"\u22d8": "<<<",
		"\u226b": ">>",
		"\u226a": "<<",
		"\u2269": ">",
		"\u2268": "<",
		"\u221a": "sqrt",

		// arrows
		"\u21d2": "=>",
		"\u21d0": "<=",

		// others
		"\u2026": "...",
	};

	const Special = {
		// dashes
		"\u2011": "-",
		"\u2212": "-",
		"\u207b": "-",
		"\u2013": "-",
		"\u2010": "-",
		"\u2014": "-",
		"\u2500": "-",
	};

	const baseList = Object.keys(Base).join("|"),
		specialList = Object.keys(Special).join("|");

	const baseRgx = `(${baseList})`,
		specialRgx = `(${specialList})`,
		fullRgx = `(${baseList}|${specialList})`;

	function clean(text) {
		const deltaMap = [];

		let cleaned = text;

		// Base cases
		cleaned = cleaned.replace(new RegExp(baseRgx, "g"), (match, offset) => {
			const replacement = Base[match] || match,
				delta = replacement.length - match.length;

			if (delta !== 0) {
				deltaMap.push({
					index: offset,
					delta: delta,
				});
			}

			return replacement;
		});

		// Edge cases
		cleaned = handleEdgeCases(cleaned);

		// Remaining special cases
		cleaned = cleaned.replace(new RegExp(specialRgx, "g"), (match, offset) => {
			const replacement = Special[match] || match,
				delta = replacement.length - match.length;

			if (delta !== 0) {
				deltaMap.push({
					index: offset,
					delta: delta,
				});
			}

			return replacement;
		});

		return {
			cleaned: cleaned,
			deltaMap: deltaMap,
		};
	}

	function handleEdgeCases(text) {
		// Special case for em dash followed by quotes (broken off dialog)
		text = text.replace(/\u2014(?=")/g, "-");

		// Special case for em dash without space in front (becomes comma instead)
		text = text.replace(/(?<! )\u2014 ?/g, ", ");

		return text;
	}

	window.dai = {
		clean: clean,
		regex: fullRgx,
	};
})();
