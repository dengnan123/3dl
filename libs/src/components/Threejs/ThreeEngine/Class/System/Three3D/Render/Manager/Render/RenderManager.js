import { WebGLRenderer } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass";
import { Three3DObject } from "../../../../../Object/Three/Three3DObject";

class RenderManager extends Three3DObject {
  constructor(eventComp, three3D, infos = RenderManager.static_Infos, domID = "") {
    super(eventComp, three3D);
    for (var key in infos) {
      if (RenderManager.static_Infos[key]) {
        infos[key] = Object.assign(RenderManager.static_Infos[key], infos[key]);
      }
    }
    const container = document.getElementById(domID);
    const renderer = new WebGLRenderer(infos.render);
    this.#renderer = renderer;
    this.object.renderer = renderer;

    // let size = this.event.screenSizeManager.screenSize;

    renderer.setPixelRatio(infos.renderFunc.devicePixelRatio);
    renderer.setClearColor(infos.renderFunc.clearColor.color, infos.renderFunc.clearColor.alpha);
    container.appendChild(renderer.domElement);

    const composer = new EffectComposer(renderer);
    this.#composer = composer;

    const ba = this.event.animation.createBaseAnimation();
    ba.animate = (dt, t) => {
      composer.render();
      // console.log("Render");
    }
    this.event.animation.renderAnimation = ba;



    this.#initPass(infos.effects);

    this.event.screenSizeManager.add("renderManager", this);

  }

  #renderer = undefined;
  #composer = undefined;
  #effects = {};
  #container = undefined;

  #initPass = (infos) => {
    let passInfo;
    let pass;
    const rse = RenderManager.static_Infos.effects;
    const size = this.event.screenSizeManager.screenSize;
    // const resolution = new Vector2(size.x, size.y);

    //RenderPass
    passInfo = infos.renderPass;
    if (passInfo && passInfo.isNeed) {
      passInfo = Object.assign(rse.renderPass, passInfo);
      pass = new RenderPass(this.three3D.sceneManager.scene, this.three3D.cameraManager.camera)
      this.#effects['renderPass'] = { pass, resolutionScale: 1 };
      this.#composer.addPass(pass);
    }

    this.setSize(size.x, size.y);



    //SMAA
    passInfo = infos.SMAA;
    if (passInfo && passInfo.isNeed) {
      passInfo = Object.assign(rse.SMAA, passInfo);
      pass = new SMAAPass(size.x, size.y);
      this.#effects['SMAA'] = { pass, resolutionScale: 1 };
      this.#composer.addPass(pass);
    }


  }
  setSize(x, y) {
    this.#renderer.setSize(x, y);
    this.#renderer.domElement.style.width = `${x}px`;
    this.#renderer.domElement.style.height = `${y}px`;

    for (var key in this.#effects) {
      const eff = this.#effects[key];
      if (eff) {
        eff.pass.setSize(x * eff.resolutionScale, y * eff.resolutionScale);
      }
    }

  }
  dispose() {
    console.log("Dispose Renderer");
    super.dispose();
  }
  static static_Infos = {
    render: {
      antialias: true,
      alpha: false,
    },
    renderFunc: {
      clearColor: {
        color: 0xEEEEEE,
        alpha: 0.0,
      },
      devicePixelRatio: window.devicePixelRatio,

    },
    effects: {
      renderPass: {
        isNeed: true,
      },
      SMAA: {
        isNeed: true,
      }
    }
  }
}

export { RenderManager }