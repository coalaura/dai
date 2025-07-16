(() => {
	const Base = {
		// double-quotes
		"“": '"',
		"”": '"',
		"„": '"',
		"«": '"',
		"»": '"',
		"❝": '"',
		"❞": '"',
		"″": '"',

		// single-quotes
		"‘": "'",
		"’": "'",
		"‚": "'",
		"‹": "'",
		"›": "'",
		"′": "'",
		"‛": "'",

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

		"═": "=",

		// dots
		"·": ".",
		"•": "-",

		// math
		"×": "x",
		"÷": "/",
		"⁄": "/",
		"∗": "*",
		"±": "+/-",
		"≈": "~",
		"≅": "~",
		"≆": "~",
		"≊": "~",
		"∼": "~",
		"≕": "=:",
		"≔": ":=",
		"≠": "!=",
		"≣": "===",
		"≡": "==",
		"≤": "<=",
		"≦": "<=",
		"⩽": "<=",
		"⋜": "<=",
		"≥": ">=",
		"≧": ">=",
		"⩾": ">=",
		"⋝": ">=",
		"⋙": ">>>",
		"⋘": "<<<",
		"≫": ">>",
		"≪": "<<",
		"≩": ">",
		"≨": "<",
		"√": "sqrt",

		// arrows
		"⇒": "=>",
		"⇐": "<=",

		// others
		"…": "...",
	};

	const Special = {
		// dashes
		"‑": "-",
		"−": "-",
		"⁻": "-",
		"–": "-",
		"‐": "-",
		"—": "-",
		"─": "-",
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
			const replacement = Mapping[match] || match,
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
			const replacement = Mapping[match] || match,
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
		text = text.replace(/—(?=")/g, "-");

		// Special case for em dash without space in front (becomes comma instead)
		text = text.replace(/(?<! )— ?/g, ", ");

		return text;
	}

	window.dai = {
		clean: clean,
		regex: fullRgx,
	};
})();
