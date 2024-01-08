import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js'
import { createNoise2D } from 'https://cdn.jsdelivr.net/npm/simplex-noise@4.0.1/+esm';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
const clock = new THREE.Clock();


const loader = new THREE.TextureLoader();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
scene.background = loader.load( 'assets/background.svg' );


// Add directional light
const pointLight = new THREE.PointLight( 0xffffff, 10000)
pointLight.position.x = 2
pointLight.position.y =50;
pointLight.position.z= 4.4;


const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);
controls.maxDistance = 25
controls.minDistance = 20
//materials 

const flowerStemColor = new THREE.MeshLambertMaterial( {color: 0x9CC5A1, flatShading: true} );
const bigPetalsColor = new THREE.MeshLambertMaterial( {color: 0xe63946, flatShading: true} );
const smallPetalsColor = new THREE.MeshLambertMaterial( {color: 0xffb703, flatShading: true} );
const leafColor  = new THREE.MeshLambertMaterial( {color: 0x9CC5A1, flatShading: true, side: THREE.DoubleSide} );
//pivots
let pivot1, pivot2, pivot3, pivot4, pivot5, pivot6, pivot7
let rotateFlower = false


pivot4 = new THREE.Object3D()
pivot4.position.set(0, 0, 0)
scene.add(pivot4)

pivot5 = new THREE.Object3D()
pivot5.position.set(0,10, 0)
scene.add(pivot5)

pivot6 = new THREE.Object3D()
pivot6.position.set(0, 0, 0)
scene.add(pivot6)

pivot7 = new THREE.Object3D()
pivot7.position.set(0, -1, 0)
scene.add(pivot7)

//sun

const geometrySun = new THREE.SphereGeometry( 5, 32, 10 ); 
const materialSun = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
const sun = new THREE.Mesh( geometrySun, materialSun ); 
sun.position.set(10, 20, 20) 


const sunlight = new THREE.PointLight(0xf4db87,7000, 500);
sunlight.position.set(0, 20, 0);
// Create a pivot for the sun
const sunPivot = new THREE.Object3D();
sunPivot.add(sun, sunlight); // Add both sun and sunlight to the pivot
scene.add(sunPivot);


//flower

pivot1 = new THREE.Object3D();
pivot1.position.set(0, 0, 0)
scene.add(pivot1)


const geometry = new THREE.CylinderGeometry(0.05, 0.8, 40, 40); 
const cylinder = new THREE.Mesh( geometry, flowerStemColor ); 
cylinder.position.set(0, 0, 0)
pivot1.add(cylinder)

//Big petal

pivot2 = new THREE.Object3D()
pivot2.position.set(cylinder.position.x, 10, cylinder.position.z)
scene.add(pivot2)



const bigPetals = new THREE.IcosahedronGeometry(4, 0);
const petals = new THREE.Mesh(bigPetals, bigPetalsColor)
petals.scale.y = 0.4;
petals.rotation.z = -1.5;
petals.rotation.x = -0.2;
petals.rotation.y = 4.8;
petals.position.set(0,10,0);
petals.castShadow = true;
pivot2.add(petals)


//Small petal

pivot3 = new THREE.Object3D()
pivot3.position.set(pivot2.position.x, 10.5, pivot2.position.z + 1.5)
scene.add(pivot3)

const smallPetals = new THREE.IcosahedronGeometry(1, 0);
const centerFlower = new THREE.Mesh(smallPetals, smallPetalsColor)
centerFlower.scale.y = 0.4;
centerFlower.rotation.z = -1.5;
centerFlower.rotation.x = -0.2;
centerFlower.rotation.y = 4.8;
centerFlower.position.set(0, 10, 0);
centerFlower.castShadow = true;
pivot3.add(centerFlower)

const x = 0, y = 0;
//rightLeaf


const rightLeafShape = new THREE.Shape();

rightLeafShape.moveTo( x + 5, y + 5 );
rightLeafShape.quadraticCurveTo(x + 5, y + 10, x, y + 20);
rightLeafShape.quadraticCurveTo(x - 5, y + 10, x, y);

const rightLeafGeometry = new THREE.ShapeGeometry( rightLeafShape );



const rightLeaf = new THREE.Mesh(rightLeafGeometry, leafColor);
rightLeaf.rotation.z = Math.PI + 8 / 2;
rightLeaf.scale.set(-0.25, -0.25, 1);
rightLeaf.position.set(0,10,0);
pivot7.add(rightLeaf);


//leftLeaf



const leftLeafShape = new THREE.Shape();

leftLeafShape.moveTo( x + 5, y + 5 );
leftLeafShape.quadraticCurveTo(x + 5, y + 10, x, y + 20);
leftLeafShape.quadraticCurveTo(x - 5, y + 10, x, y);

const leftLeafGeometry = new THREE.ShapeGeometry( leftLeafShape );



const leftLeaf = new THREE.Mesh(leftLeafGeometry, leafColor);
leftLeaf.rotation.z = Math.PI + 8 / 2;
leftLeaf.scale.set(0.25, 0.25, 1);
leftLeaf.position.set(0,2,0);
pivot5.add(leftLeaf);

let lastFrameTime = Date.now();
//the fluttering motion is applied to the leftLeaf mesh within the animateFlutterLeaves function
function animateFlutterLeaves() {
    const currentTime = Date.now();
    leftLeaf.position.y = Math.sin(currentTime * 0.01) * 0.1;
    leftLeaf.position.z = Math.sin(currentTime * 0.0001) * 0.1;
    leftLeaf.rotation.x = Math.cos(currentTime * 0.0004) * 0.05;

    pivot5.position.y = 0.5 + Math.sin(currentTime * 0.01) * 0.1;
    pivot5.position.z = Math.sin(currentTime * 0.0001) * 0.1;
    pivot5.rotation.x = Math.cos(currentTime * 0.0004) * 0.05;

	rightLeaf.position.y = Math.sin(currentTime * 0.01) * 0.1;
    rightLeaf.position.z = Math.sin(currentTime * 0.0001) * 0.1;
    rightLeaf.rotation.x = Math.cos(currentTime * 0.0004) * 0.05;

    pivot7.position.y = 0.5 + Math.sin(currentTime * 0.01) * 0.1;
    pivot7.position.z = Math.sin(currentTime * 0.0001) * 0.1;
    pivot7.rotation.x = Math.cos(currentTime * 0.0004) * 0.05;

    lastFrameTime = currentTime;

    requestAnimationFrame(animateFlutterLeaves);
}



const axesHelper1 = new THREE.AxesHelper(3);
pivot1.add(axesHelper1);

const axesHelper2 = new THREE.AxesHelper(3);
pivot2.add(axesHelper2);

const axesHelper3 = new THREE.AxesHelper(3);
pivot2.add(axesHelper3);

//group flower elements


const flowerObject = new THREE.Group
flowerObject.add(pivot1, pivot2, pivot3, pivot5, pivot7)
pivot4.add(flowerObject)

const flowerAndSun = new THREE.Group
flowerAndSun.add(pivot4, sunPivot)
pivot6.add(flowerAndSun)

//low poly terrain

const segmentX= 100;
const segmentZ= 100;
const ground = new THREE.PlaneGeometry(300, 300, segmentX, segmentZ +1);
const material = new THREE.MeshLambertMaterial( {color: '#2b9348', 
wireframe: false, flatShading: true} );

for( let i = 0; i<ground.attributes.position.count; i++)
{
	let currentZ = ground.attributes.position.getZ(i)
	currentZ += Math.random() * 1
	ground.attributes.position.setZ(i, currentZ)

	let currentX = ground.attributes.position.getX(i)
	currentX += Math.random() * 1
	ground.attributes.position.setX(i, currentX)

	let currentY = ground.attributes.position.getY(i)
	currentY += Math.random() * 1
	ground.attributes.position.setY(i, currentY)
}

ground.attributes.position.needsUpdate = true;
// compute normals so shading works properly
ground.computeVertexNormals();

// height.repeat.set(5,5)
const terrain = new THREE.Mesh( ground, material );
terrain.rotation.x = -Math.PI / 2;
terrain.position.set(cylinder.position.x, -10, cylinder.position.z)

const axesHelper = new THREE.AxesHelper( 5 );
terrain.add( axesHelper );

scene.add( terrain );


let axes = new THREE.AxesHelper(3);
scene.add(axes);



let axesCylinder = new THREE.AxesHelper(2);
cylinder.add(axesCylinder)
camera.position.z = 40;
const maxHeight = 1;
flowerObject.scale.set(0.1, 0.1, 0.1);
flowerObject.position.y = -10;
flowerObject.scale.y = 0; 
function animateFlowerGrowth() {
	console.log(flowerObject.scale.y)
	if (flowerObject.position.y < 0 && flowerObject.scale.y <= maxHeight) {
		flowerObject.scale.y += 0.01; 
		flowerObject.scale.x += 0.01;
		flowerObject.scale.z += 0.01;
	  }
	  else{

	  }
	

	requestAnimationFrame(animateFlowerGrowth);
  }
  
  // Start the growth animation
  animateFlowerGrowth();

function animateNightMode() {

    if (rotateFlower) pivot6.rotation.y += 0.01
        renderer.render(scene,camera)
        controls.update()
    
    window.addEventListener('load', (e) => {
        rotateFlower = true
    })

    
	animateFlutterLeaves()
	requestAnimationFrame( animateNightMode );
	

 
	camera.position.z += 0.1;
	const zLimit = 0; 


	if (camera.position.y < zLimit) {
		camera.position.y = zLimit;
	}
}
animateNightMode();

