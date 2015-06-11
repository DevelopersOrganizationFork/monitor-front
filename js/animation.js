
	var nrOfWires = 0;
	function initFn() {
		var lines = document.getElementsByClassName('lineTransFast');
		var i=0;
		for(i=0; i< lines.length; i++) {
			var childs = lines[i].children;
			for(j=0; j< childs.length; j++) {
				childs[j].myWidth = childs[j].style.width;
				childs[j].style.width = 0;
			}
		}
		
		setTimeout(function() {
			var login = document.getElementById('loginForm');
			login.style.opacity = 1;
		}, 400);
		
		initFn2(false);
	}
	
	function initFn2(element) {
		var i;
		var MAX_WIRES = 45;

		var backgroundDiv = document.getElementById('background');
		
		var maxWidth = backgroundDiv.offsetWidth;
		var maxHeight = backgroundDiv.offsetHeight;
		
		var wires = [];
		
		for(; nrOfWires < MAX_WIRES; nrOfWires++) {
			
			var x = Math.random() * (maxWidth-100) + 50;
			var y = Math.random() * (maxHeight-100) + 50;
			var width = (maxWidth-x+20) * Math.random();
			var height = (maxHeight-y+20) * Math.random();
	
			if(width + x + 20 > maxWidth) {
				nrOfWires--;
				continue;
			}
			if(height + y + 20 > maxHeight) {
				nrOfWires--;
				continue;
			}
			var wire = document.createElement('div');
			wire.classList.add('wire');
	
			wire.style.width = width + 'px';
			wire.style.left = x + 'px';
			wire.style.top = y + 'px';
			
			var point = document.createElement('div');
			var color;
			if(Math.random() > 0.5) {
				color = 'Green';
			} else {
				color = 'Blue';
			}
				
			var isBack = (Math.random() > 0.5) ? 'Back' : '';
			point.classList.add('point' + color);
			point.classList.add('point' + isBack);
		
			var pointBorder = document.createElement('div');
			pointBorder.classList.add('pointBorder');
			
			point.appendChild(pointBorder);
		
			var lineDiv = document.createElement('div');
			lineDiv.classList.add('line'+isBack);
			lineDiv.classList.add('line' + color);
			lineDiv.classList.add('subline');
			
			wire.classList.add('lineTransitionEndEffect');
			
			createSublines(lineDiv, width, height);
			
			wire.appendChild(point);
			wire.appendChild(lineDiv);
			backgroundDiv.appendChild(wire);
		
			wires.push(wire);
			}
			if(typeof element != 'undefined') {
				prepareAnimate(wires);
				animate(wires);
			} else {
				prepareAnimateOne(wires[wires.length-1]);
				animateOne(wires[wires.length-1]);
			}
		}
		
		function createSublines(lineDiv, subWidthMax, maxHeight) {
			var MAX_PARTS = 20;
			var MIN_PARTS = 3;
			var j;
			var subLinesCount = Math.random() * MAX_PARTS + MIN_PARTS;
			
			var lineDivWidth = subWidthMax;
			
			var top = 0;
			var bottom = 0;
			var left = 0;
			
			for(j=0; j < subLinesCount; j++) {
				if(40 > subWidthMax || 40 > maxHeight) {
					break;
				}
				var subWidth;
				var randRot = Math.random();
				
				var subLineDiv = document.createElement('div');
				
				subLineDiv.style.bottom = bottom + 'px';
				//subLineDiv.classList.add('lineTransition');
				
				if(randRot < 0.3 && (!lineDiv.lastChild || !lineDiv.lastChild.classList.contains('rotatedDown'))) {
					subWidth = 40;
					if(lineDiv.lastChild && lineDiv.lastChild.classList.contains('rotatedUp')) {
						var lastWidth = parseInt(lineDiv.lastChild.style.width);
						subWidth += lastWidth;
						subLineDiv =lineDiv.lastChild;
						bottom += 28;
						left -= 12;
						maxHeight -= 30;
					} else {
						subLineDiv.classList.add('rotatedUp');
						bottom += 28;
						subLineDiv.style.left = left + 'px';						
						left -= 12;
						maxHeight -= 30;
					}
				} else if(randRot > 0.7 && (!lineDiv.lastChild || !lineDiv.lastChild.classList.contains('rotatedUp'))) {
					subWidth = 40;
					if(lineDiv.lastChild && lineDiv.lastChild.classList.contains('rotatedDown')) {
						var lastWidth = parseInt(lineDiv.lastChild.style.width);
						subWidth += lastWidth;
						subLineDiv =lineDiv.lastChild;
						bottom -= 28;
						left -= 12;
						maxHeight -= 30;
					} else {
						bottom -= 28;
						subLineDiv.style.left = left + 'px';										
						left -= 12;
						subLineDiv.classList.add('rotatedDown');
						maxHeight -= 30;
					}
				} else if(lineDiv.lastChild && 
						!lineDiv.lastChild.classList.contains('rotatedUp') &&
						!lineDiv.lastChild.classList.contains('rotatedDown')) {
					subWidth = Math.random()*subWidthMax * 0.8;
					var lastWidth = parseInt(lineDiv.lastChild.style.width);
					subWidth = subWidth < 20 ? 20+lastWidth : subWidth+lastWidth;
					subLineDiv = lineDiv.lastChild;
				} else {
					subWidth = Math.random()*subWidthMax * 0.8;
					subWidth = subWidth < 20 ? 20 : subWidth;
					subLineDiv.style.left = left + 'px';	
				} 

				subWidthMax -= subWidth;
				
				subLineDiv.style.width = subWidth + 'px';	
				
				lineDiv.appendChild(subLineDiv);
			}
		}
		/**
		 * Ustawia poczatkowa szerokosc linii na 0
		 * i zapisuje do zmiennej myWidth obiektu docelowa
		 */
		function prepareAnimate(wires) {
			var i;
			for(i=0; i<wires.length;i++) {
				var subline = wires[i].children[1].firstChild;
				while(subline != null) {
					subline.myWidth = subline.style.width;
					subline.style.width = 0;
					subline = subline.nextSibling;
				}
			}
		}
	
		function animate(wires) {
			var i=0;
			
			var interval = setInterval(function() {
				wires[i].children[0].style.opacity = 1;

				if(wires[i].children[1].firstChild !=null) {
					var line = wires[i].children[1];
					animateSubline(line, 0);
				} else {
					var j=i;
					wires[i].style.opacity = 0;
					setTimeout(function() {
						wires[j].parentElement.removeChild(wires[j]);
						nrOfWires--;
						initFn2(true);
					}, 10000);
				}
				i++;
				if(i>=wires.length){
					clearInterval(interval);
				}			
			},200);
		}
		
	function prepareAnimateOne(wire) {
		
		var subline = wire.children[1].firstChild;
		while(subline != null) {
			subline.myWidth = subline.style.width;
			subline.style.width = 0;
			subline = subline.nextSibling;
		}
		
	}
	
	function animateOne(wire) {
		wire.children[0].style.opacity = 1;
		
		if(wire.children[1].firstChild !=null) {
			var line = wire.children[1];
			setTimeout(function() {
				animateSubline(line, 0);
			}, 200);
		} else {
			wire.style.opacity = 0;
			setTimeout(function() {
				wire.parentElement.removeChild(wire);
				nrOfWires--;
				initFn2(true);
			}, 10000);
		}

	}
		
		var transitionEnd = transitionEndEventName();
		
		function animateSubline(line, i) {
			line.children[i].style.width = line.children[i].myWidth;
			line.children[i].addEventListener(transitionEnd, function() {
				line.children[i].removeEventListener(transitionEnd, arguments.callee);
				i++;
				if(line.children[i] != null) {
					animateSubline(line, i);
				} else {
					var wire = line.parentElement;
					
					wire.addEventListener(transitionEnd, function() {
						wire.removeEventListener(transitionEnd, arguments.callee);
						wire.style.opacity = 0;
						setTimeout(function() {
							wire.parentElement.removeChild(wire);
							nrOfWires--;
							initFn2(true);
						}, 10000);
						
					}, false);
				}
			}, false);
		}
		
	function transitionEndEventName () {
		var i,
        undefined,
        el = document.createElement('div'),
        transitions = {
            'transition':'transitionend',
            'OTransition':'otransitionend',  // oTransitionEnd in very old Opera
            'MozTransition':'transitionend',
            'WebkitTransition':'webkitTransitionEnd'
        };
		
		for (i in transitions) {
			if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
				return transitions[i];
			}
		}
		
		//TODO: throw 'TransitionEnd event is not supported in this browser'; 
	}
	
		document.addEventListener('DOMContentLoaded', initFn, false); 
		window.onload = addListeners;

	function addListeners(){
		document.getElementById('loginForm').addEventListener('mousedown', mouseDown, false);
		window.addEventListener('mouseup', mouseUp, false);
	}

	function mouseUp()
	{
		window.removeEventListener('mousemove', divMove, true);
	}

	function mouseDown(e){
	if(e.target.tagName == 'INPUT') {
	return;
	}
		var div = document.getElementById('loginForm');
		startTop = div.offsetTop;
		startLeft = div.offsetLeft;
	
		startY = e.clientY;
		startX = e.clientX;
	    window.addEventListener('mousemove', divMove, true);
	}

	function divMove(e){
		var div = document.getElementById('loginForm');
		  div.style.position = 'absolute';
		  div.style.top = startTop + (e.clientY-startY) + 'px';
		  div.style.left = startLeft + (e.clientX-startX)+ 'px';
		  div.style.right = 'initial';
		  div.style.bottom = 'initial';
	  }
	 	var lastAnim = {
		lastAnim: function() {
			
			
			var wires = document.getElementsByClassName('lineTransition2');			
			
			setTimeout(function() {
			lastAnim.animate(wires);
			
			setTimeout(function() {
				var center = document.getElementById('center');
				var center2 = document.getElementById('center2');
				
				var centerCpy = center.cloneNode(true);
				var centerCpy2 = center2.cloneNode(true);
				
				var centerCpy3 = center.cloneNode(true);
				var centerCpy4 = center2.cloneNode(true);
				
				var back = document.getElementById('background2');
				
				back.insertBefore(centerCpy, center);
				back.insertBefore(centerCpy2, center2);
				setTimeout(function() {
					back.insertBefore(centerCpy3, center);
					back.insertBefore(centerCpy4, center2);
				}, 300);
				setTimeout(lastAnim.animateCenterPoint, 300);
			}, 1300);
			},30);
		},
		
		animateCenterPoint: function() {
			var centerPoint = document.getElementById("centerPoint");
			var centerOverflow = document.getElementById("centerOverflow");
			
			centerOverflow.style.opacity = "1";
			centerPoint.style.opacity = "1";
			
			setTimeout(function(){ 
				document.getElementById('loginFormForm').submit();
			}, 600);
		},
		
		animate: function(wires) {
			var i=0;
			for(;i<wires.length;i++) {
				wires[i].children[0].style.opacity = 1;
				
				if(wires[i].children[1].firstChild !=null) {
					var line = wires[i].children[1];
					lastAnim.animateSubline(line, 0);
				} else {
					var j=i;
					//wires[i].style.opacity = 0;
				}
			}
				
		},
		
		animateSubline: function(line, i) {
			var transitionEnd = transitionEndEventName();
			line.children[i].style.width = line.children[i].myWidth;
			line.children[i].addEventListener(transitionEnd, function() {
				line.children[i].removeEventListener(transitionEnd, arguments.callee);
				i++;
				if(line.children[i] != null) {
					lastAnim.animateSubline(line, i);
				} else {
					var wire = line.parentElement;
					
					wire.addEventListener(transitionEnd, function() {
						wire.removeEventListener(transitionEnd, arguments.callee);
						//wire.style.opacity = 0;
					}, false);
				}
			}, false);
			//TODO: throw 'TransitionEnd event is not supported in this browser'; 
		}
	} 
	  