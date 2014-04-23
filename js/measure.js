$(document).ready(function(){

	var canvas, ctx, flag = false,
		prevX = 0,
		currX = 0,
		prevY = 0,
		currY = 0,
		dot_flag = false;

	var x = "black",
		y = 2;

	var storedLines = [];
	// init();

	$(function() {
		// alert("init");
		canvas = $('#can');
		ctx = canvas[0].getContext("2d");
		w = canvas[0].width;
		h = canvas[0].height;

		// alert("width: " + w);


		canvas.mousedown(function(e){
			// alert("down");

			findxy('down', e);
			
		});

		canvas.mousemove(function(e){
			// alert("move");
			findxy('move', e);
		});

		canvas.mouseup(function(e){
			// alert("up");
			findxy('up', e);
		});

		canvas.mouseout(function(e){
			// alert("out");
			findxy('out', e);
		});

		$('#clr').click(function(e){
			erase();
		});
		$('#sav').click(function(e){
			save();
		});
	});

	function draw() {
		// alert("Draw");
		ctx.beginPath();
		// alert("Draw works");
		ctx.moveTo(prevX, prevY);
		ctx.lineTo(currX, currY);
		ctx.strokeStyle = x;
		ctx.lineWidth = y;
		ctx.stroke();
		ctx.closePath();
	}

	function erase() {
		var m = confirm("Want to clear");
		if (m) {
			ctx.clearRect(0, 0, w, h);
			storedLines.length = 0;
			redrawStoredLines();
			$('#table').html("<tr> <th> Start X </th> <th> Start Y </th> <th> End X </th> <th> End Y </th> <th> Distance </th> </tr>");
			// $("#canvasimg")[0].style.display = "none";
			$("#canvasimg").hide();
		}
	}

	function save() {
		var dataURL = canvas[0].toDataURL();
		$("#canvasimg").css({
			"border-width": "2px",
			"border-style": "solid"
		});
		$("#canvasimg").attr("src", dataURL);
		$("#canvasimg").show();
	}

	function findxy(res, e) {
		// alert("findxy");
		if (res == 'down') {
			currX = e.clientX - canvas.offset().left;
			currY = e.clientY - canvas.offset().top;
			prevX = currX;
			prevY = currY;
			
			// alert("currx: "+currX);

			flag = true;
			dot_flag = true;
			if (dot_flag) {
				ctx.beginPath();
				ctx.fillStyle = x;
				ctx.fillRect(currX, currY, 2, 2);
				ctx.closePath();
				dot_flag = false;
			}
		}

		if (res == 'up') {
			// alert("up");
			flag = false;
			currX = e.clientX - canvas.offset().left;
			currY = e.clientY - canvas.offset().top;
			distance = lineDistance(currX, currY, prevX, prevY);
			storedLines.push({
				x1: prevX,
				y1: prevY,
				x2: currX,
				y2: currY,
				dist: distance
			});
			
			redrawStoredLines();
			
			$('table').append("<tr><td>" + prevX + "</td>" + 
			"<td>" + prevY + "</td><td>" + currX + "</td><td>" +
			currY + "</td><td>" + distance + "</td></tr>");
			
			//draw();
			// alert("up");
		}
		if (res == 'move') {
			// alert("moving");
			
			if (!flag) {
				return;
			}
			redrawStoredLines();
			currX = e.clientX - canvas.offset().left;
			currY = e.clientY - canvas.offset().top;
			draw();
		}
	}
	
	function redrawStoredLines() {
		ctx.clearRect(0, 0, canvas[0].width, canvas[0].height);

		if (storedLines.length == 0) {
			return;
		}

		// redraw each stored line
		for (var i = 0; i < storedLines.length; i++) {
			ctx.beginPath();
			ctx.moveTo(storedLines[i].x1, storedLines[i].y1);
			ctx.lineTo(storedLines[i].x2, storedLines[i].y2);
			ctx.stroke();
		}
	}
	
	function lineDistance(x1, y1, x2, y2) {
		var xs = 0;
		var ys = 0;

		xs = x2 - x1;
		xs = xs * xs;

		ys = y2 - y1;
		ys = ys * ys;

		return Math.sqrt( xs + ys );
	}
});