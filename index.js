import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import { OBJLoader } from "jsm/loaders/OBJLoader.js";
import getLayer from './getLayer.js';
import getStarfield from "./getStarField.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 10000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping=true
controls.dampFactor=0.03

const stars = getStarfield({numStars: 1000});
scene.add(stars);

function init(geometry) {
  const material = new THREE.MeshMatcapMaterial({
    color: 0xffff00,
    matcap: new THREE.TextureLoader().load('./assets/textures/matcaps/silver.jpg'),
    // transparent: true,
    // opacity: 0.5
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.scale.setScalar(0.04)
  mesh.rotation.x=-45
  scene.add(mesh);

  const sunlight = new THREE.DirectionalLight(0xffffff,2);
  sunlight.position.y = 2;
  scene.add(sunlight);

  const filllight = new THREE.DirectionalLight(0x88ccff,2);
  filllight.position.x = 1;
  filllight.position.y = -2;
  scene.add(filllight);

  // Sprites BG
  // const gradientBackground = getLayer({
  //   hue: 0.6,
  //   numSprites: 8,
  //   opacity: 0.2,
  //   radius: 10,
  //   size: 24,
  //   z: -10.5,
  // });
  // scene.add(gradientBackground);

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();

  }
  animate();
}

const loader = new OBJLoader();
loader.load("./assets/models/Pikachu.obj", (obj) => init(obj.children[0].geometry));

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);