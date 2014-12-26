iFSMAnimation
=============

iFSM machines to create simple HTML5 animations easily and quickly

To use it,  have a look on the index.html file and see an example for a french "Happy new year" card...

Mainly, you need to create:
* a 'section' that will define where is the animation and 'articles' to define the different animated objects
* at the end, add a little script to start the animation... 
* that's it!

```html
<section id="animation-objects" data-delay-before-restart="3000">
        <article id="HappyNewYear_B" data-animation="animate,300,168,220" data-enter-animation="display, 200, 90, 104, 90, 104" data-exit-animation="smoothHide,100,90,104">
        	<img src="images/B.png">
        </article>
        <article id="HappyNewYear_O" data-animation="specialAnimate,300,{left:500;top:130;width:250}" data-enter-animation="display,200,170,104,170,104" data-exit-animation="smoothHide,100,170,104">
        	<img src="images/O.png">
        </article>
                <article id="HappyNewYear_star" data-animation="rotate,20000,3060" data-enter-animation="display,10,277,417,277,417" data-exit-animation="smoothHide,100,433,-220">
        	<img src="images/etoile.png">
        </article>
        <article id="HappyNewYear_N3" data-animation="dummy" data-enter-animation="display,200,252,104,252,104" data-exit-animation="smoothHide,100,252,104">
        	<img src="images/N.png">
        </article>        
</section>
<script>
$(document).ready(function() {
	//initialize machines on every articles with the 'animatedObjectMachine' defined in iFSMAnimation.hs
	$('section#animation-objects > article').iFSM(animatedObjectMachine);
	//initialize and start the general animation with 'mainAnimation' defined in iFSMAnimation.hs
	$('section#animation-objects').iFSM(mainAnimation);
</script>
```

DEMO
====

http://intersel.net/demos/intersel/voeux_demo/


LIBRARY DEPENDENCIES
====================
To work properly, you need to include the following javascript library:
* jQuery (>= 1.10) `<script type="text/javascript" src="extlib/jquery-1.10.2.min.js"></script>`
* doTimeout by ["Cowboy" Ben Alman](http://benalman.com/projects/jquery-dotimeout-plugin/)
	* this library brings some very usefull feature on the usual javascript setTimeout function like Debouncing, Delays & Polling Loops, Hover Intent...
	* `<script type="text/javascript" src="extlib/jquery.dotimeout.js"></script>`
* attrchange by Selvakumar Arumugam](http://meetselva.github.io/attrchange/) 
	* a simple jQuery function to bind a listener function to any HTML element on attribute change
	* `<script type="text/javascript" src="extlib/jquery.attrchange.js"></script>`
* [iFSM by intersel](https://github.com/intersel/iFSM/)
  * this library manages finite state machines
  
FAQ
===

If you have questions or unsolved problems, you can have a look on the our [FAQs](https://github.com/intersel/iFSM/wiki) 
or leave a message on the [Issue board](https://github.com/intersel/iFSMAnimation/issues).


Contact
=======
If you have any ideas, feedback, requests or bug reports, you can reach me at github@intersel.org, 
or via my website: http://www.intersel.fr