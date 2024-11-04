import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; 
import './styles.css';
import { initializePopup } from './popup';

function App() { //Creates a sphere, applys a texture to it, and places camera inside it
  const sphereRef = useRef(null); // Ref to store the sphere

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(15, 64, 64);
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('/6.png'); 
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    camera.position.set(0, 0.1, 0);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.minPolarAngle = Math.PI / 2;
    controls.maxPolarAngle = Math.PI / 2;
    controls.enableZoom = false;
    controls.enablePan = false;

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    sphereRef.current = sphere; // Set the sphere ref
    initializePopup(textureLoader, sphereRef); // Pass textureLoader and sphereRef
    animate();

    return () => {
      window.removeEventListener('resize', () => {});
      renderer.dispose();
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return <div></div>; // Render any UI if needed
}

export default App;
