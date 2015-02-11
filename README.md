# SpiritJS [![Build Status](https://travis-ci.org/inlet/spirit.js.svg?branch=master)](https://travis-ci.org/inlet/spirit.js) [![Dependencies](http://img.shields.io/badge/dependencies-jquery%20and%20greensock-brightgreen.svg)](https://github.com/inlet/spirit.js) [![License](http://img.shields.io/badge/license-Apache%202-blue.svg)](https://github.com/inlet/spirit.js)  

The animation toolkit every frontender & designer needs! 

![](spiritjs.png)

This little toy gives you the power to create life and make magic! It’s time to spice up your animation-workflow and give your productivity a boost.

Create stunning & high-performance (web)animations is childplay now. The best of all: it makes developing animations fun!

* Website: [spiritjs.io](http://spiritjs.io)
* Tutorial: coming soon
* API Docs: coming soon

## Usage

	bower install spirit --save

Include `spirit.min.js` in your project and kickoff your animations.

```html
<!DOCTYPE html>
<html>
<body>

  <!-- assets -->
  <img data-spirit-id="puppet-body" src="/img/puppet.svg" />
  <img data-spirit-id="puppet-head" src="/img/puppet-head.svg" />
  <img data-spirit-id="hand-left" src="/img/puppet-hand-left.svg" />
  <img data-spirit-id="hand-right" src="/img/puppet-hand-right.svg" />
  
  <!-- start spirit and play puppet-animation group -->
  <script src=“/spirit.min.js"></script> 
  <script>
    spirit.load(..jsondata..);
    
    var group = spirit.groups.get('puppet-animation');
    group.play();  
  </script>
  
</body>
</html>
```

Make sure to checkout the Tutorial page (coming soon..), which get’s you up and running in no time. 

## Building SpiritJS

Once you have your environment setup just run

```bash
npm install
bower install
```

This will install all dependencies and build the library using Gulp.

### Running tasks

Execute all unit tests:

```bash
gulp test
```

Run specs over browser (using Karma):

```bash
gulp test:browser
```

Create and view coverage report:

```bash
gulp test:coverage
```

For development, watch specs and source files. Automatically lint js code and build new version.

```bash
gulp watch
```

Lint source files and create a new build.
```bash
gulp
```

## Roadmap

- Integrate this library with the SpiritJS Chrome Extension (still in development).
- Get rid of internals, and have a better exposed API

