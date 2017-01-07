/*
 * jQuery css bezier animation support -- Jonah Fox - initial version http://weepy.github.com/jquery.path/
 * version 0.0.3 - by https://github.com/DanielSchaffer/jquery.path
 *     // note: rotation requires the transform CSS hook (https://github.com/brandonaaron/jquery-cssHooks/blob/master/transform.js)
 * version 0.0.4 - by intersel / E.Podvin - add the possibility to send 'transform' info on specific path to rotate the object 
 * Released under the MIT license.
 */
/*
  var path = $.path.bezier({
    start: {x:10, y:10, angle: 20, length: 0.3},
    end:   {x:20, y:30, angle: -20, length: 0.2}
  })
  $("myobj").animate({path: path}, duration)

*/

;(function($){

  $.path = {
    isPath: function(path) {
      return path &&
        path.css &&
        path.css.constructor == Function;
    }
  };

  var V = {
    rotate: function(p, degrees) {
      var radians = degrees * Math.PI / 180,
        c = Math.cos(radians),
        s = Math.sin(radians);
      return [c*p[0] - s*p[1], s*p[0] + c*p[1]];
    },
    scale: function(p, n) {
      return [n*p[0], n*p[1]];
    },
    add: function(a, b) {
      return [a[0]+b[0], a[1]+b[1]];
    },
    minus: function(a, b) {
      return [a[0]-b[0], a[1]-b[1]];
    }
  };

  $.path.bezier = function(params) {
    this.x = params.start.x;
    this.y = params.start.y;
    this.rotator = params.rotator;
    if (params.debug) this.debug = params.debug;
    else this.debug = false;
    
    if (params.smoothSteps) this.smoothSteps=params.smoothSteps;
    else this.smoothSteps = 8;
    
    params.start = $.extend( {angle: 0, length: 0.3333}, params.start );
    params.end = $.extend( {angle: 0, length: 0.3333}, params.end );

    this.p1 = [params.start.x, params.start.y];
    this.p4 = [params.end.x, params.end.y];

    var v14 = V.minus( this.p4, this.p1 ),
      v12 = V.scale( v14, params.start.length ),
      v41 = V.scale( v14, -1 ),
      v43 = V.scale( v41, params.end.length );

    v12 = V.rotate( v12, params.start.angle );
    this.p2 = V.add( this.p1, v12 );

    v43 = V.rotate(v43, params.end.angle );
    this.p3 = V.add( this.p4, v43 );

    this.f1 = function(t) { return (t*t*t); };
    this.f2 = function(t) { return (3*t*t*(1-t)); };
    this.f3 = function(t) { return (3*t*(1-t)*(1-t)); };
    this.f4 = function(t) { return ((1-t)*(1-t)*(1-t)); };

    /* p from 0 to 1 */
    this.css = function(p) {
      var f1 = this.f1(p), f2 = this.f2(p), f3 = this.f3(p), f4=this.f4(p), css = {};
      css.x = this.x = ( this.p1[0]*f1 + this.p2[0]*f2 +this.p3[0]*f3 + this.p4[0]*f4 +.5 )|0;
      css.y = this.y = ( this.p1[1]*f1 + this.p2[1]*f2 +this.p3[1]*f3 + this.p4[1]*f4 +.5 )|0;
      css.left = css.x+"px";
      css.top = css.y+"px";
      return css;
    };
  };

  $.path.arc = function(params) {
    for ( var i in params ) {
      this[i] = params[i];
    }
    this.dir = this.dir || 1;

    while ( this.start > this.end && this.dir > 0 ) {
      this.start -= 360;
    }

    while ( this.start < this.end && this.dir < 0 ) {
      this.start += 360;
    }

    if(this.spiral) {
      if(this.spiral.constructor == Array && this.spiral.length > 1) {
        this.radiusStart = this.spiral[0] || 1;
        this.radiusEnd = this.spiral[1] || 1;
      } else {
        this.radiusStart = 1;
        this.radiusEnd = (this.spiral.constructor == Array ? this.spiral[0] : this.spiral) || 1;
      }
      this.radius = this.radiusStart;
      this.radiusDiff = Math.abs(this.radiusEnd - this.radiusStart);
    }

    if($.path.isPath(this.center)) {
      this.centerPath = this.center;
      this.center = [0,0];
    }

    this.css = function(p) {
      var a = ( this.start * (p ) + this.end * (1-(p )) ) * Math.PI / 180,
        css = {};

      if(this.centerPath) {
        var pos = this.centerPath.css(p);
        this.center[0] = pos.x;
        this.center[1] = pos.y;
      }

      css.x = this.x = ( Math.sin(a) * this.radius + this.center[0] +.5 )|0;
      css.y = this.y = ( Math.cos(a) * this.radius + this.center[1] +.5 )|0;
      css.left = css.x+"px";
      css.top = css.y+"px";

      if(this.spiral) {
        this.radius = this.radiusStart + (this.radiusDiff - (this.radiusDiff * p));
      }

      return css;
    };
  };

  // rotators
  $.path.rotators = {
    isRotator: function(rotator) {
      return rotator &&
        rotator.rotate &&
        rotator.rotate.constructor == Function &&
        rotator.unit;
    },
    units: {
      degrees: 'deg',
      gradians: 'grad',
      radians: 'rad',
      turns: 'turn'
    }
  };

  $.path.rotators.followPath = function(initialVector) {
    this.unit = $.path.rotators.units.radians;
    var initVector = {x:0,y:0};// = initialVector;
    //var initAtan2 = Math.atan2(initVector.y, initVector.x);
    this.rotate = function(p, css, prevState) {
      //return Math.atan2(prevState.y - css.y, prevState.x - css.x);
    	if (initVector.x == 0 && initVector.y == 0) 
    	{
    		initVector = {x:prevState.vectx,y:prevState.vecty};
    		initAtan2 = Math.atan2(initVector.y, initVector.x);
    		angle = 0;
    	}
    	else
    	{
        	angle = Math.atan2(prevState.vecty, prevState.vectx) - initAtan2;
    	}
    	return angle;
    };
  };

  $.path.rotators.setRotation = function(aRotation) {
	    this.unit = $.path.rotators.units.degrees;
	    var rotation = aRotation;
	    this.rotate = function(p, css, prevState) {
	      return rotation*p;
	    };
	  };

  $.path.rotators.spin = function (params) {
    this.unit = $.path.rotators.units.degrees;
    for ( var i in params ) {
      this[i] = params[i];
    }
    this.dir = this.dir || 1;

    while ( this.start > this.end && this.dir > 0 ) {
      this.start -= 360;
    }

    while ( this.start < this.end && this.dir < 0 ) {
      this.start += 360;
    }

    this.diff = this.end - this.start;

    this.rotate = function(p, css, prevCss) {
      var pos = this.start - (this.diff - (this.diff * p));
      return pos % 360;
    };
  };

  $.fx.step.path = function(fx) {

    var css = fx.end.css( 1 - fx.pos );
    var rotation = 0;

    var generalSize = $().iFSMAgetGeneralSize();
    
    // note: rotation requires the transform CSS hook (https://github.com/brandonaaron/jquery-cssHooks/blob/master/transform.js)
    if($.path.rotators.isRotator(fx.end.rotator)) 
    {
        var myElem =  $(fx.elem);
    	var prevState = {	
				x:myElem.attr('prevState_x'),
				y:myElem.attr('prevState_y'),
				vectx:myElem.attr('prevState_vectx'),
				vecty:myElem.attr('prevState_vecty'),
				orix:myElem.attr('prevState_orix'),
				oriy:myElem.attr('prevState_oriy'),
				rotate:myElem.attr('prevState_rotate')
		};
    	if (fx.end.debug) $("#footer").html($("#footer").html()+fx.pos+':'+'-'+prevState.x+'-'+prevState.y+"<br>");
    	css.transform ='';

    	if (prevState.x)
    	{
       		if (prevState.vectx > 0 || prevState.vecty > 0 )
       		{
	        	rotation = fx.end.rotator.rotate(fx.pos, css, prevState);
	       		css.transform = "rotate(" + rotation + fx.end.rotator.unit + ")";
	       		if (fx.end.debug) $("#footer").html($("#footer").html()+'ontourne....'+"-->");
       		}
       		
       		if (prevState.orix)
       		{
	        	vx=prevState.x-prevState.orix;
	        	vy=prevState.y-prevState.oriy;
	        	if (Math.sqrt((vx*vx)+(vy*vy)) > fx.end.smoothSteps)
	        	{
	            	myElem.attr('prevState_vectx',vx);
	            	myElem.attr('prevState_vecty',vy);
	            	myElem.attr('prevState_orix',css.x);
	            	myElem.attr('prevState_oriy',css.y);
	        	}
       		}
       		else
       		{
            	myElem.attr('prevState_vectx',0);
            	myElem.attr('prevState_vecty',0);
            	myElem.attr('prevState_orix',css.x);
            	myElem.attr('prevState_oriy',css.y);
       		}
    	}

    	myElem.attr('prevState_x',css.x);
    	myElem.attr('prevState_y',css.y);
    	myElem.attr('prevState_rotate',rotation);
    	
    	if (fx.end.debug) $("#footer").html($("#footer").html()+fx.pos+':'+css.transform+'-'+css.x+'-'+css.y+'-'+(rotation*180 / Math.PI)+"<br>");
    }
    
    css.left = css.x*100/parseInt(generalSize.x)+'%';
	css.top = css.y*100/parseInt(generalSize.y)+'%';
    if (css.transform) fx.elem.style.transform = css.transform;

    
    fx.elem.style.top = css.top;
    fx.elem.style.left = css.left;
    
    if (fx.end.debug) 
    {
	    var color = '#000000';
	    var size = '1px';
	    $("section").append(
	        $('<div></div>')
	            .css('position', 'absolute')
	            .css('top', css.top)
	            .css('left', css.left)
	            .css('width', size)
	            .css('height', size)
	            .css('background-color', color)
	    );
    }
  };

})(jQuery);