import * as THREE from 'three';

function setupRenderer(renderer) {
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}


function createCircleMesh() {
    // Create the circle geometry
    const radius = 1; // Set the radius of the circle
    const segments = 16; // Set the number of segments used to create the circle
    const circleGeometry = new THREE.CircleGeometry(radius, segments);

    // Create the material for the circle
    const circleMaterial = new THREE.MeshBasicMaterial({ color: "#ffffff" });

    // Create the mesh for the circle
    const circleMesh = new THREE.Mesh(circleGeometry, circleMaterial);
    return circleMesh;
}


function getRandomCoord(min, max) {
    const x = Math.random() * (max.x - min.x) + min.x;
    const y = Math.random() * (max.y - min.y) + min.y;
    const z = Math.random() * (max.z - min.z) + min.z;
    return { x: x, y: y, z: z };
}

function getRandomStarCoord() {
    // Where stars spawn
    const min = { x: -window.innerWidth / 3 , y: -window.innerHeight / 3, z: -400 };
    const max = { x: window.innerWidth / 3, y: window.innerHeight / 3, z: -150 };
    return getRandomCoord(min, max);
}


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
        });

    // Return the tween object
    return tween;
}


function animate(scene, camera, renderer) {
    requestAnimationFrame(() => animate(scene, camera, renderer));
    renderer.render(scene, camera);
    TWEEN.update();

    // simple camera rotation
    camera.rotateZ(0.0001)
  }

function startBlinkTween(mesh) {
    // Makes a mesh tween from white to black and back.
    const startColor = new THREE.Color('#000000'); // Start color as THREE.Color object
    const endColor = new THREE.Color('#ffffff'); // End color as THREE.Color object
    const duration = 3000; // Duration of tween in milliseconds
    const tween = createColorTween(startColor, endColor, duration, mesh);
    tween.start();
}

function main() {
    // Set up scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    setupRenderer(renderer)
    camera.position.z = 5;

    const stars = Array.from({ length: 400 }, createCircleMesh);

    // Give each star a random position
    stars.forEach(circleMesh => {
            const coord = getRandomStarCoord()
            circleMesh.position.set(coord.x, coord.y, coord.z);
            scene.add(circleMesh);
        });

    // Select some stars to blink
    stars.slice(0, 50)
        .forEach(circleMesh => {
            startBlinkTween(circleMesh);
        });


    // Add the circle mesh to the scene
    const c1 = createCircleMesh();
    // // Create a new tween
    var t1 = new TWEEN.Tween({ x: 100, y: 0, z: 0 })
        .to({ x: 2, y: 3, z: -200 }, 5000) // Move the object to (2, 3, 4) in 1000ms
        .onUpdate((p) => {
            // Update the position of your object
            c1.position.set(p.x, p.y, p.z);
        });
    t1.start();
    scene.add(c1);

    console.log(window.innerWidth)

    // Start the animation
    animate(scene, camera, renderer);
}

main();