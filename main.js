import * as THREE from 'three';
import './styles.css'
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import gsap from 'gsap';

// Configuração da cena
const scene = new THREE.Scene();

// Configuração da geometria e material da esfera
const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({
    color: "00ff83",
    roughness: 0.5,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
}

// Configuração da luz
const light = new THREE.PointLight(0xffffff, 100, 100);
light.position.set(0, 10, 10); // Ajustando a posição da luz
scene.add(light);

// Configuração da câmera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1 ,100);
camera.position.z = 20;
scene.add(camera);


// Configuração do WebGLRenderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2)
renderer.render(scene, camera)

//Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false
controls.autoRotate = true
controls.autoRotateSpeed = 5

//Resize
window.addEventListener('resize', () => {
    //Update Sizes
    console.log(window.innerWidth)
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    //Update Camera

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
})

const loop = () => {
    renderer.render(scene, camera)
    window.requestAnimationFrame(loop)
    controls.update()
}
loop()

//Timeline magic
const tl = gsap.timeline({defaults: {duration: 1}})
tl.fromTo(mesh.scale, {z:0, x:0, y:0}, {z:1, x:1, y:1})
tl.fromTo('nav', {y: "-100%"}, {y: "0%"})
tl.fromTo(".title", { opacity: 0}, {opacity: 1})

//Mouse Animation Color
let moouseDown = false
let rgb = [12, 23, 55]
window.addEventListener('mousedown', () => (moouseDown = true))
window.addEventListener('mouseup', () => (moouseDown = false))

window.addEventListener('mousemove', (e) => {
    if(moouseDown) {
        rgb = [
            Math.round((e.pageX / sizes.width) * 255),
            Math.round((e.pageY / sizes.height) * 255),
            150,
        ]
        //Lets animate
        let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
        gsap.to(mesh.material.color, {
            r: newColor.r,
            g: newColor.g,
            b: newColor.b,
        })
    }
})