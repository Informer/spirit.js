# backbone-command [![Build Status](https://travis-ci.org/inlet/backbone-command.png)](https://travis-ci.org/inlet/backbone-command)

Execution of [commands](http://en.wikipedia.org/wiki/Command_pattern) upon event triggers.
This is build for usage with [Backbone](https://github.com/jashkenas/backbone) and relies on [injector.js](https://github.com/biggerboat/injector.js)

## Install
You could just download ```backbone-command.js``` or ```backbone-command.min.js``` from the project root.

We advise you to download it using [Bower](http://http://bower.io/) instead:
```
bower install backbone-command
```
This command will automatically download all dependencies. So in this case it takes care of downloading
[injector.js](https://github.com/biggerboat/injector.js), jQuery, Backbone and Underscore for you.

## Theory
Essentially a command is just a class with one method function. This method gets executed and then the command
instance stops to exist. As the command is a single class and can live in a separate file, it can be nicely separated from
the rest of your application. It helps keeping your classes decoupled by separating the action from the rest of the system.
Say you have a search view. Once the user enters a new search query we should execute a search. The view should not know about
how such logic is handled, all it knows is that it has to set the search query on a model. A command can then take care of
executing the desired logic. This might mean a backend call and changing the loading property to true on a model for example.
Commands are essentially the glue of your application. Your models and views should be completely agnostic,
but the command can bring all of these together. A command has access to the injector and therefor usually has access to everything it needs.