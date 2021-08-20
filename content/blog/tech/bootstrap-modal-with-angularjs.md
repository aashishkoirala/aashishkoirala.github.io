---
title: Bootstrap Modal With AngularJS
slug: bootstrap-modal-with-angularjs
date: 2014-03-17
draft: false
tags:
- javascript
- js
- angular
- bootstrap
---
We'll look at a relatively low hanging fruit in case you're working with vanilla AngularJS and Twitter Bootstrap and are not relying on other add-ons such as AngularUI's Bootstrap extension. One common need I have is to be able to show or hide Bootstrap modals based on a property on my view-model. Here's a simplified view of the controller:  

	var app = angular.module('app', ...);
	...

	app.controller('ctrl', function ($scope, ...) {
		...
    	$scope.showModal = false;
		...
    });

And here is the HTML:

	<a href="#myModal" data-toggle="modal">Show Modal</a>
	...
	...
	<div id="myModal" class="modal hide" data-backdrop="static">
	    <div class="modal-body">
	        Modal text goes here.
			<br/>
	        <button class="btn pull-right" data-dismiss="modal">Close</button>
	    </div>
	</div>

In order to maintain separation of concerns, I want to be able to show or hide the modal as the value of `showModal` changes. This is another good use for directives in AngularJS. As with the [datepicker example]({{< ref "conditional-jquery-datepicker-with-angularjs" >}}), we need a directive that will add a `watch` on `link` and use the JavaScript methods available with Bootstrap to control the modal, rather than the `data-toggle` or `data-dismiss` attributes.

The directive would then look like:

	app.directive('akModal', function() {
	    return {
	        restrict: 'A',
	        link: function(scope, element, attrs) {
	            scope.$watch(attrs.akModal, function(value) {
	                if (value) element.modal('show');
	                else element.modal('hide');
	            });
	        }
	    };
	});

Here, we are calling the Boostrap method `modal` on the element to which the directive is applied, i.e. the `div` that is the modal container. The HTML modified to work with this directive then looks like: 

	<a href="#" ng-click="showModal = true">Show Modal</a>
	...
	...
	<div class="modal hide" ak-modal="showModal" data-backdrop="static">
	    <div class="modal-body">
	        Modal text goes here.
			<br/>
	        <button class="btn pull-right" ng-click="showModal = false">Close</button>
	    </div>
	</div>

The modal display is now bound to `showModal`. Note how we got rid of `data-toggle` (along with the `id` on the `div`) and `data-dismiss`. Now, if some property on the view-model needs to control whether the modal is displayed, then it would not make sense to have a link hardwired to trigger the specific modal anyway. The case for `data-dismiss` is different though.

Another thing to consider is - if you have a lot of modals and a lot of different view-model properties controlling them, you are going to have a lot of watches, which you probably don't want. If we make the assumption that mostly you're going to have one modal visible at a time (unless you have multiple levels of modals going on - in which case personally I think you would need to rethink the UX you are providing), you can make something more generic such as a `modalService` that will work with a single modal `div` and have a `showModal` operation that takes the content to display in the modal. There would need to be a corresponding `hideModal` operation as well, of course. I plan to explore this further.

Now, back to the `data-dismiss` thing. What we have at the moment is somewhat of a one-way binding. It would be ideal if this could be made two-way so that closing the modal using `data-dismiss` automatically set `showModal` to false. At the moment, I have not given this enough effort to be able to do it in an acceptably performant way. If someone has, I would love to hear about it. 