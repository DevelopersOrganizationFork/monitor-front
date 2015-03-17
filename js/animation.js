
	var nrOfWires = 0;
	function initFn2(element) {
		var i;
		var MAX_WIRES = 50;
		
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
			
			wire.classList.add('lineTransition2');
			
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
				subLineDiv.classList.add('lineTransition');
				
				if(randRot < 0.3 && (!lineDiv.lastChild || !lineDiv.lastChild.classList.contains('rotatedDown'))) {
					subWidth = 40;
					subLineDiv.classList.add('rotatedUp');
					bottom += 28;
					subLineDiv.style.left = left + 'px';						
					left -= 12;
					maxHeight -= 30;
				} else if(randRot > 0.7 && (!lineDiv.lastChild || !lineDiv.lastChild.classList.contains('rotatedUp'))) {
					subWidth = 40;
					bottom -= 28;
					subLineDiv.style.left = left + 'px';										
					left -= 12;
					subLineDiv.classList.add('rotatedDown');
					maxHeight -= 30;
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
			animateSubline(line, 0);
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
	
	document.addEventListener('DOMContentLoaded', initFn2, false); 
	