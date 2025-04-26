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

	const $input = document.getElementById("input"),
		$overlay = document.getElementById("overlay"),
		$cleanup = document.getElementById("cleanup"),
		$copied = document.getElementById("copied");

	$input.addEventListener("paste", update);
	$input.addEventListener("input", update);
	$input.addEventListener("scroll", sync);

	$cleanup.addEventListener("click", cleanup);

	let timeout;

	function reselect(deltaMap) {
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

		$input.setSelectionRange(newStart, newEnd);
	}

	function copy(text) {
		navigator.clipboard.writeText(text);

		clearTimeout(timeout);

		$copied.classList.add("show");

		timeout = setTimeout(() => {
			$copied.classList.remove("show");
		}, 750);
	}

	function sync() {
		$overlay.scrollTop = $input.scrollTop;
	}

	function update() {
		const value = $input.value || $input.placeholder;

		$overlay.innerHTML = escapeHTML(value).replace(new RegExp(`${rgx}+`, "g"), match => {
			return `<span class="unicode">${match}</span>`;
		});

		$overlay.innerHTML += "\n".repeat(10);

		sync();
	}

	function cleanup() {
		const value = $input.value,
			scrollTop = $input.scrollTop,
			deltaMap = [];

		let cleaned = value;

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

		$input.value = cleaned;

		requestAnimationFrame(() => {
			$input.scrollTop = scrollTop;
		});

		update();

		reselect(deltaMap);

		copy(cleaned);
	}

	function escapeHTML(str) {
		return str.replace(/[&<>"']/g, char => {
			switch (char) {
				case "&":
					return "&amp;";
				case "<":
					return "&lt;";
				case ">":
					return "&gt;";
				case '"':
					return "&quot;";
				case "'":
					return "&#39;";
			}

			return char;
		});
	}

	update();
})();
