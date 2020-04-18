var canvas = document.getElementById("canvas");
var nodes = [];
var edgeMode = false;
var arrowTargetX = 0;
var arrowTargetY = 0;
const timeInit = new Date().getSeconds();
const nodeRadius = 18;
if (canvas.getContext) {
  var ctx = canvas.getContext("2d");
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  canvas.addEventListener("mousedown", canvasClick, false);
  canvas.addEventListener("mousemove", mouseMove, false);
  window.requestAnimationFrame(draw);
}

function canvasClick(event) {
  var nodeClicked = getNodeClicked(event.x, event.y, nodes);
  if (nodeClicked == null) {
    nodes.push(new Node(0, event.x, event.y));
    console.log("length / first el: " + nodes.length + "/" + nodes[0].counter);
  } else {
    nodeClicked.isEdgeStart = true;
    console.log("hit other node");
  }
}

function draw() {
  var ctx = canvas.getContext("2d");
  if (canvas.getContext) {
    ctx.clearRect(0, 0, window.innerWidth * 2, window.innerHeight * 2);
    for (var i = 0; i < nodes.length; i++) {
      ctx.beginPath();
      ctx.lineWidth = 8;
      if (nodes[i].isEdgeStart) {
        ctx.strokeStyle = "#FA5750";
        ctx.fillStyle = "white";
      } else {
        ctx.strokeStyle = "#32BFE3";
        ctx.fillStyle = "#32BFE3";
      }

      var oscillator = Math.cos(nodes[i].counter / 2 + 8); // oscillates -1.0 to 1.0
      var dampener = Math.min(1, 1 / (nodes[i].counter / 2)) + 0.05;
      var dampener2 = Math.min(1, 1 / (nodes[i].counter / 10));
      var radius = Math.max(
        1,
        30 * oscillator * dampener * dampener2 + nodeRadius
      );
      ctx.arc(nodes[i].x, nodes[i].y, radius, 0, Math.PI * 2, false);
      ctx.stroke();
      ctx.fill();
      // prevent overflow, don't increment indefinitely
      if (nodes[i].counter < 1000) {
        nodes[i].counter += 1;
      }
    }
  }
  //ctx.arc(500, 400, 300, 0, -Math.PI * 0.5, true);

  //ctx.fill();
  window.requestAnimationFrame(draw);
}

function Node(counter, x, y, randColor) {
  this.counter = counter;
  this.x = x;
  this.y = y;
  this.isEdgeStart = false;
  this.isHover = false;
}

function getNodeClicked(x, y, nodes) {
  for (var i = 0; i < nodes.length; i++) {
    var dx = x - nodes[i].x;
    var dy = y - nodes[i].y;
    var distFromCent = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    if (distFromCent < nodeRadius * 2) {
      return nodes[i];
    }
  }
  return null;
}

function mouseMove(event) {
  arrowTargetX = event.x;
  arrowTargetY = event.y;
}
