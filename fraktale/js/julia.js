//Julia
//(c) 2011 by Tomasz Lubinski
//www.algorytm.org

/* Render area coordinates */
var minX = -1.5;
var maxX =  1.5;
var minY = -1.25;
var maxY =  1.25;

/* C parameter */
var c_re = -0.123;
var c_im = 0.745;

/* Render area size */
var width = 0;
var height = 0;
var ratioX;
var ratioY;

/* Number of fractal levels */
var levelNum = 100;
var colors = new Array(levelNum+1);

/* Fractal image */
var imageData;
var canvas;
var ctx;
	
/* Selection data*/
var selectionStarted = false;
var selectStartX, selectStartY, selectStopX, selectStopY;

/* signum function */
function sgn(x){
  if(x>0)return 1;
  else if(x<0)return -1;
  else return 0;
}

/* store where selection has started */
function startSelect(e)
{
	if (e.button == 0)
	{
		/* left mouse button - select operation */
		selectionStarted = true;
		if (e.offsetX || e.offsetX == 0) 
		{
			selectStartX = e.offsetX;
			selectStopX = e.offsetX;
			selectStartY = e.offsetY;
			selectStopY = e.offsetY;				
		}
		else
		{
			selectStartX = e.layerX;
			selectStopX = e.layerX;
			selectStartY = e.layerY;
			selectStopY = e.layerY;
		}
	}
	else
	{
		/* right mouse button - reset operation */
		selectStartX = 0;
		selectStopX = 0;
		selectStartY = 0;
		selectStopY = 0;
		minX = -1.5;
		maxX =  1.5;
		minY = -1.25;
		maxY =  1.25;		
		ratioX = (maxX - minX) / width;
		ratioY = (maxY - minY) / height;
		renderFractal();
	}
}

/* selection has stopped, render new fractal */
function stopSelect(e)
{
	selectionStarted = false;
	if (selectStartX != selectStopX && selectStartY != selectStopY)
	{
		maxX = Math.max(selectStartX, selectStopX)*ratioX + minX;
		minX = Math.min(selectStartX, selectStopX)*ratioX + minX;
		maxY = Math.max(selectStartY, selectStopY)*ratioY + minY;
		minY = Math.min(selectStartY, selectStopY)*ratioY + minY;
		ratioX = (maxX - minX) / width;
		ratioY = (maxY - minY) / height;
		renderFractal();
	}
}

/* mouse is outside render area, cancel selection */
function clearSelect(e)
{
	if (selectionStarted)
	{
		canvas.width = canvas.width;
		ctx.putImageData(imageData, 0, 0);	
	}
	selectionStarted = false;
}

/* mouse is moving inside render area, show selection rectangle */
function moveSelect(e)
{
	if (selectionStarted)
	{
		if (e.offsetX || e.offsetX == 0) 
		{
			selectStopX = e.offsetX;
			selectStopY = e.offsetY;			
		}
		else
		{
			selectStopX = e.layerX;
			selectStopY = e.layerY;
		}
		canvas.width = canvas.width; /* clear canvas */
		ctx.putImageData(imageData, 0, 0); /* put fractal on the canvas */
		if (selectStartX != selectStopX && selectStartY != selectStopY)
		{
			/* make sure that selection area has the same ratio as original area */
			if (width/height < Math.abs(selectStartX-selectStopX)/Math.abs(selectStartY-selectStopY))
			{
				selectStopY = selectStartY+sgn(selectStopY-selectStartY)*height*Math.abs(selectStartX-selectStopX)/width;
			}
			else
			{
				selectStopX = selectStartX+sgn(selectStopX-selectStartX)*width*Math.abs(selectStartY-selectStopY)/height;
			}
			/* put select rectangle on the canvas */
			ctx.fillStyle = 'rgba(100,200,300,0.5)';
			ctx.fillRect(Math.min(selectStartX, selectStopX), Math.min(selectStartY, selectStopY), Math.abs(selectStartX-selectStopX), Math.abs(selectStartY-selectStopY));
		}
	}
}

/* initialize color table */
function initializeColors()
{
	for (var level=0; level<=levelNum; level++)
	{
		colors[level] = new Object();
		colors[level].r = 255.0*level/levelNum;
		colors[level].g = 255.0*level/levelNum;
		colors[level].b = 255.0*Math.log(level)/Math.log(levelNum);
	}
}

/* value is inside set in the returned level */
function levelSet(p_re, p_im, c_re, c_im)
{
	var z_re = p_re;
	var z_im = p_im;
	var iteration = 0;
	var tmp_re, tmp_im;

	do
	{
		tmp_re = z_re*z_re - z_im*z_im + c_re;
		tmp_im = 2*z_re*z_im + c_im;
		z_re = tmp_re;
		z_im = tmp_im;
		iteration++;		
	} while ((z_re*z_re+z_im*z_im) < 4 && iteration < levelNum);

	return iteration;
}

/* render Fractal */
function renderFractal()
{
	for (var i=0; i<height; i++)
	{
		p_im = i*ratioY + minY;
		for (var j=0; j<width; j++)
		{
			p_re = j*ratioX + minX;
			index = (i*width+j)*4;
			imageData.data[index+3] = 0xff;
			level = levelSet(p_re, p_im, c_re, c_im);
			imageData.data[index+0] = colors[level].r;
			imageData.data[index+1] = colors[level].g;
			imageData.data[index+2] = colors[level].b;
		}
	}
	
	// copy the image data back onto the canvas
	ctx.putImageData(imageData, 0, 0);
}

/* touch handler for devices with touch screen */
function touchHandler(event)
{
	var touches = event.changedTouches,
	first = touches[0],
	type = "";
	switch(event.type)
	{
		case "touchstart": type = "mousedown"; break;
		case "touchmove":  type = "mousemove"; break;        
		case "touchend":   type = "mouseup"; break;
		default: return;
	}    
	if (touches.length > 1)
	{
		type = "mousedown";
	}
	var simulatedEvent = document.createEvent("MouseEvent");
	simulatedEvent.initMouseEvent(type, true, true, window, 1, 
		first.screenX, first.screenY, 
		first.clientX, first.clientY, false, 
		false, false, false, touches.length-1, null);
	first.target.dispatchEvent(simulatedEvent);
	event.preventDefault();
}

/* initialize environment and render Fractal */
function initializeFractal()
{
	canvas = document.getElementById("canvasJulia");
	ctx = canvas.getContext("2d");
	
	canvas.onmousemove = moveSelect;
	canvas.onmousedown = startSelect;
	canvas.onmouseup = stopSelect;
	canvas.onmouseout = clearSelect;

	//support for mobile devices with touch screen
	if ("ontouchstart" in document.documentElement)
	{
		canvas.ontouchstart = touchHandler;
		canvas.ontouchmove = touchHandler;
		canvas.ontouchend = touchHandler;
	}

	// read the width and height of the canvas
	width = canvas.width;
	height = canvas.height;

	// create a new pixel array
	imageData = ctx.createImageData(width, height);
	
	ratioX = (maxX - minX) / width;
	ratioY = (maxY - minY) / height;
	
	initializeColors();
	renderFractal();
}