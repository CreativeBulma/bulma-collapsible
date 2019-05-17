import EventEmitter from './events';
import * as dom from './dom';
import * as types from './type';
import * as utils from './index';

export default class Component extends EventEmitter {
	constructor(element, options = {}, defaultOptions = {}) {
		super();

		this.element = types.isString(element) ? this.options.container.querySelector(element) : element;

		// An invalid selector or non-DOM node has been provided.
		if (!this.element) {
			throw new Error(`An invalid selector or non-DOM node has been provided for ${this.constructor.name}.`);
		}

		this.element[this.constructor.name] = this.constructor._interface.bind(this);
		this.element[this.constructor.name].Constructor = this.constructor.name;
		this.id = utils.uuid(this.constructor.name + '-');

		this.options = {
			...defaultOptions,
			...options,
			...dom.optionsFromDataset(this.element, defaultOptions) // Use Element dataset values to override options
		};
	}

	/**
	 * Initiate all DOM element corresponding to selector
	 * @method
	 * @return {Array} Array of all Plugin instances
	 */
	static attach(selector = null, options = {}, defaultOptions = {}) {
		let instances = new Array();
		if (selector === null) {
			return instances;
		}

		options = {
			...defaultOptions,
			...options,
			...dom.optionsFromDataset(this.element, defaultOptions) // Use Element dataset values to override options
		};

		const elements = dom.querySelectorAll(selector, options.container) || [];
		elements.forEach(element => {
			// Check if plugin has already been instantiated for element
			if (typeof element[this.constructor.name] === 'undefined') { // If no then instantiate it and register it in element
				instances.push(new this(element, {
					selector: selector,
					...options
				}));
			} else { // If Yes then return the existing instance
				instances.push(element[this.constructor.name]);
			}
		});

		return instances;
	}

	static _interface(options = {}) {
		if (typeof options === 'string') {
			if (typeof this[options] === 'undefined') {
				throw new TypeError(`No method named "${options}"`);
			}

			return this[options](options);
		}

		return this;
	}
}