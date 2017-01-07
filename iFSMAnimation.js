/**
 * -----------------------------------------------------------------------------------------
 * INTERSEL - 4 cité d'Hauteville - 75010 PARIS
 * RCS PARIS 488 379 660 - NAF 721Z
 *
 * File    : iFSMAnimation.js
 * Abstract: iFSMAnimation allows to create simple HTML5 animations in responsive design easily on DOM objects
 * Remark  : based on iFSM (cf. https://github.com/intersel/iFSM)
 * Official help: https://github.com/intersel/iFSMAnimation
 * 
 * Description:
 * 
 * create a section with articles with the animation definition for each article as the following example:
 * 
 * @code
 * <section id="animation-objects">
 *  	<article id="anim1" data-animation="dummy,10,90,104" data-enter-animation="display, 200, 90, 104, 90, 104" data-exit-animation="smoothHide,100,90,104">
 *          	<img src="images/B.png">
 * 		</article>
 * 		<article id="anim2" data-animation="animate,400,78,220" data-enter-animation="display,10,78,-220" data-exit-animation="smoothHide,100,78,-220">
 *         	<img src="images/A.png">
 * 		</article>
 * 		<article id="anim3" data-animation="rotate,20000,3060" data-enter-animation="display,10,272,417,272,417" data-exit-animation="smoothHide,100,433,-220">
 *         	<img src="images/etoile.png">
 * 		</article>
 * </section>
 * then call the following script to activate your animation:
 * <script>
 *			$(document).ready(function() {
 *				$('section#animation-objects').iFSM(mainAnimation);
 *				//Possible options :
 *				//$('section#animation-objects').iFSM(mainAnimation,
 *				//			{	 debug:true
 *				//				,scriptsToLoad:null
 *				//				,<... any option of iFSM...>
 *				//			});
 *			});
 * </script>
 *
 * if a $('#info') is defined, and debug sets to true, debug info will be displayed in it
 *
 * Example  of an Image to move along waypoints
 * 	<script type="text/javascript" src="iFSMAnimation/extlib/jquery.path/jquery.path.js"></script>
 *
 *  	        <article id="aImageToMove" 
 *  	        			data-animation="specialAnimateNoWait,3000,{path : myFirstFollowLinePath}"
 *  	        			data-enter-animation="display, 250, 450,450,450,450"
 *          	>
 *          		<img src="images/myImage.png">
 *              </article>
 *
 *  var myFirstPointArray = [
 *                             {x:450,y:450}
 *                             ,{x:650,y:650}
 *                             ,{x:150,y:750}
 *                             ,{x:280,y:850}
 *                           ];
 * 	myFirstFollowLinePath = $().iFSMACreatePath(myFirstPointArray,90);
 *
 * -----------------------------------------------------------------------------------------
 * Modifications:
 * - 20141223 - EPO - V1.0.0 - Creation
 * - 20160210 - EPO - V1.1.0 - bug fixes
 * -----------------------------------------------------------------------------------------
 * @copyright Intersel 2014
 * @author    E.Podvin emmanuel.podvin@intersel.fr
 * @version   <1.1.0> (to be updated to the current_version of the developed software if file is touched)
 * -----------------------------------------------------------------------------------------
 */


/**
 * 
 * index of information in data-.... 
 */
(function($){

var $defaults = null;
	
var ANIMATION_TYPE 				= 0;
var ANIMATION_DURATION 			= 1;
var ANIMATION_X_DESTINATION		= 2;
var ROTATE_ANGLE				= 2;
var SPECIALANIMATION_DEFINITION = 2;
var ANIMATION_Y_DESTINATION		= 3;
var ANIMATION_X_ORIGIN			= 4;
var ANIMATION_Y_ORIGIN			= 5;
var ANIMATION_EASING			= 6;
var ANIMATION_LOOP_NUMBER		= 6; // if == 0 then infinite loop
var ANIMATION_LOOP_BACK_DELAY	= 7; // 
var ANIMATION_LOOP_FEATURE		= 8; // == ''(default)||'pulse' 

var ANIMATION_NOTWAIT			= 100;

var ANIMATION_NEEDED_SCRIPTS	= [
	 'extlib/iFSM/extlib/jquery.dorequesttimeout.js'
	,'extlib/iFSM/extlib/jquery.attrchange.js'	
	,'extlib/waitForImages/dist/jquery.waitforimages.js'
	,'extlib/FitText/jquery.fittext.js'
	,'extlib/jquery-ui/jquery-ui.min.js'
	];
var WAITFORIMAGES_ULR = 0;

var animatedObjectMachine = {
	InitAnimatedObject: 
	{
		enterState:
		{
			init_function: function() {
				if (this.myUIObject.attr('data-animation') 			&& (this.myUIObject.attr('data-animation')!= '') ) 			this.opts.data_animation 		= this.myUIObject.attr('data-animation').replace(/[ \t\r]+/g,"").split(',');
				if (this.myUIObject.attr('data-enter-animation') 	&& (this.myUIObject.attr('data-enter-animation')!= '')) 	this.opts.data_enter_animation 	= this.myUIObject.attr('data-enter-animation').replace(/[ \t\r]+/g,"").split(',');
				if (this.myUIObject.attr('data-exit-animation') 	&& (this.myUIObject.attr('data-exit-animation')!= '')) 		this.opts.data_exit_animation 	= this.myUIObject.attr('data-exit-animation').replace(/[ \t\r]+/g,"").split(',');
			},
			next_state: 'ObjectInitialized',
		},
	},
	ObjectInitialized:
	{
		enterState:
		{
		},
		startEnterAnimation:
		{
			init_function: function(parameters, event, data) {
				this.opts.currentAnimationCaller = jQuery.extend(true, {}, data);
				if (this.opts.data_enter_animation) this.opts.currentAnimationData 	= jQuery.extend(true, {}, this.opts.data_enter_animation);
				else this.opts.currentAnimationData = null;
				this.myUIObject.css({transform:'rotate(0rad)'});

			},
			propagate_event:['initResponsive','doAnimation'],
		},
		startAnimation:
		{
			init_function: function(parameters, event, data) {
				this.opts.currentAnimationCaller = jQuery.extend(true, {}, data);
				if (this.opts.data_animation) this.opts.currentAnimationData 	= jQuery.extend(true, {}, this.opts.data_animation);
				else this.opts.currentAnimationData = null;
			},
			propagate_event:['initResponsive','doAnimation'],
		},
		startExitAnimation:
		{
			init_function: function(parameters, event, data) {
				this.opts.currentAnimationCaller = jQuery.extend(true, {}, data);
				if (this.opts.data_exit_animation) this.opts.currentAnimationData 	= jQuery.extend(true, {}, this.opts.data_exit_animation);
				else this.opts.currentAnimationData = null;
			},
			propagate_event:['initResponsive','doAnimation'],
		},
		initResponsive:
		{
			init_function: function() {
				//TO DO - we should create states and events to process these statements according to requested animation!

				if (this.opts.currentAnimationData[ANIMATION_X_ORIGIN] != null) this.opts.currentAnimationData[ANIMATION_X_ORIGIN] = parseInt(this.opts.currentAnimationData[ANIMATION_X_ORIGIN]);
				if (this.opts.currentAnimationData[ANIMATION_Y_ORIGIN] != null) this.opts.currentAnimationData[ANIMATION_Y_ORIGIN] = parseInt(this.opts.currentAnimationData[ANIMATION_Y_ORIGIN]);
				this.opts.currentAnimationData[ANIMATION_X_DESTINATION] = parseInt(this.opts.currentAnimationData[ANIMATION_X_DESTINATION]);
				this.opts.currentAnimationData[ANIMATION_Y_DESTINATION] = parseInt(this.opts.currentAnimationData[ANIMATION_Y_DESTINATION]);

				if (this.opts.doResponsive && this.opts.currentAnimationData[ANIMATION_TYPE] != 'rotate')
				{
					if (this.opts.currentAnimationData[ANIMATION_X_ORIGIN] != null) this.opts.currentAnimationData[ANIMATION_X_ORIGIN] = this.opts.currentAnimationData[ANIMATION_X_ORIGIN]*100/parseInt(this.opts.generalSize.X)+"%";
					if (this.opts.currentAnimationData[ANIMATION_Y_ORIGIN] != null) this.opts.currentAnimationData[ANIMATION_Y_ORIGIN] = this.opts.currentAnimationData[ANIMATION_Y_ORIGIN]*100/parseInt(this.opts.generalSize.Y)+"%";
					this.opts.currentAnimationData[ANIMATION_X_DESTINATION] = this.opts.currentAnimationData[ANIMATION_X_DESTINATION]*100/parseInt(this.opts.generalSize.X)+'%';
					this.opts.currentAnimationData[ANIMATION_Y_DESTINATION] = this.opts.currentAnimationData[ANIMATION_Y_DESTINATION]*100/parseInt(this.opts.generalSize.Y)+'%';
					if (!this.opts.currentAnimationData[ANIMATION_EASING]) this.opts.currentAnimationData[ANIMATION_EASING]="linear";
					
				};
			},
			process_event_if:'( (this.opts.currentAnimationData != null) && (this.opts.currentAnimationData['+ANIMATION_TYPE+'] != "specialAnimate") && (this.opts.currentAnimationData['+ANIMATION_TYPE+'] != "specialAnimateNoWait") && (this.opts.currentAnimationData['+ANIMATION_TYPE+'] != "dummy") )',
		},
		doAnimation:
		{
			init_function: function() {
			},
			how_process_event:{delay:1,preventcancel:true},
			next_state:'EnterAnimation',
			next_state_when:'(this.opts.currentAnimationData != null) && (this.opts.currentAnimationData['+ANIMATION_TYPE+'] != "dummy")',
			propagate_event:'voidAnimationData',
		},
		voidAnimationData:
		{
			next_state:'ExitAnimation',
		},
	},
	EnterAnimation:
	{
		enterState:
		{
			init_function: function() {
				var styles = {};

				if (this.opts.currentAnimationData[ANIMATION_X_ORIGIN]) styles['left'] = this.opts.currentAnimationData[ANIMATION_X_ORIGIN];
				if (this.opts.currentAnimationData[ANIMATION_Y_ORIGIN]) styles['top']  = this.opts.currentAnimationData[ANIMATION_Y_ORIGIN];
				
				//initialize initial position if not a loop...
				if (this.opts.currentAnimationData[ANIMATION_TYPE] != 'loop')
					this.myUIObject.css(styles);
				
				if (this.opts.doResponsive) this.myUIObject.find('img').css({width:'100%'});
				this.trigger(this.opts.currentAnimationData[ANIMATION_TYPE]);
			},
		},
		//initialization
		specialAnimateNoWait:
		{
			init_function: function() {
				this.opts.currentAnimationData[ANIMATION_NOTWAIT]=1;
			},
			propagate_event:'specialAnimate',
			next_state:'ObjectInMotion',
		},
		displayNoWait:
		{
			init_function: function() {
				this.opts.currentAnimationData[ANIMATION_NOTWAIT]=1;
			},
			propagate_event:'display',
			next_state:'ObjectInMotion',
		},
		rotateNoWait:
		{
			init_function: function() {
				this.opts.currentAnimationData[ANIMATION_NOTWAIT]=1;
			},
			propagate_event:'rotate',
			next_state:'ObjectInMotion',
		},
		smoothHideNoWait:
		{
			init_function: function() {
				this.opts.currentAnimationData[ANIMATION_NOTWAIT]=1;
			},
			propagate_event:'smoothHide',
			next_state:'ObjectInMotion',
		},
		animateNoWait:
		{
			init_function: function() {
				this.opts.currentAnimationData[ANIMATION_NOTWAIT]=1;
			},
			propagate_event:'animate',
			next_state:'ObjectInMotion',
		},
		loop:
		{
			init_function: function() {
				this.opts.currentAnimationData[ANIMATION_NOTWAIT]=1;
				
			},
			propagate_event:'initLoop',
			next_state:'ObjectInMotion',
		},
		display:'animate',
		rotate:'animate',
		smoothHide:'animate',
		specialAnimate:'animate',
		animate:
		{
			init_function: function() {
				this.opts.currentAnimationData[ANIMATION_NOTWAIT]=0;
			},
			propagate_event:true,
			next_state:'ObjectInMotion',
		},
	},
	ObjectInMotion:
	{
	    enterState:
		{
		},
		delegate_machines: 
	    {
	        LoopSubmachine: 
	        {
	            submachine: 
	            {
	            	LoopInMotionStart:
	            	{
	            		initLoop:
	            		{
	            			init_function: function() {
	            				if (this.rootMachine.opts.currentAnimationData[ANIMATION_LOOP_NUMBER] && this.rootMachine.opts.currentAnimationData[ANIMATION_LOOP_NUMBER] != 0) 
	            					this.opts.numberOfLoops=this.rootMachine.opts.currentAnimationData[ANIMATION_LOOP_NUMBER];
	            				else this.opts.numberOfLoops=10000000;

	            				if (!this.rootMachine.opts.currentAnimationData[ANIMATION_LOOP_BACK_DELAY]) this.rootMachine.opts.currentAnimationData[ANIMATION_LOOP_BACK_DELAY]=this.rootMachine.opts.currentAnimationData[ANIMATION_DURATION];

	            				if ( 	(this.rootMachine.opts.currentAnimationData[ANIMATION_NOTWAIT] == 1) 
	            						 && (this.rootMachine.opts.currentAnimationCaller) 
	            						) 
	            				{
	            					this.rootMachine.opts.currentAnimationCaller.trigger('animationStopped');
	            					this.rootMachine.opts.currentAnimationCaller=null;
	            				}
	            			},
	            			prevent_bubble:true,
	            			propagate_event:'loop',
	            			next_state:'LoopInMotion',
	            		},
	            	},
	            	LoopInMotion:
	            	{
	            		loop:
	            		{
	            			init_function: function() {
	            				var aFSM = this;//mandatory for complete trigger...

	            				this.opts.numberOfLoops--;
	            				this._log('numberOfLoop:'+this.opts.numberOfLoops,2);
	            				
	            				if (this.opts.debug) $('#info').html('LOOP:x:'+this.myUIObject.position().left+';y:'+this.myUIObject.position().top);

	            				var easingFunc = "linear";
	            				if (this.rootMachine.opts.currentAnimationData[ANIMATION_LOOP_FEATURE])
            					{
	            					easingFunc = this.rootMachine.opts.currentAnimationData[ANIMATION_LOOP_FEATURE];
            					}
	            				
	            				this.myUIObject.stop().animate({
	            					left	: this.rootMachine.opts.currentAnimationData[ANIMATION_X_DESTINATION],
	            					top		: this.rootMachine.opts.currentAnimationData[ANIMATION_Y_DESTINATION],
	            					},{
	            						duration	: parseInt(this.rootMachine.opts.currentAnimationData[ANIMATION_DURATION]), 
	            						easing		: easingFunc,
	            						complete	: function(){
	            							aFSM.trigger('loopEnd');
	            						},
	            				});
	            				if (this.opts.debug)  $('#info').html($('#info').html()+'<br>'+'LOOP2/x:'+this.myUIObject.position().left+';y:'+this.myUIObject.position().top);
	            			},
	            			prevent_bubble:true,
	            		},
	            		loopEnd:
	            		{
	            			init_function: function() {
	            				
	            				var aFSM = this;//mandatory for complete trigger...
	            				
	            				if (this.opts.debug)  $('#info').html('LOOPEND/x:'+this.myUIObject.position().left+';y:'+this.myUIObject.position().top);
	            				
	            				var easingFunc = "linear";
	            				if (this.rootMachine.opts.currentAnimationData[ANIMATION_LOOP_FEATURE])
            					{
	            					easingFunc = this.rootMachine.opts.currentAnimationData[ANIMATION_LOOP_FEATURE];
            					}

	            				this.myUIObject.stop().animate({
	            					left	: this.rootMachine.opts.currentAnimationData[ANIMATION_X_ORIGIN],
	            					top		: this.rootMachine.opts.currentAnimationData[ANIMATION_Y_ORIGIN],
	            					},{
	            					duration	: parseInt(this.rootMachine.opts.currentAnimationData[ANIMATION_LOOP_BACK_DELAY]), 
            						easing		: easingFunc,
	            					complete	: function(){
	            						aFSM.trigger('loopEndReinit');
	            					},
	            				});
	            			},
	            			prevent_bubble:true,
	            		},
	            		loopEndReinit:
	            		{
	            			init_function:function(){
	            				if (this.opts.debug)  $('#info').html('REINIT/x:'+this.myUIObject.position().left+';y:'+this.myUIObject.position().top);
	            			},
	            			propagate_event:'loop',
	            			process_event_if:'this.opts.numberOfLoops>0',
	            			propagate_event_on_refused:'animationStopped',
	            			prevent_bubble:true,
	            		},
	            		animationStopped:
	            		{
	            			next_state : 'LoopInMotionStart',
	            		},
	            		//do not react on external stimulations...
	            		startEnterAnimation:'startExitAnimation',
	            		startAnimation:'startExitAnimation',
	            		startExitAnimation:
	            		{
	            			init_function: function() {
		            			if (this.rootMachine.opts.currentAnimationCaller) 
		           				{
		           					this.rootMachine.opts.currentAnimationCaller.trigger('animationStopped');
		           					this.rootMachine.opts.currentAnimationCaller=null;
		           				}
	            			},
	            			prevent_bubble:true, //while loop is not finished, continue...
	            		}
	            	},
	            	DefaultState: 
	            	{
	            		start: 
	            		{
	            			next_state : 'LoopInMotionStart',
	            		},
	            	},
	            },
	        },          
	    },          
		animate:
		{
			init_function: function() {
				var aFSM = this;
				this.opts.numberOfLoops--;
				this.myUIObject.stop().animate({
						left	: this.rootMachine.opts.currentAnimationData[ANIMATION_X_DESTINATION],
						top		: this.rootMachine.opts.currentAnimationData[ANIMATION_Y_DESTINATION],
					},{
						duration	: parseInt(this.opts.currentAnimationData[ANIMATION_DURATION]), 
						easing		: this.opts.currentAnimationData[ANIMATION_EASING],
						complete	: function(){
							aFSM.trigger('animationStopped');
					},
				});
				if ( 	(this.opts.currentAnimationData[ANIMATION_NOTWAIT] == 1) 
					 && (this.opts.currentAnimationCaller) 
					) 
				{
					if (this.opts.currentAnimationCaller) 
						this.opts.currentAnimationCaller.trigger('animationStopped');
					this.opts.currentAnimationCaller = null;
				}
			},
	    	how_process_event:{delay:1,preventcancel:true},
		},
		specialAnimate:
		{
			init_function: function() {
				var aFSM = this;
				eval('var aAnimation='+this.opts.currentAnimationData[SPECIALANIMATION_DEFINITION].replace(/[;]+/g,","));
				this.myUIObject.stop().animate(aAnimation,{
						duration	: parseInt(this.opts.currentAnimationData[ANIMATION_DURATION]), 
						complete	: function(){aFSM.trigger('animationStopped');},
						easing		: this.opts.currentAnimationData[ANIMATION_EASING],
				});
				if ( 	(this.opts.currentAnimationData[ANIMATION_NOTWAIT] == 1) 
						 && (this.opts.currentAnimationCaller) 
						) 
				{
					if (this.opts.currentAnimationCaller) 
						this.opts.currentAnimationCaller.trigger('animationStopped');
					this.opts.currentAnimationCaller = null;
				}
			},
		},
		rotate:
		{
			init_function: function() {
				var aFSM = this;
				this.myUIObject.css('border-spacing','0px');
				this.myUIObject.stop().animate({ borderSpacing: parseInt(aFSM.opts.currentAnimationData[ROTATE_ANGLE]) }, {
				    step: function(now,fx) {
				        $(this).css('-webkit-transform','rotate('+now+'deg)'); 
				        $(this).css('-moz-transform','rotate('+now+'deg)');
				        $(this).css('transform','rotate('+now+'deg)');
				      },
				      duration:parseInt(aFSM.opts.currentAnimationData[ANIMATION_DURATION])
				  },'linear');
				if ( 	(this.opts.currentAnimationData[ANIMATION_NOTWAIT] == 1) 
						 && (this.opts.currentAnimationCaller) 
						) 
				{
					if (this.opts.currentAnimationCaller) 
						this.opts.currentAnimationCaller.trigger('animationStopped');
					this.opts.currentAnimationCaller = null;
				}
			},
		},
		smoothHide:
		{
			init_function: function() {
				var aFSM = this;
				this.myUIObject.stop().animate({
						opacity	: 0,
    					left	: this.rootMachine.opts.currentAnimationData[ANIMATION_X_DESTINATION],
    					top		: this.rootMachine.opts.currentAnimationData[ANIMATION_Y_DESTINATION],
				},{
						duration	: parseInt(this.opts.currentAnimationData[ANIMATION_DURATION]), 
						easing		: this.opts.currentAnimationData[ANIMATION_EASING],
						complete	: function(){aFSM.trigger('animationStopped');},
				});
				if ( 	(this.opts.currentAnimationData[ANIMATION_NOTWAIT] == 1) 
						 && (this.opts.currentAnimationCaller) 
						) 
				{
					if (this.opts.currentAnimationCaller) 
						this.opts.currentAnimationCaller.trigger('animationStopped');
					this.opts.currentAnimationCaller = null;
				}
			},
			how_process_event:{delay:1,preventcancel:true},
		},
		display:
		{
			init_function: function() {
				var aFSM = this;
				this.myUIObject.stop().animate({
						opacity	: 1,
    					left	: this.rootMachine.opts.currentAnimationData[ANIMATION_X_DESTINATION],
    					top		: this.rootMachine.opts.currentAnimationData[ANIMATION_Y_DESTINATION],
				},{
						duration	: parseInt(this.opts.currentAnimationData[ANIMATION_DURATION]), 
						easing		: this.opts.currentAnimationData[ANIMATION_EASING],
						complete	: function(){
							aFSM.trigger('animationStopped');
						},
				});
			},
			how_process_event:{delay:1,preventcancel:true},
		},
		animationStopped:
		{
			next_state:'ExitAnimation',
		},
		startEnterAnimation:'startExitAnimation',
		startAnimation:'startExitAnimation',
		startExitAnimation:
		{
			init_function: function() {
				this.myUIObject.stop();
			},
			how_process_event:{delay:1,preventcancel:true},
			next_state:'ObjectInitialized',
			propagate_event:true,
		}
	},
	ExitAnimation:
	{
		enterState:
		{
			init_function: function() {
				if (this.opts.currentAnimationCaller) this.opts.currentAnimationCaller.trigger('animationStopped');
				this.opts.currentAnimationCaller = null;
			},
			next_state:'ObjectInitialized',
		}
	},
	DefaultState: 
	{
		start: 
		{
			next_state : 'InitAnimatedObject',
		},
		display:
		{
			init_function: function() {
				this.myUIObject.css({display:'block'});
			}
		},
		hide:
		{
			init_function: function() {
				this.myUIObject.css({display:'none'});
			}
		},
		animate:
		{
			propagate_event:true,
			next_state:'ObjectInMotion',
		},
	}
};

/**
 * mainAnimation - iFSM machine definition that manages the sequence of the overall animation
 * @abstract
 *  Each animated object will have a "startEnterAnimation" then "startAnimation" triggered in a loop
 *  Then objects will receive "startExitAnimation"
 *  then we repplay the whole...
 *  
 *  @param int    data-delay-before-restart - delay before restart animation in ms  
 *  @param int,int data-box-size-reference - gives the width and height of the reference outer box (default: 500,500)
 *  @param boolean data-box-responsive - true/false, if true, the box should be responsive 
 *  @param array  opts.animationSequence (optional) - list of the animated objects in the order of their animation. If defined, you need to previously attach the iFSM machines to them.
 *  @param string opts.animatedObjectDefinition (optional, default = '> article') - definition to find the animated objects under the object attached to the iFSM machine (myUIObject)
 *  @param boolean opts.automaticStart (optional, default: true) : if false, the animation needs to be start with the 'startAnimation' event
 *  received events :
 *    - tempStopAnimation - stop the animation
 *    - tempStartAnimation -  restart the animation
 */
var mainAnimation = {
	InitAnimation:
	{
		enterState:
		{
			init_function: function() {
				this.opts.animationStep = 0;
			},
		},
		startAnimation:
		{
			next_state:'StartAnimation',
		},
	},
	StartAnimation:
	{
		enterState:
		{
			init_function: function() {
				var aFSM=this;
				if ( jQuery(this.opts.animationSequence[this.opts.animationStep]).length>0) 
					 jQuery(this.opts.animationSequence[this.opts.animationStep]).trigger('startEnterAnimation',aFSM);
				else this.trigger('animationObjectVoid');
			},
			how_process_event:{delay:1,preventcancel:true},
			next_state:'WaitForStartAnimationDone',
		},
	},
	WaitForStartAnimationDone:
	{
		animationStopped:
		{
			next_state:'Animation',
			how_process_event:{delay:1,preventcancel:true},
		},
		animationObjectVoid:
		{
			init_function: function() {
				this.opts.animationStep++;
				this.trigger('reStartAnimation');
			},
			next_state:'WaitForAnimationDone',
			next_state_when:'this.opts.animationStep>=this.opts.animationSequence.length',
			how_process_event:{delay:1,preventcancel:true},
		},
		reStartAnimation:
		{
			next_state:'StartAnimation',
			how_process_event:{delay:1,preventcancel:true},
		},
	},
	Animation:
	{
		enterState:
		{
			propagate_event:'doAnimation',
			how_process_event:{delay:1,preventcancel:true},
		},
		doAnimation:
		{
			init_function: function() {
				 jQuery(this.opts.animationSequence[this.opts.animationStep]).trigger('startAnimation',this);
				this.opts.animationStep++;
			},
			next_state:'WaitForAnimationDone',
			next_state_when:'this.opts.animationStep>=this.opts.animationSequence.length',
			how_process_event:{delay:1,preventcancel:true},
		},
		animationStopped:
		{
			next_state:'StartAnimation',
			how_process_event:{delay:1,preventcancel:true},
		},
		
	},
	WaitForAnimationDone: // do the next element
	{
		reStartAnimation:'animationStopped',
		animationStopped:
		{
			next_state:'EndOfAnimation',
			how_process_event:{delay:1,preventcancel:true},
		},
	},
	tempAnimationStopped:
	{
		tempStartAnimation:
		{
			pushpop_state: 'PopState',
			propagate_event:'reStartAnimation',
			how_process_event:{delay:1,preventcancel:true},
		},
	},
	EndOfAnimation:
	{
		enterState:
		{
			init_function: function() {
				this.opts.animationStep=0;
				if (this.myUIObject.attr('data-delay-before-restart')) 
					this._stateDefinition['EndOfAnimation']['startEraseAnimation']['how_process_event'] = {delay: this.myUIObject.attr('data-delay-before-restart')};
				},
			how_process_event:{delay:1,preventcancel:true},
			propagate_event:'startEraseAnimation',
		},
		resetAnimation:
		{ 
			propagate_event : 'resetAnimation',
			next_state:'DoingEndAndStopAnimation',
			how_process_event:{delay:1,preventcancel:true},
		},
		startEraseAnimation:
		{ 
			propagate_event : 'eraseAnimation',
			how_process_event: {delay:2500},
			next_state:'DoingEndOfAnimation',
			how_process_event:{delay:1,preventcancel:true},
		},
	},
	DoingEndAndStopAnimation:
	{
		resetAnimation:
		{
			init_function: function() {
				if ( jQuery(this.opts.animationSequence[this.opts.animationStep]).length>0)  
					jQuery(this.opts.animationSequence[this.opts.animationStep]).trigger('startExitAnimation',this);
				this.opts.animationStep++;
			},
			how_process_event:{delay:1,preventcancel:true},
		},
		animationStopped:
		{
			propagate_event:'resetAnimation',
			how_process_event:{delay:1,preventcancel:true},
		},
		startAnimation:
		{
			propagate_event:'startAnimation',
			next_state:'InitAnimation',
			how_process_event:{delay:1,preventcancel:true},
		},

		//prevent action of stop during resetting the animation and retry the event later on...
		tempStopAnimation:
		{
			propagate_event:true,
			how_process_event:{delay:500,preventcancel:true},
		}
		
	},

	DoingEndOfAnimation:
	{
		eraseAnimation:
		{
			init_function: function() {
				if ($(this.opts.animationSequence[this.opts.animationStep]).length>0) $(this.opts.animationSequence[this.opts.animationStep]).trigger('startExitAnimation',this);
				else this.trigger('animationStopped');
				this.opts.animationStep++;
			},
			next_state:'WaitForExitAnimationDone',
			next_state_when:'this.opts.animationStep>=this.opts.animationSequence.length',
			how_process_event:{delay:1,preventcancel:true},
		},
		animationStopped:
		{
			propagate_event:'eraseAnimation',
			how_process_event:{delay:1,preventcancel:true},
		},
		//prevent action of stop during resetting the animation and retry the event later on...
		tempStopAnimation:
		{
			propagate_event:true,
			how_process_event:{delay:500,preventcancel:true},
		}
		
	},
	WaitForExitAnimationDone: // do the next element
	{
		animationStopped:
		{
			propagate_event:'startAnimation',
			next_state:'InitAnimation',
			how_process_event:{delay:1,preventcancel:true},
		},
	},
	WaitForImagesDownloaded:
	{
		enterState:
		{
			init_function: function() {
				var myFSM = this;
				if (this.myUIObject.waitForImages)
				{
					this.myUIObject.waitForImages().done(function() {
						myFSM.trigger('imagesDownloaded');
					});
				}
				else myFSM.trigger('imagesDownloaded');//curious to be there...?
			},
		},
		imagesDownloaded:
		{
			init_function: function() {
				this.trigger('initAnimatedObjects');
			},
		},
        startAnimation: //he! wait a minute... we're not ready!
        {
                how_process_event:{delay:100,preventcancel:true},
                propagate_event:true,
        },
	},
	WaitForJavascriptFileDownloaded:
	{
		enterState:
		{
			init_function: function() {
				var myFSM = this;
				
				//get js path
				var dir = document.querySelector('script[src$="iFSMAnimation.js"]').getAttribute('src');
				var name = dir.split('/').pop(); 
				dir = dir.replace('/'+name,"");
				
				if (this.opts.scriptsToLoad)
				{
					jQuery.each(this.opts.scriptsToLoad,	function(aKey,aScriptURL){			
						jQuery.getScript( dir+'/'+aScriptURL, function() {
							myFSM.trigger('scriptDownloaded');
						});
					});
				}
				else
					myFSM.trigger('scriptDownloaded');
			},
		},
		scriptDownloaded:
		{
			next_state: 'WaitForImagesDownloaded',
			next_state_when:'!this.opts.scriptsToLoad || this.EventIteration >= this.opts.scriptsToLoad.length',
		},
        startAnimation://he! wait a minute... we're not ready!
        {
                how_process_event:{delay:100,preventcancel:true},
                propagate_event:true,
        },
	},
	DefaultState: 
	{
		start: 
		{
			init_function: function() {
				
 				this.myUIObject.css({width:'0px'}); // a way to undisplay without breaking things during rendering...
 				
				//start loader picto if any

 				//if the data-loader-class attribute is define, will remove any pre-defined opts.loader
 				if (this.myUIObject.attr('data-loader-class')) this.opts.loader={class:this.myUIObject.attr('data-loader-class')};
				
				if (this.opts.automaticStart==undefined) this.opts.automaticStart=true;//by default, start animation automatically  (if undefined then it's true (automactic))
 				
 				if (this.opts.loader)
 				{
 	 				if (!this.opts.loader.id) this.opts.loader.id = 'AnimationLoader-'+this.myUIObject.attr('id');
 	 				if (!this.opts.loader.class) this.opts.loader.class = 'AnimationLoader';
 	 				//Show a loader
 	 				this.myUIObject.before( '<div id="'+this.opts.loader.id+'" class="'+this.opts.loader.class+'"></div>');
 	 				$('#'+this.opts.loader.id).stop().fadeIn( 500 );
 				}
 				
 				//initialize variables
				if (this.opts.scriptsToLoad) this.opts.scriptsToLoad = ANIMATION_NEEDED_SCRIPTS.concat(this.opts.scriptsToLoad);
				else this.opts.scriptsToLoad = ANIMATION_NEEDED_SCRIPTS;

			},
			next_state: 'WaitForJavascriptFileDownloaded',
		},
		initAnimatedObjects: 
		{
			init_function: function() {
				if (!this.opts.animatedObjectDefinition) this.opts.animatedObjectDefinition='> article';
				
				if (!this.opts.animationSequence)
				{
					//get the animated objects
					this.opts.animationSequence=this.myUIObject.find(this.opts.animatedObjectDefinition);
					
					//attached them to the animatedObjectMachine machine
					var myOptions={};
					if (this.opts.debug) myOptions['debug']=this.opts.debug;
					if (this.opts.logFSM) myOptions['logFSM']=this.opts.logFSM;
					if (this.opts.LogLevel) myOptions['LogLevel']=this.opts.LogLevel;
					this.opts.animationSequence.iFSM(animatedObjectMachine,myOptions);
				};
				
				//define general box size to the animated objects
				
				//set default general size
				if (!this.myUIObject.attr('data-box-size-reference')) this.myUIObject.attr('data-box-size-reference',this.myUIObject.width()+','+this.myUIObject.height());
			
				//get the external boxing
				var aGeneralSize = this.myUIObject.attr('data-box-size-reference').replace(/[ \t\r]+/g,"").split(',');
				var aClass = '';
				if (this.myUIObject.attr('data-div-class')) aClass='class="'+this.myUIObject.attr('data-div-class')+'"';

				this.myUIObject.wrapAll('<div '+aClass+'/>');
				if (aGeneralSize[0] <= 0) aGeneralSize[0] = $(window).width(); 
				if (aGeneralSize[1] <= 0) aGeneralSize[1] = $(window).height(); 

				var widthAnim = Math.min( jQuery(window).width(),aGeneralSize[0]);
				var ratio = aGeneralSize[0] / aGeneralSize[1];
				var heightAnim = widthAnim/ratio;

				if (this.myUIObject.attr('data-keep-height-visible') == 'true')
				{
					if (heightAnim > $(window).height()) 
					{
						widthAnim = $(window).height() * ratio;
						heightAnim = widthAnim/ratio;
					}
				}
				
				this.myUIObject.parent().css({
					maxWidth	: widthAnim+'px',
					maxHeight	: heightAnim+'px',
					overflow	: 'hidden',
				});
				this.myUIObject.css({
					overflow	: 'hidden',
					height		: '100%',
					minHeight	: '50px',
					maxHeight	: heightAnim+'px',
					margin		: '0px auto',
					paddingBottom : '90%',
					position	: 'relative',
					width		: '100%',

					maxWidth	: widthAnim+'px',
				});
				
				
				var doResponsive = this.myUIObject.attr('data-box-responsive');
				if (!doResponsive || doResponsive == "false") doResponsive=false;
				
				var zindex = 10;
				jQuery.each(this.opts.animationSequence, 
						function(aKey,aValue)
						{
							var aFSM =  jQuery(aValue).getFSM()[0]; 
							if (!aFSM || aFSM.length == 0) return;
							aFSM.opts.generalSize = {X:aGeneralSize[0],Y:aGeneralSize[1]};
							aFSM.opts.doResponsive = doResponsive;
							aFSM.myUIObject.css({
								position:'absolute',
							});
							
							//Set zindex if not defined
							if (!jQuery.isNumeric(aFSM.myUIObject.css('zIndex')) || aFSM.myUIObject.css('zIndex')==0 )
							{
								aFSM.myUIObject.css({
									zIndex:zindex,
									transform:'0rad'
								});
							}
							zindex=zindex+10;
							if (doResponsive) aFSM.myUIObject.css({
								width:aFSM.myUIObject.width()*100/parseInt(aFSM.opts.generalSize.X)+"%"
							});
				});
				
				if (this.opts.loader) $('#'+this.opts.loader.id).stop().fadeOut( 500 );

				if (this.opts.automaticStart) this.trigger('startAnimation');

			},
			next_state : 'InitAnimation',
		},
		tempStopAnimation:
		{
			pushpop_state: 'PushState',
			next_state:'tempAnimationStopped'
		}
	}
};

$.fn.iFSMAgetGeneralSize =  function ()
{
	var aGeneralSize = $.fn.iFSMAgetGeneralSize.dataBoxSizeReference.replace(/[ \t\r]+/g,"").split(',');
	if (aGeneralSize[0] <= 0) aGeneralSize[0] = $(window).width(); 
	if (aGeneralSize[1] <= 0) aGeneralSize[1] = $(window).height(); 
	return {x:aGeneralSize[0],y:aGeneralSize[1]};
}
$.fn.iFSMAsetGeneralSize =  function (dataBoxSizeReference)
{
	$.fn.iFSMAgetGeneralSize.dataBoxSizeReference = dataBoxSizeReference;
}

/** iFSMACreatePath
 * 
 * example :
 * 	var myFirstPointArray = [
	                          {x:0,y:-160}
	                         ,{x:160,y:110}
	                         ,{x:600,y:-24}
	                         ,{x:1110,y:400}
	                         ,{x:760,y:440}
	                         ];
	myFirstFollowLinePath = $.iFSMACreatePath(myFirstPointArray,{1250,1250});

 */
$.fn.iFSMACreatePath = function (aArrayOfPoints,aRotation) {
		
	this.len = 0;
	this.path = null;
	this.generalSize = {x:0,y:0};
	if (!aRotation) aRotation = 0;
	
	this.pointAt = function(percent){
		return this.path.getPointAtLength( this.len * percent/100 );
	};

	this.updatePath = function(aArrayOfPoints){
		
		var path = this.convertArrayToSvg(aArrayOfPoints);
		
		this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		this.path.setAttribute('d', path);
		this.len = this.path.getTotalLength();
		
	}
	
	this.convertArrayToSvg = function (aPointArray,closePath)
	{
		var aSVGPath ="M";
		var svgPrefix = "";
		var index, len;
		if (!closePath) closePath=false;
		
		for (index = 0, len = aPointArray.length; index < len; ++index) {
			aSVGPath += svgPrefix+aPointArray[index].x+" "+aPointArray[index].y;
			svgPrefix = " L";
		}
		if (closePath) aSVGPath += " Z";
		return aSVGPath;
	};

	this.css = function(p) {
		
		var percent = (1-p)*100;
		var rotate = (1-p)*aRotation;
		var currentPoint = this.pointAt(percent);
		
		var displayPoint = {};
		displayPoint.x = currentPoint.x*100/parseInt(this.generalSize.x)+'%';
		displayPoint.y = currentPoint.y*100/parseInt(this.generalSize.y)+'%';

		//$("#footer").append("<br>"+p+" - "+displayPoint.x+","+displayPoint.y+" - "+currentPoint.x+","+currentPoint.y);
		
		return {x:currentPoint.x, y:currentPoint.y, left: displayPoint.x,top: displayPoint.y,transform:'rotate('+rotate+'deg)'};
	} 

	if( aArrayOfPoints.length ) 
	{
		this.updatePath(aArrayOfPoints);
		this.generalSize = $().iFSMAgetGeneralSize();
	}
	
	return this;
};

/** iFSMAnimation
 * 
 */
$.fn.iFSMAnimation = function(options) {
	if (options == undefined) options=null;
	var myOptions = jQuery.extend( {}, $defaults, options || {});

	if (myOptions.debug == undefined)
		myOptions.debug=false;
	
	if (myOptions.ANIMATION_NEEDED_SCRIPTS)
		ANIMATION_NEEDED_SCRIPTS=myOptions.ANIMATION_NEEDED_SCRIPTS;
	
	return this.each(function() {
		$(this).iFSM(mainAnimation, myOptions);
	});
};

})(jQuery);



/**
 * buttonOnOffMachine - manages button with On/Off states that can handle a distant object
 * @example: 
 * <code>
 * 		<button class="playMusic" id="onoff_music"></button>
 * ....
 * 		$("#onoff_music").iFSM(buttonOnOffMachine,{sendTo:$('#music'),text:{on:'Stop Music',off:'Play Music'}});
 * </code>
 * @param handle events
 * 		- click - event click on the button
 * @param default state: ButtonOff
 * @param opts
 * 		- text (optional):
 * 			- on: text to set when button is on
 * 			- off: text to set when button is off
 * 		- sendTo (optional): jquery object to trigger messages 'setOn' or 'setOff' when the button is 'on' or 'off'
 * 		- sendToMessage (optional):
 * 			- on: text to trigger when button is on (default:'setOn')
 * 			- off: text to set when button is off (default:'setOff')
 * 		- buttonIsOn (optional): if true, the start state of the button is 'on' (default: 'off')
 * 
 */
var buttonOnOffMachine = {
		ButtonOn		: 
		{
			enterState : 
			{
				init_function		: function (){
					if (this.opts.text) 	this.myUIObject.html(this.opts.text.on).attr({'class':'on'});
					if (this.opts.sendTo) 	this.opts.sendTo.trigger(this.opts.sendToMessage.on);
				}
			},
			click	:	
			{
				next_state			: 'ButtonOff'
			},
		},
		ButtonOff		: 
		{
			enterState : 
			{
				init_function		: function (){
					if (this.opts.text) 	this.myUIObject.html(this.opts.text.off).attr({'class':'off'});
					if (this.opts.sendTo) 	this.opts.sendTo.trigger(this.opts.sendToMessage.off);
				},
			},
			click	:	
			{
				next_state		: 'ButtonOn'
			}
		},
		DefaultState			:
		{
			start	:	
			{
				init_function		: function (){
					if (!this.opts.sendToMessage) this.opts.sendToMessage = {on:'setOn',off:'setOff'};
					if (this.opts.buttonIsOn) this._stateDefinition['DefaultState']['start']['next_state'] = 'ButtonOn';
				},
				next_state		: 'ButtonOn'
			}
		}				
	};

/**
 * musicMachine - manages an audio object
 * @example
 * <code>
 * 		<audio id="music" src="myMusic.mp3" preload="auto"></audio>
 * 		.....
 * 		$("#music").iFSM(musicMachine,{volume:0.3});
 * </code>
 * @param default state: Paused
 * @param handle events:
 * 		- setOn
 * 		- setOff
 * @param opts
 * 		- volume (default: 0.2)
 */
var musicMachine = {
	Playing		: 
	{
		enterState : 
		{
			init_function		: function (){
				this.myUIObject.trigger('play');
			}
		},
		setOff	:	
		{
			next_state			: 'Paused'
		},
	},
	Paused		: 
	{
		enterState : 
		{
			init_function		: function (){this.myUIObject.trigger('pause');},
		},
		setOn	:	
		{
			next_state		: 'Playing'
		}
	},
	DefaultState			:
	{
		start	:	
		{
			init_function		: function (){
				if (!this.opts.volume) this.opts.volume=0.1;
				this.myUIObject.prop("volume",this.opts.volume);
			},
			next_state		: 'Paused'
		}
	}				
};
