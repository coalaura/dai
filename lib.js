(() => {
	const Mapping = {
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

		// dashes
		"‑": "-",
		"−": "-",
		"⁻": "-",
		"–": "-",
		"‐": "-",
		"—": "-",
		"─": "-",

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

	const rgx = `(${Object.keys(Mapping).join("|")})`;

	function clean(text) {
		const deltaMap = [];

		let cleaned = text;

		// Special case for em dash without space in front (becomes comma instead)
		cleaned = cleaned.replace(/(?<! )— ?/g, ", ");

		// Other cases
		cleaned = cleaned.replace(new RegExp(rgx, "g"), (match, offset) => {
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

	window.dai = {
		clean: clean,
		regex: rgx,
	};
})();
