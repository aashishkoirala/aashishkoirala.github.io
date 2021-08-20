---
title: Introduction to NodeJS
slug: introduction-to-nodejs
aliases:
- /blog/introduction-to-nodejs
date: 2012-04-12
draft: false
tags:
- node
- nodejs
- js
- javascript
---
I just ran into some presentation material from a Node.js introduction presentation I had done in a session that shall remain unnamed. I thought it would be a good idea to put it out there in case someone is starting out with Node, should they stumble on here. So, here it is.

To quote [Wikipedia](http://en.wikipedia.org/wiki/Nodejs):

+ A software system designed for writing scalable internet applications, notably web servers.
+ Programs are written in JavaScript, using event-driven, asynchronous I/O to minimize overhead and maximize scalability.
+ Consists of Google's V8 JavaScript engine plus several built-in libraries.
+ Created by Ryan Dahl starting in 2009; growth sponsored by Joyent, his employer.

The V8 JavaScript Engine is part of why Chrome is so fast. It compiles JavaScript to native code. It has a "stop-the-world" garbage collector that makes it more suitable for non-interactive applications. In Dahl's words, V8 is a "beast" with all sorts of features (such as debugging). Node.js is a JavaScript library (compare to JRE or .NET framework) on top of the V8 JS Engine (compare to JVM or .NET CLR).

Traditionally, the way synchronous programming works is that you call a function, wait for its result, call the next function, wait for that result, and so on. To do multiple things at once, you need to spawn multiple threads. Each thread is either itself synchronous or spawns more threads as required.

With asynchronous programming - which is what Node.js follows, you call a function, but instead of waiting, pass another function (“callback”) as a parameter (also known as the *continuation passing* pattern). The callback function is executed by the function being called when it’s done. The callback function can itself take another callback function as a parameter, and so on.

Asynchronous programming is easier in languages that support closures, and JavaScript happens to be one of them. A simple example:

    var a = 1, b = 2;

    function firstFunction(a, b, cb) {
	    cb(a + b);
    }

    firstFunction(a, b, function(c) {
	    console.log(c);
    });

A Node.js application is a bunch of JavaScript (.js) files. The application is launched using the node executable:

    node entry-point-js-file

The process knows by itself when to exit.

Here's a simple "Hello, world" example:

	setTimeout(function() {
		console.log("Here comes the chicken!");
	}, 2000);

	console.log("Here comes the egg!");

Here's a simple web server:

	require('http').createServer(function(req, res) {
		res.writeHead(200, { 'Content-Type' : 'text/plain' });
		res.write("Here comes the egg!");
		setTimeout(function() {
			res.end("Here comes the chicken!");
		}, 2000);
	}).listen(8000);

A little more dynamic:

	require('http').createServer(function(req, res) {
		res.writeHead(200, { 'Content-Type' : 'text/plain' });
		getValueFromDB(req, res, getValueFromWebService);
	}).listen(8000);
	
	function getValueFromDB(req, res, cb) {
		console.log("Getting value from database...");
		var value = 45; // Get from DB in real life
		cb(value, res);
	}
	
	function getValueFromWebService(input, res) {
		console.log("Getting value from web service " +
			"based on value from db = " + input + "...");
		var value = input * 2; // Get from WS in real life
		res.end(value.toString());
	}

If we take an unusual use case to demonstrate the power of asynchronous programming, consider we need an application that needs to: 

+ Do Thing 1 every 5 seconds
+ Do Thing 2 every 2 seconds
+ Do Thing 3 every 30 seconds
+ Be a web server
+ Also be a TCP server

Then, here's the Node.js solution:

	require('http').createServer(function(req, res) {
		res.writeHead(200, { 'Content-Type' : 'text/plain' });
		res.end(JSON.stringify(req.headers));
	}).listen(8000);
	
	require('net').createServer(function(socket) {
		socket.on('data', function() {
			socket.write('Hey!');
		});
	}).listen(7000);
	
	setInterval(function() {
		console.log("Doing thing 1...");
	}, 5000);
	
	setInterval(function() {
		console.log("Doing thing 2...");
	}, 2000);
	
	setInterval(function() {
		console.log("Doing thing 3...");
	}, 30000);

There you go, Node.js - oversimplified and in a nutshell.