import * as type from './type';
import * as utils from './index';

export const querySelector = (selector, node) => {
	if (type.isFunction(selector)) {
		return querySelector(selector(), node);
	}

	if (type.isNode(selector)) {
		return selector;
	}

	if (type.isString(selector)) {
		if (node && type.isNode(node)) {
			return node.querySelector(selector);
		} else {
			if (typeof document !== 'undefined') {
				return document.querySelector(selector);
			} else {
				return null;
			}
		}
	}

	if (Array.isArray(selector) || type.isNodeList(selector)) {
		return selector[0];
	}
};
export const querySelectorAll = (selector, node) => {
	if (type.isFunction(selector)) {
		return selector(node ? node : (typeof document !== 'undefined' ? document : null));
	}

	if (type.isString(selector)) {
		if (node && type.isNode(node)) {
			return node.querySelectorAll(selector);
		} else {
			if (typeof document !== 'undefined') {
				return document.querySelectorAll(selector);
			} else {
				return null;
			}
		}
	}

	if (type.isNode(selector)) {
		return [selector];
	}

	if (type.isNodeList(selector)) {
		return selector;
	}

	return null;
};

export const optionsFromDataset = (node, defaultOptions = {}) => {
	if (type.isNode(node)) {
		return node.dataset ? Object.keys(node.dataset)
			.filter(key => Object.keys(defaultOptions).includes(key))
			.reduce((obj, key) => {
				return {
					...obj,
					[key]: node.dataset[key]
				};
			}, {}) : {};
	} else {
		return {};
	}
};

if (typeof Node !== 'undefined' && !Node.prototype.on) {
	Node.prototype.on = function (names, handler) {
		if (!Array.isArray(names)) {
			names = names.split(' ');
		}

		names.forEach(name => {
			this.addEventListener(name.trim(), handler, utils.detectSupportsPassive() ? {
				passive: false
			} : false);
		});

		return this;
	};
}

if (typeof NodeList !== 'undefined' && !NodeList.prototype.on) {
	NodeList.prototype.on = function (names, handler) {
		this.forEach(node => {
			node.on(names, handler);
		});

		return this;
	};
}

if (typeof Node !== 'undefined' && !Node.prototype.off) {
	Node.prototype.off = function (names, handler) {
		if (!Array.isArray(names)) {
			names = names.split(' ');
		}

		names.forEach(name => {
			this.removeEventListener(name.trim(), handler, utils.detectSupportsPassive() ? {
				passive: false
			} : false);
		});

		return this;
	};
}

if (typeof NodeList !== 'undefined' && !NodeList.prototype.off) {
	NodeList.prototype.off = function (names, handler) {
		this.forEach(node => {
			node.off(names, handler);
		});

		return this;
	};
}