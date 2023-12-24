import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js'
import { createNoise2D } from 'https://cdn.jsdelivr.net/npm/simplex-noise@4.0.1/+esm';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

const loader = new THREE.TextureLoader();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
scene.background = loader.load( 'assets/darkMode.png' );


// Add directional light
/*
const pointLight = new THREE.PointLight( 0xffffff, 10000)
pointLight.position.x = 2
pointLight.position.y =50;
pointLight.position.z= 4.4;
scene.add(pointLight)
const pointLightHelper = new THREE.PointLightHelper( pointLight );
scene.add( pointLightHelper );


const sunlight = new THREE.DirectionalLight(0xffffff);
sunlight.position.x = -1
sunlight.position.y = 2
scene.add(sunlight)
*/

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
//flower
const geometry = new THREE.CylinderGeometry(0.03, 0.5, 20, 20); 
const cylinder = new THREE.Mesh( geometry, flowerStemColor ); 


//Big petal
const bigPetals = new THREE.IcosahedronGeometry(4, 0);
const petals = new THREE.Mesh(bigPetals, bigPetalsColor)
petals.scale.y = 0.4;
petals.rotation.z = -1.5;
petals.rotation.x = -0.2;
petals.rotation.y = 4.8;
petals.position.set(cylinder.position.x, 10, cylinder.position.z);
petals.castShadow = true;


//Small petal
const smallPetals = new THREE.IcosahedronGeometry(1, 0);
const centerFlower = new THREE.Mesh(smallPetals, smallPetalsColor)
centerFlower.scale.y = 0.4;
centerFlower.rotation.z = -1.5;
centerFlower.rotation.x = -0.2;
centerFlower.rotation.y = 4.8;
centerFlower.position.set(petals.position.x, 10.5, petals.position.z + 1.5);
centerFlower.castShadow = true;

//group flower elements
const flower = new THREE.Group
flower.add(cylinder, petals, centerFlower)
scene.add(flower)


//fireflies

function getPointLight(color){
	const light = new THREE.PointLight(color, 100, 500);

	
	const geo = new THREE.IcosahedronGeometry(0.2, 0);
	const mat = new THREE.MeshBasicMaterial({color})
	const mesh = new THREE.Mesh(geo, mat)

	const glowMat = new THREE.MeshBasicMaterial({
		color,
		transparent: true,
		opacity: 0.15
	})
	const glowMesh = new THREE.Mesh(geo, glowMat);
	glowMesh.scale.multiplyScalar(1.5);
	const glowMesh2 = new THREE.Mesh(geo, glowMat);
	glowMesh2.scale.multiplyScalar(2.5);
	const glowMesh3 = new THREE.Mesh(geo, glowMat);
	glowMesh3.scale.multiplyScalar(4);
	const glowMesh4 = new THREE.Mesh(geo, glowMat);
	glowMesh4.scale.multiplyScalar(6);

	mesh.add(light)
	mesh.add(glowMesh)
	mesh.add(glowMesh2)
	mesh.add(glowMesh3)
	mesh.add(glowMesh4)

	const circle = new THREE.Object3D()
	circle.position.y = 10
	const radius = 13
	mesh.position.x = radius 
	circle.rotation.x = THREE.MathUtils.degToRad(120)
	circle.rotation.y = Math.random() * Math.PI * 8
	circle.add(mesh)
	const rate = Math.random() * 0.001 + 0.003
	function update(){
		circle.rotation.z += rate
	}
	return{
		obj: circle,
		update,
	}
}
const colors = [0xbc00dd, 0xff006d, 0x04e762, 0xffdd00, 0x17ffee]
const pLights = []
let pLight;
for (let i = 0; i < colors.length; i++){
	pLight = getPointLight(colors[i])
	scene.add(pLight.obj)
	pLights.push(pLight)
}

//thunder

//rain

let rainCount = 1000;
let rainDrop, rain, rainGeo
const points = []
for(let i = 0; i < rainCount; i++){
	rainDrop = new THREE.Vector3(
		Math.random() * 400 - 200,
		Math.random() * 500 - 250,
		Math.random() * 400 - 200
	)
	rainDrop.velocity = {}
	rainDrop.velocity = 0
	points.push(rainDrop)
	rainGeo = new THREE.BufferGeometry().setFromPoints(points)
}

const rainMaterial = new THREE.PointsMaterial({
	color: 0xaaaaaa,
	size: 0.5,
	transparent: true
});
rain = new THREE.Points(rainGeo, rainMaterial)
scene.add(rain)
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




//cloud

function animateNightMode() {
	requestAnimationFrame( animateNightMode );
	
	points.forEach(p => {
		p.velocity -= 0.01 + Math.random() * 0.01
		p.y += p.velocity
		if(p.y < -200){
			p.y = 200
			p.velocity = 0
		}
	})
	const positions = rainGeo.attributes.position.array;
	for (let i = 0; i < points.length; i++) {
		const index = i * 3;
		positions[index] = points[i].x;
		positions[index + 1] = points[i].y;
		positions[index + 2] = points[i].z;
	}

	rainGeo.attributes.position.needsUpdate = true;
	pLights.forEach(l => l.update())
 
	camera.position.z += 0.1; // Adjust the camera movement speed as needed
	const zLimit = 0; // Set the desired limit along the z-axis

	// Check and limit camera position
	if (camera.position.y < zLimit) {
		camera.position.y = zLimit;
	}
	controls.update();

	renderer.render( scene, camera );
}
animateNightMode();
/*
function animateLightMode() {
	requestAnimationFrame( animateLightMode );
	scene.remove(rain)
	scene.remove(pLights)
	
	const zLimit = 0; // Set the desired limit along the z-axis

	// Check and limit camera position
	if (camera.position.y < zLimit) {
		camera.position.y = zLimit;
	}
	controls.update();

	renderer.render( scene, camera );
}

function startDarkMode(){
	scene.background = loader.load( 'assets/darkMode.png' );
	animateNightMode()
}

function startLightMode(){
	scene.background = loader.load( 'assets/background.svg' );
	animateLightMode()
}
const btn = document.getElementById('img')
btn.addEventListener('click', startLightMode)
*/