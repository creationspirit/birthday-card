import React from "react"
import * as BABYLON from 'babylonjs';
import SpeechRecognition from "react-speech-recognition"
import { Button } from 'semantic-ui-react'
import { navigate } from "gatsby"

import BabylonScene from './BabylonScene'
import './scene.css'
import Flare from '../../images/flare.png'
import Pitanje from '../../audio/pitanje.mp3'
import Pozdrav from '../../audio/pozdrav.mp3'
import Fail from '../../audio/fail.mp3'
import Tocno from '../../audio/tocno.mp3'


class Scene extends React.Component {
  state = {
    showGhost: false,
    correct: false
  }

  pozdravAudio = new Audio(Pozdrav)
  pitanjeAudio = new Audio(Pitanje)
  failAudio = new Audio(Fail)
  correctAudio = new Audio(Tocno)

  ghostRef = React.createRef()

  componentDidUpdate(prevProps, prevState) {
    if (this.props.transcript.toLowerCase() === 'bravo' && !this.state.correct && !this.props.listening) {
      this.setState({ correct: true })
      this.correctAudio.play()
      navigate("/#video")
    }
    if (this.props.transcript.toLowerCase() !== 'bravo' && prevProps.listening && !this.props.listening) {
      this.failAudio.play()
    }
  }

  showGhost = () => {
    if (!this.state.showGhost) {
      this.setState( { showGhost: true })
      navigate("/#renderCanvas")
      //   this.ghostRef.current.scrollIntoView({
      //     behavior: 'smooth'
      // });
    }
    this.pozdravAudio.play()
  }

  onSceneMount = (sceneArgs) => {
    const { canvas, scene, engine } = sceneArgs;

    const camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, BABYLON.Vector3.Zero(), scene);
    camera.setPosition(new BABYLON.Vector3(-5, 5, 0));
    camera.lowerBetaLimit = 0.1;
    camera.upperBetaLimit = (Math.PI / 2) * 0.99;
    camera.lowerRadiusLimit = 5;
    camera.upperRadiusLimit = 5;
    camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Mirror
    const mirror = BABYLON.Mesh.CreateBox("Mirror", 1.0, scene);
    mirror.scaling = new BABYLON.Vector3(100.0, 0.01, 100.0);
    mirror.material = new BABYLON.StandardMaterial("mirror", scene);
    mirror.material.diffuseColor = new BABYLON.Color3(0.1, 0.2, 0.4);
    mirror.material.specularColor = new BABYLON.Color3(1, 1, 1);
    mirror.material.reflectionTexture = new BABYLON.MirrorTexture("mirror", 512, scene, true);
    mirror.material.reflectionTexture.mirrorPlane = new BABYLON.Plane(0, -1.0, 0, 0.0);
    mirror.material.reflectionTexture.level = 0.2;
    mirror.position = new BABYLON.Vector3(0, 0.0, 0);

    // Emitters
    const emitter0 = BABYLON.Mesh.CreateBox("emitter0", 0.1, scene);
    emitter0.isVisible = false;

    const emitter1 = BABYLON.Mesh.CreateBox("emitter0", 0.1, scene);
    emitter1.isVisible = false;

    mirror.material.reflectionTexture.renderList.push(emitter0);
    mirror.material.reflectionTexture.renderList.push(emitter1);

    // Particles
    const particleSystem = new BABYLON.ParticleSystem("particles", 4000, scene);
    particleSystem.particleTexture = new BABYLON.Texture(Flare, scene);
    particleSystem.minAngularSpeed = -0.5;
    particleSystem.maxAngularSpeed = 0.5;
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 0.5;
    particleSystem.minLifeTime = 0.5;
    particleSystem.maxLifeTime = 2.0;
    particleSystem.minEmitPower = 0.5;
    particleSystem.maxEmitPower = 4.0;
    particleSystem.emitter = emitter0;
    particleSystem.emitRate = 400;
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    particleSystem.minEmitBox = new BABYLON.Vector3(-0.5, 0, -0.5);
    particleSystem.maxEmitBox = new BABYLON.Vector3(0.5, 0, 0.5);
    particleSystem.direction1 = new BABYLON.Vector3(-1, 1, -1);
    particleSystem.direction2 = new BABYLON.Vector3(1, 1, 1);
    particleSystem.color1 = new BABYLON.Color4(1, 0, 0, 1);
    particleSystem.color2 = new BABYLON.Color4(0, 1, 1, 1);
    particleSystem.gravity = new BABYLON.Vector3(0, -2.0, 0);
    particleSystem.start();

    const particleSystem2 = new BABYLON.ParticleSystem("particles", 4000, scene);
    particleSystem2.particleTexture = new BABYLON.Texture(Flare, scene);
    particleSystem2.minSize = 0.1;
    particleSystem2.maxSize = 0.3;
    particleSystem2.minEmitPower = 1.0;
    particleSystem2.maxEmitPower = 2.0;
    particleSystem2.minLifeTime = 0.5;
    particleSystem2.maxLifeTime = 1.0;
    particleSystem2.emitter = emitter1;
    particleSystem2.emitRate = 500;
    particleSystem2.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    particleSystem2.minEmitBox = new BABYLON.Vector3(0, 0, 0);
    particleSystem2.maxEmitBox = new BABYLON.Vector3(0, 0, 0);
    particleSystem2.gravity = new BABYLON.Vector3(0, -0.5, 0);
    particleSystem2.direction1 = new BABYLON.Vector3(0, 0, 0);
    particleSystem2.direction2 = new BABYLON.Vector3(0, 0, 0);
    particleSystem2.start();

    let alpha = 0;
    scene.registerBeforeRender(function () {
        emitter1.position.x = 3 * Math.cos(alpha);
        emitter1.position.y = 1.0;
        emitter1.position.z = 3 * Math.sin(alpha);

        alpha += 0.05 * scene.getAnimationRatio();
    });

    scene.onPointerDown = (evt, pickInfo, type) => {
      this.pitanjeAudio.play()
      setTimeout(() => {
        this.props.startListening()
      }, 2500)
    }

    engine.runRenderLoop(() => {
        if (scene) {
            scene.render();
        }
    });
  }

  render () {
    return (
      <div className="ghostWrapper">
        <Button size="massive" color="pink" onClick={this.showGhost}>
          {!this.state.showGhost ? 'Klikni me' : 'Klikni me da se Slavko opet predstavi'}
          </Button>
        <div id="ghostAnchor" ref={this.ghostRef}></div>
        {this.state.showGhost &&
          <BabylonScene onSceneMount={this.onSceneMount} />
        }
        {this.state.correct &&
          <React.Fragment>
            <h1>Wooohoooo! Otključala si tajni video!</h1>
            <iframe id="video" width="80%" height="500" src="https://www.youtube.com/embed/-9Lb-M-08fY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </React.Fragment>
        }
      </div>
    )
  }
}

const options = {
  autoStart: false,
  continuous: false,
}
export default SpeechRecognition(options)(Scene)
