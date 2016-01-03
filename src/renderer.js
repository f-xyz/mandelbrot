define(function (require, exports, module) {
    'use strict';

    const V = 0.015; // velocity delta
    const Z = 0.0001; // zoom delta

    var gl = require('three');
    var stats = require('./stats');

    class Renderer {

        constructor() {
            this._initProperties();
            this._initRenderer();
            this._initCamera();
            this._initScene();
            this._initControls();
        }

        _initProperties() {
            this.size = new gl.Vector2(innerWidth, innerHeight);
            this.position = new gl.Vector3(0.001, 0.001, 0.1);
            this.velocity = new gl.Vector3(0, 0, 0);
            this.acceleration = new gl.Vector3(0, 0, 0);
            this.friction = new gl.Vector3(0.90, 0.50, 0.999);
            this.config = new gl.Vector3(1000, 0, 0); // iterations / not used / not used
            this.isRunning = false;
        }

        _initRenderer() {
            this.canvas = document.querySelector('canvas');
            this.renderer = new gl.WebGLRenderer({ canvas: this.canvas });
            this.renderer.setSize(this.size.x, this.size.y);
        }

        _initCamera() {
            this.camera = new gl.PerspectiveCamera(45, this.size.x / this.size.y, 0.1, 100);
            this.camera.position.set(0, 0, 1);
            this.camera.lookAt(new gl.Vector3(0, 0, 0));
        }

        _initScene() {
            this.scene = new gl.Scene();
            this.box = new gl.Mesh(
                new gl.BoxGeometry(1, this.size.y / this.size.x, 1),
                new gl.ShaderMaterial({
                    vertexShader:   require('text!../shaders/mandelbrot.vertex.glsl'),
                    fragmentShader: require('text!../shaders/mandelbrot.fragment.glsl'),
                    uniforms: {
                        size:   { type: 'v2', value: this.size },
                        pos:    { type: 'v3', value: this.position },
                        config: { type: 'v3', value: this.config }
                    }
                })
            );
            this.scene.add(this.box);
        }

        render() {
            this.renderer.render(this.scene, this.camera);
        }

        start() {
            console.log('start');
            this.config.x = 100;
            this.isRunning = true;
            this.loop();
        }

        stop() {
            console.log('stop');
            this.config.x = 1000;
            this.isRunning = false;
            this.render();
        }

        loop() {
            stats.begin();
            if (this.isRunning) {
                requestAnimationFrame(this.loop.bind(this));
                this.step();
                this.render();
            }
            stats.end();
        }

        step() {

            if (!this.isRunning) return;

            this.position.x += this.velocity.x / Math.exp(this.position.z);
            this.position.y += this.velocity.y / Math.exp(this.position.z);
            this.position.z += this.velocity.z;

            this.velocity
                .add(this.acceleration)
                .multiply(this.friction)
            ;

            if (this.position.z < 0.1) {
                this.position.z = 0.1;
                this.velocity.set(0, 0, 0);
                this.acceleration.set(0, 0, 0);
            }

            if (this.velocity.length() == 0) {
                this.stop();
            }

        }

        _initControls() {
            addEventListener('keydown', this._onKeyDown.bind(this));
            addEventListener('keyup', this._onKeyUp.bind(this));
        }

        _onKeyDown(e) {
            switch (e.keyCode) {
                case 87: // w
                    this.velocity.y = V;
                    break;
                case 83: // s
                    this.velocity.y = -V;
                    break;
                case 65: // a
                    this.velocity.x = -V;
                    break;
                case 68: // d
                    this.velocity.x = V;
                    break;
                case 38: // up
                    this.acceleration.z += Z;
                    break;
                case 40: // down
                    this.acceleration.z -= Z;
                    break;
            }
            if (!this.isRunning) {
                this.start();
            }
        }

        _onKeyUp(e) {
            switch (e.keyCode) {
                case 32: // space
                    if (!this.isRunning) {
                        this.start();
                    } else {
                        this.velocity.set(0, 0, 0);
                        this.acceleration.set(0, 0, 0);
                    }
                    break;
                case 87: // w
                case 83: // s
                    this.acceleration.y = 0;
                    break;
                case 65: // a
                case 68: // d
                    this.acceleration.x = 0;
                    break;
                case 38: // up
                case 40: // down
                    this.acceleration.z = 0;
                    break;
            }
        }

    }

    module.exports = Renderer;

});