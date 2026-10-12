import * as THREE from 'three';
import { createGemCut } from './gem-cut.js';
import { createGemOptics } from './gem-optics.js';
const host = document.getElementById('gem-canvas');
const caption = document.getElementById('gem-caption');
const colours = {sapphire:['#2455d5','Blue sapphire'],ruby:['#bb153b','Ruby'],emerald:['#078250','Emerald'],other:['#8166ac','Other gem']};
let material, renderer, mesh, camera, scene, frame;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let visible = true;
function selection() {
  const value = document.querySelector('[name="gem"]:checked')?.value;
  const [colour, label] = colours[value] || ['#829491','Choose a gem'];
  if (material) {
    const tint = new THREE.Color(colour);
    const level = Number(host.dataset.colourLevel ?? .5);
    if (host.dataset.colourKnown === 'true') {
      if (level < .5) tint.lerp(new THREE.Color('#ffffff'), .6 * (1 - level * 2));
      else tint.multiplyScalar(1 - .6 * (level - .5) * 2);
    }
    material.attenuationColor.copy(tint);
    host.dataset.previewTint = tint.getHexString();
    material?.userData.updateCamera?.(camera,mesh);renderer.render(scene,camera);
  }
  caption.textContent = value ? `${label} · Colour preview only` : 'Choose a gem to see its colour';
  host.setAttribute('aria-label',value ? `3D ${label} colour preview; shape is illustrative` : '3D gemstone preview; choose a gem to change its colour');
  host.dataset.selection = value || 'none';
}
function animate() {
  frame = requestAnimationFrame(animate);
  if (!visible || document.hidden || !mesh) return;
  if (!reduced.matches) mesh.parent.parent.rotation.y += .003;
  material?.userData.updateCamera?.(camera,mesh);renderer.render(scene,camera);
}
async function init() {
 try {
  renderer = new THREE.WebGLRenderer({antialias:true,alpha:true});
  renderer.setPixelRatio(matchMedia('(pointer: coarse)').matches ? Math.min(devicePixelRatio,1.25) : devicePixelRatio);
  renderer.setClearColor(0x000000,0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  host.append(renderer.domElement);
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(35,1,.01,50);
  camera.position.set(0,.72,3.7);camera.lookAt(0,0,0);
  // Small procedural studio: bright softboxes separated by dark reflection gaps.
  const studio = new THREE.Scene();studio.background = new THREE.Color('#aab3c0');
  const panels = [
    [3,5,[-3,3,4],4], [1.2,4,[3,1,3],5],
    [4,2,[0,5,0],3], [2,3,[-4,0,-2],2],
    [1,4,[3,2,-3],3], [3,1,[0,-3,3],1.5]
  ];
  panels.forEach(([w,h,position,intensity]) => {
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:new THREE.Color().setScalar(intensity),side:THREE.DoubleSide}));
    panel.position.set(...position);panel.lookAt(0,0,0);studio.add(panel);
  });
  const cubeTarget = new THREE.WebGLCubeRenderTarget(256,{type:THREE.HalfFloatType});
  const cubeCamera = new THREE.CubeCamera(.1,30,cubeTarget);cubeCamera.update(renderer,studio);
  studio.traverse(node=>{if(node.isMesh){node.geometry.dispose();node.material.dispose()}});
  // Neutral backdrop matches the soft-UI circle; optical paths sample the studio cube.
  const backdrop = new THREE.Mesh(new THREE.PlaneGeometry(20,20),new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false}));
  backdrop.position.z=-3;scene.add(backdrop);
  mesh = new THREE.Mesh(createGemCut());
  const orientation = new THREE.Group();orientation.add(mesh);
  const size = new THREE.Vector3(2,1.43,2);
  const group = new THREE.Group();group.add(orientation);
  group.scale.setScalar(2/Math.max(size.x,size.y,size.z));scene.add(group);
  material = createGemOptics(mesh.geometry,cubeTarget.texture);
  mesh.traverse(node=>{if(node.isMesh)node.material=material});
  document.getElementById('gem-loading').remove();
  const resize = () => {const width=host.clientWidth,height=host.clientHeight;renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();material.userData.updateCamera(camera,mesh);renderer.render(scene,camera)};
  new ResizeObserver(resize).observe(host);resize();selection();
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting}).observe(host);
  host.dataset.ready='true';animate();
 } catch(error) {
  cancelAnimationFrame(frame);renderer?.dispose();
  host.querySelector('canvas')?.remove();
  const loading=document.getElementById('gem-loading');
  if(loading)loading.textContent='3D preview unavailable. You can still choose your gem below.';
  host.dataset.ready='unavailable';
 }
}
host.addEventListener('colourpreview',selection);
document.getElementById('calculator').addEventListener('change',selection);
document.getElementById('calculator').addEventListener('reset',()=>setTimeout(selection,0));
document.getElementById('try-example').addEventListener('click',()=>setTimeout(selection,0));
init();
