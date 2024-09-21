import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import { OBJLoader } from "jsm/loaders/OBJLoader.js";
// import getLayer from './getLayer.js';
import getStarfield from "./getStarField.js";

let reloadCount
let model
try {
  // Reload counter logic
  reloadCount = localStorage.getItem("reloadCount") ? parseInt(localStorage.getItem("reloadCount")) : 0;
  reloadCount += 1;
  localStorage.setItem("reloadCount", reloadCount);
} catch (e) {
  console.error("localStorage error: ", e);
}

let randomTexture=getRandomInt(1,5)
console.log(randomTexture)

if(reloadCount){
  model = reloadCount%3
}else{
  model =0
}

let matcapTexture=undefined
switch(randomTexture){
  case 1:
    matcapTexture=new THREE.TextureLoader().load('./assets/textures/matcaps/silver2.jpg')
    break
  case 2:
    matcapTexture=new THREE.TextureLoader().load('./assets/textures/matcaps/silver.jpg')
    break
  case 3:
    matcapTexture=new THREE.TextureLoader().load('./assets/textures/matcaps/glass.jpg')
    break
  case 4:
    matcapTexture=new THREE.TextureLoader().load('./assets/textures/matcaps/pearl.jpg')
    break
}



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
controls.dampingFactor=0.2

const stars = getStarfield({numStars: 1000});
scene.add(stars);

function init(geometry) {
  const material = new THREE.MeshMatcapMaterial({
    // color: 0x00ff00,
    flatShading:false ,
    matcap: matcapTexture,
    // transparent: true,
    // opacity: 0.5
  });
  const mesh = new THREE.Mesh(geometry, material);

  switch(model){
    case 0:
      mesh.scale.setScalar(30)
      mesh.rotation.x = Math.PI / 10;
      break
    case 1:
      mesh.scale.setScalar(0.03) 
      mesh.rotation.x = -Math.PI / 2;
      mesh.rotation.z = -Math.PI / 2;
      break
    case 2:
      mesh.scale.setScalar(0.05) 
      mesh.rotation.x = -Math.PI / 2;

      break
  }
  mesh.geometry.center()


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

switch(model){
  case 0:
    loader.load("./assets/models/bunny2.obj", (obj) => init(obj.children[0].geometry));
    break
  case 1:
    loader.load("./assets/models/Pikachu_V2.obj", (obj) => init(obj.children[0].geometry));
    break
  case 2:
    loader.load("./assets/models/turtle.obj", (obj) => init(obj.children[0].geometry));
    break
}

if(model==0){
}else{
  if(model==1){}
}
function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);
