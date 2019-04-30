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
			return document.querySelector(selector);
		}
	}

	if (Array.isArray(selector) || NodeList.prototype.isPrototypeOf(selector)) {
		return selector[0];
	}
};
export const querySelectorAll = (selector, node) => type.isFunction(selector) ?
	selector(node ? node : document) : (type.isString(selector) ?
		((node && type.isNode(node)) ? node.querySelectorAll(selector) : document.querySelectorAll(selector)) : (type.isNode(selector) ? [selector] : (NodeList.prototype.isPrototypeOf(selector) ?
			selector : null)));

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

if (window.Node && !Node.prototype.on) {
	Node.prototype.on = function (events, handler) {
		if (!Array.isArray(events)) {
			events = events.split(' ');
		}

		events.forEach(event => {
			this.addEventListener(event, handler, utils.detectSupportsPassive() ? {
				passive: false
			} : false);
		});
	};
}

if (window.NodeList && !NodeList.prototype.on) {
	NodeList.prototype.on = function (events, handler) {
		this.forEach(node => {
			node.on(events, handler);
		});
	};
}

if (window.Node && !Node.prototype.off) {
	Node.prototype.off = function (events, handler) {
		if (!Array.isArray(events)) {
			events = events.split(' ');
		}

		events.forEach(event => {
			this.removeEventListener(event, handler, utils.detectSupportsPassive() ? {
				passive: false
			} : false);
		});
	};
}

if (window.NodeList && !NodeList.prototype.off) {
	NodeList.prototype.off = function (events, handler) {
		this.forEach(node => {
			node.off(events, handler);
		});
	};
}