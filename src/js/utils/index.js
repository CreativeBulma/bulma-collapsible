export const uuid = (prefix = '') => prefix + ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));

export const ready = handler => {
	if (typeof document !== 'undefined') {
		if (/complete|loaded|interactive/.test(document.readyState) && document.body) {
			handler();
		} else {
			document.addEventListener('DOMContentLoaded', handler, false);
		}
	} else {
		handler.apply();
	}
};

export const detectSupportsPassive = () => {
	let supportsPassive = false;

	if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
		let opts = Object.defineProperty({}, 'passive', {
			get() {
				supportsPassive = true;
				return true;
			}
		});

		const noop = () => { };
		window.addEventListener('testPassive', noop, opts);
		window.removeEventListener('testPassive', noop, opts);
	}

	return supportsPassive;
};