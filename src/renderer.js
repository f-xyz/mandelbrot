define(function (require, exports, module) {
    'use strict';

    const V = 0.015; // velocity delta
    const Z = 0.00001; // zoom delta
    const MIN_ZOOM = 0.1;
    const MAX_ZOOM = 11; // GPU register size limit :/
    const MAX_VELOCITY = 0.01;
    const MAX_ITERATIONS = 100;

    var gl = require('three');
    var stats = require('./stats');

    class Renderer {

        constructor() {
            this._initProperties();
            this._initRenderer();
            this._initCamera();
            this._initScene();
            this._initControls();
            this._initUi();
            this.render();
            this.start();
        }

        _initProperties() {
            this.size = new gl.Vector2(innerWidth, innerHeight);
            this.position = new gl.Vector3(-0.3483002946699772, 0.6611475123024879);
            this.velocity = new gl.Vector3(0, 0, 0);
            this.acceleration = new gl.Vector3(0, 0, 0);
            this.config = new gl.Vector3(MAX_ITERATIONS, 0, 0); // iterations / not used / not used
            this.isRunning = false;
            this.time = 0;
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
            this.shader = new gl.ShaderMaterial({
                vertexShader:   require('text!../shaders/mandelbrot.vertex.glsl'),
                fragmentShader: require('text!../shaders/mandelbrot.fragment.glsl'),
                uniforms: {
                    time:   { type: 'f', value: this.time },
                    size:   { type: 'v2', value: this.size },
                    pos:    { type: 'v3', value: this.position },
                    config: { type: 'v3', value: this.config }
                }
            });
            this.box = new gl.Mesh(
                new gl.BoxGeometry(1, this.size.y / this.size.x, 1),
                this.shader
            );
            this.scene.add(this.box);
        }

        render() {
            this.renderer.render(this.scene, this.camera);
        }

        start() {
            console.log('started');
            this.config.x = MAX_ITERATIONS;
            this.config.y = 1;
            this.isRunning = true;
            this._loop();
        }

        stop() {
            console.log('stopped at position and zoom');
            console.log([this.position.x, this.position.y, this.position.z].join(', '));
            this.config.x = MAX_ITERATIONS * 2;
            this.config.y = 0;
            this.isRunning = false;
            this.render();
        }

        _loop() {
            stats.begin();
            if (this.isRunning) {
                requestAnimationFrame(this._loop.bind(this));
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

            if (this.velocity.length() <= MAX_VELOCITY) {
                this.velocity.add(this.acceleration);
            }

            // min or max zoom - stop
            if (this.position.z < MIN_ZOOM) {
                this.position.z = MIN_ZOOM;
                this.velocity.set(0, 0, 0);
                this.acceleration.set(0, 0, 0);
            }

            // max zoom - stop
            if (this.position.z > MAX_ZOOM) {
                this.position.z = MAX_ZOOM;
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
                    this.acceleration.z -= Z*2;
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
                    this.velocity.y = 0;
                    break;
                case 65: // a
                case 68: // d
                    this.velocity.x = 0;
                    break;
                case 38: // up
                case 40: // down
                    this.acceleration.z = 0;
                    break;
            }
        }

        _initUi() {
            this.select = document.querySelector('select');
            this.select.addEventListener('change', this._onCoordsSelected.bind(this));
            this._onCoordsSelected();
        }

        _onCoordsSelected() {
            this.select.blur();
            var coords = this.select.value.match(/[-.\d]+/g).map(Number);
            this.position.x = coords[0];
            this.position.y = coords[1];
            this.render();
        }

    }

    module.exports = Renderer;

});