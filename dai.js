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
		"—": ", ",

		// dots
		"·": ".",
		"•": "-",

		// math
		"×": "x",
		"÷": "/",
		"⁄": "/",
		"±": "+/-",
		"≈": "~",
		"≠": "!=",
		"≤": "<=",
		"≥": ">=",
		"√": "sqrt",

		// arrows
		"→": "->",
		"←": "<-",
		"↔": "<->",
  		"⇒": "=>",
		"⇐": "<=",
		"➔": "->",
		"➙": "->",

		// others
		"…": "...",
	};

	const $input = document.getElementById("input"),
		$copied = document.getElementById("copied");

	$input.addEventListener("paste", update);
	$input.addEventListener("input", update);

	let timeout;

	function notify() {
		clearTimeout(timeout);

		$copied.classList.add("show");

		timeout = setTimeout(() => {
			$copied.classList.remove("show");
		}, 1500);
	}

	function update() {
		const original = $input.value?.trim();

		if (!original) {
			return;
		}

		let cleaned = "",
			deltaMap = [];

		const chars = `[${Object.keys(Mapping).join("")}]`,
			regexp = new RegExp(chars, "g");

		cleaned = original.replace(regexp, (match, offset) => {
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

		if (cleaned === original) return;

		const { selectionStart, selectionEnd } = $input;

		let newStart = selectionStart,
			newEnd = selectionEnd;

		for (const { index, delta } of deltaMap) {
			if (index < selectionStart) {
				newStart += delta;
			}

			if (index < selectionEnd) {
				newEnd += delta;
			}
		}

		$input.value = cleaned;

		$input.setSelectionRange(newStart, newEnd);

		navigator.clipboard.writeText(cleaned);

		notify();
	}

	update();
})();
