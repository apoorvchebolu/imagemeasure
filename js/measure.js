$(document).ready(function(){
	var canvas, ctx, flag = false,
		prevX = 0,
		currX = 0,
		prevY = 0,
		currY = 0,
		dot_flag = false;
	var imageCanvas, imageCtx;

	var x = "black",
		y = 2;

	var storedLines = [];
	// init();

	$(function() {
		// alert("init");
		canvas = $('#can');
        ctx = canvas[0].getContext("2d");
        imageCanvas = $('#imageCanvas');
        imageCtx = imageCanvas[0].getContext('2d');
        canvas.hide();
        imageCanvas.hide();

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

		var imageLoader = $('#imageLoader');
        imageLoader.change(function(e){
            // alert("changed");
            var reader = new FileReader();
            // alert("reader readyyy");
            reader.onload = function(event){
                // alert("reader ready");
                var img = new Image();
                img.onload = function(){
                	var MAX_WIDTH = 800;
					var MAX_HEIGHT = 600;
                    canvas.show();
                    imageCanvas.show();

                    w = img.width;
                    h = img.height;

                    // alert("old width: " + w);
                    var wFactor = 1,
                    hFactor = 1;

					if (w > h) {
					  if (w > MAX_WIDTH) {
					  	hFactor = MAX_WIDTH / w
					    h *= MAX_WIDTH / w;
					    w = MAX_WIDTH;
					  }
					} else {
					  if (h > MAX_HEIGHT) {
					  	wFactor = MAX_HEIGHT / h;
					    w *= MAX_HEIGHT / h;
					    h = MAX_HEIGHT;
					  }
					}
					// alert("new width: " + w);
					canvas[0].width = w;
                    canvas[0].height = h;
                    imageCanvas[0].width = w;
                    imageCanvas[0].height = h;
                    
     				// canvas.css({
     				// 	"width": wFactor*80+"%",
     				// 	"height": hFactor*60+"%"
     				// });

     				// imageCanvas.css({
     				// 	"width": wFactor*80+"%",
     				// 	"height": hFactor*60+"%"
     				// });

                     // alert("imageCanvas.width" + imageCanvas.width)
                    imageCtx.drawImage(img,0,0, w, h);
                }
                img.src = event.target.result;
            }
            reader.readAsDataURL(e.target.files[0]);
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
        var m = confirm("Do you want to clear?");
        if (m) {
            ctx.clearRect(0, 0, w, h);
            imageCtx.clearRect(0,0,w,h);
            canvas.hide();
            imageCanvas.hide();
            //Can replace the input file box with a fresh input. Must add the change listener back
            // $("#imageLoader").replaceWith("<input type='file' id='imageLoader' name='imageLoader' style='position:absolute;top:25%'/>");
            storedLines.length = 0;
            redrawStoredLines();
            // $("#canvasImg")[0].style.display = "none";
            $("#canvasImg").hide();
        }
    }

	function save() {
        // var dataURL = canvas[0].toDataURL();
        // $("#canvasImg").css({
        //     "border-width": "2px",
        //     "border-style": "solid"
        // });
        // $("#canvasImg").attr("src", dataURL);
        // $("#canvasImg").show();

        var drawingImg = new Image();
        drawingImg.src = canvas[0].toDataURL();
        var picImg = new Image();
        picImg.src = imageCanvas[0].toDataURL();

        var savCan = $("#savCanvas");
        var savCtx = savCan[0].getContext("2d");
        savCan[0].width = canvas[0].width;
        savCan[0].height = canvas[0].height;

        savCtx.drawImage(picImg, 0, 0);
        savCtx.drawImage(drawingImg, 0, 0);
        savCan.hide();
        // alert("finished drawing!");

        var dataURL = savCan[0].toDataURL();

        $("#canvasImg").css({
            "border-width": "2px",
            "border-style": "solid"
        });
        $("#canvasImg").attr("src", dataURL);
        $("#canvasImg").show();
    }

	function findxy(res, e) {
		// alert("findxy");
		if (res == 'down') {
			currX = e.pageX - canvas.offset().left;
			currY = e.pageY - canvas.offset().top;
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
			currX = e.pageX - canvas.offset().left;
			currY = e.pageY - canvas.offset().top;
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
			currX = e.pageX - canvas.offset().left;
			currY = e.pageY - canvas.offset().top;
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