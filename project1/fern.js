// Riley Welch
// Interactive fern

// generate 100,000 points for two ferns
// allow color change with key press 'c' and change between fern on mouse click

var gl, program;
// to store points
var finalPoints;
// number of points
var SIZE=100000;
// choose color for display, press key 'c'
var color=1;
// boolean to choose pattern of fern for display, mouse click
var fern= true;

function main() {
  var canvas = document.getElementById( "gl-canvas" );

  gl = WebGLUtils.setupWebGL( canvas );
  if ( !gl ) { console.log( "WebGL isn't available" ); return; }

  // call function generatePoints to return the points for two ferns
  finalPoints = generatePoints();

  //  Configure WebGL
  gl.viewport( 0, 0, canvas.width, canvas.height );
  gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

  program = initShaders( gl, "vertex-shader", "fragment-shader" );
  // debugging message
  if (!program) { console.log("Failed to intialize shaders."); return; }
  gl.useProgram( program );

  // Load the data
  var bufferId = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(finalPoints), gl.STATIC_DRAW );

  var vPosition = gl.getAttribLocation( program, "vPosition" );
  gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  // mouse click event handler
  canvas.addEventListener("mousedown", function() {
    // negate fern variable
    fern = !fern;
    // draws new fern
    render();
  });

  // event handler for a keypress
  window.addEventListener("keydown", function() {
    // if 'c' is pressed
    if (event.keyCode == 67) {
      // changes color
      if (color == 1)
        color = 0;
      // changes color
      else
        color = 1;
      // draw shape again with render function call
      render();
    }
  });

  // draw shape
  render();
};

// this function generates points for two different ferns
function generatePoints() {
  var x = 0;  
  var y = 0;  
  var x2, y2; // temp variables to store next
  var vertices = [];  // array to store coordinate pairs
  // min/max x and y values for each fern
  var xMin, xMax, yMin, yMax;
  var xMin2, xMax2, yMin2, yMax2;

  // generate 100000 points
  for (var i=0; i<SIZE; i++) {
    // generate random number between 0-1
    r = Math.random();

    // x2 = a * x + b * y + e
    // y2 = c * x + d * y + f
    if (r <= 0.1) {
      x2 = 0.0;
      y2 = 0.16 * y;
    }
    else if (r <= 0.18) {
      x2 = 0.2 * x - 0.26 * y;
      y2 = 0.23 * x + 0.22 * y + 1.6;
    }
    else if (r <= 0.26) {
      x2 = -0.15 * x + 0.28 * y;
      y2 = 0.26 * x + 0.24 * y + 0.44;
    }
    else {
      x2 = 0.75 * x + 0.04 * y;
      y2 = -0.04 * x + 0.85 * y + 1.6;
    }

    // get the minimum and maximum values of x and y
    if (i==0)
    {
      xMin = x2;
      xMax = x2;
      yMin = y2;
      yMax = y2;
    }
    else {
      // new x-min found
      if (x2<xMin)
        xMin = x2;
        // new x-max found
      else if (x2>xMax)
        xMax = x2;

      // new y-min found
      if (y2<yMin)
        yMin = y2;
      // new y-max found
      else if (y2>yMax)
        yMax = y2;
    }

    // update x to get next point
    x = x2;
    y = y2;

    // add points to array
    vertices.push([x,y]);
  }

  // generates 100000 points for the second fern
  for (var i=0; i<SIZE; i++) {
    // generate random number between 0-1
    r = Math.random();

    // x2 = a * x + b * y + e
    // y2 = c * x + d * y + f
    if (r <= 0.01) {
      x2 = 0.0;
      y2 = 0.16 * y;
    }
    else if (r <= 0.08) {
      x2 = 0.2 * x - 0.26 * y;
      y2 = 0.23 * x + 0.22 * y + 1.6;
    }
    else if (r <= 0.15) {
      x2 = -0.15 * x + 0.28 * y;
      y2 = 0.26 * x + 0.24 * y + 0.44;
    }
    else {
      x2 = 0.85 * x + 0.04 * y;
      y2 = -0.04 * x + 0.85 * y + 1.6;
    }

    // get the min/max values of x and y for second fern
    if (i==0)
    {
      xMin2 = x2;
      xMax2 = x2;
      yMin2 = y2;
      yMax2 = y2;
    }
    else {
      // new x-min found
      if (x2<xMin2)
        xMin2 = x2;
      // new x-max found
      else if (x2>xMax2)
        xMax2 = x2;
      // new y-min found
      if (y2<yMin2)
        yMin2 = y2;
      // new y-max found
      else if (y2>yMax2)
        yMax2 = y2;
    }

    // update x to start next point calculation
    x = x2;
    y = y2;

    // add points to array
    vertices.push([x2,y2]);
  }

  //change points to be in the range [-1,1]
  vertices = convertPoints(vertices,xMin,xMax,yMin,yMax,
                            xMin2,xMax2,yMin2,yMax2);

  // return final point values
  return vertices;
}

// this function takes existing points and scales them to points within
// the range [-1,1]
function convertPoints( vertices, xmin, xmax, ymin, ymax,
                        xmin2, xmax2, ymin2, ymax2) {
  // loop through first 100000 points to scale the first fern and skip through first 30
  for(var i=30; i<SIZE-1; i++) {
    // (y(i) - ymin) / (ymax-ymin) * 2 - 1
    vertices[i][0] = ((vertices[i][0]-xmin) / (xmax-xmin)) * 2 - 1;
    vertices[i][1] = ((vertices[i][1]-ymin) / (ymax-ymin)) * 2 - 1;
  }
  //repeat for second fern and skip first 30
  for(var i=SIZE+30; i<SIZE*2-1; i++) {
    vertices[i][0] = ((vertices[i][0]-xmin2) / (xmax2-xmin2)) * 2 - 1;
    vertices[i][1] = ((vertices[i][1]-ymin2) / (ymax2-ymin2)) * 2 - 1;
  }

  // return update coordinate values
  return vertices;
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    // if statement to produce new fern when mouse is clicked
    if (fern == true) {
      gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), color);
      gl.drawArrays(gl.POINTS,0, SIZE);
    }
    else {
      gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), color);
      gl.drawArrays(gl.POINTS,SIZE, SIZE);
    }
}