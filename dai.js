(() => {
	const $input = document.getElementById("input"),
		$overlay = document.getElementById("overlay"),
		$counter = document.getElementById("counter"),
		$cleanup = document.getElementById("cleanup");

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

		$cleanup.textContent = "Cleaned & Copied!";
		$cleanup.classList.add("cleaned");

		timeout = setTimeout(() => {
			$cleanup.textContent = "Clean & Copy";
			$cleanup.classList.remove("cleaned");
		}, 750);
	}

	function sync() {
		$overlay.scrollTop = $input.scrollTop;
	}

	function update() {
		const value = $input.value || $input.placeholder;

		$cleanup.classList.toggle("disabled", !$input.value);

		let count = 0;

		$overlay.innerHTML = escapeHTML(value).replace(new RegExp(`${dai.regex}+`, "g"), match => {
			count++;

			return `<span class="unicode">${match}</span>`;
		});

		$overlay.innerHTML += "\n".repeat(10);

		$counter.textContent = `${count > 0 ? count : "no"} issues found`;
		$counter.classList.toggle("none", count === 0);
		$counter.classList.toggle("hidden", !$input.value);

		sync();
	}

	function cleanup() {
		const value = $input.value,
			scrollTop = $input.scrollTop;

		if (!value) {
			return;
		}

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
