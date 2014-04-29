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
	var calVal = 1;
	var ratio = 1;
	var linepixel = 1;
	// init();

	$(function() {
		// alert("init");
		canvas = $('#can');
        ctx = canvas[0].getContext("2d");
        imageCanvas = $('#imageCanvas');
        imageCtx = imageCanvas[0].getContext('2d');
        canvas.hide();
        imageCanvas.hide();
        $("#savCanvas").hide();
        // $("#downloadImgLink").hide();
        // $("#clr").hide();

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
		
		$('#cal').click(function(e){
			calibrate();
		});
		
		$('#sav').click(function(e){
			save();
		});
		$('#undo').click(function(e){
			undo();
		});

		$('#green').click(function(e){
			x="green";
			y=2;
		});

		$('#blue').click(function(e){
			x="blue";
			y=2;
		});

		$('#red').click(function(e){
			x="red";
			y=2;
		});

		$('#yellow').click(function(e){
			x="yellow";
			y=2;
		});

		$('#orange').click(function(e){
			x="orange";
			y=2;
		});

		$('#black').click(function(e){
			x="black";
			y=2;
		});

		$('#white').click(function(e){
			x="white";
			y=14;
		});

		addImageLoaderListener();

		$("#downloadImgLink").click(function(){
			save();
			$('#downloadImgLink').attr('href', savCanvas.toDataURL());
		});

		$("#exportDataLink").click(function(){
			// alert($("#table").html());
			var uri = $("#table").toCSV();
			$("#exportDataLink").attr("href", uri);
		});
    });

	function draw() {
		// alert("Draw");
		ctx.beginPath();
		// alert("Draw works");
		ctx.moveTo(prevX, prevY);
		ctx.lineTo(currX, currY);
		ctx.strokeStyle = $('#color').val();
		ctx.lineWidth = y;
		ctx.stroke();
		ctx.closePath();
	}
	function calibrate(){
		alert($('#units').val())
		var m = confirm("Do you want to Calibrate?");
		if (storedLines.length == 0) {
			alert("No line Drawn");
		}else{
			linepixel = storedLines[storedLines.length - 1].dist;
			ratio = linepixel/$('#textbox1').val();
			calVal = $('#textbox1').val();
			 $('table').replaceWith("<table class='CSSTableGenerator' id='table' style='border:3px solid;position:absolute; top: 23%; left: 20%;  width: 40%; margin-left: 700px'>" +
				"<tr>"+
					"<th> Start X </th>" +
					"<th> Start Y </th>" +
					"<th> End X </th>" +
					"<th> End Y </th>" +
					"<th> Distance </th>" +
				"</tr>" +
			"</table>");
			 
			
			 for (var i=0;i<storedLines.length;i++)
				{
				storedLines[i].calDist = storedLines[i].dist/ratio;
				$('table').append(
				"<tr><td><font color='" + storedLines[i].xColor + "'>" + storedLines[i].x1 + "</font>" + 
				"</td><td><font color='" + storedLines[i].xColor + "'>" + storedLines[i].y1 + "</font>" + 
				"</td><td><font color='" + storedLines[i].xColor + "'>" + storedLines[i].x2 + "</font>" + 
				"</td><td><font color='" + storedLines[i].xColor + "'>" + storedLines[i].xy + "</font>" + 
				"</td><td><font color='" + storedLines[i].xColor + "'>"+ storedLines[i].calDist + " " + $('#units').val()+ "</font>"+ 
				"</td></tr>");
				}
				
			
			
		}
		
	}
	function erase() {
        var m = confirm("Do you want to clear?");
        if (m) {
            ctx.clearRect(0, 0, w, h);
            imageCtx.clearRect(0,0,w,h);
            canvas.hide();
            imageCanvas.hide();
            $('table').replaceWith("<table class='CSSTableGenerator' id='table' style='border:3px solid;position:absolute; top: 23%; left: 20%;  width: 40%; margin-left: 700px'>" +
				"<tr>"+
					"<th> Start X </th>" +
					"<th> Start Y </th>" +
					"<th> End X </th>" +
					"<th> End Y </th>" +
					"<th> Distance </th>" +
				"</tr>" +
			"</table>");
            // $("#downloadImgLink").hide();

            //Can replace the input file box with a fresh input. Must add the change listener back
            $("#imageLoader").replaceWith("<input type='file' id='imageLoader' name='imageLoader' style='position:absolute;top:25%'/>");
            addImageLoaderListener();
            storedLines.length = 0;
            redrawStoredLines();
            // $("#canvasImg")[0].style.display = "none";
            $("#canvasImg").hide();
            // $("#clr").hide();
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
        // savCan.hide();
        // alert("finished drawing!");

        var dataURL = savCan[0].toDataURL();
        return dataURL;

        // $("#canvasImg").css({
        //     "border-width": "2px",
        //     "border-style": "solid"
        // });
        // $("#canvasImg").attr("src", dataURL);
        // $("#canvasImg").show();
    }

	function undo() {
		storedLines.pop();
		var tr = $(this).closest('tr');
		tr.remove();
		redrawStoredLines();
		drawTable();
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
			distance = lineDistance(currX, currY, prevX, prevY, ratio);
			storedLines.push({
				x1: prevX,
				y1: prevY,
				x2: currX,
				y2: currY,
				dist: distance*ratio,
				calDist: distance,
				xColor: $('#color').val(),
				yColor: y,
			});
			
			redrawStoredLines();
			drawTable();

			// $('table').append("<tr><td>" + prevx + "</td>" + 
			// "<td>" + prevy + "</td><td>" + currx + "</td><td>" +
			// curry + "</td><td>" + distance + "</td></tr>");
		
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
	
	function drawTable() {
		$('table').replaceWith(
			"<table class='CSSTableGenerator' id='table' style='border:3px solid;position:absolute; top: 23%; left: 20%;  width: 40%; margin-left: 700px'>" +
				"<tr>"+
					"<th> Start X </th>" +
					"<th> Start Y </th>" +
					"<th> End X </th>" +
					"<th> End Y </th>" +
					"<th> Distance </th>" +
				"</tr>" +
			"</table>");
			
		for (var i = 0; i < storedLines.length; i++) {
			$('table').append(
				"<tr><td><font color='" + storedLines[i].xColor + "'>" + storedLines[i].x1 + "</font>" + 
				"</td><td><font color='" + storedLines[i].xColor + "'>" + storedLines[i].y1 + "</font>" + 
				"</td><td><font color='" + storedLines[i].xColor + "'>" + storedLines[i].x2 + "</font>" + 
				"</td><td><font color='" + storedLines[i].xColor + "'>" + storedLines[i].y2 + "</font>" + 
				"</td><td><font color='" + storedLines[i].xColor + "'>"+ storedLines[i].calDist + " " + $('#units').val()+ "</font>"+ 
				"</td></tr>");
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
			ctx.strokeStyle = storedLines[i].xColor;
			ctx.lineWidth = storedLines[i].yColor;
			ctx.stroke();
		}
	}
	
	function lineDistance(x1, y1, x2, y2, ratio) {
		
		var xs = 0;
		var ys = 0;
		
			xs = x2 - x1;
			xs = xs * xs;

			ys = y2 - y1;
			ys = ys * ys;

			return Math.sqrt( xs + ys )/ratio;
		
		
	}

	function addImageLoaderListener(){
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
                    $("#downloadImgLink").show();
                    $("#clr").show();

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
	}

	jQuery.fn.toCSV = function() {
	  var data = $(this).first(); //Only one table
	  var csvData = [];
	  var tmpArr = [];
	  var tmpStr = '';
	  data.find("tr").each(function() {
	      if($(this).find("th").length) {
	          $(this).find("th").each(function() {
	            tmpStr = $(this).text().replace(/"/g, '""');
	            tmpArr.push('"' + tmpStr + '"');
	          });
	          csvData.push(tmpArr);
	      } else {
	          tmpArr = [];
	             $(this).find("td").each(function() {
	                  if($(this).text().match(/^-{0,1}\d*\.{0,1}\d+$/)) {
	                      tmpArr.push(parseFloat($(this).text()));
	                  } else {
	                      tmpStr = $(this).text().replace(/"/g, '""');
	                      tmpArr.push('"' + tmpStr + '"');
	                  }
	             });
	          csvData.push(tmpArr.join(','));
	      }
	  });
	  var output = csvData.join('\n');
	  var uri = 'data:application/csv;charset=UTF-8,' + encodeURIComponent(output);
	  return uri;
	  // window.open(uri);
	}

});