'use strict';

import * as path from 'path';

import plugin from '../src/js/index.js';	// Used as reference to check instances type

const triggerOneSelector = '[data-action="collapse"][data-target="collapsible-one"]';
const triggerTwoSelector = '[data-action="collapse"][data-target="collapsible-two"]';
const collapsibleOne = '#collapsible-one';
const collapsibleTwo = '#collapsible-two';

const timeout = 10000;

const toClass = function(obj, proto) {
	obj.__proto__ = proto;
	
	return obj;
};

describe('bulmaCollapsible', () => {
	let page;

	beforeAll(async () => {
		jest.setTimeout(timeout);
		page = await global.__BROWSER__.newPage();
	});

	beforeEach(async () => {
		await page.goto(`file:${path.join(__dirname, 'index-test.html')}`, {
			waitUntil: 'domcontentloaded'
		});
		await page.addScriptTag({
			path: './dist/js/bulma-collapsible.min.js'
		});
	});

	afterAll(async () => {
		await page.close();
	});

	it('Should throw exception if instanciate with no/wrong selector', () => {
		expect(() => {
			new plugin();
		}).toThrow('An invalid selector or non-DOM node has been provided for bulmaCollapsible.');
	});

	it('Should return an array', async () => {
		const instances = plugin.attach('.selector');

		expect(Array.isArray(instances)).toBe(true);
		expect(instances.length).toBe(0);
	});

	it('Should return an array of bulmaCollapsible instances', async () => {
		const instances = await page.evaluate(() => bulmaCollapsible.attach());

		// We should have two Collapsible instances returned
		expect(instances.length).toBe(2);
		instances.every(instance => {
			expect(typeof instance).toBe('object');
			expect(instance._class == 'bulmaCollapsible');
		});
	});

	it('Should return an array of bulmaCollapsible instanciated from specific container', async () => {
		const instances = await page.evaluate(() => bulmaCollapsible.attach('.is-collapsible', {
			container: document.getElementById('collapsibles')
		}));

		// We should have two Collapsible instances returned
		expect(instances.length).toBe(2);
		instances.every(instance => {
			expect(typeof instance).toBe('object');
			expect(instance._class == 'bulmaCollapsible');
		});
	});

	it('Should return an array of bulmaCollapsible instanciated from NodeList', async () => {
		const instances = await page.evaluate(() => {
			const elements = document.querySelectorAll('.is-collapsible') || [];
			return bulmaCollapsible.attach(elements);
		});

		// We should have two Collapsible instances returned
		expect(instances.length).toBe(2);
		instances.every(instance => {
			expect(typeof instance).toBe('object');
			expect(instance._class == 'bulmaCollapsible');
		});
	});

	it('Should have bulmaCollapsible instance registered in node element', async () => {
		const instances = await page.evaluate(() => bulmaCollapsible.attach());
  
		expect(instances.length).toBe(2);
		
		const firstCollapsibleElement = await page.$eval(collapsibleOne, el => typeof el.bulmaCollapsible == 'function' && el.bulmaCollapsible() instanceof bulmaCollapsible);
		const secondCollapsibleElement = await page.$eval(collapsibleTwo, el => typeof el.bulmaCollapsible == 'function' && el.bulmaCollapsible() instanceof bulmaCollapsible);
		expect(firstCollapsibleElement).toBe(true);
		expect(secondCollapsibleElement).toBe(true);
	});

	it('Should return an array of bulmaCollapsible instances with options', async () => {
		const instances = await page.evaluate(() => bulmaCollapsible.attach('.is-collapsible', {
			allowMultiple: true
		}));

		expect(instances.length).toBe(2);
		instances.every(instance => expect(instance.options.allowMultiple).toBe(true));
	});

	it('Should activate second collapsible by default', async () => {
		const instances = await page.evaluate(() => bulmaCollapsible.attach());

		const firstCollapsibleInstance = toClass(instances[0], plugin.prototype);
		const secondCollapsibleInstance = toClass(instances[1], plugin.prototype);

		expect(firstCollapsibleInstance.collapsed()).toBe(true);
		expect(secondCollapsibleInstance.collapsed()).toBe(false);
	});

	it('Should activate collapsible on expand', async () => {
		await page.evaluate(() => bulmaCollapsible.attach());

		// Click on trigger again to open collapsible element
		await page.click(triggerOneSelector);
 
		// Create component class from $eval returned object
		const firstCollapsibleInstanceObject = await page.$eval(collapsibleOne, el => el.bulmaCollapsible());
		const firstCollapsibleInstance = toClass(firstCollapsibleInstanceObject, plugin.prototype);
	 	expect(firstCollapsibleInstance.collapsed()).toBe(false);
	});

	it('Should add is-active class to element on expand', async () => {
		await page.evaluate(() => bulmaCollapsible.attach());

		// Click on trigger to open collapsible element
		await page.click(triggerOneSelector);

		// Check if collapsible-one class list contains 'is-active'
		const isCollapsibleOneActive = await page.$eval(collapsibleOne, el => el.classList.contains('is-active'));

		expect(isCollapsibleOneActive).toBe(true);
	});

	it('Should remove is-active class from element on collapse', async () => {
		await page.evaluate(() => bulmaCollapsible.attach());

		// Click on trigger again to open collapsible element
		await page.click(triggerTwoSelector);

		// Check if collapsible-one class list contains 'is-active'
		const isCollapsibleTwoActive = await page.$eval(collapsibleTwo, el => el.classList.contains('is-active'));

		expect(isCollapsibleTwoActive).toBe(false);
	});

	it('Should add is-active class to trigger element on expand', async () => {
		await page.evaluate(() => bulmaCollapsible.attach());

		// Click on trigger to open collapsible element
		await page.click(triggerOneSelector);

		// Check if collapsibleTrigger class list contains 'is-active'
		const isTriggerActive = await page.$eval(triggerOneSelector, el => el.classList.contains('is-active'));

		expect(isTriggerActive).toBe(true);
	});

	it('Should remove is-active class from trigger element on collapse', async () => {
		await page.evaluate(() => bulmaCollapsible.attach());

		// Click on trigger to close collapsible element
		await page.click(triggerTwoSelector);

		// Check if collapsibleTrigger class list contains 'is-active'
		const isTriggerActive = await page.$eval(triggerTwoSelector, el => el.classList.contains('is-active'));

		expect(isTriggerActive).toBe(false);
	});

	it('Should have both elements expanded', async () => {
		await page.evaluate(() => bulmaCollapsible.attach('.is-collapsible', {
			allowMultiple: true
		}));

		// Click on trigger to open first collapsible element
		await page.click(triggerOneSelector);
		
		// Check if collapsible-one class list contains 'is-active'
		const isCollapsibleOneActive = await page.$eval(collapsibleOne, el => el.classList.contains('is-active'));
		// Check if collapsible-two class list contains 'is-active'
		const isCollapsibleTwoActive = await page.$eval(collapsibleTwo, el => el.classList.contains('is-active'));

		expect(isCollapsibleOneActive).toBe(true);
		expect(isCollapsibleTwoActive).toBe(true);
		
		// Create component class from $eval returned object
		const firstCollapsibleInstanceObject = await page.$eval(collapsibleOne, el => el.bulmaCollapsible());
		const firstCollapsibleInstance = toClass(firstCollapsibleInstanceObject, plugin.prototype);
		const secondCollapsibleInstanceObject = await page.$eval(collapsibleTwo, el => el.bulmaCollapsible());
		const secondCollapsibleInstance = toClass(secondCollapsibleInstanceObject, plugin.prototype);
		expect(firstCollapsibleInstance.collapsed()).toBe(false);
		expect(secondCollapsibleInstance.collapsed()).toBe(false);
	});

	it('Should collapse only one element', async () => {
		await page.evaluate(() => bulmaCollapsible.attach('.is-collapsible', {
			allowMultiple: true
		}));

		// Click on trigger to open first collapsible element
		await page.click(triggerOneSelector);
		// Click on trigger again to close first collapsible element
		await page.click(triggerOneSelector);

		// Check if collapsible-one class list contains 'is-active'
		const isCollapsibleOneActive = await page.$eval(collapsibleOne, el => el.classList.contains('is-active'));
		const isCollapsibleTwoActive = await page.$eval(collapsibleTwo, el => el.classList.contains('is-active'));

		expect(isCollapsibleOneActive).toBe(false);
		expect(isCollapsibleTwoActive).toBe(true);
		
		// Create component class from $eval returned object
		const firstCollapsibleInstanceObject = await page.$eval(collapsibleOne, el => el.bulmaCollapsible());
		const firstCollapsibleInstance = toClass(firstCollapsibleInstanceObject, plugin.prototype);
		const secondCollapsibleInstanceObject = await page.$eval(collapsibleTwo, el => el.bulmaCollapsible());
		const secondCollapsibleInstance = toClass(secondCollapsibleInstanceObject, plugin.prototype);
		expect(firstCollapsibleInstance.collapsed()).toBe(true);
		expect(secondCollapsibleInstance.collapsed()).toBe(false);
	});

	it('Should collapse previous element', async () => {
		await page.evaluate(() => bulmaCollapsible.attach());

		// Click on trigger to open first collapsible element
		await page.click(triggerOneSelector);

		// Check if collapsible-one class list contains 'is-active'
		const isCollapsibleOneActive = await page.$eval(collapsibleOne, el => el.classList.contains('is-active'));
		const isCollapsibleTwoActive = await page.$eval(collapsibleTwo, el => el.classList.contains('is-active'));

		expect(isCollapsibleOneActive).toBe(true);
		expect(isCollapsibleTwoActive).toBe(false);
		
		// Create component class from $eval returned object
		const firstCollapsibleInstanceObject = await page.$eval(collapsibleOne, el => el.bulmaCollapsible());
		const firstCollapsibleInstance = toClass(firstCollapsibleInstanceObject, plugin.prototype);
		const secondCollapsibleInstanceObject = await page.$eval(collapsibleTwo, el => el.bulmaCollapsible());
		const secondCollapsibleInstance = toClass(secondCollapsibleInstanceObject, plugin.prototype);
		expect(firstCollapsibleInstance.collapsed()).toBe(false);
		expect(secondCollapsibleInstance.collapsed()).toBe(true);
	});

	it('Should activate collapsible on calling expand method', async () => {
		await page.evaluate(() => {
			const instances = bulmaCollapsible.attach();
			instances[0].expand();
		});
		
		// Create component class from $eval returned object
		const firstCollapsibleInstanceObject = await page.$eval(collapsibleOne, el => el.bulmaCollapsible());
		const firstCollapsibleInstance = toClass(firstCollapsibleInstanceObject, plugin.prototype);
		expect(firstCollapsibleInstance.collapsed()).toBe(false);
	});

	it('Should deactivate collapsible on calling collapse method', async () => {
		await page.evaluate(() => {
			const instances = bulmaCollapsible.attach();
			instances[1].collapse();
		});
		
		// Create component class from $eval returned object
		const secondCollapsibleInstanceObject = await page.$eval(collapsibleTwo, el => el.bulmaCollapsible());
		const secondCollapsibleInstance = toClass(secondCollapsibleInstanceObject, plugin.prototype);
		expect(secondCollapsibleInstance.collapsed()).toBe(true);
	});

	it('Should log Events in console', async () => {
		await page.evaluate(() => {
			const instances = bulmaCollapsible.attach();

			instances.every(instance => {
				instance.on('before:expand', (e) => {
					expect(e.data.collapsed()).toBe(true);
				});
				instance.on('after:expand', (e) => {
					expect(e.data.collapsed()).toBe(false);
				});
				instance.on('before:collapse', (e) => {
					expect(e.data.collapsed()).toBe(false);
				});
				instance.on('after:collapse', (e) => {
					expect(e.data.collapsed()).toBe(true);
				});
			});
		});

		// Click on trigger to open first collapsible element
		await page.click(triggerOneSelector);
		
		// Click on trigger again to close first collapsible element
		await page.click(triggerOneSelector);
	});
}, timeout);