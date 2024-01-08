import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js'
import { createNoise2D } from 'https://cdn.jsdelivr.net/npm/simplex-noise@4.0.1/+esm';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';



const loader = new THREE.TextureLoader();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
scene.background = loader.load( 'assets/background.svg' );


// Add directional light
const pointLight = new THREE.PointLight( 0xffffff, 10000)
pointLight.position.x = 2
pointLight.position.y =50;
pointLight.position.z= 4.4;

const sunlight = new THREE.DirectionalLight(0xffffff);
sunlight.position.x = -1
sunlight.position.y = 2
scene.add(sunlight, pointLight)
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);
controls.maxDistance = 25
controls.minDistance = 20
//materials 

const flowerStemColor = new THREE.MeshLambertMaterial( {color: 0x00532c, flatShading: true} );
const bigPetalsColor = new THREE.MeshLambertMaterial( {color: 0xFBD405, flatShading: true} );
const smallPetalsColor = new THREE.MeshLambertMaterial( {color: 0x322413, flatShading: true} );
//pivots
let pivot1, pivot2, pivot3, pivot4
let growFlower = false
pivot1 = new THREE.Object3D();
pivot1.position.set(-2, 0, 0)
scene.add(pivot1)

pivot2 = new THREE.Object3D()
pivot2.position.set(-2, 0, 0)
scene.add(pivot2)

pivot3 = new THREE.Object3D()
pivot3.position.set(-2, 0, 0)
scene.add(pivot3)

pivot4 = new THREE.Object3D()
pivot4.position.set(-2, 0, 0)
scene.add(pivot4)

//sunlight function


//sun
const geometrySun = new THREE.SphereGeometry( 5, 32, 10 ); 
const materialSun = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
const sun = new THREE.Mesh( geometrySun, materialSun ); 
sun.position.set(10, 20, 20) 


//flower
const geometry = new THREE.CylinderGeometry(0.03, 0.5, 30, 30); 
const cylinder = new THREE.Mesh( geometry, flowerStemColor ); 
cylinder.position.set(0, -5, 0)
pivot1.add(cylinder)

//Big petal
const bigPetals = new THREE.IcosahedronGeometry(4, 0);
const petals = new THREE.Mesh(bigPetals, bigPetalsColor)
petals.scale.y = 0.4;
petals.rotation.z = -1.5;
petals.rotation.x = -0.2;
petals.rotation.y = 4.8;
petals.position.set(cylinder.position.x, 10, cylinder.position.z);
petals.castShadow = true;
pivot2.add(petals)




//Small petal
const smallPetals = new THREE.IcosahedronGeometry(1, 0);
const centerFlower = new THREE.Mesh(smallPetals, smallPetalsColor)
centerFlower.scale.y = 0.4;
centerFlower.rotation.z = -1.5;
centerFlower.rotation.x = -0.2;
centerFlower.rotation.y = 4.8;
centerFlower.position.set(petals.position.x, 10.5, petals.position.z + 1.5);
centerFlower.castShadow = true;
pivot3.add(centerFlower)

const axesHelper1 = new THREE.AxesHelper(3);
pivot1.add(axesHelper1);

const axesHelper2 = new THREE.AxesHelper(3);
pivot2.add(axesHelper2);

const axesHelper3 = new THREE.AxesHelper(3);
pivot2.add(axesHelper3);

//group flower elements

const flowerAndSun = new THREE.Group
flowerAndSun.add(cylinder, petals, centerFlower, sun)
pivot4.add(flowerAndSun)


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



const clock = new THREE.Clock();
/*
function animateFlowerGrowth() {
    const t = clock.getElapsedTime();

    if (t >= 5.0)
    {
        clock = new THREE.Clock;
        cylinder.scale.set(1,1,1);
    }
    else
    {
        cylinder.scale.x = 1+(t/8.0);
    	cylinder.scale.y = 1+(t/2);
		cylinder.scale.z = 1+(t/8.0);

    }



    requestAnimationFrame(animateFlowerGrowth);
}

animateFlowerGrowth();

// Trigger flower growth on load
window.addEventListener('load', () => {
    clock.start();
});
*/

function animateNightMode() {

    if (growFlower) pivot4.rotation.y += 0.01
        renderer.render(scene,camera)
        controls.update()
    
    window.addEventListener('load', (e) => {
        growFlower = true
    })
    
    
	requestAnimationFrame( animateNightMode );
	

 
	camera.position.z += 0.1;
	const zLimit = 0; 


	if (camera.position.y < zLimit) {
		camera.position.y = zLimit;
	}
}
animateNightMode();

