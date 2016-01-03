define(function (require, exports, module) {
    'use strict';

    addEventListener('keydown', onKeyDown);
    addEventListener('keyup', onKeyUp);

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
    }

});