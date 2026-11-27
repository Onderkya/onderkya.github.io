/* Onaz Studio · hafif three.js sahneleri. <div data-3d="petals|bubbles|pole|spool|aperture|paws|drop|road|sofa" data-colors="#hex,#hex"></div>
   Telefonda az nesne + düşük piksel oranı; görünmeyince durur; azaltılmış harekette tek kare. */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

const mobile = matchMedia('(max-width: 760px)').matches;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

function setup(el) {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none';
  if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
  el.appendChild(canvas);
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !mobile, powerPreference: 'low-power' }); }
  catch (e) { canvas.remove(); return null; }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, mobile ? 1.25 : 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0, 10);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x886655, 1.6));
  const dl = new THREE.DirectionalLight(0xffffff, 2.2); dl.position.set(3, 5, 6); scene.add(dl);
  function size() { const w = el.clientWidth || 1, h = el.clientHeight || 1; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
  size(); new ResizeObserver(size).observe(el);
  return { renderer, scene, camera, canvas };
}

const colorsOf = (el, def) => (el.dataset.colors || def).split(',').map(c => new THREE.Color(c.trim()));
const rand = (a, b) => a + Math.random() * (b - a);

const SCENES = {
  petals(el, s) {
    const cols = colorsOf(el, '#F4A7B9,#FFFFFF,#E8577F,#FFD3A5');
    const g = new THREE.PlaneGeometry(0.55, 0.8, 4, 4);
    const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); p.setZ(i, 0.35 * x * x + 0.12 * y * y); p.setX(i, x * (1 - 0.35 * (y + 0.4))); }
    g.computeVertexNormals();
    const n = mobile ? 16 : 30, m = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, roughness: 0.45, metalness: 0, emissive: 0x220a10, emissiveIntensity: 0.15 });
    const mesh = new THREE.InstancedMesh(g, m, n); s.scene.add(mesh);
    const d = [], o = new THREE.Object3D();
    for (let i = 0; i < n; i++) { d.push({ x: rand(-7, 7), y: rand(-5, 6), z: rand(-4, 2), r: rand(0, 6), sp: rand(0.25, 0.7), sw: rand(0.5, 1.6), s: rand(0.32, 0.62) }); mesh.setColorAt(i, cols[i % cols.length]); }
    new MutationObserver(() => { const c2 = colorsOf(el, '#FFFFFF'); for (let i = 0; i < n; i++) mesh.setColorAt(i, c2[i % c2.length]); mesh.instanceColor.needsUpdate = true; }).observe(el, { attributes: true, attributeFilter: ['data-colors'] });
    return t => { for (let i = 0; i < n; i++) { const q = d[i]; q.y -= q.sp * 0.016; if (q.y < -6) q.y = 6; o.position.set(q.x + Math.sin(t * q.sw + i) * 0.6, q.y, q.z); o.rotation.set(t * q.sw * 0.6 + q.r, t * 0.4 + q.r, Math.sin(t + i) * 0.8); o.scale.setScalar(q.s); o.updateMatrix(); mesh.setMatrixAt(i, o.matrix); } mesh.instanceMatrix.needsUpdate = true; };
  },
  bubbles(el, s) {
    /* Canlı köpük: hep yukarı çıkar, sallanır, üst kısımda patlar (halka büyür, söner, damlacıklar saçılır), alttan yenisi gelir. */
    const g = new THREE.SphereGeometry(1, mobile ? 20 : 28, mobile ? 14 : 20);
    const n = +el.dataset.count || (mobile ? 14 : 30);
    const pop = new Float32Array(n); g.setAttribute('aPop', new THREE.InstancedBufferAttribute(pop, 1));
    const m = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, uniforms: { t: { value: 0 } },
      vertexShader: 'attribute float aPop; varying float vP; varying vec3 vN; varying vec3 vV; void main(){ vP = aPop; vec4 p = vec4(position,1.0); vec3 n = normal;\n#ifdef USE_INSTANCING\n p = instanceMatrix * p; n = mat3(instanceMatrix) * normal;\n#endif\n vec4 mv = modelViewMatrix * p; vN = normalize(normalMatrix * n); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }',
      fragmentShader: 'uniform float t; varying float vP; varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.0); vec3 c = 0.5 + 0.5 * cos(6.2831 * (f * 1.3 + t * 0.08 + vec3(0.0, 0.33, 0.67))); vec3 col = mix(vec3(1.0), c, 0.6); float hl = smoothstep(0.82, 1.0, dot(normalize(vN), normalize(vec3(-0.4, 0.6, 0.7)))); float a = (f * 0.8 + hl * 0.7 + 0.03) * (1.0 - vP); gl_FragColor = vec4(col + hl, a); }'
    });
    const mesh = new THREE.InstancedMesh(g, m, n); s.scene.add(mesh);
    /* damlacıklar */
    const DP = 10, ND = n * DP, dPos = new Float32Array(ND * 3), dA = new Float32Array(ND), dV = new Float32Array(ND * 3);
    const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.BufferAttribute(dPos, 3)); dg.setAttribute('aA', new THREE.BufferAttribute(dA, 1));
    const dm = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { px: { value: s.renderer.getPixelRatio() } },
      vertexShader: 'attribute float aA; varying float vA; uniform float px; void main(){ vA = aA; vec4 mv = modelViewMatrix * vec4(position,1.0); gl_PointSize = (2.0 + 5.0 * aA) * px * (10.0 / -mv.z); gl_Position = projectionMatrix * mv; }',
      fragmentShader: 'varying float vA; void main(){ vec2 q = gl_PointCoord - 0.5; float d = length(q); if (d > 0.5) discard; gl_FragColor = vec4(1.0, 1.0, 1.0, vA * smoothstep(0.5, 0.15, d) * 0.9); }' });
    s.scene.add(new THREE.Points(dg, dm));
    const T = Math.tan(THREE.MathUtils.degToRad(s.camera.fov / 2));
    const half = z => (s.camera.position.z - z) * T;
    const d = [], o = new THREE.Object3D();
    function spawn(q, first) {
      q.z = rand(-3, 2); const h = half(q.z), w = h * Math.max(s.camera.aspect, 0.5);
      q.x = rand(-w, w); q.r = rand(0.12, mobile ? 0.42 : 0.55); q.y = first ? rand(-h, h * 0.8) : -h - q.r - rand(0, 1.5);
      q.sp = rand(0.55, 1.25); q.ph = rand(0, 6.28); q.top = h * rand(0.5, 0.95); q.p = 0; q.dead = 0;
    }
    for (let i = 0; i < n; i++) { const q = {}; spawn(q, true); d.push(q); }
    function burst(i, q) {
      for (let k = 0; k < DP; k++) { const j = i * DP + k, a = (k / DP) * 6.283 + rand(-0.3, 0.3), v = rand(0.8, 1.9) * q.r * 4;
        dPos[j * 3] = q.x + Math.cos(a) * q.r; dPos[j * 3 + 1] = q.y + Math.sin(a) * q.r; dPos[j * 3 + 2] = q.z;
        dV[j * 3] = Math.cos(a) * v; dV[j * 3 + 1] = Math.sin(a) * v + 0.4; dV[j * 3 + 2] = 0; dA[j] = 1; }
    }
    let last = 0;
    return t => {
      const dt = Math.min(0.05, last ? t - last : 0.016); last = t; m.uniforms.t.value = t;
      for (let i = 0; i < n; i++) {
        const q = d[i];
        if (q.dead > 0) { q.dead -= dt; if (q.dead <= 0) spawn(q, false); pop[i] = 1; o.scale.setScalar(0.0001); o.position.set(0, -50, 0); o.updateMatrix(); mesh.setMatrixAt(i, o.matrix); continue; }
        if (q.p > 0) { q.p += dt / 0.22; if (q.p >= 1) { q.p = 0; q.dead = rand(0.2, 1.4); pop[i] = 1; continue; } }
        else { q.y += q.sp * dt; if (q.y >= q.top) { q.p = 0.001; burst(i, q); } }
        pop[i] = q.p;
        const wob = Math.sin(t * 2.4 + q.ph) * 0.06;
        o.position.set(q.x + Math.sin(t * 0.9 + q.ph) * 0.25, q.y, q.z);
        const sc = q.r * (1 + q.p * 0.55);
        o.scale.set(sc * (1 + wob), sc * (1 - wob), sc); o.rotation.set(0, 0, Math.sin(t + q.ph) * 0.3);
        o.updateMatrix(); mesh.setMatrixAt(i, o.matrix);
      }
      for (let j = 0; j < ND; j++) { if (dA[j] <= 0) continue; dA[j] = Math.max(0, dA[j] - dt * 2.6); dV[j * 3 + 1] -= 3.2 * dt; dPos[j * 3] += dV[j * 3] * dt; dPos[j * 3 + 1] += dV[j * 3 + 1] * dt; }
      mesh.instanceMatrix.needsUpdate = true; g.attributes.aPop.needsUpdate = true; dg.attributes.position.needsUpdate = true; dg.attributes.aA.needsUpdate = true;
    };
  },
  sofa(el, s) {
    /* Döşeme demosu: data-age (1 eski → 0 yeni) ve data-color (#hex) değişince koltuk yenilenir. */
    function rbox(w, h, d, r, seg) {
      const g = new THREE.BoxGeometry(w, h, d, seg, seg, seg), pos = g.attributes.position, v = new THREE.Vector3(), c = new THREE.Vector3();
      const hx = w / 2 - r, hy = h / 2 - r, hz = d / 2 - r;
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        c.set(Math.max(-hx, Math.min(hx, v.x)), Math.max(-hy, Math.min(hy, v.y)), Math.max(-hz, Math.min(hz, v.z)));
        v.sub(c); if (v.lengthSq() > 0) v.setLength(r); v.add(c); pos.setXYZ(i, v.x, v.y, v.z);
      }
      g.computeVertexNormals(); return g;
    }
    const cv = document.createElement('canvas'); cv.width = cv.height = 256; const x = cv.getContext('2d');
    x.fillStyle = '#e8e8e8'; x.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 256; i += 2) { x.fillStyle = 'rgba(0,0,0,' + (0.04 + Math.random() * 0.05) + ')'; x.fillRect(i, 0, 1, 256); x.fillRect(0, i, 256, 1); }
    for (let i = 0; i < 2600; i++) { x.fillStyle = 'rgba(255,255,255,' + Math.random() * 0.12 + ')'; x.fillRect(Math.random() * 256, Math.random() * 256, 1, 1); }
    const tex = new THREE.CanvasTexture(cv); tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(3, 3); tex.colorSpace = THREE.SRGBColorSpace;
    const fab = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.92, metalness: 0 });
    const wood = new THREE.MeshStandardMaterial({ color: '#6b4428', roughness: 0.45, metalness: 0.05 });
    const seg = mobile ? 4 : 6, sofa = new THREE.Group();
    const add = (g, m, px, py, pz) => { const o = new THREE.Mesh(g, m); o.position.set(px, py, pz); sofa.add(o); return o; };
    add(rbox(4.6, 0.5, 1.9, 0.12, seg), fab, 0, 0.55, 0);                       /* taban */
    add(rbox(4.6, 1.5, 0.45, 0.16, seg), fab, 0, 1.35, -0.75);                  /* sırt */
    const armL = add(rbox(0.5, 1.05, 1.95, 0.2, seg), fab, -2.45, 1.0, 0.02), armR = add(rbox(0.5, 1.05, 1.95, 0.2, seg), fab, 2.45, 1.0, 0.02);
    const seats = [], backs = [];
    for (let i = -1; i <= 1; i++) { seats.push(add(rbox(1.42, 0.42, 1.5, 0.16, seg), fab, i * 1.47, 1.0, 0.12)); backs.push(add(rbox(1.38, 1.05, 0.38, 0.18, seg), fab, i * 1.47, 1.62, -0.42)); }
    const legs = [[-2.1, -0.75], [2.1, -0.75], [-2.1, 0.75], [2.1, 0.75]].map(p => add(new THREE.CylinderGeometry(0.07, 0.045, 0.32, 12), wood, p[0], 0.16, p[1]));
    /* yırtık: yaşla görünür */
    const tear = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.06), new THREE.MeshBasicMaterial({ color: '#20160f', transparent: true, opacity: 0 }));
    tear.rotation.x = -Math.PI / 2; tear.rotation.z = 0.5; tear.position.set(1.3, 1.215, 0.35); sofa.add(tear);
    /* yumuşak zemin gölgesi */
    const sc = document.createElement('canvas'); sc.width = sc.height = 128; const sx = sc.getContext('2d'), gr = sx.createRadialGradient(64, 64, 4, 64, 64, 64);
    gr.addColorStop(0, 'rgba(0,0,0,.45)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); sx.fillStyle = gr; sx.fillRect(0, 0, 128, 128);
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(7, 3.4), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.005; sofa.add(shadow);
    sofa.position.y = -1.1; s.scene.add(sofa);
    const fit = () => { const a = Math.max(0.45, el.clientWidth / Math.max(1, el.clientHeight)); s.camera.position.set(0, 2.2, Math.max(9.5, 7.6 / a + 2.2)); s.camera.lookAt(0, 0.1, 0); }; fit(); new ResizeObserver(fit).observe(el);
    const key = new THREE.SpotLight(0xfff1dc, 60, 30, 0.6, 0.6); key.position.set(-4, 7, 6); s.scene.add(key);
    const target = new THREE.Color(el.dataset.color || '#2f5d50'), cur = target.clone(), hsl = {};
    let age = +(el.dataset.age || 1), ageT = age;
    new MutationObserver(() => { target.set(el.dataset.color || '#2f5d50'); ageT = +(el.dataset.age || 0); }).observe(el, { attributes: true, attributeFilter: ['data-color', 'data-age'] });
    const base = seats.map(o => o.position.clone()), bBase = backs.map(o => o.position.clone());
    return t => {
      age += (ageT - age) * 0.08; cur.lerp(target, 0.08);
      const c = cur.clone(); c.getHSL(hsl); c.setHSL(hsl.h + 0.03 * age, hsl.s * (1 - 0.7 * age), Math.min(0.75, hsl.l + 0.14 * age)); fab.color.copy(c);
      seats.forEach((o, i) => { o.scale.y = 1 - 0.42 * age; o.position.y = base[i].y - 0.1 * age; o.rotation.z = (i - 1) * 0.07 * age + (i === 1 ? -0.04 * age : 0); o.rotation.x = 0.05 * age; });
      backs.forEach((o, i) => { o.rotation.x = 0.32 * age; o.rotation.z = (i - 1) * -0.08 * age; o.position.z = bBase[i].z + 0.12 * age; o.position.y = bBase[i].y - 0.1 * age; });
      armL.rotation.z = 0.04 * age; legs[3].scale.y = 1 - 0.35 * age; sofa.rotation.z = -0.012 * age;
      wood.color.setHSL(0.07, 0.45 - 0.25 * age, 0.29 - 0.08 * age); tear.material.opacity = Math.max(0, age - 0.25) / 0.75;
      sofa.rotation.y = Math.sin(t * 0.35) * 0.42 - 0.12;
    };
  },
  pole(el, s) {
    const c = document.createElement('canvas'); c.width = 256; c.height = 256; const x = c.getContext('2d');
    x.fillStyle = '#F3EEE6'; x.fillRect(0, 0, 256, 256);
    const cols = (el.dataset.colors || '#B3261E,#1F4FA3').split(',');
    for (let k = -2; k < 6; k++) { x.save(); x.translate(0, k * 64); x.transform(1, -0.5, 0, 1, 0, 0); x.fillStyle = cols[(k + 2) % cols.length]; x.fillRect(0, 0, 256, 26); x.restore(); }
    const tex = new THREE.CanvasTexture(c); tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(1, 2); tex.colorSpace = THREE.SRGBColorSpace;
    const grp = new THREE.Group();
    const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 5, 48, 1, true), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.25 }));
    const brass = new THREE.MeshStandardMaterial({ color: '#C9A063', metalness: 0.9, roughness: 0.25 });
    const cap1 = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, 0.5, 48), brass); cap1.position.y = 2.75;
    const cap2 = cap1.clone(); cap2.position.y = -2.75;
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.75, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), brass); dome.position.y = 3;
    grp.add(glass, cap1, cap2, dome); grp.rotation.z = 0.08; s.scene.add(grp); s.camera.position.z = 11;
    return t => { tex.offset.y = -t * 0.35; grp.rotation.y = Math.sin(t * 0.4) * 0.25; };
  },
  spool(el, s) {
    const cols = colorsOf(el, '#C23A2B,#F2C230,#2E4A7A');
    const grp = new THREE.Group(), wood = new THREE.MeshStandardMaterial({ color: '#D8B98A', roughness: 0.7 });
    for (let k = 0; k < 3; k++) {
      const sp = new THREE.Group();
      const core = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 1.5, 40), new THREE.MeshStandardMaterial({ color: cols[k % cols.length], roughness: 0.85 }));
      const r1 = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.14, 40), wood); r1.position.y = 0.82;
      const r2 = r1.clone(); r2.position.y = -0.82; sp.add(core, r1, r2);
      sp.position.set((k - 1) * 2.6, (k % 2 ? 0.5 : -0.3), -k * 0.4); sp.rotation.set(0.4, 0, 0.2 * (k - 1)); grp.add(sp);
    }
    const pts = []; for (let i = 0; i <= 120; i++) { const u = i / 120; pts.push(new THREE.Vector3(-6 + 12 * u, Math.sin(u * 9) * 0.6 - 1.8, Math.cos(u * 6) * 0.5)); }
    const thread = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 200, 0.03, 6), new THREE.MeshStandardMaterial({ color: cols[0], roughness: 0.6 }));
    grp.add(thread); s.scene.add(grp);
    return t => { grp.children.forEach((c, i) => { if (i < 3) c.rotation.y = t * (0.5 + i * 0.15); }); thread.rotation.x = Math.sin(t * 0.6) * 0.15; grp.rotation.y = Math.sin(t * 0.25) * 0.2; };
  },
  aperture(el, s) {
    const N = 7, grp = new THREE.Group(), cols = colorsOf(el, '#2A2724,#3A3632');
    const blade = new THREE.Shape(); blade.moveTo(0, 0); blade.lineTo(2.6, 0.2); blade.quadraticCurveTo(2.9, 1.3, 2.2, 2.0); blade.lineTo(0.2, 0.9); blade.closePath();
    const geo = new THREE.ExtrudeGeometry(blade, { depth: 0.05, bevelEnabled: false });
    const mat = new THREE.MeshStandardMaterial({ color: cols[0], metalness: 0.6, roughness: 0.35 });
    const blades = [];
    for (let i = 0; i < N; i++) { const p = new THREE.Group(), m = new THREE.Mesh(geo, mat); p.add(m); p.rotation.z = (i / N) * Math.PI * 2; grp.add(p); blades.push(m); }
    const ring = new THREE.Mesh(new THREE.TorusGeometry(3.1, 0.22, 16, 80), new THREE.MeshStandardMaterial({ color: '#C9A063', metalness: 0.9, roughness: 0.3 }));
    grp.add(ring); s.scene.add(grp); s.camera.position.z = 9.5;
    return t => { const k = (Math.sin(t * 0.9) + 1) / 2; blades.forEach(b => { b.position.set(0.3 + k * 0.9, 0.2, 0); b.rotation.z = 0.35 + k * 0.55; }); grp.rotation.z = t * 0.12; grp.rotation.x = Math.sin(t * 0.4) * 0.2; };
  },
  paws(el, s) {
    const cols = colorsOf(el, '#FF8A3D,#2BB3A3,#FFD166');
    const sh = new THREE.Shape(); sh.absellipse(0, -0.25, 0.5, 0.42, 0, Math.PI * 2);
    const toes = [[-0.5, 0.35], [-0.18, 0.62], [0.18, 0.62], [0.5, 0.35]].map(([x, y]) => { const t = new THREE.Shape(); t.absellipse(x, y, 0.17, 0.21, 0, Math.PI * 2); return t; });
    const geo = new THREE.ExtrudeGeometry([sh, ...toes], { depth: 0.12, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 2 });
    const n = mobile ? 8 : 14, mesh = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ roughness: 0.5 }), n); s.scene.add(mesh);
    const d = [], o = new THREE.Object3D();
    for (let i = 0; i < n; i++) { d.push({ x: rand(-7, 7), y: rand(-6, 6), z: rand(-3, 1), r: rand(0, 6), sp: rand(0.2, 0.5), s: rand(0.22, 0.42) }); mesh.setColorAt(i, cols[i % cols.length]); }
    return t => { for (let i = 0; i < n; i++) { const q = d[i]; q.y += q.sp * 0.012; if (q.y > 6.5) q.y = -6.5; o.position.set(q.x, q.y, q.z); o.rotation.set(Math.sin(t + i) * 0.5, t * 0.5 + q.r, q.r); o.scale.setScalar(q.s); o.updateMatrix(); mesh.setMatrixAt(i, o.matrix); } mesh.instanceMatrix.needsUpdate = true; };
  },
  drop(el, s) {
    const geo = new THREE.SphereGeometry(2, mobile ? 64 : 96, mobile ? 48 : 72), base = geo.attributes.position.array.slice();
    const mat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(el.dataset.color || '#B3122B'), roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.05, metalness: 0.1, sheen: 0.4 });
    const mesh = new THREE.Mesh(geo, mat); s.scene.add(mesh); s.camera.position.z = 8;
    const target = new THREE.Color(mat.color);
    new MutationObserver(() => target.set(el.dataset.color)).observe(el, { attributes: true, attributeFilter: ['data-color'] });
    const p = geo.attributes.position;
    return t => {
      for (let i = 0; i < p.count; i++) { const x = base[i * 3], y = base[i * 3 + 1], z = base[i * 3 + 2]; const k = 1 + 0.09 * Math.sin(x * 1.6 + t * 1.3) * Math.cos(y * 1.4 + t) + 0.05 * Math.sin(z * 2.2 + t * 1.7); p.setXYZ(i, x * k, y * k * 1.06, z * k); }
      p.needsUpdate = true; geo.computeVertexNormals(); mat.color.lerp(target, 0.06); mesh.rotation.y = t * 0.25;
    };
  },
  road(el, s) {
    const c = document.createElement('canvas'); c.width = 64; c.height = 256; const x = c.getContext('2d');
    x.fillStyle = '#3A4045'; x.fillRect(0, 0, 64, 256); x.fillStyle = el.dataset.line || '#FFD15C'; x.fillRect(28, 0, 8, 120);
    const tex = new THREE.CanvasTexture(c); tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(1, 14); tex.colorSpace = THREE.SRGBColorSpace;
    const road = new THREE.Mesh(new THREE.PlaneGeometry(4, 120), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9 }));
    road.rotation.x = -Math.PI / 2; road.position.set(0, -1.6, -50); s.scene.add(road);
    const side = new THREE.Mesh(new THREE.PlaneGeometry(40, 120), new THREE.MeshStandardMaterial({ color: el.dataset.side || '#E9D8B8', roughness: 1 }));
    side.rotation.x = -Math.PI / 2; side.position.set(0, -1.62, -50); s.scene.add(side);
    const posts = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.06, 0.06, 0.8, 6), new THREE.MeshStandardMaterial({ color: '#FFFFFF' }), 40), o = new THREE.Object3D();
    s.scene.add(posts); s.camera.position.set(0, 0.2, 6); s.camera.lookAt(0, -0.6, -20);
    return t => { tex.offset.y = t * 1.6; for (let i = 0; i < 40; i++) { const z = ((i * 6 + t * 12) % 120); o.position.set(i % 2 ? 2.6 : -2.6, -1.2, 6 - z); o.updateMatrix(); posts.setMatrixAt(i, o.matrix); } posts.instanceMatrix.needsUpdate = true; };
  }
};

function run(el) {
  const name = el.dataset['3d'], make = SCENES[name]; if (!make) return;
  const s = setup(el); if (!s) return;
  const step = make(el, s);
  let vis = false, raf = 0; const t0 = performance.now();
  const frame = () => { step((performance.now() - t0) / 1000); s.renderer.render(s.scene, s.camera); if (vis && !reduced) raf = requestAnimationFrame(frame); };
  new IntersectionObserver(es => { vis = es[0].isIntersecting; cancelAnimationFrame(raf); if (vis) frame(); }, { rootMargin: '80px' }).observe(el);
  if (reduced) { step(1.5); s.renderer.render(s.scene, s.camera); }
}
document.querySelectorAll('[data-3d]').forEach(run);
