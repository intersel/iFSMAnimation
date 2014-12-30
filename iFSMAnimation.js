/**
 * -----------------------------------------------------------------------------------------
 * INTERSEL - 4 cité d'Hauteville - 75010 PARIS
 * RCS PARIS 488 379 660 - NAF 721Z
 *
 * File    : iFSMAnimation.js
 * Abstract: iFSMAnimation allows to create simple HTML5 animations easily on DOM objects
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
 * 	$(document).ready(function() {
 * //initialize and start the general animation
 * 	$('section#animation-objects').iFSM(mainAnimation);
 * </script>
 * 
 * The available animations are:
 * - dummy - non animation
 * 	- animate - animate article from current position or startposition to destination
 * 	- duration
 * 	- destination-left
 * 	- destination-top
 * 	- startposition-left - optional
 * 	- startposition-top - optional
 * 	- animateNoWait - same as animate but does not wait the end of animation to start the next animation 
 * -display - display article (opacity set to 1) with animation from current position or startposition to destination
 * 	- duration
 * 	- destination-left
 * 	- destination-top
 * 	- startposition-left - optional
 * 	- startposition-top - optional
 * -smoothHide - display article (opacity set to 0) with animation from current position or startposition to destination
 * 	- duration
 * 	- destination-left
 * 	- destination-top
 * 	- startposition-left - optional
 * 	- startposition-top - optional
 * -rotate - rotate article 
 * 	- duration
 * 	- angle
 * -loop - loop animation
 * 	- duration
 * 	- destination-left
 * 	- destination-top
 * 	- startposition-left - optional
 * 	- startposition-top - optional
 * 	- loops number - optional default:infinite - give the number of loops
 * 	- loop back delay - optional default: duration - give the delay to go to the initial position
 * -specialAnimate
 * 	- duration
 * 	- animation description object as in jQuery. ex: {left: 20;top:100;width:300}
 * -----------------------------------------------------------------------------------------
 * Modifications:
 * - 20141223 - EPO - V1.0.0 - Creation
 * -  -  - V<current_version of the developed software> - Rename into P1P2_MYClassName
 * -----------------------------------------------------------------------------------------
 * @copyright Intersel 2014
 * @author    E.Podvin emmanuel.podvin@intersel.fr
 * @author    second... IAM me.iam@intersel.fr
 * @version   <1.0.0> (to be updated to the current_version of the developed software if file is touched)
 * -----------------------------------------------------------------------------------------
 */


/**
 * 
 * 
 */

var ANIMATION_TYPE 				= 0;
var ANIMATION_DURATION 			= 1;
var ANIMATION_X_DESTINATION		= 2;
var ROTATE_ANGLE				= 2;
var SPECIALANIMATION_DEFINITION = 2;
var ANIMATION_Y_DESTINATION		= 3;
var ANIMATION_X_ORIGIN			= 4;
var ANIMATION_Y_ORIGIN			= 5;
var ANIMATION_LOOP_NUMBER		= 6; // if == 0 then infinite loop
var ANIMATION_LOOP_BACK_DELAY	= 7; // 
var ANIMATION_NOTWAIT			= 100;

var animatedObjectMachine = {
	InitAnimatedObject: 
	{
		enterState:
		{
			init_function: function() {
				if (this.myUIObject.attr('data-animation')) 		this.opts.data_animation 		= this.myUIObject.attr('data-animation').replace(/[ \t\r]+/g,"").split(',');
				if (this.myUIObject.attr('data-enter-animation')) 	this.opts.data_enter_animation 	= this.myUIObject.attr('data-enter-animation').replace(/[ \t\r]+/g,"").split(',');
				if (this.myUIObject.attr('data-exit-animation')) 	this.opts.data_exit_animation 	= this.myUIObject.attr('data-exit-animation').replace(/[ \t\r]+/g,"").split(',');
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
				this.opts.currentAnimationCaller = data;
				this.opts.currentAnimationData 	= this.opts.data_enter_animation;
			},
			propagate_event:'doAnimation',
		},
		startAnimation:
		{
			init_function: function(parameters, event, data) {
				this.opts.currentAnimationCaller = data;
				this.opts.currentAnimationData 	= this.opts.data_animation;
			},
			propagate_event:'doAnimation',
		},
		startExitAnimation:
		{
			init_function: function(parameters, event, data) {
				this.opts.currentAnimationCaller = data;
				this.opts.currentAnimationData 	= this.opts.data_exit_animation;
			},
			propagate_event:'doAnimation',
		},
		doAnimation:
		{
			init_function: function() {
			},
			next_state:'EnterAnimation',
			next_state_when:'(this.opts.currentAnimationData != null) && (this.opts.currentAnimationData[ANIMATION_TYPE] != "dummy")',
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
				var styles = {position 	: "absolute"};
				if (this.opts.currentAnimationData[ANIMATION_X_ORIGIN]) styles['left']=this.opts.currentAnimationData[ANIMATION_X_ORIGIN]+"px";
				if (this.opts.currentAnimationData[ANIMATION_Y_ORIGIN]) styles['top']=this.opts.currentAnimationData[ANIMATION_Y_ORIGIN]+"px";
				this.myUIObject.css(styles);
				this.trigger(this.opts.currentAnimationData[ANIMATION_TYPE]);
			},
		},
		//initialization
		display:'animate',
		rotate:'animate',
		smoothHide:'animate',
		specialAnimate:'animate',
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
	            				var aFSM = this;
	            				this.opts.numberOfLoops--;
	            				this._log('numberOfLoop:'+this.opts.numberOfLoops,2);
	            				this.myUIObject.stop().animate({
	            					left	: parseInt(this.rootMachine.opts.currentAnimationData[ANIMATION_X_DESTINATION]),
	            					top		: parseInt(this.rootMachine.opts.currentAnimationData[ANIMATION_Y_DESTINATION]),
	            					},{
	            						duration	: parseInt(this.rootMachine.opts.currentAnimationData[ANIMATION_DURATION]), 
	            						complete	: function(){
	            							aFSM.trigger('loopEnd');
	            						},
	            				});
	            			},
	            			prevent_bubble:true,
	            		},
	            		loopEnd:
	            		{
	            			init_function: function() {
	            				var aFSM = this;
	            				this.myUIObject.stop().animate({
	            					left	: parseInt(this.rootMachine.opts.currentAnimationData[ANIMATION_X_ORIGIN]),
	            					top		: parseInt(this.rootMachine.opts.currentAnimationData[ANIMATION_Y_ORIGIN]),
	            					},{
	            					duration	: parseInt(this.rootMachine.opts.currentAnimationData[ANIMATION_LOOP_BACK_DELAY]), 
	            					complete	: function(){
	            						aFSM.trigger('loopEndReinit');
	            					},
	            				});
	            			},
	            			prevent_bubble:true,
	            		},
	            		loopEndReinit:
	            		{
	            			propagate_event:'loop',
	            			process_event_if:'this.opts.numberOfLoops>0',
	            			propagate_event_on_refused:'animationStopped',
	            			prevent_bubble:true,
	            		},
	            		animationStopped:
	            		{
	            			next_state : 'initLoop',
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
						left	: this.opts.currentAnimationData[ANIMATION_X_DESTINATION],
						top		: this.opts.currentAnimationData[ANIMATION_Y_DESTINATION],
				},{
						duration	: parseInt(this.opts.currentAnimationData[ANIMATION_DURATION]), 
						complete	: function(){aFSM.trigger('animationStopped');},
				});
				if ( 	(this.opts.currentAnimationData[ANIMATION_NOTWAIT] == 1) 
					 && (this.opts.currentAnimationCaller) 
					) 
				{
					this.opts.currentAnimationCaller.trigger('animationStopped');
					this.opts.currentAnimationCaller = null;
				}
			}
		},
		specialAnimate:
		{
			init_function: function() {
				var aFSM = this;
				eval('var aAnimation='+this.opts.currentAnimationData[SPECIALANIMATION_DEFINITION].replace(/[;]+/g,","));
				this.myUIObject.stop().animate(aAnimation,{
						duration	: parseInt(this.opts.currentAnimationData[ANIMATION_DURATION]), 
						complete	: function(){aFSM.trigger('animationStopped');},
				});
			}
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
				if (this.opts.currentAnimationCaller) 
				{
					this.opts.currentAnimationCaller.trigger('animationStopped');
					this.opts.currentAnimationCaller = null;
				}
			}
		},
		smoothHide:
		{
			init_function: function() {
				var aFSM = this;
				this.myUIObject.stop().animate({
						opacity	: 0,
						left	: this.opts.currentAnimationData[ANIMATION_X_DESTINATION],
						top		: this.opts.currentAnimationData[ANIMATION_Y_DESTINATION],
				},{
						duration	: parseInt(this.opts.currentAnimationData[ANIMATION_DURATION]), 
						complete	: function(){aFSM.trigger('animationStopped');},
				});
				//this.myUIObject.css({display:'none'});//utile?
			}
		},
		display:
		{
			init_function: function() {
				var aFSM = this;
				this.myUIObject.show().stop().animate({
						opacity	: 1,
						left	: this.opts.currentAnimationData[ANIMATION_X_DESTINATION],
						top		: this.opts.currentAnimationData[ANIMATION_Y_DESTINATION],
				},{
						duration	: this.opts.currentAnimationData[ANIMATION_DURATION], 
						complete	: function(){aFSM.trigger('animationStopped');},
				});
			}
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
			next_state:'ObjectInitialized',
			propagate_event:true,
		}
	},
	ExitAnimation:
	{
		enterState:
		{
			init_function: function() {if (this.opts.currentAnimationCaller) this.opts.currentAnimationCaller.trigger('animationStopped');},
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
 *  Each animated object will have a "startEnterAnimation" then "startAnimation" triggered in a loop
 *  Then objects will receive "startExitAnimation"
 *  then we repplay the whole...
 *  
 *  @param data-delay-before-restart - delay before restart animation in ms  
 *  @param opts.animationSequence (optional) - list of the animated objects in the order of their animation
 *  @param opts.animatedObjectDefinition (optional, default = 'article') - definition to find the animated objects under the object attached to the iFSM machine (myUIObject)
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
			next_state:'StartAnimation',
		},
	},
	StartAnimation:
	{
		enterState:
		{
			init_function: function() {
				if (this.opts.animationSequence[this.opts.animationStep]) $(this.opts.animationSequence[this.opts.animationStep]).trigger('startEnterAnimation',this);
				else this.trigger('animationObjectVoid');
			},
			next_state:'WaitForStartAnimationDone',
		},
	},
	WaitForStartAnimationDone:
	{
		animationStopped:
		{
			next_state:'Animation',
		},
		animationObjectVoid:
		{
			init_function: function() {
				this.opts.animationStep++;
				this.trigger('reStartAnimation');
			},
			next_state:'WaitForAnimationDone',
			next_state_when:'this.opts.animationStep>=this.opts.animationSequence.length',
		},
		reStartAnimation:
		{
			next_state:'StartAnimation',
		},
	},
	Animation:
	{
		enterState:
		{
			propagate_event:'doAnimation',
		},
		doAnimation:
		{
			init_function: function() {
				$(this.opts.animationSequence[this.opts.animationStep]).trigger('startAnimation',this);
				this.opts.animationStep++;
			},
			next_state:'WaitForAnimationDone',
			next_state_when:'this.opts.animationStep>=this.opts.animationSequence.length',
		},
		animationStopped:
		{
			next_state:'StartAnimation',
		},
		
	},
	WaitForAnimationDone: // do the next element
	{
		reStartAnimation:'animationStopped',
		animationStopped:
		{
			next_state:'EndOfAnimation',
		},
	},
	tempAnimationStopped:
	{
		tempStartAnimation:
		{
			pushpop_state: 'PopState',
			propagate_event:'reStartAnimation',
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
			propagate_event:'startEraseAnimation',
		},
		startEraseAnimation:
		{
			propagate_event : 'eraseAnimation',
			how_process_event: {delay:2500},
			next_state:'DoingEndOfAnimation',
		},
	},
	DoingEndOfAnimation:
	{
		eraseAnimation:
		{
			init_function: function() {
				if (this.opts.animationSequence[this.opts.animationStep]) $(this.opts.animationSequence[this.opts.animationStep]).trigger('startExitAnimation',this);
				else this.trigger('animationStopped');
				this.opts.animationStep++;
			},
			next_state:'WaitForExitAnimationDone',
			next_state_when:'this.opts.animationStep>=this.opts.animationSequence.length',
		},
		animationStopped:
		{
			propagate_event:'eraseAnimation',
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
			next_state:'InitAnimation',
		},
	},
	DefaultState: 
	{
		start: 
		{
			init_function: function() {
				if (!this.opts.animatedObjectDefinition) this.opts.animatedObjectDefinition='article';
				if (!this.opts.animationSequence)
				{
					//get the animated objects
					this.opts.animationSequence=this.myUIObject.find(this.opts.animatedObjectDefinition);
					//attached them to the animatedObjectMachine machine
					this.opts.animationSequence.iFSM(animatedObjectMachine);
				};
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

/**
 * @param opts
 * 		- text (optional):
 * 			- on: text to set when button is on
 * 			- off: text to set when button is off
 * 		- sendTo (optional): jquery object to trigger messages 'setOn' or 'setOff' when the button is 'on' or 'off'
 * 		- sendToMessage (optional):
 * 			- on: text to trigger when button is on (default:'setOn')
 * 			- off: text to set when button is off (default:'setOff')
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
				},
				next_state		: 'ButtonOn'
			}
		}				
	};
	 
var musicMachine = {
		Playing		: 
		{
			enterState : 
			{
				init_function		: function (){
					this.myUIObject.prop("volume",this.opts.volume);
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
				next_state		: 'Playing'
			}
		}				
	};



