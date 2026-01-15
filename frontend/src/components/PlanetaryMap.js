import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

function PlanetaryMap({ data }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Create Earth-like sphere
    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x2233ff, wireframe: true });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Add resource markers (e.g., water levels)
    data.regions?.forEach(region => {
      const marker = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
      marker.position.set(region.lat * 0.1, region.lon * 0.1, 5.5);  // Simplified positioning
      scene.add(marker);
    });

    camera.position.z = 10;
    const animate = () => {
      requestAnimationFrame(animate);
      sphere.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    return () => mountRef.current.removeChild(renderer.domElement);
  }, [data]);

  return <div ref={mountRef} style={{ width: '100%', height: '400px' }} />;
}

export default PlanetaryMap;
