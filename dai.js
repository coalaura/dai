(() => {
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

		$overlay.innerHTML = escapeHTML(value).replace(
			new RegExp(`${dai.regex}+`, "g"),
			(match) => {
				return `<span class="unicode">${match}</span>`;
			},
		);

		$overlay.innerHTML += "\n".repeat(10);

		sync();
	}

	function cleanup() {
		const value = $input.value,
			scrollTop = $input.scrollTop;

		const { cleaned, deltaMap } = dai.clean(value);

		$input.value = cleaned;

		requestAnimationFrame(() => {
			$input.scrollTop = scrollTop;
		});

		update();

		reselect(deltaMap);

		copy(cleaned);
	}

	function escapeHTML(str) {
		return str.replace(/[&<>"']/g, (char) => {
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
