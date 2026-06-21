import { useEffect, useRef } from "react";
import * as THREE from "three";
import { prefersReducedMotion } from "@/utils/webgl";

// Fundo 3D vivo do hero CodeTier: uma malha neon que ondula e recua na névoa
// (um "terreno de dados"). Carregado sob demanda (chunk three isolado), com o
// PNG estático servindo de poster até montar.
//
// Cuidados de bateria: pixelRatio <= 2, render pausado fora de tela
// (IntersectionObserver) e com a aba oculta, sem animação em prefers-reduced-
// motion, e dispose completo (geometria, material, renderer, contexto) ao sair.
const HeroCanvas = ({ meshOpacity = 0.42 }: { meshOpacity?: number }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth || 800;
    let height = mount.clientHeight || 520;
    const reduced = prefersReducedMotion();

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0e0c, 0.05);

    const camera = new THREE.PerspectiveCamera(62, width / height, 0.1, 200);
    camera.position.set(0, 7, 14);
    camera.lookAt(0, 0, -8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Malha em wireframe deitada, recuando para o fundo.
    const SIZE = 90;
    const SEG = 88;
    const geo = new THREE.PlaneGeometry(SIZE, SIZE, SEG, SEG);
    geo.rotateX(-Math.PI / 2); // posição passa a ser (x, altura=0, z)
    geo.translate(0, 0, -22);
    const mat = new THREE.MeshBasicMaterial({ color: 0x2fd62a, wireframe: true, transparent: true, opacity: meshOpacity });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // Nós luminosos esparsos flutuando acima da malha.
    const NODES = 70;
    const nodeGeo = new THREE.BufferGeometry();
    const np = new Float32Array(NODES * 3);
    for (let i = 0; i < NODES; i++) {
      np[i * 3] = (Math.random() - 0.5) * SIZE;
      np[i * 3 + 1] = Math.random() * 6 + 0.5;
      np[i * 3 + 2] = -Math.random() * 60 + 6;
    }
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(np, 3));
    const nodeMat = new THREE.PointsMaterial({ color: 0x6df56a, size: 0.16, transparent: true, opacity: Math.min(0.9, meshOpacity * 1.9), sizeAttenuation: true });
    const nodes = new THREE.Points(nodeGeo, nodeMat);
    scene.add(nodes);

    const pos = geo.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    const applyWave = (t: number) => {
      for (let i = 0; i < arr.length; i += 3) {
        const x = arr[i];
        const z = arr[i + 2];
        arr[i + 1] =
          Math.sin(x * 0.22 + t) * 0.55 +
          Math.cos(z * 0.26 + t * 0.8) * 0.55 +
          Math.sin((x + z) * 0.12 + t * 0.5) * 0.35;
      }
      pos.needsUpdate = true;
    };

    let raf = 0;
    let t = 0;
    let visible = true;
    const clock = new THREE.Clock();

    const renderFrame = () => {
      raf = 0;
      t += clock.getDelta() * 0.55;
      applyWave(t);
      nodes.rotation.y = t * 0.03;
      camera.position.x = Math.sin(t * 0.13) * 1.4;
      camera.lookAt(0, 0.4, -8);
      renderer.render(scene, camera);
      schedule();
    };
    const schedule = () => {
      if (!raf && visible && !reduced && document.visibilityState === "visible") raf = requestAnimationFrame(renderFrame);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    // primeira pintura
    applyWave(0);
    renderer.render(scene, camera);
    if (!reduced) schedule();

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) schedule();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(mount);

    const onVisibility = () => {
      if (document.visibilityState === "visible") schedule();
      else stop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onResize = () => {
      width = mount.clientWidth || width;
      height = mount.clientHeight || height;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", onResize);

    // fade-in suave
    const canvas = renderer.domElement;
    canvas.style.opacity = "0";
    canvas.style.transition = "opacity 1.4s ease";
    const fadeId = window.setTimeout(() => {
      canvas.style.opacity = "1";
    }, 60);

    return () => {
      stop();
      window.clearTimeout(fadeId);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
      geo.dispose();
      mat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      renderer.dispose();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, [meshOpacity]);

  return <div ref={mountRef} className="h-full w-full" aria-hidden="true" />;
};

export default HeroCanvas;
