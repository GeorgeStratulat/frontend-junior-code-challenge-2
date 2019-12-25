// CAN\NVAS.js plugin
(() => {
  /**
   * CAN\VAS Plugin - Adding line breaks to canvas
   * @arg {string} [str=Hello World] - text to be drawn
   * @arg {number} [x=0]             - top left x coordinate of the text
   * @arg {number} [y=textSize]      - top left y coordinate of the text
   * @arg {number} [w=canvasWidth]   - maximum width of drawn text
   * @arg {number} [lh=1]            - line height
   * @arg {number} [method=fill]     - text drawing method, if 'none', text will not be rendered
   */

  CanvasRenderingContext2D.prototype.drawBreakingText = function(
    str,
    x,
    y,
    w,
    lh,
    method
  ) {
    var textSize = parseInt(this.font.replace(/\D/gi, ""), 10);
    var textParts = [];
    var textPartsNo = 0;
    var words = [];
    var currLine = "";
    var testLine = "";
    str = str || "";
    x = x || 0;
    y = y || 0;
    w = w || this.canvas.width;
    lh = lh || 1;
    method = method || "fill";

    textParts = str.split("\n");
    textPartsNo = textParts.length;

    for (var i = 0; i < textParts.length; i++) {
      words[i] = textParts[i].split(" ");
    }

    textParts = [];

    for (var i = 0; i < textPartsNo; i++) {
      currLine = "";

      for (var j = 0; j < words[i].length; j++) {
        testLine = currLine + words[i][j] + " ";

        if (this.measureText(testLine).width > w && j > 0) {
          textParts.push(currLine);
          currLine = words[i][j] + " ";
        } else {
          currLine = testLine;
        }
      }
      textParts.push(currLine);
    }

    for (var i = 0; i < textParts.length; i++) {
      if (method === "fill") {
        this.fillText(
          textParts[i].replace(/((\s*\S+)*)\s*/, "$1"),
          x,
          y + textSize * lh * i
        );
      } else if (method === "stroke") {
        this.strokeText(
          textParts[i].replace(/((\s*\S+)*)\s*/, "$1"),
          x,
          y + textSize * lh * i
        );
      } else if (method === "none") {
        return {
          textParts: textParts,
          textHeight: textSize * lh * textParts.length
        };
      } else {
        console.warn("drawBreakingText: " + method + "Text() does not exist");
        return false;
      }
    }

    return {
      textParts: textParts,
      textHeight: textSize * lh * textParts.length
    };
  };
})(window, document);

var canvas = document.createElement("canvas");
var canvasWrapper = document.getElementById("canvasWrapper");
canvasWrapper.appendChild(canvas);
canvas.width = 500;
canvas.height = 500;
var context = canvas.getContext("2d");
var padding = 15;
var textFont = "Impact";
var textTop = "";
var textBottom = "";
var textSizeTop = 10;
var textSizeBottom = 10;
var textColor = "#ffffff";
var image = document.createElement("img");

image.onload = () => {
  canvas.outerHTML = "";
  canvas = document.createElement("canvas");
  canvasWrapper.appendChild(canvas);
  context = canvas.getContext("2d");
  draw();
};

document.getElementById("imgFile").onchange = function(ev) {
  var reader = new FileReader();
  reader.onload = () => {
    image.src = reader.result;
  };
  reader.readAsDataURL(this.files[0]);
};

document.getElementById("textFontSelect").onchange = ev => {
  textFont = ev.target.value;
  draw();
};

document.getElementById("textTop").oninput = ev => {
  textTop = ev.target.value;
  draw();
};

document.getElementById("textBottom").oninput = ev => {
  textBottom = ev.target.value;
  draw();
};

document.getElementById("textSizeTop").oninput = ev => {
  textSizeTop = parseInt(ev.target.value, 10);
  draw();
  document.getElementById("textSizeTopOut").innerHTML = parseInt(
    ev.target.value,
    10
  );
};

document.getElementById("textSizeBottom").oninput = ev => {
  textSizeBottom = parseInt(ev.target.value, 10);
  draw();
  document.getElementById("textSizeBottomOut").innerHTML = parseInt(
    ev.target.value,
    10
  );
};

document.getElementById("textColorPicker").onchange = ev => {
  textColor = ev.target.value;
  draw();
};

document.getElementById("export").onclick = () => {
  var img = canvas.toDataURL("image/png");
  var link = document.createElement("a");
  link.download = "My Meme";
  link.href = img;
  link.click();
};

style = (font, size, align, base) => {
  context.font = size + "px " + font;
  context.textAlign = align;
  context.textBaseline = base;
};

draw = () => {
  var top = textTop.toUpperCase();
  var bottom = textBottom.toUpperCase();

  canvas.width = image.width;
  canvas.height = image.height;

  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  context.fillStyle = textColor;
  context.strokeStyle = "#000";
  context.lineWidth = canvas.width * 0.004;

  var _textSizeTop = (textSizeTop / 100) * canvas.width;
  var _textSizeBottom = (textSizeBottom / 100) * canvas.width;

  // draw top text
  style(textFont, _textSizeTop, "center", "bottom");
  context.drawBreakingText(
    top,
    canvas.width / 2,
    _textSizeTop + padding,
    null,
    1,
    "fill"
  );
  context.drawBreakingText(
    top,
    canvas.width / 2,
    _textSizeTop + padding,
    null,
    1,
    "stroke"
  );

  // draw bottom text
  style(textFont, _textSizeBottom, "center", "top");
  var height = context.drawBreakingText(bottom, 0, 0, null, 1, "none")
    .textHeight;
  context.drawBreakingText(
    bottom,
    canvas.width / 2,
    canvas.height - padding - height,
    null,
    1,
    "fill"
  );
  context.drawBreakingText(
    bottom,
    canvas.width / 2,
    canvas.height - padding - height,
    null,
    1,
    "stroke"
  );
};

image.src =
  "http://www.baytownmotors.com/wp-content/uploads/2013/11/dummy-image-square.jpg";
document.getElementById("textSizeTop").value = textSizeTop;
document.getElementById("textSizeBottom").value = textSizeBottom;
document.getElementById("textSizeTopOut").innerHTML = textSizeTop;
document.getElementById("textSizeBottomOut").innerHTML = textSizeBottom;
