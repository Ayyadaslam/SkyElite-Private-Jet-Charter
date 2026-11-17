import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

interface TrustAtmosphereBackgroundProps {
  theme: 'light' | 'dark';
}

const _dummyObj = new THREE.Object3D();
const _tmpVec = new THREE.Vector3();

export function TrustAtmosphereBackground({ theme }: TrustAtmosphereBackgroundProps) {
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
    const height = container.clientHeight || 540;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 8.2);
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

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const hemiLight = new THREE.HemisphereLight(0xe2e8f0, 0x1e293b, 1.0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfffaf0, 1.8);
    keyLight.position.set(5, 6, 7);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x93c5fd, 1.1);
    rimLight.position.set(-6, -3, -4);
    scene.add(rimLight);

    const disposableGeos: THREE.BufferGeometry[] = [];

    // 1. Composite Precision Aviation Gimbal / Attitude Rings (Left & Right Depth Anchors)
    const gimbalGroup = new THREE.Group();
    gimbalGroup.position.set(0, 0.05, -1.8);
    scene.add(gimbalGroup);

    const ringOuterMat = new THREE.MeshPhysicalMaterial({
      color: themeRef.current === 'dark' ? 0x64748b : 0x94a3b8,
      metalness: 0.9,
      roughness: 0.22,
      clearcoat: 0.6,
      transparent: true,
      opacity: themeRef.current === 'dark' ? 0.36 : 0.32,
    });

    const ringInnerMat = new THREE.MeshStandardMaterial({
      color: themeRef.current === 'dark' ? 0x93c5fd : 0x475569,
      metalness: 0.8,
      roughness: 0.3,
      transparent: true,
      opacity: themeRef.current === 'dark' ? 0.28 : 0.24,
    });

    const outerRingGeo = new THREE.TorusGeometry(3.35, 0.014, 14, 128);
    const midRingGeo = new THREE.TorusGeometry(2.75, 0.011, 12, 112);
    const innerRingGeo = new THREE.TorusGeometry(2.15, 0.009, 12, 96);
    disposableGeos.push(outerRingGeo, midRingGeo, innerRingGeo);

    const outerRing = new THREE.Mesh(outerRingGeo, ringOuterMat);
    const midRing = new THREE.Mesh(midRingGeo, ringInnerMat);
    const innerRing = new THREE.Mesh(innerRingGeo, ringOuterMat);

    outerRing.rotation.x = Math.PI * 0.38;
    midRing.rotation.y = Math.PI * 0.25;
    innerRing.rotation.x = -Math.PI * 0.32;

    gimbalGroup.add(outerRing, midRing, innerRing);

    // 2. Flowing Stratospheric Laminar Slipstream Ribbons
    const streamGroup = new THREE.Group();
    scene.add(streamGroup);

    const streamMatPrimary = new THREE.MeshStandardMaterial({
      color: themeRef.current === 'dark' ? 0x93c5fd : 0x334155,
      emissive: themeRef.current === 'dark' ? 0x38bdf8 : 0x475569,
      emissiveIntensity: themeRef.current === 'dark' ? 0.35 : 0.12,
      roughness: 0.35,
      metalness: 0.45,
      transparent: true,
      opacity: themeRef.current === 'dark' ? 0.38 : 0.26,
    });

    const streamMatSecondary = new THREE.MeshStandardMaterial({
      color: themeRef.current === 'dark' ? 0x64748b : 0x64748b,
      roughness: 0.4,
      metalness: 0.5,
      transparent: true,
      opacity: themeRef.current === 'dark' ? 0.24 : 0.2,
    });

    const streamSpecs = [
      { yBase: 1.45, zBase: -0.9, amp: 0.42, freq: 0.55, phase: 0.0, primary: true },
      { yBase: 0.72, zBase: -1.4, amp: 0.35, freq: 0.48, phase: 1.3, primary: false },
      { yBase: -0.15, zBase: -2.1, amp: 0.48, freq: 0.42, phase: 2.5, primary: true },
      { yBase: -0.95, zBase: -1.2, amp: 0.34, freq: 0.62, phase: 3.7, primary: false },
      { yBase: -1.65, zBase: -0.7, amp: 0.38, freq: 0.52, phase: 4.9, primary: true },
    ];

    const streamCurves: {
      points: THREE.Vector3[];
      curve: THREE.CatmullRomCurve3;
      mesh: THREE.Mesh;
      spec: (typeof streamSpecs)[number];
    }[] = [];

    for (const spec of streamSpecs) {
      const pts: THREE.Vector3[] = [];
      const count = 18;
      for (let i = 0; i < count; i++) {
        const u = i / (count - 1);
        const x = -11 + u * 22;
        const y = spec.yBase + Math.sin(x * spec.freq + spec.phase) * spec.amp;
        const z = spec.zBase + Math.cos(x * 0.35 + spec.phase) * 0.55;
        pts.push(new THREE.Vector3(x, y, z));
      }
      const curve = new THREE.CatmullRomCurve3(pts);
      const tubeGeo = new THREE.TubeGeometry(curve, 96, spec.primary ? 0.015 : 0.01, 6, false);
      disposableGeos.push(tubeGeo);
      const mesh = new THREE.Mesh(tubeGeo, spec.primary ? streamMatPrimary : streamMatSecondary);
      streamGroup.add(mesh);
      streamCurves.push({ points: pts, curve, mesh, spec });
    }

    // 3. Instanced Stratospheric Altitude Motes (130 diamond crystals)
    const MOTE_COUNT = 130;
    const moteGeo = new THREE.OctahedronGeometry(0.032, 0);
    disposableGeos.push(moteGeo);

    const moteMat = new THREE.MeshStandardMaterial({
      color: themeRef.current === 'dark' ? 0xe2e8f0 : 0x334155,
      emissive: themeRef.current === 'dark' ? 0x60a5fa : 0x475569,
      emissiveIntensity: themeRef.current === 'dark' ? 0.55 : 0.15,
      roughness: 0.2,
      metalness: 0.7,
      transparent: true,
      opacity: themeRef.current === 'dark' ? 0.65 : 0.42,
    });

    const motes = new THREE.InstancedMesh(moteGeo, moteMat, MOTE_COUNT);
    motes.frustumCulled = false;
    scene.add(motes);

    const moteData: {
      x: number;
      y: number;
      z: number;
      speed: number;
      scale: number;
      phase: number;
    }[] = [];

    for (let i = 0; i < MOTE_COUNT; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 5.6;
      const z = -3.2 + Math.random() * 3.8;
      const speed = 0.25 + Math.random() * 0.55;
      const scale = 0.65 + Math.random() * 0.85;
      const phase = Math.random() * Math.PI * 2;
      moteData.push({ x, y, z, speed, scale, phase });

      _dummyObj.position.set(x, y, z);
      _dummyObj.scale.setScalar(scale);
      _dummyObj.updateMatrix();
      motes.setMatrixAt(i, _dummyObj.matrix);
    }
    motes.instanceMatrix.needsUpdate = true;
    motes.computeBoundingSphere();

    // Theme synchronization
    applyThemeRef.current = (mode: 'light' | 'dark') => {
      const isDark = mode === 'dark';

      ringOuterMat.color.setHex(isDark ? 0x64748b : 0x94a3b8);
      ringOuterMat.opacity = isDark ? 0.36 : 0.32;

      ringInnerMat.color.setHex(isDark ? 0x93c5fd : 0x475569);
      ringInnerMat.opacity = isDark ? 0.28 : 0.24;

      streamMatPrimary.color.setHex(isDark ? 0x93c5fd : 0x334155);
      streamMatPrimary.emissive.setHex(isDark ? 0x38bdf8 : 0x475569);
      streamMatPrimary.emissiveIntensity = isDark ? 0.35 : 0.12;
      streamMatPrimary.opacity = isDark ? 0.38 : 0.26;

      streamMatSecondary.opacity = isDark ? 0.24 : 0.2;

      moteMat.color.setHex(isDark ? 0xe2e8f0 : 0x334155);
      moteMat.emissive.setHex(isDark ? 0x60a5fa : 0x475569);
      moteMat.emissiveIntensity = isDark ? 0.55 : 0.15;
      moteMat.opacity = isDark ? 0.65 : 0.42;

      hemiLight.intensity = isDark ? 1.0 : 1.3;
      keyLight.intensity = isDark ? 1.8 : 1.5;
    };

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 540;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

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
        // Serene 3-axis gyroscope drift
        outerRing.rotation.z = elapsed * 0.12;
        outerRing.rotation.y = Math.sin(elapsed * 0.25) * 0.22;

        midRing.rotation.x = elapsed * 0.16;
        midRing.rotation.z = Math.cos(elapsed * 0.2) * 0.18;

        innerRing.rotation.y = -elapsed * 0.2;

        // Subtle slipstream wave undulation
        streamGroup.position.y = Math.sin(elapsed * 0.45) * 0.14;
        streamGroup.rotation.z = Math.sin(elapsed * 0.25) * 0.025;

        // Update instanced altitude motes along laminar flow
        for (let i = 0; i < MOTE_COUNT; i++) {
          const d = moteData[i];
          d.x += delta * d.speed;
          if (d.x > 10.5) d.x = -10.5;

          const floatY = d.y + Math.sin(elapsed * 0.8 + d.phase) * 0.16;
          _tmpVec.set(d.x, floatY, d.z);
          _dummyObj.position.copy(_tmpVec);
          _dummyObj.rotation.set(elapsed * 0.6 + d.phase, elapsed * 0.8, 0);
          _dummyObj.scale.setScalar(d.scale);
          _dummyObj.updateMatrix();
          motes.setMatrixAt(i, _dummyObj.matrix);
        }
        motes.instanceMatrix.needsUpdate = true;
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
      ringOuterMat.dispose();
      ringInnerMat.dispose();
      streamMatPrimary.dispose();
      streamMatSecondary.dispose();
      moteMat.dispose();
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
