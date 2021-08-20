---
title: Conditional JQuery Datepicker With AngularJS
slug: conditional-jquery-datepicker-with-angularjs
date: 2014-03-07
draft: false
tags:
- javascript
- js
- jquery
- angular
---
I just find AngularJS directives so much fun. It is so satisfying to see them work. Recently, I came across a requirement where I had a text field bound to a property that could either be a date or text. I had a way of knowing which one it was, but if the property was a date, the text field would need to become a datepicker, and turn back into a normal text field if not. And no, not an HTML5 date control - an old-timy jQuery datepicker.

So, a simplified version of what the controller looked like:

	var app = angular.module('app', ...);
	...

	app.controller('ctrl', function ($scope, ...) {
		...
    	$scope.isDate = false;
		$scope.dateOrText = '';
		...
    });

Here, `dateOrText` was bound to the text field and we had a way of knowing whether it was a date or not, represented in a simplified manner here by the boolean `isDate`. Given the HTML as follows:

	<input type="text" ng-model="dateOrText"/>

The need was for this text field to become a jQuery datepicker whenever `isDate` becomes `true` and turn back to a normal text field when it becomes `false`.

An obvious application of directives, right? Here's the naive solution:

	app.directive('akDate', function() {
	    return {
	        restrict: 'A',
	        link: function(scope, element, attrs) {
	            scope.$watch(attrs.akDate, function(value) {
	                if (value) $(element).datepicker();
	                else $(element).datepicker("destroy");
	            });
	        }
	    };
	});

The HTML would then look like:

	<input type="text" ak-date="isDate" ng-model="dateOrText"/>

In plain English, the directive watches for the value of the `ak-date` attribute to change, and when it does - it uses the jQuery `datepicker` call to apply or remove "datepickerness" to the element.

One thing I did not catch though was the fact that just applying the datepicker is not enough. If you leave it like this, the rendering will work fine - however, the binding with the model will not work, i.e. picking a date will not update the value of `dateOrText`. The way that jQuery datepicker applies the selected text to the control is not picked up by Angular.

Fortunately, jQuery datepicker has an `onSelect` event that you can handle to put your own logic in that happens whenever a date is selected. We just need to use that to create an expression that assigns the value to the model, and then run it within Angular. 

The complete solution then becomes:

	app.directive('akDate', function() {
	    return {
	        restrict: 'A',
	        require: 'ngModel',
	        link: function(scope, element, attrs) {
	            scope.$watch(attrs.akDate, function(value) {
	                if (value) {
	                    $(element).datepicker({
	                        onSelect: function(dateText) {
	                            var expression = attrs.ngModel + " = " + "'" + dateText + "'";
	                            scope.$apply(expression);
	                        }
	                    });
	                } else $(element).datepicker("destroy");
	            });
	        }
	    };
	});

Works like a charm!