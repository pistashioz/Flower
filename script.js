// Importing necessary modules from Three.js

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

// Initializing a clock for animation

const clock = new THREE.Clock();
let lastFrameTime = Date.now();
// audio elements 
const rainSound = new Audio('../assets/sounds/rainEffect.mp3')
const nightMusic = new Audio('../assets/sounds/nightMusic.mp3')
const dayMusic = new Audio('../assets/sounds/dayMusic.mp3')
// Event listener for when the HTML document is fully loaded
document.addEventListener('DOMContentLoaded', function () {

// THREE.js components
const loader = new THREE.TextureLoader();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0, 5, 50)
scene.background = loader.load( 'assets/lightMode.svg' );
// play day music when the page is loaded
dayMusic.play()

// function to enable shadows for objects in a group
const shadowSupport = (group) => {
	group.traverse((object) => {
	  if (object instanceof THREE.Mesh) {
		object.castShadow = true;
		object.receiveShadow = true;
	  }
	});
  };
  //mapping function for value interpolation
const map = (val, smin, smax, emin, emax) => ((emax - emin) * (val - smin)) / (smax - smin) + emin;
// Function to add jitter to a geometry
const jitter = (geo, per) => {
    const vertices = geo.attributes.position.array;

    for (let i = 0; i < vertices.length; i += 3) {
        vertices[i] += map(Math.random(), 0, 1, -per, per);
        vertices[i + 1] += map(Math.random(), 0, 1, -per, per);
        vertices[i + 2] += map(Math.random(), 0, 1, -per, per);
    }

    geo.attributes.position.needsUpdate = true;
};

// Point light for the scene
const pointLight = new THREE.PointLight( 0xffffff, 10000)
pointLight.position.x = 2
pointLight.position.y =50;
pointLight.position.z= 4.4;

// Renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
// Orbit controls for camera simulation
const controls = new OrbitControls(camera, renderer.domElement);
controls.maxDistance = 25
controls.minDistance = 20
//lighting setup
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4, 100);
const light = new THREE.HemisphereLight(0xffffff, 0xb3858c, 0.9);

scene.add(light);
scene.add(directionalLight);
//setting up directional lights for shadows
directionalLight.position.set(10, 12, 8);
directionalLight.castShadow = true;
directionalLight.receiveShadow = true;
directionalLight.shadow.mapSize.width = 512;
directionalLight.shadow.mapSize.height = 512; 
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 500;
const sunlight = new THREE.PointLight(0xf4db87,7000, 500);
//sunlight point light
sunlight.position.set(0, 20, 0);
scene.add(sunlight);

//material definitions 
const cloudMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.3, flatShading: true });
const flowerStemColor = new THREE.MeshLambertMaterial( {color: 0x9CC5A1, flatShading: true} );
const bigPetalsColor = new THREE.MeshLambertMaterial( {color: 0xe63946, flatShading: true} );
const smallPetalsColor = new THREE.MeshLambertMaterial( {color: 0xffb703, flatShading: true} );
const leafColor  = new THREE.MeshLambertMaterial( {color: 0x9CC5A1, flatShading: true, side: THREE.DoubleSide} );

//cloudsfunction
function drawCloud(){
	const cloudGroups = [];
    const createCloudGroup = (x, y, z, scale) => {
        const clouds = new THREE.Group();

        const geoCloud = new THREE.SphereGeometry(2, 6, 6);
        jitter(geoCloud, 0.2);
        const cloud = new THREE.Mesh(geoCloud, cloudMaterial);
        cloud.scale.set(1, 0.8, 1);

        const cloud2 = cloud.clone();
        cloud2.scale.set(0.75, 0.5, 1);
        cloud2.position.set(1.95, -0.5, 0);

        const cloud3 = cloud.clone();
        cloud3.scale.set(0.75, 0.5, 1);
        cloud3.position.set(-1.85, -1, 0);

        clouds.add(cloud);
        clouds.add(cloud2);
        clouds.add(cloud3);

        shadowSupport(clouds);

        clouds.position.set(x, y, z);
        clouds.scale.set(scale, scale, scale);
        scene.add(clouds);

        return clouds;
    };
// creating multiple cloud groups
    const clouds = createCloudGroup(-80, 60, 80, 5);
    cloudGroups.push(clouds);

    const cloneCloudGroup = createCloudGroup(6, 60, -80, 5.2);
    cloudGroups.push(cloneCloudGroup);

    const cloneCloudGroup2 = createCloudGroup(80, 40, -100, 5.2);
    cloudGroups.push(cloneCloudGroup2);

	const cloneCloudGroup3 = createCloudGroup(80, 40, 80, 5.2);
    cloudGroups.push(cloneCloudGroup3);

	const cloneCloudGroup4 = createCloudGroup(-50, 25, -50, 5.2);
    cloudGroups.push(cloneCloudGroup4);

	const cloneCloudGroup5 = createCloudGroup(70, 50, 130, 5.2);
    cloudGroups.push(cloneCloudGroup5);
  }
  drawCloud()


//flower pivot point

let flowerPivot = new THREE.Object3D();
flowerPivot.position.set(0,-12,0)
scene.add(flowerPivot);

//flower

const geometryBase = new THREE.CylinderGeometry(0.05, 0.8, 40, 40)
const base = new THREE.Mesh(geometryBase, flowerStemColor)
base.position.set(0,0,0)
flowerPivot.add(base)

//top pivot
let topPivot = new THREE.Object3D()
topPivot.position.set(base.position.x, 20, base.position.z)
base.add(topPivot)
//petal
const bigPetals = new THREE.IcosahedronGeometry(0.4, 0);
const petals = new THREE.Mesh(bigPetals, bigPetalsColor)
petals.scale.y = 0.4;
petals.rotation.z = -1.5;
petals.rotation.x = -0.2;
petals.rotation.y = 4.8;
petals.position.set(0,0,0);
petals.castShadow = true;
topPivot.add(petals)

//center of the top
const smallPetals = new THREE.IcosahedronGeometry(0.1, 0);
const centerFlower = new THREE.Mesh(smallPetals, smallPetalsColor)
centerFlower.scale.y = 0.4;
centerFlower.rotation.z = 1.5;
centerFlower.rotation.x = -0.2;
centerFlower.rotation.y = 4.8;
centerFlower.position.set(0, 0.05, 0.15);
centerFlower.castShadow = true;
topPivot.add(centerFlower)

//leaf pivot
let leftLeafPivot = new THREE.Object3D()
leftLeafPivot.position.set(0,12, 0)

base.add(leftLeafPivot)

//left leaf
const x = 0, y = 0;
const leftLeafShape = new THREE.Shape();

leftLeafShape.moveTo( x + 5, y + 5 );
leftLeafShape.quadraticCurveTo(x + 5, y + 10, x, y + 20);
leftLeafShape.quadraticCurveTo(x - 5, y + 10, x, y);

const leftLeafGeometry = new THREE.ShapeGeometry( leftLeafShape );

const leftLeaf = new THREE.Mesh(leftLeafGeometry, leafColor);
leftLeaf.rotation.z = Math.PI + 8 / 2;
leftLeaf.scale.set(0.25, 0.25, 1);
leftLeaf.position.set(0,0,0);
leftLeafPivot.add(leftLeaf);



//right leaf pivot
let rightLeafPivot = new THREE.Object3D()
rightLeafPivot.position.set(0, 9, 0)
base.add(rightLeafPivot)
//right leaf

const rightLeafShape = new THREE.Shape();

rightLeafShape.moveTo( x + 5, y + 5 );
rightLeafShape.quadraticCurveTo(x + 5, y + 10, x, y + 20);
rightLeafShape.quadraticCurveTo(x - 5, y + 10, x, y);

const rightLeafGeometry = new THREE.ShapeGeometry( rightLeafShape );


const rightLeaf = new THREE.Mesh(rightLeafGeometry, leafColor);
rightLeaf.rotation.z = Math.PI + 8 / 2;
rightLeaf.scale.set(-0.25, -0.25, 1);
rightLeaf.position.set(0,0,0);
rightLeafPivot.add(rightLeaf);

// function to animate the leaves
function animateFlutterLeaves() {
	if (day){ //check if its daytime
		//gt current time in ms
		const currentTime = Date.now();

		//update rotation and fluttering 
		leftLeafPivot.rotation.y =  Math.sin(currentTime * 0.005) *  leftLeafRotation;
		leftLeafPivot.rotation.z = Math.sin(currentTime * 0.005) * 0.01;
	
		rightLeafPivot.rotation.y = Math.sin(currentTime * 0.005) * rightLeafRotation;
		rightLeafPivot.rotation.z = Math.sin(currentTime * 0.005) * 0.01;

		//store the curent time for the next frame
		lastFrameTime = currentTime;

		//request the next animation frame to continue the animation loop
		requestAnimationFrame(animateFlutterLeaves);
	}

}

//sun
const geometrySun = new THREE.SphereGeometry( 5, 32, 10 ); 
const materialSun = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
const sun = new THREE.Mesh( geometrySun, materialSun ); 
sun.position.set(10, 45, 40) 

window.sun = sun
scene.add(sun);
//moon
const moonGeometry = new THREE.SphereGeometry(5, 32, 10)
const moonMaterial = new THREE.MeshBasicMaterial({color: "white"});
const moon = new THREE.Mesh(moonGeometry, moonMaterial)
moon.position.set(40, 20, 10)

const moonlight = new THREE.PointLight(0xf4db87,1000, 300)
moonlight.position.copy(sunlight.position)

//fireflies
// function that creates a point light 
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

	//create additional meshes for the glowing effect 
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
	//add the mesehes to the main mesh
	const circle = new THREE.Object3D()
	// Set the initial position of the circle and mesh
	circle.position.y = 10
	const radius = 13
	mesh.position.x = radius 
	// Set the initial rotation of the circle
	circle.rotation.x = THREE.MathUtils.degToRad(120)
	circle.rotation.y = Math.random() * Math.PI * 8
	// Add the main mesh to the circle
	circle.add(mesh)
	// set a random rotation rate
	const rate = Math.random() * 0.001 + 0.003
	// This function updates the rotation of the circle
	function update(){
		circle.rotation.z += rate
	}
	// return an object containid the circle and the update function
	return{
		obj: circle,
		update,
	}
}
// Array to store the created point lights
const colors = [0xbc00dd, 0xff006d, 0x04e762, 0xffdd00, 0x17ffee]
let pLights = [];
let pLight;
// Loop throught the colors array to create and store point lights
for (let i = 0; i < colors.length; i++) {
	// Call the getPointLight function for each color
    pLight = getPointLight(colors[i]);
    //scene.add(pLight.obj);
	// store the point light object in the pLights array
    pLights.push(pLight);
}

//rain
//initial count of raindrops
let rainCount = 1000;
let rainDrop, rain, rainGeo
// array to store individual raindrop positions
const points = []

//loop to create individual raindrop positions and popiate the points array
for(let i = 0; i < rainCount; i++){
	// create a new vector for each raindrop with random coordinated
	rainDrop = new THREE.Vector3(
		// coordinates within the range [-200, 200], [-250, 250, [-200, 200]
		Math.random() * 400 - 200,
		Math.random() * 500 - 250,
		Math.random() * 400 - 200
	)
	// add a velocity property to the raindrop object and set it initially to 0
	rainDrop.velocity = {}
	rainDrop.velocity = 0
	points.push(rainDrop)

	// create the greomtry for the raindrops
	rainGeo = new THREE.BufferGeometry().setFromPoints(points)
}

const rainMaterial = new THREE.PointsMaterial({
	color: 0xaaaaaa, //raindrop color
	size: 0.5, // size of each raindrop
	transparent: true
});
rain = new THREE.Points(rainGeo, rainMaterial)




//axesHelper
/*
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const axesHelper2 = new THREE.AxesHelper(2);
base.add(axesHelper2);

const axesHelper3 = new THREE.AxesHelper(2);
sun.add(axesHelper3);

const axesHelper4 = new THREE.AxesHelper(2);
topPivot.add(axesHelper4);

const axesHelper5 = new THREE.AxesHelper(2);
leftLeafPivot.add(axesHelper5);

const axesHelper6 = new THREE.AxesHelper(2);
flowerPivot.add(axesHelper6);
*/
//low poly terrain
// Define the number of segments for the ground geometry
const segmentX = 100;
const segmentZ = 100;

// Create a PlaneGeometry for the ground with specified width, height, and segments
const ground = new THREE.PlaneGeometry(300, 300, segmentX, segmentZ + 1);

// Create a Lambert material for the ground mesh with specific properties
const material = new THREE.MeshLambertMaterial({
    color: '#2b9348',       // Color of the ground
    wireframe: false,       // Disable wireframe rendering
    flatShading: true       // Enable flat shading for a simplified appearance
});

// Perturb the positions of vertices in the ground geometry
for (let i = 0; i < ground.attributes.position.count; i++) {
    // Adjust the z-coordinate of each vertex by adding a random value between 0 and 1
    let currentZ = ground.attributes.position.getZ(i);
    currentZ += Math.random() * 1;
    ground.attributes.position.setZ(i, currentZ);

    // Adjust the x-coordinate of each vertex by adding a random value between 0 and 1
    let currentX = ground.attributes.position.getX(i);
    currentX += Math.random() * 1;
    ground.attributes.position.setX(i, currentX);

    // Adjust the y-coordinate of each vertex by adding a random value between 0 and 1
    let currentY = ground.attributes.position.getY(i);
    currentY += Math.random() * 1;
    ground.attributes.position.setY(i, currentY);
}

// Signal that the position attributes have been updated
ground.attributes.position.needsUpdate = true;

// Compute vertex normals to ensure proper shading
ground.computeVertexNormals();

// Create a Mesh object using the ground geometry and Lambert material
const terrain = new THREE.Mesh(ground, material);

// Adjust the rotation and position of the terrain mesh
terrain.rotation.x = -Math.PI / 2;  // Rotate the terrain to be horizontal
terrain.position.set(base.position.x, -10, base.position.z);  // Set the position of the terrain relative to a base object

// Add the terrain mesh to the scene
scene.add(terrain);

//trees
// Define an array to store groups of trees
const treeGroups = [];

// Function to create a group of trees and add it to the scene
function createTreeGroup(x, y, z) {
    // Create a new THREE.Group to hold the tree components
    const group = new THREE.Group();

    // Create three levels of foliage using ConeGeometry and LambertMaterial
    const level1 = new THREE.Mesh(
        new THREE.ConeGeometry(1.5, 2, 8),
        new THREE.MeshLambertMaterial({ color: 0x688F4E })
    );
    level1.position.y = 4;
    group.add(level1);

    const level2 = new THREE.Mesh(
        new THREE.ConeGeometry(2, 2, 8),
        new THREE.MeshLambertMaterial({ color: 0x688F4E })
    );
    level2.position.y = 3;
    group.add(level2);

    const level3 = new THREE.Mesh(
        new THREE.ConeGeometry(3, 2, 8),
        new THREE.MeshLambertMaterial({ color: 0x688F4E })
    );
    level3.position.y = 2;
    group.add(level3);

    // Create a trunk using CylinderGeometry and LambertMaterial
    const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.5, 2),
        new THREE.MeshLambertMaterial({ color: 0x652800 })
    );
    trunk.position.y = 0;

    // Adjust rotation, scale, and position of the tree group
    group.rotation.x = 14.1; // Rotation for a natural tree appearance
    group.scale.set(3, 4, 3); // Scale the entire tree group
    group.position.set(x, y, z); // Set the position of the tree group in the scene

    // Add the trunk to the tree group
    group.add(trunk);

    // Add the tree group to the terrain (assuming 'terrain' is a defined object in the scene)
    terrain.add(group);

    // Store the created tree group in the array for later reference
    treeGroups.push(group);

    // Return the tree group for additional manipulation if needed
    return group;
}

// Create multiple instances of tree groups with different positions and scales
const tree1 = createTreeGroup(15, 30, 5);
tree1.scale.set(3, 4, 3);

const tree2 = createTreeGroup(15, -30, 5);
tree2.scale.set(3, 4, 3);

const tree3 = createTreeGroup(1, 50, 5);
tree3.scale.set(1.5, 2.1, 1.5);

const tree4 = createTreeGroup(-50, 20, 5);
tree4.scale.set(1.5, 2.5, 1.5);

const tree5 = createTreeGroup(50, 20, 5);
tree5.scale.set(1.5, 2.5, 1.5);

const tree6 = createTreeGroup(-15, -20, 5);
tree6.scale.set(1, 2, 1);

// Set the initial scale of the flower pivot
const maxHeight = 1;
flowerPivot.scale.set(0.1, 0.1, 0.1);

// Function to animate the growth of the flower
function animateFlowerGrowth() {
    // Check if the flower has not reached the maximum height
    if (flowerPivot.scale.y < maxHeight) {
        // Increase the scale of the flower pivot in all dimensions
        flowerPivot.scale.y += 0.007;
        flowerPivot.scale.x += 0.007;
        flowerPivot.scale.z += 0.007;

        // Log the current scale.y value (for debugging)
        console.log(flowerPivot.scale.y);

        // Check if the flower has grown to a certain height
        if (flowerPivot.scale.y >= 0.5) {
            // Increase the scale of the top pivot, representing the flower top
            topPivot.scale.y += 0.12;
            topPivot.scale.x += 0.12;
            topPivot.scale.z += 0.12;

            // Log the maxHeight value (for debugging)
            console.log(maxHeight);

            // Add a sun object to the flower pivot
            flowerPivot.add(sun);
        }
    }

    // Request the next animation frame to continue the growth animation
    requestAnimationFrame(animateFlowerGrowth);
}

// Function to animate the fluttering of flower petals
function animatePetalsFlutter() {
    // Check if it's daytime
    if (day) {
        // Get the current time
        const currentTime = Date.now();

        // Apply rotation to the top pivot for petal fluttering
        topPivot.rotation.z = Math.sin(currentTime * 0.005) * petalRotation;
        topPivot.rotation.x = Math.cos(currentTime * 0.005) * 0.05;

        // Request the next animation frame to continue the petal flutter animation
        requestAnimationFrame(animatePetalsFlutter);
    }
}

// Function to animate the rotation of the terrain
function animateTerrain() {
    // Get the current time
    const currentTime = Date.now();

    // Apply rotation to the terrain for a dynamic effect
    terrain.rotation.z = Math.sin(currentTime * 0.001) * 0.05;

    // Request the next animation frame to continue the terrain animation
    requestAnimationFrame(animateTerrain);
}


animateTerrain();

animateFlowerGrowth()

function animateRotation(){
	flowerPivot.rotation.y += rotationSpeed;
}
// function to animate the day scene
function animateDayScene(){
	// call day functions
    animateRotation()
	animateFlutterLeaves()
	animatePetalsFlutter()
	// render scene with the camera
    renderer.render(scene, camera);


    camera.position.z += 0.1;
	const zLimit = 0; 

//limit the camera´s position along the y-axis
	if (camera.position.y < zLimit) {
		camera.position.y = zLimit;
	}

	// update controls for camera movement
	controls.update();

}
// function to animate night scene
function animateNightScene(){
	// update the raindrops possition based on their velocity
	points.forEach(p => {
		p.velocity -= 0.01 + Math.random() * 0.01
		p.y += p.velocity
		if(p.y < -200){
			p.y = 200
			p.velocity = 0
		}
	})
	// update the positions of raindrops in the geometry
	const positions = rainGeo.attributes.position.array;
	for (let i = 0; i < points.length; i++) {
		const index = i * 3;
		positions[index] = points[i].x;
		positions[index + 1] = points[i].y;
		positions[index + 2] = points[i].z;
	}
// update the rain geometry to reflect positions changes
	rainGeo.attributes.position.needsUpdate = true;
	// Update the position of point lights in the scene
	pLights.forEach(l => l.update())
 

// Move the camera along the z-axis
    camera.position.z += 0.1;
	const zLimit = 0; 
	camera.lookAt(flowerPivot.position);


	if (camera.position.y < zLimit) {
		camera.position.y = zLimit;
	}
	controls.update();
    renderer.render(scene, camera)

}
let fireFliesInScene = false;
// function to create fireflies and add them to the scene
function createFireflies() {
    const colors = [0xbc00dd, 0xff006d, 0x04e762, 0xffdd00, 0x17ffee];
    let pLight;

    for (let i = 0; i < colors.length; i++) {
        pLight = getPointLight(colors[i]);
        scene.add(pLight.obj);
        pLights.push(pLight);
    }
}

// function to remove the fireflies form the scene
function removeFireflies() {
    pLights.forEach(firefly => scene.remove(firefly.obj));
    pLights = [];
    fireFliesInScene = false; // set the flag to indicate no fireflies are in the scene
}


let isRaining = false;
let rotationSpeed = 0.003;
let leftLeafRotation = 0.1
let rightLeafRotation = 0.1
let petalRotation = 0.02
//GUI controls
const gui = new GUI();
// Leaf Flutter controls
const leafFlutterFolder = gui.addFolder('Leaf Flutter');
const leftLeafFlutterRotation = leafFlutterFolder.add({ rotation: leftLeafRotation}, 'rotation', -1, 1).name('Left Leaf Rotation')
leftLeafFlutterRotation.onChange(function(value) {
	leftLeafRotation = value;
});

const rightLeafFlutterRotation = leafFlutterFolder.add({ rotation: rightLeafRotation}, 'rotation', -1, 1).name('Right Leaf Rotation')
rightLeafFlutterRotation.onChange(function(value) {
	// update the petal rotation based on the GUI input
	rightLeafRotation = value;
});

// Petal flutter controls
const petalFlutterFolder = gui.addFolder('Petal Flutter');
const petalFlutterRotation = petalFlutterFolder.add({ rotation: petalRotation}, 'rotation', -1, 1).name('Petal Rotation')
petalFlutterRotation.onChange(function(value) {
	petalRotation = value;
});

// sun rotation controls
const sunRotationSpeed = gui.addFolder('Sun Rotation');
const rotationSpeedController = sunRotationSpeed.add({ speed: rotationSpeed }, 'speed', -0.3, 0.3).name('Rotation Speed');
rotationSpeedController.onChange(function(value) {
	rotationSpeed = value;
});


function nightModeAnimations(){
	// move fireflies and update their positions
    points.forEach(p => {
		p.velocity -= 0.01 + Math.random() * 0.01
		p.y += p.velocity
		if(p.y < -200){
			p.y = 200
			p.velocity = 0
		}
	})
	// update the rain particle positions
	const positions = rainGeo.attributes.position.array;
	for (let i = 0; i < points.length; i++) {
		const index = i * 3;
		positions[index] = points[i].x;
		positions[index + 1] = points[i].y;
		positions[index + 2] = points[i].z;
	}
	// update rain particle geometry
	rainGeo.attributes.position.needsUpdate = true;
	// update pointlights
	pLights.forEach(l => l.update())

    camera.position.z += 0.1;
	const zLimit = 0; 


	if (camera.position.y < zLimit) {
		camera.position.y = zLimit;
	}

	// upate camera constrols
	controls.update();

	renderer.render( scene, camera );
 
}


nightMusic.volume = 0.08
dayMusic.volume = 0.08
let day = true
let rainBtn, fireflyBtn
function switchDayAndNight(){
    if (day){
		 // Night mode settings
        // change background, remove lights, add moon, play night music, etc.
        // Also handles the toggling of fireflies and rain
        scene.background = loader.load('assets/darkMode.svg');
        scene.remove(sunlight);
		scene.remove(directionalLight)
		scene.remove(light)
        flowerPivot.remove(sun)
		console.log(flowerPivot)
		btn.src = './assets/sun.png';
        scene.add(moon, moonlight)
		dayMusic.pause()
		nightMusic.play()
        nightModeAnimations()

        fireflyBtn = document.createElement('button');
        fireflyBtn.textContent = 'Add fireflies';
		fireflyBtn.id = 'fireflyButton'; 
        document.body.appendChild(fireflyBtn);

        rainBtn = document.createElement('button');
        rainBtn.textContent = 'Add rain';
		rainBtn.id = 'rainButton'
        document.body.appendChild(rainBtn);

		fireflyBtn.addEventListener('click', function() {
			if (fireFliesInScene) {
				createFireflies();
			} else {
				removeFireflies();
			}
			fireFliesInScene = !fireFliesInScene;
		});
		
		rainBtn.addEventListener('click', function() {
			if (!isRaining) {
				scene.add(rain);
				rainSound.play()
			} else {
				scene.remove(rain);
				rainSound.pause()
			}
			isRaining = !isRaining; 
		});
    }
    else{
		// Day mode settings
        // change background, add lights, add sun, play day music, etc.
        // Also handles the removal of fireflies and rain
        scene.background = loader.load('assets/lightMode.svg');
        scene.add(sunlight);
		nightMusic.pause()
		rainSound.pause()
		dayMusic.play()
        flowerPivot.add(sun);
		scene.add(directionalLight)
		scene.add(light)
		btn.src = './assets/moon.svg';
        scene.remove(moon, moonlight);
        removeFireflies()
		if (fireflyBtn) {
            document.body.removeChild(fireflyBtn);
            fireflyBtn = null;
        }

        if (rainBtn) {
            document.body.removeChild(rainBtn);
            rainBtn = null;
        }
        scene.remove(rain);
        animateDayScene();
    }
    day = !day; // Toggle day/night state
}


const btn = document.getElementById('img')
btn.addEventListener('click', switchDayAndNight)

function animate() {
	// Depending on the current mode, call either animateDayScene or animateNightScene
    if (day) {
        animateDayScene();
    } else {
        animateNightScene();
    }

    requestAnimationFrame(animate);
}

animate();
});
