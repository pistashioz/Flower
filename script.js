import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const loader = new THREE.TextureLoader();
//texture loader
const texture = loader.load('assets/mountain.avif')
const height = loader.load('assets/image.png')
const alpha = loader.load('assets/alpha.png')
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
scene.background = loader.load( 'assets/background.svg' );

//ilumination
const ambientLight = new THREE.AmbientLight(0x8ecae6, 0.5);
scene.add(ambientLight);

// Add directional light
const pointLight = new THREE.PointLight(0x007200, 10)
pointLight.position.x = 2
pointLight.position.y =10;
pointLight.position.z= 4.4;
scene.add(pointLight)

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);

//materials 

const flowerStemColor = new THREE.MeshBasicMaterial( {color: 0x9CC5A1} );
const bigPetalsColor = new THREE.MeshBasicMaterial( {color: 0xe63946} );
const smallPetalsColor = new THREE.MeshBasicMaterial( {color: 0xffb703} );
//flower
const geometry = new THREE.CylinderGeometry(0.03, 0.5, 20, 20); 
const cylinder = new THREE.Mesh( geometry, flowerStemColor ); 
scene.add( cylinder );

//Big petal
const bigPetals = new THREE.IcosahedronGeometry(4, 0);
const petals = new THREE.Mesh(bigPetals, bigPetalsColor)
petals.scale.y = 0.4;
petals.rotation.z = -1.5;
petals.rotation.x = -0.2;
petals.rotation.y = 4.8;
petals.position.set(cylinder.position.x, 10, cylinder.position.z);
petals.castShadow = true;
scene.add(petals)

//Small petal
const smallPetals = new THREE.IcosahedronGeometry(1, 0);
const centerFlower = new THREE.Mesh(smallPetals, smallPetalsColor)
centerFlower.scale.y = 0.4;
centerFlower.rotation.z = -1.5;
centerFlower.rotation.x = -0.2;
centerFlower.rotation.y = 4.8;
centerFlower.position.set(petals.position.x, 10.5, petals.position.z + 1.5);
centerFlower.castShadow = true;
scene.add(centerFlower)

//low poly terrain
const ground = new THREE.PlaneGeometry(300, 300, 300, 300);
const material = new THREE.MeshStandardMaterial( {color: 'green', side: THREE.DoubleSide, map: texture, displacementMap: height, displacementScale:20, alphaMap: alpha, transparent: true} );
const plane = new THREE.Mesh( ground, material );
plane.rotation.x = -Math.PI / 2;
plane.position.set(cylinder.position.x, -10, cylinder.position.z)

scene.add( plane );


let axes = new THREE.AxesHelper(3);
scene.add(axes);

//lighting



let axesCylinder = new THREE.AxesHelper(2);
cylinder.add(axesCylinder)
camera.position.z = 40;


function animate() {
	requestAnimationFrame( animate );

	controls.update();

	renderer.render( scene, camera );
}

animate();