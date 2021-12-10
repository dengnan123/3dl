import { PerspectiveCamera, Vector3 } from 'three';
import { TE_OrbitControls } from './Controller/TE_OrbitControls';
var CameraManager = function ({ animate, screenSize }, dom, scene) {
    // let _fov = 15;
    let _camera = new PerspectiveCamera(30, screenSize.size.x / screenSize.size.y, 1, 10000);
    // let _camera = new PerspectiveCamera(_fov,screenSize.size.x,screenSize,)

    let controller;
    let animateItem = undefined;
    let startTarget = new Vector3();
    let nextTarget = new Vector3();

    let offset = new Vector3();
    init();
    function init() {
        scene.add(_camera);
        _camera.position.set(375.67308713411387, 311.22531383198276, 1007.3488775935496);
        controller = new TE_OrbitControls(_camera, dom, animate);
        // controller.enablePan = false;
        // controller.autoRotate = true;
        controller.autoRotateSpeed = 0.6;
        animate.addListener("cameraController", controller.autoRotation);
        //自旋


        // console.log(controller);


    }

    //事件
    var onScreenSizeChange = (val) => {
        _camera.aspect = val.x / val.y;
        // console.log(_camera);
    }
    screenSize.addListener("Camera", onScreenSizeChange);
    this.camera = undefined;

    this.setTarget = function (target, startDis, endDis, onFinished) {
        nextTarget.copy(target);
        if (!animateItem) {
            startTarget.copy(controller.target);
            var anim = (alpha, deltaP) => {
                let x = startTarget.x * (1 - alpha) + nextTarget.x * alpha;
                let y = startTarget.y * (1 - alpha) + nextTarget.y * alpha;
                let z = startTarget.z * (1 - alpha) + nextTarget.z * alpha;
                controller.target.set(x, y, z);
                if (startDis) {
                    var lerpDis = startDis * (1 - alpha) + endDis * alpha;
                    controller.nextDistance = lerpDis;
                }
                controller.update();
            }
            var onFinish = () => {
                animateItem = undefined;
                onFinished && onFinished();

            }
            animateItem = animate.addAnimateStack("CameraController", anim, 0, 1, onFinish);
        }
        else {
            animateItem.duration = 0;
            startTarget.copy(controller.target);
            nextTarget.copy(target);
        }
        // controller.target.copy(target);
    }
    this.getDistance = function () {
        offset.copy(this.camera.position).sub(controller.target);
        return offset.length();
    }
    Object.defineProperty(this, "camera", {
        get: function () { return _camera },
    })
    Object.defineProperty(this, "controlTarget", {
        get: function () { return controller.target },
    })
    Object.defineProperty(this, "isAnimate", {
        get: function () { return animateItem !== undefined },
    })
}

export { CameraManager }