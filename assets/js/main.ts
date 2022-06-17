import * as THREE from 'three';

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
camera.position.z = 1;

const scene = new THREE.Scene();
const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
const material = new THREE.MeshNormalMaterial();

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
let mouse = new THREE.Vector2()
let scroll = 0;
document.addEventListener('mousemove', onDocumentMouseMove, false);
window.addEventListener('resize', onWindowResize, false);
window.addEventListener("scroll", onScroll);

function onScroll(e) {
    scroll =
        ((document.documentElement.scrollTop || document.body.scrollTop) /
            ((document.documentElement.scrollHeight ||
                    document.body.scrollHeight) -
                document.documentElement.clientHeight))
}


function onDocumentMouseMove(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

const pointsPath = new THREE.CurvePath();
const bezierLine = new THREE.CubicBezierCurve3(
    new THREE.Vector3(.4, 0, 0.4),
    new THREE.Vector3(-0.5, -.5, -.2),
    new THREE.Vector3(1, -.5, 0),
    new THREE.Vector3(-2, 0.5, 1)
);

pointsPath.add(bezierLine);

// Debug the curve
// const lineGeometry = new THREE.BufferGeometry().setFromPoints(pointsPath.getPoints());
// const lineMaterial = new THREE.LineBasicMaterial({color: 0x000000});
// const line = new THREE.Line(lineGeometry, lineMaterial);
// scene.add(line);

animate();

function animate() {
    mesh.rotation.y = mouse.x;
    mesh.rotation.x = -mouse.y;

    const newPosition = pointsPath.getPoint(scroll);
    if (newPosition != null) {
        mesh.position.copy(newPosition);
    }

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
