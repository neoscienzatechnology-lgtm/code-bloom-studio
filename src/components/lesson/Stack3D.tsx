import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Layers, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { VisualTone } from "@/utils/visualTones";
import { prefersReducedMotion } from "@/utils/webgl";

// Visualização 3D de uma PILHA (LIFO), 100% procedural: blocos = BoxGeometry,
// número = Sprite (sempre de frente para a câmera). Empilhar/desempilhar mexe
// só no topo — o aluno sente o LIFO girando a estrutura. Carregado sob demanda
// (chunk "three" isolado) e só quando o aluno clica em "Ver em 3D".
//
// Cuidados de bateria/WebView: pixelRatio limitado, laço de render pausado
// quando fora de tela (IntersectionObserver), auto-rotação só quando ocioso, e
// dispose completo (geometria, materiais, texturas, contexto) ao desmontar.

const MAX_BLOCKS = 6;
const INITIAL = 3;
const BOX_H = 0.46;
const PITCH = 0.54; // altura + folga entre blocos

interface Block {
  group: THREE.Group;
  mat: THREE.MeshStandardMaterial;
  spriteMat: THREE.SpriteMaterial;
  tex: THREE.Texture;
  targetY: number;
  leaving: boolean;
}

const Stack3D = ({ tone }: { tone: VisualTone }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<{ push: () => void; pop: () => void } | null>(null);
  const [count, setCount] = useState(INITIAL);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 320;
    const height = mount.clientHeight || 240;
    const reduced = prefersReducedMotion();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(3.1, 2.7, 5.8);
    camera.lookAt(0, 1.4, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.touchAction = "none";
    renderer.domElement.style.cursor = "grab";

    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const dir = new THREE.DirectionalLight(0xffffff, 0.7);
    dir.position.set(4, 8, 6);
    scene.add(dir);

    const group = new THREE.Group();
    scene.add(group);

    // Base/plataforma da pilha
    const baseMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(tone.secondary), roughness: 0.7 });
    const base = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.18, 2.0), baseMat);
    base.position.y = -0.12;
    group.add(base);

    const boxGeo = new THREE.BoxGeometry(2.4, BOX_H, 1.5);
    const blocks: Block[] = [];
    let nextLabel = 0;

    const makeNumberTexture = (n: number): THREE.Texture => {
      const c = document.createElement("canvas");
      c.width = 128;
      c.height = 128;
      const ctx = c.getContext("2d")!;
      ctx.clearRect(0, 0, 128, 128);
      ctx.font = "bold 84px ui-sans-serif, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineWidth = 9;
      ctx.strokeStyle = "rgba(15,23,42,0.6)";
      ctx.strokeText(String(n), 64, 70);
      ctx.fillStyle = "#ffffff";
      ctx.fillText(String(n), 64, 70);
      const tex = new THREE.CanvasTexture(c);
      tex.anisotropy = 2;
      return tex;
    };

    const makeBlock = (label: number): Block => {
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(tone.primary),
        roughness: 0.5,
        metalness: 0.05,
        transparent: true,
        opacity: 1,
      });
      const box = new THREE.Mesh(boxGeo, mat);
      const tex = makeNumberTexture(label);
      const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(0.86, 0.86, 0.86);
      sprite.position.set(0, 0, 0.8);
      const g = new THREE.Group();
      g.add(box);
      g.add(sprite);
      group.add(g);
      return { group: g, mat, spriteMat, tex, targetY: 0, leaving: false };
    };

    // Recoloca alvos de altura e destaca o topo (único que entra/sai)
    const relayout = () => {
      const live = blocks.filter((b) => !b.leaving);
      live.forEach((b, i) => {
        b.targetY = BOX_H / 2 + i * PITCH;
        const isTop = i === live.length - 1;
        b.mat.color.set(new THREE.Color(isTop ? tone.accent : tone.primary));
      });
    };

    const liveCount = () => blocks.filter((b) => !b.leaving).length;

    const push = () => {
      if (liveCount() >= MAX_BLOCKS) return;
      nextLabel += 1;
      const b = makeBlock(nextLabel);
      b.group.position.y = BOX_H / 2 + liveCount() * PITCH + 1.6; // entra de cima
      blocks.push(b);
      relayout();
      setCount(liveCount());
    };

    const pop = () => {
      for (let i = blocks.length - 1; i >= 0; i -= 1) {
        if (!blocks[i].leaving) {
          blocks[i].leaving = true;
          blocks[i].targetY = blocks[i].group.position.y + 1.5; // sobe e some
          break;
        }
      }
      relayout();
      setCount(liveCount());
    };

    apiRef.current = { push, pop };

    // Pilha inicial, já posicionada
    for (let i = 0; i < INITIAL; i += 1) {
      nextLabel += 1;
      const b = makeBlock(nextLabel);
      b.group.position.y = BOX_H / 2 + i * PITCH;
      blocks.push(b);
    }
    relayout();

    // Arraste para girar
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      renderer.domElement.setPointerCapture(e.pointerId);
      renderer.domElement.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      group.rotation.y += (e.clientX - lastX) * 0.01;
      group.rotation.x = THREE.MathUtils.clamp(group.rotation.x + (e.clientY - lastY) * 0.008, -0.5, 0.6);
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onUp = (e: PointerEvent) => {
      dragging = false;
      try {
        renderer.domElement.releasePointerCapture(e.pointerId);
      } catch {
        /* ponteiro já solto */
      }
      renderer.domElement.style.cursor = "grab";
    };
    renderer.domElement.addEventListener("pointerdown", onDown);
    renderer.domElement.addEventListener("pointermove", onMove);
    renderer.domElement.addEventListener("pointerup", onUp);
    renderer.domElement.addEventListener("pointerleave", onUp);

    // Laço de render, pausável
    let raf = 0;
    let running = false;
    let last = performance.now();

    const frame = (now: number) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      let animating = false;
      for (let i = blocks.length - 1; i >= 0; i -= 1) {
        const b = blocks[i];
        const dy = b.targetY - b.group.position.y;
        if (Math.abs(dy) > 0.001) {
          b.group.position.y += dy * Math.min(1, dt * 9);
          animating = true;
        }
        if (b.leaving) {
          const o = Math.max(0, b.mat.opacity - dt * 2.4);
          b.mat.opacity = o;
          b.spriteMat.opacity = o;
          animating = true;
          if (o <= 0.02) {
            group.remove(b.group);
            b.mat.dispose();
            b.spriteMat.dispose();
            b.tex.dispose();
            blocks.splice(i, 1);
          }
        }
      }

      if (!animating && !dragging && !reduced) group.rotation.y += dt * 0.32;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    // Pausa quando sai da tela (rolagem) — economia de bateria
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0.1 },
    );
    io.observe(mount);

    const ro = new ResizeObserver(() => {
      const w = mount.clientWidth || width;
      const h = mount.clientHeight || height;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    ro.observe(mount);

    start();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onDown);
      renderer.domElement.removeEventListener("pointermove", onMove);
      renderer.domElement.removeEventListener("pointerup", onUp);
      renderer.domElement.removeEventListener("pointerleave", onUp);
      apiRef.current = null;
      for (const b of blocks) {
        b.mat.dispose();
        b.spriteMat.dispose();
        b.tex.dispose();
      }
      boxGeo.dispose();
      baseMat.dispose();
      base.geometry.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [tone]);

  return (
    <div className="mt-3 rounded-xl border border-border bg-card p-3">
      <div
        ref={mountRef}
        className="relative h-[240px] w-full overflow-hidden rounded-lg bg-gradient-to-b from-secondary/40 to-background"
      />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
          <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-primary">
            <Layers size={12} /> LIFO
          </span>
          {count} {count === 1 ? "bloco" : "blocos"} · arraste para girar
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => apiRef.current?.push()}
            disabled={count >= MAX_BLOCKS}
            className="gap-1 rounded-lg font-bold"
          >
            <Plus size={14} /> Empilhar
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => apiRef.current?.pop()}
            disabled={count <= 0}
            className="gap-1 rounded-lg font-bold"
          >
            <Minus size={14} /> Desempilhar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Stack3D;
