define(function(require/*, exports, module*/) {
    'use strict';

    var gl = require('three');
    var Stats = require('stats');

    var stats = new Stats();
    document.body.appendChild(stats.domElement);

    const V = 0.015; // velocity delta
    const Z = 0.0001; // zoom delta

    var size = new gl.Vector2(innerWidth, innerHeight);
    var position = new gl.Vector3(0.001, 0.001, 0.1);
    var velocity = new gl.Vector3(0, 0, 0);
    var acceleration = new gl.Vector3(0, 0, 0);
    var friction = new gl.Vector3(0.90, 0.50, 0.999);
    var config = new gl.Vector3(1000, 0, 0); // iterations / not used / not used
    var isRunning = false;

    var canvas = document.querySelector('canvas');
    var renderer = new gl.WebGLRenderer({ canvas: canvas });
    renderer.setSize(size.x, size.y);

    var camera = new gl.PerspectiveCamera(45, size.x/size.y, 0.1, 100);
    camera.position.set(0, 0, 1);
    camera.lookAt(new gl.Vector3(0, 0, 0));

    var scene = new gl.Scene();
    var box = new gl.Mesh(
        new gl.BoxGeometry(1, size.y/size.x, 1),
        new gl.ShaderMaterial({
            vertexShader:   require('text!./shaders/mandelbrot.vertex.glsl'),
            fragmentShader: require('text!./shaders/mandelbrot.fragment.glsl'),
            uniforms: {
                size:   { type: 'v2', value: size },
                pos:    { type: 'v3', value: position },
                config: { type: 'v3', value: config }
            }
        })
    );
    scene.add(box);
    renderer.render(scene, camera);
    start();

    ///////////////////////////////////

    function start() {
        console.log('start');
        config.x = 100;
        isRunning = true;
        loop();
    }

    function stop() {
        console.log('stop');
        config.x = 1000;
        isRunning = false;
        render();
    }

    function loop() {
        stats.begin();
        if (isRunning) {
            requestAnimationFrame(loop);
            step();
            render();
        }
        stats.end();
    }

    function step() {
        if (isRunning) {

            position.x += velocity.x / Math.exp(position.z);
            position.y += velocity.y / Math.exp(position.z);
            position.z += velocity.z;

            velocity
                .add(acceleration)
                .multiply(friction)
            ;

            if (position.z < 0.1) {
                position.z = 0.1;
                velocity.set(0, 0, 0);
                acceleration.set(0, 0, 0);
            }

            if (velocity.length() == 0) {
                stop();
            }

        }
    }

    function render() {
        renderer.render(scene, camera);
    }

    ///////////////////////////////////////////////////////

    function onKeyDown(e) {
        switch (e.keyCode) {
            case 87: // w
                velocity.y = V;
                break;
            case 83: // s
                velocity.y = -V;
                break;
            case 65: // a
                velocity.x = -V;
                break;
            case 68: // d
                velocity.x = V;
                break;
            case 38: // up
                acceleration.z += Z;
                break;
            case 40: // down
                acceleration.z -= Z;
                break;
        }
        if (!isRunning) {
            start();
        }
    }

    function onKeyUp(e) {
        switch (e.keyCode) {
            case 32: // space
                if (!isRunning) {
                    start();
                } else {
                    velocity.set(0, 0, 0);
                    acceleration.set(0, 0, 0);
                }
                break;
            case 87: // w
            case 83: // s
                acceleration.y = 0;
                break;
            case 65: // a
            case 68: // d
                acceleration.x = 0;
                break;
            case 38: // up
            case 40: // down
                acceleration.z = 0;
                break;
        }
        console.log(e.keyCode);
    }

    ////////////////////////

    addEventListener('keydown', onKeyDown);
    addEventListener('keyup', onKeyUp);

});