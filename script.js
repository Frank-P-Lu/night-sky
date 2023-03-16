// import * as THREE from 'three';
// import * as TWEEN from 'tween.js';
import * as THREE from 'three';


function setupRenderer(renderer) {
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}


// Set up scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
setupRenderer(renderer)
camera.position.z = 5;

function createCircleMesh() {
    // Create the circle geometry
    const radius = 1; // Set the radius of the circle
    const segments = 32; // Set the number of segments used to create the circle
    const circleGeometry = new THREE.CircleGeometry(radius, segments);

    // Create the material for the circle
    const circleMaterial = new THREE.MeshBasicMaterial({ color: "#ffffff" });

    // Create the mesh for the circle
    const circleMesh = new THREE.Mesh(circleGeometry, circleMaterial);
    return circleMesh;
}


// Add the circle mesh to the scene
const c1 = createCircleMesh();

c1.position.set(1, 1, 0);

// Create a new tween
var t1 = new TWEEN.Tween({ x: 0, y: 0, z: 0 })
  .to({ x: 2, y: 3, z: -200 }, 5000) // Move the object to (2, 3, 4) in 1000ms
  .onUpdate((p) => {
    // Update the position of your object
    c1.position.set(p.x, p.y, p.z);
  });
t1.start();
scene.add(c1);

function getRandomCoord(min, max) {
  const x = Math.random() * (max.x - min.x) + min.x;
  const y = Math.random() * (max.y - min.y) + min.y;
  const z = Math.random() * (max.z - min.z) + min.z;
  return { x: x, y: y, z: z };
}

function getRandomStarCoord() {
    const min = { x: -200, y: -200, z: -200 };
    const max = { x: 200, y: 200, z: 0 };
    return getRandomCoord(min, max);
}

Array.from({length: 300}, createCircleMesh)
    .forEach(circleMesh => {
    const coord = getRandomStarCoord()
    circleMesh.position.set(coord.x, coord.y, coord.z);
    scene.add(circleMesh);
  });


function createColorTween(startColor, endColor, duration, mesh) {
    // Create a new tween object with the starting color's RGB values
    const tween = new TWEEN.Tween({ r: startColor.r, g: startColor.g, b: startColor.b })
        .to({ r: endColor.r, g: endColor.g, b: endColor.b }, duration)
        .yoyo(true)
        .repeat(Infinity)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate((color) => {
            // Update the object's color with the new values
            const newColor = new THREE.Color().setRGB(color.r, color.g, color.b);
            mesh.material.color.copy(newColor);
        })
        .onComplete(() => {
            // console.log('Animation complete');
            // circleMesh.material.color.copy(startColor);
        });

    // Return the tween object
    return tween;
}

// Create a new Tween instance and define its properties
const startColor = new THREE.Color('#000000'); // Start color as THREE.Color object
const endColor = new THREE.Color('#ffffff'); // End color as THREE.Color object
const duration = 2000; // Duration of tween in milliseconds
const tween = createColorTween(startColor, endColor, duration, c1);

// Start the animation
console.log("Starting animation")
tween.start();
// console.log(TWEEN);


function animate() {
    requestAnimationFrame(animate);


    renderer.render(scene, camera);
    TWEEN.update();
}

// var black = true;
// make circle blink
// setInterval(function () {
//     console.log("toggle");
//     if (black) {
//         circleMesh.material.color.set("#000000")
//     } else {
//         circleMesh.material.color.set("#ffffff")
//     }
//     black = !black;
// }, 500); // 500ms interval (half second)

animate();