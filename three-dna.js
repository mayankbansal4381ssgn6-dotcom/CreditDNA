// @ts-check
/**
 * @fileoverview Three.js DNA double helix animation for hero section
 */

/** @type {any} */
const THREE = window.THREE;

/**
 * Initialize and render a DNA double helix in the given canvas element
 * @param {HTMLCanvasElement} canvas
 * @returns {{ dispose: () => void }}
 */
export function initDNA(canvas) {
  if (!THREE) { console.warn('Three.js not loaded'); return { dispose: () => {} }; }

  // ── Scene setup ────────────────────────────────────
  const scene    = new THREE.Scene();
  const W = canvas.clientWidth  || canvas.offsetWidth  || 400;
  const H = canvas.clientHeight || canvas.offsetHeight || 600;
  const camera   = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
  camera.position.set(0, 0, 7);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.setClearColor(0x000000, 0);

  // ── Lighting ───────────────────────────────────────
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));

  const ptLight1 = new THREE.PointLight(0x22c55e, 2, 20);
  ptLight1.position.set(3, 3, 3);
  scene.add(ptLight1);

  const ptLight2 = new THREE.PointLight(0x16a34a, 1.5, 20);
  ptLight2.position.set(-3, -3, 2);
  scene.add(ptLight2);

  const ptLight3 = new THREE.PointLight(0xd4500f, 0.8, 15);
  ptLight3.position.set(0, 0, 5);
  scene.add(ptLight3);

  // ── Materials ──────────────────────────────────────
  const strandMat = new THREE.MeshPhongMaterial({
    color:     0x22c55e,
    emissive:  0x0a3d1a,
    shininess: 80,
    transparent: true,
    opacity: 0.92,
  });
  const strandMat2 = new THREE.MeshPhongMaterial({
    color:     0x16a34a,
    emissive:  0x061f0d,
    shininess: 80,
    transparent: true,
    opacity: 0.85,
  });
  const pairMat = new THREE.MeshPhongMaterial({
    color:     0x4ade80,
    emissive:  0x052e16,
    transparent: true,
    opacity: 0.6,
  });
  const accentMat = new THREE.MeshPhongMaterial({
    color:     0xd4500f,
    emissive:  0x3d1503,
    transparent: true,
    opacity: 0.7,
  });

  // ── DNA Geometry ───────────────────────────────────
  const group = new THREE.Group();
  scene.add(group);

  const TURNS   = 3.5;   // number of helix turns
  const HEIGHT  = 5.5;   // total height
  const RADIUS  = 1.2;   // helix radius
  const STEPS   = 80;    // smoothness of helix
  const PAIRS   = 14;    // number of base pairs

  // Strand sphere radius
  const SR = 0.07;
  const sphereGeo = new THREE.SphereGeometry(SR, 8, 8);

  // Build two strands
  for (let s = 0; s < 2; s++) {
    const phaseOffset = s === 0 ? 0 : Math.PI;
    const mat = s === 0 ? strandMat : strandMat2;

    for (let i = 0; i <= STEPS; i++) {
      const t     = i / STEPS;
      const angle = t * TURNS * Math.PI * 2 + phaseOffset;
      const y     = t * HEIGHT - HEIGHT / 2;
      const x     = Math.cos(angle) * RADIUS;
      const z     = Math.sin(angle) * RADIUS;

      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.position.set(x, y, z);
      // Vary size slightly for organic feel
      const scale = 0.8 + 0.4 * Math.sin(t * Math.PI * 6);
      mesh.scale.setScalar(scale);
      group.add(mesh);
    }
  }

  // Base pairs (rungs of the ladder)
  const pairGeo = new THREE.CylinderGeometry(0.04, 0.04, RADIUS * 2, 6);
  for (let p = 0; p < PAIRS; p++) {
    const t     = p / (PAIRS - 1);
    const angle = t * TURNS * Math.PI * 2;
    const y     = t * HEIGHT - HEIGHT / 2;
    const x1    = Math.cos(angle) * RADIUS;
    const z1    = Math.sin(angle) * RADIUS;
    const x2    = Math.cos(angle + Math.PI) * RADIUS;
    const z2    = Math.sin(angle + Math.PI) * RADIUS;

    const midX = (x1 + x2) / 2;
    const midZ = (z1 + z2) / 2;

    const mat = p % 3 === 0 ? accentMat : pairMat;
    const pair = new THREE.Mesh(pairGeo, mat);
    pair.position.set(midX, y, midZ);
    // Rotate cylinder to lie horizontal, pointing in the helix direction
    pair.rotation.z = Math.PI / 2;
    pair.rotation.y = angle;
    group.add(pair);

    // Small spheres at pair endpoints (nucleotides)
    const nGeo = new THREE.SphereGeometry(0.1, 8, 8);
    [[ x1, z1 ], [ x2, z2 ]].forEach(([nx, nz]) => {
      const n = new THREE.Mesh(nGeo, p % 3 === 0 ? accentMat : pairMat);
      n.position.set(nx, y, nz);
      group.add(n);
    });
  }

  // ── Particle cloud ─────────────────────────────────
  const particleCount = 120;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 5;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 7;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 3;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const pMat = new THREE.PointsMaterial({ color: 0x22c55e, size: 0.04, transparent: true, opacity: 0.5 });
  scene.add(new THREE.Points(pGeo, pMat));

  // ── Mouse parallax ─────────────────────────────────
  let mouseX = 0, mouseY = 0;
  const onMouse = (/** @type {MouseEvent} */ e) => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  window.addEventListener('mousemove', onMouse);

  // ── Resize handler ─────────────────────────────────
  const onResize = () => {
    const w = canvas.clientWidth  || canvas.offsetWidth  || 400;
    const h = canvas.clientHeight || canvas.offsetHeight || 600;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener('resize', onResize);

  // ── Animation loop ─────────────────────────────────
  let running = true;
  let raf = 0;

  const animate = () => {
    if (!running) return;
    raf = requestAnimationFrame(animate);

    const t = performance.now() * 0.001;
    group.rotation.y  = t * 0.35 + mouseX * 0.3;
    group.rotation.x  = mouseY * 0.15;
    group.position.y  = Math.sin(t * 0.4) * 0.08;

    // Pulsing light
    ptLight1.intensity = 2 + Math.sin(t * 1.5) * 0.5;

    renderer.render(scene, camera);
  };
  animate();

  return {
    dispose: () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    }
  };
}
