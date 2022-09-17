var gl, program;
var points;
var SIZE; 

function main() {
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { console.log( "WebGL isn't available" ); return; }

	var center= vec2(0.0, 0.0);  // location of the center of the circle
    var radius = 0.5;    // radius of the inner circle
    var Radius = 1.;   //radius of outer circle
    points = GeneratePoints(center, radius, Radius);
    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
 	if (!program) { console.log('Failed to intialize shaders.'); return; }
	gl.useProgram( program );
    
    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};


// generate points to draw a symbol from two concentric circles, 
// the inner circle one with radius, the outer circle with Radius 
// centered at (center[0], center[1]) using GL_Line_STRIP
function GeneratePoints(center, radius, Radius)
{
    SIZE=100;
    var angle = 2*Math.PI/SIZE;

    var vertices=[];
    for  (var i=0; i<SIZE+1; i++) {
	    console.log(center[0]+Radius*Math.cos(i*angle));
	    vertices.push([center[0]+Radius*Math.cos(i*angle), 
		               center[1]+Radius*Math.sin(i*angle)]);
	}
    SIZE=6; // slices

    var angle = 2*Math.PI/SIZE;


    for (var i=0; i<SIZE; i++) {
        // point from outer circle
        vertices.push(vec2(center[0]+radius*Math.cos(i*angle), center[1]+radius*Math.sin(i*angle)));

       // point from inner circle
        vertices.push(vec2(center[0]+Radius*Math.cos((i*angle)+Math.PI/SIZE), center[1]+Radius*Math.sin((i*angle)+Math.PI/SIZE)));
    }
    vertices.push(vec2(center[0]+radius*Math.cos(0), center[1]+radius*Math.sin(0)));

    return vertices;
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    gl.uniform1i(gl.getUniformLocation(program, "colorIndex"), 2);
    gl.drawArrays( gl.LINE_STRIP, 0, 101);
    gl.drawArrays( gl.LINE_STRIP, 101, 13);
}