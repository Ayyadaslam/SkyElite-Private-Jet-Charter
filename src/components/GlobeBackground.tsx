import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

interface GlobeBackgroundProps {
  theme: 'light' | 'dark';
}

const HUB_COORDS: { code: string; lat: number; lon: number }[] = [
  { code: 'LAX', lat: 33.94, lon: -118.41 },
  { code: 'JFK', lat: 40.64, lon: -73.78 },
  { code: 'LHR', lat: 51.47, lon: -0.45 },
  { code: 'DXB', lat: 25.25, lon: 55.36 },
  { code: 'SIN', lat: 1.36, lon: 103.99 },
];

const ROUTE_PAIRS: [string, string][] = [
  ['LHR', 'JFK'],
  ['JFK', 'LAX'],
  ['DXB', 'LHR'],
  ['SIN', 'DXB'],
  ['LHR', 'SIN'],
];

// Simplified equirectangular continent polygons (lon, lat) for procedural 2D canvas Earth texture
const CONTINENT_POLYGONS: [number, number][][] = [
  // North America
  [
    [-168, 66], [-140, 70], [-95, 72], [-78, 62], [-56, 52], [-66, 44],
    [-76, 35], [-81, 25], [-89, 21], [-97, 26], [-105, 20], [-84, 9],
    [-78, 8], [-92, 14], [-108, 23], [-117, 32], [-125, 48], [-136, 58], [-162, 60],
  ],
  // Greenland
  [[-52, 60], [-42, 60], [-20, 72], [-25, 82], [-58, 81], [-62, 72]],
  // South America
  [
    [-78, 10], [-62, 10], [-50, 1], [-35, -6], [-39, -15], [-46, -24],
    [-54, -34], [-65, -43], [-68, -54], [-74, -52], [-73, -38], [-71, -18], [-81, -5],
  ],
  // Europe
  [
    [-9, 37], [-9, 43], [-2, 44], [-5, 48], [2, 51], [8, 54], [6, 61],
    [18, 70], [32, 69], [42, 66], [42, 45], [29, 41], [23, 38], [16, 38], [12, 43], [3, 43], [-5, 36],
  ],
  // UK & Ireland
  [[-6, 50], [1, 51], [0, 58], [-6, 57]],
  // Africa
  [
    [-17, 15], [-13, 28], [-6, 35], [10, 37], [15, 32], [32, 31], [35, 25],
    [43, 12], [51, 11], [41, -2], [40, -15], [33, -26], [20, -35], [14, -22],
    [12, -6], [8, 4], [-8, 5], [-16, 11],
  ],
  // Madagascar
  [[44, -25], [47, -25], [50, -13], [46, -15]],
  // Asia
  [
    [35, 36], [42, 42], [52, 40], [58, 52], [62, 68], [95, 74], [135, 70],
    [172, 66], [162, 55], [142, 52], [132, 42], [122, 38], [122, 30],
    [114, 22], [108, 16], [104, 2], [98, 8], [96, 16], [88, 22], [80, 12],
    [77, 8], [72, 20], [66, 25], [56, 26], [51, 25], [44, 13], [36, 28],
  ],
  // Japan
  [[130, 32], [136, 34], [141, 38], [145, 44], [140, 41], [134, 35]],
  // Australia
  [
    [114, -22], [122, -16], [131, -12], [137, -15], [142, -11], [150, -21],
    [153, -28], [149, -37], [139, -36], [129, -32], [116, -34], [113, -26],
  ],
  // Indonesia / Borneo
  [[96, 5], [106, -6], [115, -8], [118, 2], [110, 1], [102, -1]],
];

function latLonToVec3(lat: number, lon: number, radius: number, out: THREE.Vector3): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  out.set(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
  return out;
}

function createEarthTexture(mode: 'light' | 'dark', maxAnisotropy: number): THREE.CanvasTexture {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  const isDark = mode === 'dark';

  // Ocean gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  if (isDark) {
    bgGrad.addColorStop(0, '#0B131E');
    bgGrad.addColorStop(0.5, '#0F1A29');
    bgGrad.addColorStop(1, '#0A111A');
  } else {
    bgGrad.addColorStop(0, '#E3E9F0');
    bgGrad.addColorStop(0.5, '#EDF1F6');
    bgGrad.addColorStop(1, '#DFE6EE');
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle equirectangular grid lines
  ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.08)' : 'rgba(32, 42, 54, 0.07)';
  ctx.lineWidth = 1;
  for (let lon = -150; lon <= 180; lon += 30) {
    const x = ((lon + 180) / 360) * width;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let lat = -60; lat <= 60; lat += 30) {
    const y = ((90 - lat) / 180) * height;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Continents
  ctx.fillStyle = isDark ? '#243447' : '#C3CDD8';
  ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.35)' : 'rgba(32, 42, 54, 0.25)';
  ctx.lineWidth = 1.5;

  for (const poly of CONTINENT_POLYGONS) {
    ctx.beginPath();
    poly.forEach(([lon, lat], idx) => {
      const x = ((lon + 180) / 360) * width;
      const y = ((90 - lat) / 180) * height;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.min(8, maxAnisotropy);
  tex.needsUpdate = true;
  return tex;
}

const _tmpA = new THREE.Vector3();
const _tmpB = new THREE.Vector3();
const _tmpMid = new THREE.Vector3();

export function GlobeBackground({ theme }: GlobeBackgroundProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef(theme);
  const applyThemeRef = useRef<((mode: 'light' | 'dark') => void) | null>(null);

  useEffect(() => {
    themeRef.current = theme;
    applyThemeRef.current?.(theme);
  }, [theme]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Software WebGL guard per Three.js guidelines
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 720;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.55, 6.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    // Studio environment reflection
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    // 3-Point Balanced Studio Rig
    const hemiLight = new THREE.HemisphereLight(0xe2e8f0, 0x1e293b, 0.9);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff8ed, 1.8);
    keyLight.position.set(6, 5, 7);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x94a3b8, 1.1);
    rimLight.position.set(-6, -2, -5);
    scene.add(rimLight);

    // Composite 3D Globe Group (Multi-part assembly)
    const globeGroup = new THREE.Group();
    globeGroup.rotation.z = THREE.MathUtils.degToRad(14);
    globeGroup.rotation.x = THREE.MathUtils.degToRad(12);
    scene.add(globeGroup);

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const lightTex = createEarthTexture('light', maxAniso);
    const darkTex = createEarthTexture('dark', maxAniso);

    const GLOBE_RADIUS = 2.45;

    // Part 1: Primary Earth Sphere
    const earthGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 48);
    const earthMat = new THREE.MeshStandardMaterial({
      map: themeRef.current === 'dark' ? darkTex : lightTex,
      roughness: 0.72,
      metalness: 0.12,
      envMapIntensity: 0.7,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    globeGroup.add(earthMesh);

    // Part 2: Outer Lat/Long Graticule Cage
    const cageGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.012, 24, 16);
    const cageMat = new THREE.MeshBasicMaterial({
      color: themeRef.current === 'dark' ? 0x64748b : 0x475569,
      wireframe: true,
      transparent: true,
      opacity: themeRef.current === 'dark' ? 0.14 : 0.1,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    globeGroup.add(cageMesh);

    // Part 3: Atmospheric Rim Shell
    const atmosGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.08, 48, 36);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: themeRef.current === 'dark' ? 0x38bdf8 : 0x94a3b8,
      transparent: true,
      opacity: themeRef.current === 'dark' ? 0.08 : 0.12,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    globeGroup.add(atmosMesh);

    // Part 4: Equatorial Orbital Ring
    const orbitGeo = new THREE.TorusGeometry(GLOBE_RADIUS * 1.18, 0.008, 12, 128);
    const orbitMat = new THREE.MeshStandardMaterial({
      color: themeRef.current === 'dark' ? 0x94a3b8 : 0x334155,
      metalness: 0.85,
      roughness: 0.25,
      transparent: true,
      opacity: 0.35,
    });
    const orbitMesh = new THREE.Mesh(orbitGeo, orbitMat);
    orbitMesh.rotation.x = Math.PI / 2;
    globeGroup.add(orbitMesh);

    // Part 5: Hub Beacons & Curved Great-Circle Flight Arcs
    const hubMap = new Map<string, THREE.Vector3>();
    const beaconGeo = new THREE.SphereGeometry(0.048, 16, 16);
    const beaconRingGeo = new THREE.RingGeometry(0.065, 0.095, 24);
    const beaconMat = new THREE.MeshStandardMaterial({
      color: themeRef.current === 'dark' ? 0xf8fafc : 0x202a36,
      emissive: themeRef.current === 'dark' ? 0x93c5fd : 0x202a36,
      emissiveIntensity: 0.65,
      roughness: 0.25,
      metalness: 0.5,
    });
    const beaconRingMat = new THREE.MeshBasicMaterial({
      color: themeRef.current === 'dark' ? 0x93c5fd : 0x202a36,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
    });

    for (const hub of HUB_COORDS) {
      const pos = latLonToVec3(hub.lat, hub.lon, GLOBE_RADIUS * 1.015, new THREE.Vector3());
      hubMap.set(hub.code, pos);

      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.copy(pos);
      globeGroup.add(beacon);

      const ring = new THREE.Mesh(beaconRingGeo, beaconRingMat);
      ring.position.copy(pos).multiplyScalar(1.003);
      ring.lookAt(pos.clone().multiplyScalar(2));
      globeGroup.add(ring);
    }

    const arcMat = new THREE.MeshStandardMaterial({
      color: themeRef.current === 'dark' ? 0xe2e8f0 : 0x202a36,
      emissive: themeRef.current === 'dark' ? 0x60a5fa : 0x334155,
      emissiveIntensity: 0.45,
      roughness: 0.3,
      metalness: 0.4,
      transparent: true,
      opacity: 0.75,
    });

    const travelerGeo = new THREE.SphereGeometry(0.032, 12, 12);
    const travelerMat = new THREE.MeshBasicMaterial({
      color: themeRef.current === 'dark' ? 0xffffff : 0x0f172a,
    });

    const routeTravelers: { curve: THREE.QuadraticBezierCurve3; mesh: THREE.Mesh; offset: number }[] = [];
    const disposableGeos: THREE.BufferGeometry[] = [
      earthGeo,
      cageGeo,
      atmosGeo,
      orbitGeo,
      beaconGeo,
      beaconRingGeo,
      travelerGeo,
    ];

    ROUTE_PAIRS.forEach(([fromCode, toCode], idx) => {
      const start = hubMap.get(fromCode);
      const end = hubMap.get(toCode);
      if (!start || !end) return;

      _tmpA.copy(start);
      _tmpB.copy(end);
      const dist = _tmpA.distanceTo(_tmpB);
      _tmpMid.copy(_tmpA).add(_tmpB).multiplyScalar(0.5).normalize().multiplyScalar(GLOBE_RADIUS + dist * 0.36);

      const curve = new THREE.QuadraticBezierCurve3(_tmpA.clone(), _tmpMid.clone(), _tmpB.clone());
      const tubeGeo = new THREE.TubeGeometry(curve, 44, 0.011, 8, false);
      disposableGeos.push(tubeGeo);
      const arcMesh = new THREE.Mesh(tubeGeo, arcMat);
      globeGroup.add(arcMesh);

      const traveler = new THREE.Mesh(travelerGeo, travelerMat);
      globeGroup.add(traveler);
      routeTravelers.push({ curve, mesh: traveler, offset: idx * 0.21 });
    });

    // Dynamic Light / Dark theme synchronization without recreating WebGL context
    applyThemeRef.current = (mode: 'light' | 'dark') => {
      const isDark = mode === 'dark';
      earthMat.map = isDark ? darkTex : lightTex;
      earthMat.needsUpdate = true;

      cageMat.color.setHex(isDark ? 0x64748b : 0x475569);
      cageMat.opacity = isDark ? 0.14 : 0.1;

      atmosMat.color.setHex(isDark ? 0x38bdf8 : 0x94a3b8);
      atmosMat.opacity = isDark ? 0.08 : 0.12;

      orbitMat.color.setHex(isDark ? 0x94a3b8 : 0x334155);

      beaconMat.color.setHex(isDark ? 0xf8fafc : 0x202a36);
      beaconMat.emissive.setHex(isDark ? 0x93c5fd : 0x202a36);
      beaconRingMat.color.setHex(isDark ? 0x93c5fd : 0x202a36);

      arcMat.color.setHex(isDark ? 0xe2e8f0 : 0x202a36);
      arcMat.emissive.setHex(isDark ? 0x60a5fa : 0x334155);

      travelerMat.color.setHex(isDark ? 0xffffff : 0x0f172a);

      hemiLight.intensity = isDark ? 0.9 : 1.35;
      keyLight.intensity = isDark ? 1.8 : 1.5;
    };

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // ResizeObserver for full-width responsive container sizing
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 720;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Animation loop with Software-WebGL pacing
    let frameId = 0;
    let disposed = false;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync?.(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      if (!sync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      gl.flush();
      const poll = () => {
        if (disposed) {
          gl.deleteSync(sync);
          return;
        }
        const state = gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        globeGroup.rotation.y += delta * 0.15;
        orbitMesh.rotation.z = elapsed * 0.08;

        for (let i = 0; i < routeTravelers.length; i++) {
          const item = routeTravelers[i];
          const t = (elapsed * 0.22 + item.offset) % 1;
          item.curve.getPointAt(t, _tmpA);
          item.mesh.position.copy(_tmpA);
        }
      }

      renderer.render(scene, camera);

      if (prefersReducedMotion) return;

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();

      disposableGeos.forEach((g) => g.dispose());
      earthMat.dispose();
      cageMat.dispose();
      atmosMat.dispose();
      orbitMat.dispose();
      beaconMat.dispose();
      beaconRingMat.dispose();
      arcMat.dispose();
      travelerMat.dispose();
      lightTex.dispose();
      darkTex.dispose();
      envTarget.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
