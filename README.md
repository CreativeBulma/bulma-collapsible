# :exclamation::exclamation::exclamation: Looking for new Maintainer :exclamation::exclamation::exclamation:
As you may have noticed, this package has not been updated for some time. I'm sorry, but unfortunately I'm not able to continue to maintain it, so I'm looking for someone who would like to take it over and maintain it. If you are interested, open an issue to request ownership transfer.

# Introduction
**Make any Bulma element collapsible with ease**

This components as been developped as a [Bulma](https://bulma.io) extension and bring you the ability to **easily Collapse/Exand any kind of element/component**.  
We designed it to be as generic as possible, that's why its Sass part is lighter than in its ancestor (Wikiki's bulma-accordion component). But don't worry you can still use it for accordion purpose - and even more.

[![npm](https://img.shields.io/npm/v/@creativebulma/bulma-collapsible.svg)](https://www.npmjs.com/package/@creativebulma/bulma-collapsible)
[![npm](https://img.shields.io/npm/dm/@creativebulma/bulma-collapsible.svg)](https://www.npmjs.com/package/@creativebulma/bulma-collapsible)

------------

## Prerequisites
This component extends [Bulma CSS Framework](https://bulma.io) and requires it to work.

## Get Started
```shell
npm i -D @creativebulma/bulma-collapsible
```
Full installation steps can be found here: [installation steps](https://bulma-collapsible.netlify.app/installation)

## Live demo
[Live demo](https://bulma-collapsible.netlify.app/usage)

## Documentation
See [documentation](https://bulma-collapsible.netlify.app/)

## Tests
This library uses Jest & Puppeteer for test purpose.
<center>
	<a href="https://jest.io" target="_blank"><img src="https://www.vectorlogo.zone/logos/jestjsio/jestjsio-ar21.svg" alt="jest" title="jest" height="70"></a>
	&nbsp;
	<a href="https://github.com/GoogleChrome/puppeteer" target="_blank"><img src="https://www.vectorlogo.zone/logos/pptrdev/pptrdev-official.svg" alt="jest" title="jest" height="70"></a>
</center>

[Jest](https://jestjs.io/) is a testing framework maintained by Facebook that works great with [Puppeteer](https://github.com/GoogleChrome/puppeteer), a library for controlling Headless Chrome which bring the ability to test UI.


```shell
$ npm run test
```

If you want to run tests using the amazing Majestic UI execute the following command from your terminal:
```shell
$ npx majestic
```

**Caution:** You have to run <code>gulp</code> to build project before running tests if you have modified sources (test process is working with headless browser so it uses compiled files).


## About the project
BulmaCollapsible is © 2019 by CreativeBulma.

This project is based on the work done by Wikiki.

## License
BulmaCollapsible is distributed under MIT license.

## Contributing
**Contribution are welcome!**  
When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.
