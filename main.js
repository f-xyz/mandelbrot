require.config({
    urlArgs: Date.now(),
    baseUrl: './',
    paths: {
        three: 'lib/three',
        text: 'lib/text'
    },
    shim: {
        three: { exports: 'THREE' }
    }
});

define(function(require) {

    var gl = require('three');

    var size = new gl.Vector2(innerWidth, innerHeight);
    var position = new gl.Vector2(0, 0);
    var zoom = new gl.Vector2(1, 0);
    var velocity = new gl.Vector3(0, 0, 0);
    var velocityLimit = Infinity;
    var acceleration = new gl.Vector3(0, 0, 0);
    var accelerationLimit = Infinity;
    var accelerationDelta = 0.00001;
    var friction = new gl.Vector3(0.95, 0.95, 0.99);
    var args = new gl.Vector3(100, 0, 0);
    var running = false;

    var canvas = document.querySelector('canvas');
    var renderer = new gl.WebGLRenderer({ canvas: canvas });
    renderer.setSize(size.x, size.y);

    var camera = new gl.PerspectiveCamera(
        45,
        size.x / size.y,
        0.1,
        100
    );
    camera.position.set(0, 0, 1);
    camera.lookAt(new gl.Vector3(0, 0, 0));

    var scene = new gl.Scene();

    ///////////////////////////////////

    var box = new gl.Mesh(
        new gl.BoxGeometry(1, size.y / size.x, 1),
        //new t.MeshNormalMaterial(),
        new gl.ShaderMaterial({
            vertexShader:   require('text!./shaders/mandelbrot.vertex.glsl'),
            fragmentShader: require('text!./shaders/mandelbrot.fragment.glsl'),
            uniforms: {
                args: { type: 'v3', value: args },
                zoom: { type: 'v2', value: zoom },
                size: { type: 'v2', value: size },
                pos:  { type: 'v2', value: position }
            }
        })
    );
    scene.add(box);
    renderer.render(scene, camera);

    //start();

    ///////////////////////////////////

    function start() {
        console.log('start');
        running = true;
        loop();
    }

    function stop() {
        console.log('stop');
        running = false;
    }

    function loop() {
        if (running) {
            requestAnimationFrame(loop);
            step();
            render();
        }
    }

    function step() {
        if (running) {

            position.x += velocity.x / zoom.x / Math.exp(zoom.x) * 4*Math.E;
            position.y += velocity.y / zoom.x / Math.exp(zoom.x) * 4*Math.E;
            position.z += velocity.z / zoom.x / Math.exp(zoom.x) * 4*Math.E;

            velocity
                .add(acceleration)
                .multiply(friction);

            zoom.x += velocity.z;

            if (zoom.x < 0.1) {
                velocity.set(0, 0, 0);
                acceleration.set(0, 0, 0);
                zoom.x = 0.1;
            }
        }
    }

    function render() {
        renderer.render(scene, camera);
    }

    ///////////////////////////////////////////////////////

    function onMouseMove(e) {
        //mouse.x = 2 * e.clientX / size.x - 1;
        //mouse.y = 2 * e.clientY / size.y - 1;
        //lastMouse = mouse.clone();
    }

    function onMouseWheel(e) {
        //zoom.x = zoom.x - e.wheelDelta/-1200;
        //zoom.x = Math.max(0.25, zoom.x);
    }

    function onKeyDown(e) {
        switch (e.keyCode) {
            case 87: // w
                acceleration.z += 0.00001;
                break;
            case 83: // s
                acceleration.z -= 0.00001;
                break;
            case 38: // up
                velocity.y = 0.01;
                break;
            case 39: // right
                velocity.x = 0.01;
                break;
            case 40: // down
                velocity.y = -0.01;
                break;
            case 37: // left
                velocity.x = -0.01;
                break;
        }
    }

    function onKeyUp(e) {
        switch (e.keyCode) {
            case 32: // space
                if (!running) {
                    start();
                } else {
                    stop();
                }
                break;
            case 87: // w
            case 83: // s
                acceleration.z = 0;
                break;
            case 38: // up
            case 40: // down
                acceleration.y = 0;
                break;
            case 39: // right
            case 37: // left
                acceleration.x = 0;
                break;
        }
    }

    ////////////////////////

    addEventListener('mousemove', onMouseMove);
    addEventListener('mousewheel', onMouseWheel);
    addEventListener('keydown', onKeyDown);
    addEventListener('keyup', onKeyUp);
});