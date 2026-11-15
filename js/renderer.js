class AssetLoaderManager {
  constructor() {
    this.images = {};
    this.procedural = {};
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    this.initialized = true;

    this.tryLoadExternalImage('bg_menu', './assets/bg_menu.png');
    this.tryLoadExternalImage('menu_reference', './assets/menu_reference.jpg');

    const specs = window.GAME_DATA.specialists;
    const frames = ['front', 'left1', 'left2', 'left3', 'right1', 'right2', 'right3'];

    specs.forEach((spec) => {
      frames.forEach((frame) => {
        const key = `${spec.id}_${frame}`;
        this.procedural[key] = this.createCharacterSprite(spec, frame);
        this.tryLoadExternalImage(key, `./assets/${key}.png`);
      });
    });

    const props = [
      'prop_science',
      'prop_board',
      'prop_cleanroom',
      'prop_shaker',
      'prop_comms',
      'prop_launch'
    ];
    props.forEach((propKey) => {
      this.procedural[propKey] = this.createPropSprite(propKey);
      this.tryLoadExternalImage(propKey, `./assets/${propKey}.png`);
    });

    this.procedural['map_ksc'] = this.createKscMapSprite();
    this.tryLoadExternalImage('map_ksc', './assets/map_ksc.png');
  }

  tryLoadExternalImage(key, url) {
    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth > 0) {
        this.images[key] = img;

        if (key === 'menu_reference' || key === 'bg_menu') {
          this.procedural['menu_clean_bg'] = this.buildCleanMenuBgFromRef();
          if (window.GameApp) window.GameApp.drawMenuBackground();
        }

        if (key.endsWith('_front')) {
          const charId = key.replace('_front', '');
          delete this.procedural[`portrait_rect_${charId}_png`];
          delete this.procedural[`portrait_rect_${charId}_proc`];
          if (window.GameApp && typeof window.GameApp.refreshCharacterPreviews === 'function') {
            window.GameApp.refreshCharacterPreviews();
          }
        }
      }
    };
    img.onerror = () => {};
    img.src = url;
  }

  get(key) {
    return this.images[key] || this.procedural[key];
  }

  getPortraitDataUrl(charId) {
    const hasRealPng = Boolean(this.images[`${charId}_front`]);
    const cacheKey = `portrait_rect_${charId}_${hasRealPng ? 'png' : 'proc'}`;
    if (this.procedural[cacheKey]) return this.procedural[cacheKey];

    const c = document.createElement('canvas');
    c.width = 64;
    c.height = 84;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    ctx.fillStyle = '#0c0822';
    ctx.fillRect(0, 0, 64, 84);

    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fillRect(8, 10, 2, 2);
    ctx.fillRect(54, 14, 2, 2);
    ctx.fillRect(10, 60, 2, 2);

    const realImg = this.images[`${charId}_front`];
    if (realImg && realImg.naturalWidth > 0) {
      const sw = realImg.naturalWidth;
      const sh = realImg.naturalHeight;
      const cropX = Math.round(sw * 0.16);
      const cropY = Math.round(sh * 0.02);
      const cropW = Math.round(sw * 0.68);
      const cropH = Math.round(sh * 0.80);
      ctx.drawImage(realImg, cropX, cropY, cropW, cropH, 2, 4, 60, 76);
    } else {
      const procSprite = this.procedural[`${charId}_front`];
      if (procSprite) {
        ctx.drawImage(procSprite, 16, 4, 64, 76, 2, 4, 60, 76);
      }
    }

    const url = c.toDataURL('image/png');
    this.procedural[cacheKey] = url;
    return url;
  }

  buildCleanMenuBgFromRef() {
    const c = document.createElement('canvas');
    c.width = 1280;
    c.height = 720;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    if (this.images['bg_menu']) {
      ctx.drawImage(this.images['bg_menu'], 0, 0, 1280, 720);
      return c;
    }

    const ref = this.images['menu_reference'];
    if (!ref) return c;

    const sx = 4;
    const sy = 6;
    const sw = 481;
    const sh = 270;

    ctx.drawImage(ref, sx, sy, sw, sh, 0, 0, 1280, 720);

    for (let destX = 420; destX < 860; destX += 20) {
      ctx.drawImage(c, 360, 0, 24, 720, destX, 0, 22, 720);
    }

    const grad = ctx.createLinearGradient(390, 0, 890, 0);
    grad.addColorStop(0, 'rgba(34, 21, 78, 0)');
    grad.addColorStop(0.2, 'rgba(38, 24, 86, 0.72)');
    grad.addColorStop(0.5, 'rgba(46, 30, 98, 0.82)');
    grad.addColorStop(0.8, 'rgba(38, 24, 86, 0.72)');
    grad.addColorStop(1, 'rgba(34, 21, 78, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(390, 0, 500, 720);

    const starCoords = [
      [480, 95, 3], [590, 64, 2], [720, 110, 3], [790, 80, 2],
      [460, 210, 2], [540, 290, 3], [750, 250, 2], [815, 310, 3],
      [495, 430, 3], [640, 390, 2], [710, 470, 3], [785, 520, 2],
      [530, 590, 2], [680, 625, 3], [595, 670, 2], [450, 640, 3]
    ];
    starCoords.forEach(([x, y, sz]) => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.fillRect(x, y, sz, sz);
    });

    return c;
  }

  createCharacterSprite(spec, frame) {
    const c = document.createElement('canvas');
    c.width = 96;
    c.height = 96;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const stylesByChar = {
      char1: { hair: '#222226', skin: '#d8a57d', shirt: '#71a360', pants: '#6d4c33', tousled: true },
      char2: { hair: '#603922', skin: '#f1c49b', shirt: '#eb7527', pants: '#5c4028', tousled: false },
      char3: { hair: '#222226', skin: '#d8a57d', shirt: '#7ec4cf', pants: '#6d4c33', tousled: true },
      char4: { hair: '#603922', skin: '#f1c49b', shirt: '#7ec4cf', pants: '#5c4028', tousled: false }
    };
    const st = stylesByChar[spec.id] || stylesByChar.char1;

    const isLeft = frame.startsWith('left');
    const isRight = frame.startsWith('right');
    const stepIdx = frame.endsWith('1') ? 1 : frame.endsWith('2') ? 2 : frame.endsWith('3') ? 3 : 0;
    const bobY = stepIdx === 1 || stepIdx === 3 ? -2 : 0;

    ctx.save();
    ctx.translate(0, bobY);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(28, 84, 40, 6);

    ctx.fillStyle = st.pants;
    ctx.fillRect(34, 60, 12, 20);
    ctx.fillRect(50, 60, 12, 20);
    ctx.fillStyle = '#18181b';
    ctx.fillRect(32, 80, 14, 6);
    ctx.fillRect(50, 80, 14, 6);

    ctx.fillStyle = st.shirt;
    ctx.fillRect(28, 38, 40, 24);
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 2;
    ctx.strokeRect(28, 38, 40, 24);

    ctx.fillStyle = st.shirt;
    ctx.fillRect(20, 40, 8, 14);
    ctx.fillRect(68, 40, 8, 14);
    ctx.fillStyle = st.skin;
    ctx.fillRect(21, 54, 6, 8);
    ctx.fillRect(69, 54, 6, 8);

    ctx.fillStyle = st.skin;
    ctx.fillRect(30, 14, 36, 24);
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 14, 36, 24);

    ctx.fillStyle = st.hair;
    ctx.fillRect(26, 8, 44, 12);
    if (st.tousled) {
      ctx.fillRect(24, 14, 8, 22);
      ctx.fillRect(64, 14, 8, 22);
      ctx.fillRect(42, 18, 6, 4);
    } else {
      ctx.fillRect(26, 12, 6, 14);
      ctx.fillRect(64, 12, 6, 14);
    }

    if (!isLeft) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(52, 24, 7, 5);
      ctx.fillStyle = '#271c19';
      ctx.fillRect(53, 24, 4, 5);
    }
    if (!isRight) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(37, 24, 7, 5);
      ctx.fillStyle = '#271c19';
      ctx.fillRect(39, 24, 4, 5);
    }

    ctx.restore();
    return c;
  }

  createPropSprite(propKey) {
    const c = document.createElement('canvas');
    c.width = 144;
    c.height = 144;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fillRect(10, 114, 124, 18);
    ctx.fillRect(16, 110, 112, 24);

    const drawLabDeskBase = (topColor = '#334155', frontColor = '#1e293b', accentColor = '#38bdf8') => {

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(14, 108, 12, 16);
      ctx.fillRect(118, 108, 12, 16);
      ctx.fillStyle = '#475569';
      ctx.fillRect(16, 118, 8, 4);
      ctx.fillRect(120, 118, 8, 4);

      ctx.fillStyle = frontColor;
      ctx.fillRect(12, 66, 120, 48);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.strokeRect(12, 66, 120, 48);

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(18, 74, 32, 14);
      ctx.fillRect(18, 92, 32, 16);
      ctx.fillRect(54, 74, 36, 34);
      ctx.fillRect(94, 74, 32, 34);

      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(28, 79, 12, 3);
      ctx.fillRect(28, 98, 12, 3);
      ctx.fillStyle = accentColor;
      ctx.fillRect(60, 80, 24, 3);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(100, 80, 6, 6);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(110, 80, 6, 6);

      ctx.fillStyle = '#334155';
      for (let vy = 90; vy <= 102; vy += 4) {
        ctx.fillRect(60, vy, 24, 2);
        ctx.fillRect(100, vy, 20, 2);
      }

      ctx.fillStyle = topColor;
      ctx.fillRect(8, 54, 128, 14);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(8, 54, 128, 3);
      ctx.fillStyle = accentColor;
      ctx.fillRect(10, 64, 124, 3);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(8, 54, 128, 14);
    };

    if (propKey === 'prop_science') {

      drawLabDeskBase('#1e3a8a', '#172554', '#38bdf8');

      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(16, 48, 22, 6);
      ctx.fillRect(20, 28, 6, 20);
      ctx.fillRect(22, 24, 12, 6);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(18, 40, 16, 3);
      ctx.fillRect(30, 18, 6, 8);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(28, 30, 4, 8);

      ctx.fillStyle = '#64748b';
      ctx.fillRect(50, 50, 18, 4);
      ctx.fillRect(57, 44, 4, 6);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(48, 22, 22, 22);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(52, 26, 8, 6);
      ctx.fillRect(58, 34, 8, 7);
      ctx.fillRect(50, 36, 5, 5);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(48, 22, 22, 22);

      ctx.fillStyle = '#facc15';
      ctx.fillRect(44, 31, 30, 3);

      ctx.fillStyle = '#334155';
      ctx.fillRect(78, 18, 24, 36);
      ctx.fillStyle = '#064e3b';
      ctx.fillRect(81, 23, 18, 26);
      ctx.fillStyle = '#10b981';
      ctx.fillRect(84, 30, 12, 16);
      ctx.fillStyle = '#a7f3d0';
      ctx.fillRect(86, 26, 3, 3);
      ctx.fillRect(91, 34, 4, 4);
      ctx.strokeStyle = '#e2e8f0';
      ctx.strokeRect(78, 18, 24, 36);

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(106, 24, 26, 24);
      ctx.strokeStyle = '#38bdf8';
      ctx.strokeRect(106, 24, 26, 24);
      ctx.fillStyle = '#334155';
      ctx.fillRect(115, 48, 8, 6);
      ctx.fillStyle = '#22d3ee';
      ctx.fillRect(110, 30, 18, 3);
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(110, 36, 12, 3);
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(110, 41, 15, 3);
    } else if (propKey === 'prop_board') {

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(20, 78, 10, 44);
      ctx.fillRect(114, 78, 10, 44);
      ctx.fillStyle = '#475569';
      ctx.fillRect(14, 114, 22, 8);
      ctx.fillRect(108, 114, 22, 8);

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(10, 12, 124, 74);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 12, 124, 74);

      ctx.fillStyle = '#1d4ed8';
      ctx.fillRect(14, 16, 116, 10);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(18, 19, 28, 4);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(108, 19, 6, 4);
      ctx.fillRect(118, 19, 6, 4);

      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(18, 30, 32, 44);
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(22, 34, 24, 5);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(22, 43, 22, 3);
      ctx.fillRect(22, 49, 20, 3);
      ctx.fillRect(22, 55, 24, 3);

      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(36, 62, 10, 10);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(38, 64, 6, 6);

      ctx.fillStyle = '#172554';
      ctx.fillRect(54, 30, 40, 44);
      ctx.strokeStyle = '#38bdf8';
      ctx.strokeRect(54, 30, 40, 44);

      ctx.fillStyle = '#22c55e';
      ctx.fillRect(60, 58, 6, 12);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(69, 50, 6, 20);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(78, 42, 6, 28);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(58, 35, 28, 3);

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(98, 30, 28, 44);
      ctx.strokeStyle = '#a855f7';
      ctx.strokeRect(98, 30, 28, 44);
      ctx.fillStyle = '#c084fc';
      ctx.fillRect(102, 35, 20, 4);
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(102, 44, 6, 6);
      ctx.fillRect(102, 54, 6, 6);
      ctx.fillRect(102, 64, 6, 6);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(111, 46, 12, 3);
      ctx.fillRect(111, 56, 12, 3);
      ctx.fillRect(111, 66, 12, 3);

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(46, 86, 52, 34);
      ctx.strokeStyle = '#ffffff';
      ctx.strokeRect(46, 86, 52, 34);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(52, 92, 40, 10);
    } else if (propKey === 'prop_cleanroom') {

      drawLabDeskBase('#0369a1', '#0f172a', '#22d3ee');

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(14, 8, 116, 12);
      ctx.strokeStyle = '#e2e8f0';
      ctx.strokeRect(14, 8, 116, 12);
      ctx.fillStyle = '#e0f2fe';
      ctx.fillRect(20, 17, 104, 3);

      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(22, 20, 6, 18);
      ctx.fillRect(22, 34, 18, 5);
      ctx.fillStyle = '#f97316';
      ctx.fillRect(38, 32, 6, 9);

      ctx.fillStyle = '#0284c7';
      ctx.fillRect(16, 52, 112, 6);

      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(64, 48, 16, 6);

      ctx.fillStyle = '#1d4ed8';
      ctx.fillRect(24, 28, 30, 18);
      ctx.fillRect(90, 28, 30, 18);
      ctx.strokeStyle = '#93c5fd';
      ctx.lineWidth = 2;
      ctx.strokeRect(24, 28, 30, 18);
      ctx.strokeRect(90, 28, 30, 18);

      ctx.fillStyle = '#60a5fa';
      ctx.fillRect(33, 29, 2, 16);
      ctx.fillRect(43, 29, 2, 16);
      ctx.fillRect(99, 29, 2, 16);
      ctx.fillRect(109, 29, 2, 16);

      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(54, 22, 36, 28);
      ctx.fillStyle = '#fde047';
      ctx.fillRect(58, 26, 12, 10);
      ctx.strokeStyle = '#ffffff';
      ctx.strokeRect(54, 22, 36, 28);

      ctx.fillStyle = '#090714';
      ctx.fillRect(66, 30, 12, 12);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(69, 33, 6, 6);
    } else if (propKey === 'prop_shaker') {

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(10, 74, 124, 46);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 74, 124, 46);

      for (let hx = 14; hx < 68; hx += 12) {
        ctx.fillStyle = '#facc15';
        ctx.fillRect(hx, 78, 6, 8);
        ctx.fillStyle = '#090714';
        ctx.fillRect(hx + 6, 78, 6, 8);
      }

      ctx.fillStyle = '#475569';
      ctx.fillRect(16, 54, 48, 20);
      ctx.strokeStyle = '#cbd5e1';
      ctx.strokeRect(16, 54, 48, 20);

      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(24, 46, 8, 8);
      ctx.fillRect(48, 46, 8, 8);

      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(26, 24, 28, 22);
      ctx.strokeStyle = '#ffffff';
      ctx.strokeRect(26, 24, 28, 22);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(36, 30, 8, 8);

      ctx.fillStyle = '#64748b';
      ctx.fillRect(74, 14, 56, 62);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(78, 18, 8, 54);
      ctx.strokeStyle = '#ffffff';
      ctx.strokeRect(74, 14, 56, 62);

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(86, 24, 32, 32);
      ctx.strokeStyle = '#38bdf8';
      ctx.strokeRect(86, 24, 32, 32);

      ctx.fillStyle = '#0284c7';
      ctx.fillRect(90, 28, 24, 24);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(96, 34, 12, 12);

      ctx.fillStyle = '#090714';
      ctx.fillRect(78, 84, 48, 26);
      ctx.strokeStyle = '#38bdf8';
      ctx.strokeRect(78, 84, 48, 26);
      ctx.fillStyle = '#22d3ee';
      ctx.fillRect(82, 90, 18, 4);
      ctx.fillStyle = '#f97316';
      ctx.fillRect(104, 90, 18, 4);
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(82, 100, 40, 4);
    } else if (propKey === 'prop_comms') {

      drawLabDeskBase('#1e1b4b', '#0f172a', '#a855f7');

      ctx.fillStyle = '#090714';
      ctx.fillRect(10, 10, 124, 46);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 10, 124, 46);

      ctx.fillStyle = '#0c4a6e';
      ctx.fillRect(14, 14, 56, 18);
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(20, 18, 12, 8);
      ctx.fillRect(42, 17, 16, 10);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(16, 24, 52, 2);

      ctx.fillStyle = '#052e16';
      ctx.fillRect(74, 14, 56, 18);
      ctx.strokeStyle = '#22c55e';
      ctx.strokeRect(92, 16, 20, 14);
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(101, 17, 10, 6);

      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(14, 34, 56, 18);
      const bars = [6, 12, 8, 14, 10, 15, 7, 11];
      bars.forEach((bh, idx) => {
        ctx.fillStyle = idx % 2 === 0 ? '#38bdf8' : '#c084fc';
        ctx.fillRect(18 + idx * 6, 50 - bh, 4, bh);
      });

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(74, 34, 56, 18);
      for (let gx = 0; gx < 4; gx++) {
        for (let gy = 0; gy < 2; gy++) {
          ctx.fillStyle = '#22c55e';
          ctx.fillRect(80 + gx * 12, 37 + gy * 7, 8, 5);
        }
      }

      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(44, 56, 44, 5);
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(102, 55, 10, 6);
    } else if (propKey === 'prop_launch') {

      drawLabDeskBase('#31102f', '#18181b', '#f43f5e');

      ctx.fillStyle = '#d97706';
      ctx.fillRect(16, 22, 30, 32);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(20, 26, 22, 24);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(16, 22, 30, 32);

      ctx.fillStyle = '#dc2626';
      ctx.fillRect(44, 28, 12, 22);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(47, 32, 6, 14);

      ctx.fillStyle = '#dc2626';
      ctx.fillRect(70, 10, 14, 44);
      ctx.strokeStyle = '#fca5a5';
      ctx.strokeRect(70, 10, 14, 44);

      ctx.fillStyle = '#ef4444';
      ctx.fillRect(84, 18, 14, 4);
      ctx.fillRect(84, 32, 14, 4);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(102, 6, 12, 6);
      ctx.fillRect(98, 12, 20, 36);
      ctx.strokeStyle = '#0f172a';
      ctx.strokeRect(98, 12, 20, 36);

      ctx.fillStyle = '#1d4ed8';
      ctx.fillRect(102, 20, 12, 6);
      ctx.fillStyle = '#090714';
      ctx.fillRect(98, 34, 20, 5);

      ctx.fillStyle = '#dc2626';
      ctx.fillRect(94, 42, 4, 8);
      ctx.fillRect(118, 42, 4, 8);
      ctx.fillStyle = '#475569';
      ctx.fillRect(90, 48, 36, 6);
    }

    return c;
  }

  getKscMapNodes() {
    return [
      {
        num: 1,
        x: 235,
        y: 335,
        title: '1. CIÊNCIA (SLSL)',
        sub: 'Missão e Orçamento',
        color: '#2563eb'
      },
      {
        num: 2,
        x: 265,
        y: 135,
        title: '2. SALA LIMPA',
        sub: 'Satélite e Testes',
        color: '#0d9488'
      },
      {
        num: 3,
        x: 565,
        y: 315,
        title: '3. CONTROLE (LCC)',
        sub: 'Antena e Clima',
        color: '#d97706'
      },
      {
        num: 4,
        x: 755,
        y: 140,
        title: '4. PAD 39A / VAB',
        sub: 'Foguete e Decolagem',
        color: '#dc2626'
      }
    ];
  }

  createKscMapSprite() {
    const c = document.createElement('canvas');
    c.width = 960;
    c.height = 440;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    ctx.fillStyle = '#082f49';
    ctx.fillRect(0, 0, 960, 440);

    const waveCoords = [
      [18, 48, 42], [28, 136, 36], [14, 240, 48], [22, 342, 40],
      [888, 36, 52], [902, 92, 44], [882, 158, 58], [896, 224, 46],
      [876, 290, 62], [892, 356, 48], [860, 408, 66], [626, 28, 38],
      [622, 168, 34], [634, 396, 44]
    ];
    ctx.fillStyle = '#0c4a6e';
    waveCoords.forEach(([wx, wy, ww]) => {
      ctx.fillRect(wx, wy, ww, 5);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(wx + 6, wy - 2, Math.max(12, ww - 18), 2);
      ctx.fillStyle = '#0c4a6e';
    });

    ctx.fillStyle = '#14532d';
    ctx.fillRect(84, 24, 524, 392);
    ctx.fillRect(68, 64, 32, 310);

    ctx.fillStyle = '#166534';
    ctx.fillRect(104, 42, 484, 356);
    ctx.fillStyle = '#15803d';
    ctx.fillRect(126, 62, 430, 316);

    ctx.fillStyle = '#0369a1';
    ctx.fillRect(596, 0, 74, 440);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(610, 0, 46, 440);

    ctx.fillStyle = '#14532d';
    ctx.fillRect(658, 22, 206, 376);
    ctx.fillRect(646, 70, 24, 280);
    ctx.fillStyle = '#166534';
    ctx.fillRect(674, 38, 174, 344);

    ctx.fillStyle = '#fde047';
    ctx.fillRect(858, 22, 10, 376);
    ctx.fillRect(664, 394, 198, 8);

    const treeClusters = [
      [118, 205], [142, 218], [412, 74], [436, 86], [420, 210],
      [448, 224], [692, 245], [718, 258], [790, 275], [816, 260],
      [740, 330], [772, 344]
    ];
    treeClusters.forEach(([tx, ty]) => {
      ctx.fillStyle = '#052e16';
      ctx.fillRect(tx, ty + 8, 14, 6);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(tx + 2, ty, 10, 10);
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(tx + 4, ty + 2, 4, 4);
    });

    ctx.fillStyle = '#64748b';
    ctx.fillRect(0, 322, 90, 22);
    ctx.fillRect(584, 208, 96, 26);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 322, 90, 22);
    ctx.strokeRect(584, 208, 96, 26);

    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 14;
    ctx.lineJoin = 'round';
    ctx.beginPath();

    ctx.moveTo(235, 335);
    ctx.lineTo(235, 220);
    ctx.lineTo(265, 135);

    ctx.moveTo(265, 135);
    ctx.lineTo(485, 135);
    ctx.lineTo(485, 315);
    ctx.lineTo(565, 315);

    ctx.moveTo(235, 335);
    ctx.lineTo(485, 335);

    ctx.moveTo(565, 315);
    ctx.lineTo(565, 221);
    ctx.lineTo(755, 221);
    ctx.lineTo(755, 140);
    ctx.stroke();

    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(710, 221);
    ctx.lineTo(755, 140);
    ctx.stroke();

    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(235, 335);
    ctx.lineTo(235, 220);
    ctx.lineTo(265, 135);
    ctx.lineTo(485, 135);
    ctx.lineTo(485, 315);
    ctx.lineTo(565, 315);
    ctx.lineTo(565, 221);
    ctx.lineTo(755, 221);
    ctx.lineTo(755, 140);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(195, 262, 52, 26);
    ctx.strokeStyle = '#ffffff';
    ctx.strokeRect(195, 262, 52, 26);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(201, 268, 16, 12);
    ctx.fillRect(223, 268, 18, 12);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(252, 266, 24, 22);
    ctx.fillStyle = '#60a5fa';
    ctx.fillRect(256, 270, 16, 10);

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(228, 62, 74, 26);
    ctx.strokeStyle = '#0d9488';
    ctx.strokeRect(228, 62, 74, 26);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(234, 66, 62, 8);
    ctx.fillStyle = '#2dd4bf';
    ctx.fillRect(236, 77, 20, 7);
    ctx.fillRect(264, 77, 28, 7);

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(524, 244, 54, 24);
    ctx.strokeStyle = '#f59e0b';
    ctx.strokeRect(524, 244, 54, 24);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(530, 250, 42, 8);

    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(590, 254, 6, 14);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(582, 242, 22, 12);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(591, 236, 4, 6);

    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(712, 56, 36, 34);
    ctx.strokeStyle = '#0f172a';
    ctx.strokeRect(712, 56, 36, 34);
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(717, 62, 10, 10);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(760, 50, 10, 40);
    ctx.fillRect(770, 62, 10, 4);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(780, 52, 10, 38);
    ctx.fillStyle = '#f97316';
    ctx.fillRect(782, 46, 6, 6);

    const nodes = this.getKscMapNodes();
    nodes.forEach((n) => {

      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.fillRect(n.x - 114, n.y - 34, 236, 72);

      ctx.fillStyle = '#090714';
      ctx.fillRect(n.x - 118, n.y - 38, 236, 72);

      ctx.fillStyle = n.color;
      ctx.fillRect(n.x - 118, n.y - 38, 12, 72);

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(n.x - 118, n.y - 38, 236, 72);

      ctx.fillStyle = '#ffffff';
      ctx.font = '12px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(n.title, n.x + 4, n.y - 8);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '22px "VT323", monospace';
      ctx.fillText(n.sub, n.x + 4, n.y + 20);
    });

    ctx.fillStyle = '#090714';
    ctx.fillRect(16, 14, 304, 40);
    ctx.strokeStyle = '#ffffff';
    ctx.strokeRect(16, 14, 304, 40);
    ctx.fillStyle = '#38bdf8';
    ctx.font = '11px "Press Start 2P", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('CABO CANAVERAL: KSC MAP', 30, 39);

    return c;
  }
}

window.AssetLoader = new AssetLoaderManager();

class GameRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.logicalWidth = 1280;
    this.logicalHeight = 720;
    this.hoveredProp = null;
    this.nearProp = null;
    this.nearDoor = false;

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    this.canvas.width = Math.round(this.logicalWidth * dpr);
    this.canvas.height = Math.round(this.logicalHeight * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.ctx.imageSmoothingEnabled = false;
  }

  clientToLogical(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.logicalWidth / rect.width;
    const scaleY = this.logicalHeight / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }

  drawSparkleStar(ctx, cx, cy, scale = 1, coreColor = '#fef08a', rayColor = '#ffffff') {
    const s = Math.max(1, Math.round(scale));
    const x = Math.round(cx);
    const y = Math.round(cy);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillRect(x - 3 * s, y - 3 * s, 7 * s, 7 * s);

    ctx.fillStyle = rayColor;
    ctx.fillRect(x, y - 5 * s, s, 11 * s);
    ctx.fillRect(x - 5 * s, y, 11 * s, s);

    ctx.fillRect(x - s, y - 3 * s, 3 * s, 7 * s);
    ctx.fillRect(x - 3 * s, y - s, 7 * s, 3 * s);
    ctx.fillRect(x - 2 * s, y - 2 * s, 5 * s, 5 * s);

    ctx.fillStyle = coreColor;
    ctx.fillRect(x - s, y - s, 3 * s, 3 * s);
  }

  drawStarfieldRegion(ctx, rx, ry, rw, rh, count = 90, scrollY = 0, nowSec = 0) {
    const fract = (v) => v - Math.floor(v);
    for (let i = 0; i < count; i++) {

      const hx = fract(Math.sin((i + 1) * 127.1 + 311.7) * 43758.5453123);
      const hy = fract(Math.sin((i + 1) * 269.5 + 183.3) * 31415.9265359);
      const sx = rx + Math.floor(hx * (rw - 6)) + 3;
      const sy = ry + ((Math.floor(hy * (rh - 6)) + Math.floor(scrollY)) % Math.max(1, rh - 6)) + 3;

      const twinklePhase = Math.sin(nowSec * 3.5 + i * 1.7);
      if (i % 9 === 0) {

        const coreCol = i % 18 === 0 ? '#fde047' : '#bae6fd';
        this.drawSparkleStar(ctx, sx, sy, 1, coreCol, '#ffffff');
      } else {

        const isBright = twinklePhase > 0.35;
        ctx.fillStyle = isBright ? (i % 4 === 0 ? '#fde047' : '#ffffff') : 'rgba(226, 232, 240, 0.65)';
        const sz = i % 3 === 0 ? 3 : 2;
        ctx.fillRect(sx, sy, sz, sz);
        if (isBright && sz === 3) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
          ctx.fillRect(sx - 1, sy + 1, 5, 1);
          ctx.fillRect(sx + 1, sy - 1, 1, 5);
        }
      }
    }
  }

  renderMenuBackground(menuCanvas) {
    if (!menuCanvas) return;
    const ctx = menuCanvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const cleanBg = window.AssetLoader.get('menu_clean_bg');
    if (cleanBg) {
      ctx.drawImage(cleanBg, 0, 0, 1280, 720);
      return;
    }

    const grad = ctx.createRadialGradient(640, 360, 80, 640, 360, 720);
    grad.addColorStop(0, '#36236e');
    grad.addColorStop(1, '#180f38');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1280, 720);

    for (let i = 0; i < 95; i++) {
      const sx = (i * 197 + 43) % 1280;
      const sy = (i * 113 + 71) % 720;
      ctx.fillStyle = i % 3 === 0 ? '#ffffff' : 'rgba(255,255,255,0.45)';
      const sz = i % 5 === 0 ? 3 : 2;
      ctx.fillRect(sx, sy, sz, sz);
    }
  }

  render(app) {
    const ctx = this.ctx;
    const nowMs = performance.now();
    ctx.save();
    this.ctx.imageSmoothingEnabled = false;

    const activeChar = app.getActiveCharacter();
    const roomId = activeChar ? activeChar.room : 1;
    const roomData = window.GAME_DATA.rooms[roomId];

    this.drawRoomInterior(ctx, roomData, app.missionState, nowMs);
    this.drawDoorMat(ctx, roomData.door, this.nearDoor, nowMs);

    const drawables = [];

    roomData.props.forEach((prop) => {
      drawables.push({
        type: 'prop',
        ySort: prop.y + prop.h * 0.78,
        prop
      });
    });

    Object.values(app.characters).forEach((charObj) => {
      const isSelectedBySomeone =
        charObj.id === app.activeCharId ||
        (window.Network && window.Network.isRoleTakenByOther(charObj.id));

      if (charObj.room === roomId && isSelectedBySomeone) {
        drawables.push({
          type: 'char',
          ySort: charObj.y + 42,
          charObj
        });
      }
    });

    drawables.sort((a, b) => a.ySort - b.ySort);

    drawables.forEach((item) => {
      if (item.type === 'prop') {
        this.drawProp(
          ctx,
          item.prop,
          this.nearProp === item.prop || this.hoveredProp === item.prop,
          nowMs
        );
      } else {
        this.drawCharacter(ctx, item.charObj, item.charObj.id === app.activeCharId);
      }
    });

    if (activeChar && activeChar.walkTarget) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(activeChar.walkTarget.x - 12, activeChar.walkTarget.y - 12, 24, 24);
    }

    const promptProp = this.nearProp || this.hoveredProp;
    if (promptProp) {
      this.drawPropPrompt(ctx, promptProp);
    } else if (this.nearDoor) {
      this.drawDoorPrompt(ctx, roomData.door);
    }

    ctx.restore();
  }

  drawRoomInterior(ctx, roomData, state, nowMs = 0) {

    ctx.fillStyle = '#0d0822';
    ctx.fillRect(0, 0, 1280, 720);

    ctx.fillStyle = '#1b1346';
    ctx.fillRect(40, 28, 1200, 146);

    ctx.fillStyle = '#120c32';
    for (let px = 40; px <= 1200; px += 240) {
      ctx.fillRect(px, 28, 18, 146);
    }

    ctx.fillStyle = '#090714';
    ctx.fillRect(68, 44, 156, 110);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.strokeRect(68, 44, 156, 110);
    if (roomData.id === 1) {

      this.drawStarfieldRegion(ctx, 72, 48, 148, 86, 18, 0, nowMs / 1000);
      this.drawSparkleStar(ctx, 96, 66, 1, '#fde047', '#ffffff');
      this.drawSparkleStar(ctx, 188, 62, 1, '#bae6fd', '#ffffff');

      ctx.fillStyle = '#0284c7';
      ctx.fillRect(70, 134, 152, 18);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(70, 130, 152, 4);

      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(142, 82, 14, 14);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(146, 86, 4, 4);
    } else if (roomData.id === 2) {

      ctx.fillStyle = '#0284c7';
      for (let hy = 56; hy <= 132; hy += 16) {
        ctx.fillRect(82, hy, 128, 8);
      }
    } else if (roomData.id === 3) {

      const blink = Math.floor(nowMs / 400) % 2 === 0;
      for (let ry = 56; ry <= 130; ry += 18) {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(80, ry, 132, 12);
        ctx.fillStyle = blink ? '#22c55e' : '#38bdf8';
        ctx.fillRect(88, ry + 3, 6, 6);
        ctx.fillStyle = !blink ? '#f59e0b' : '#22c55e';
        ctx.fillRect(102, ry + 3, 6, 6);
      }
    } else {

      this.drawStarfieldRegion(ctx, 72, 48, 148, 84, 16, 0, nowMs / 1000);
      this.drawSparkleStar(ctx, 92, 64, 1, '#fde047', '#ffffff');
      this.drawSparkleStar(ctx, 196, 68, 1, '#bae6fd', '#ffffff');

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(70, 136, 152, 16);

      ctx.fillStyle = '#dc2626';
      ctx.fillRect(124, 72, 12, 64);
      ctx.fillRect(136, 86, 12, 4);
      ctx.fillRect(136, 104, 12, 4);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(150, 68, 4, 6);
      ctx.fillRect(148, 74, 8, 62);
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(150, 88, 4, 8);
    }

    ctx.fillStyle = '#090714';
    ctx.fillRect(1056, 44, 156, 110);
    ctx.strokeStyle = '#38bdf8';
    ctx.strokeRect(1056, 44, 156, 110);
    ctx.fillStyle = '#facc15';
    ctx.font = '11px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('KSC LAB', 1134, 76);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(1084, 90, 100, 6);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(1084, 106, 76, 6);
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(1084, 122, 90, 6);

    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(40, 170, 1200, 4);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(40, 174, 1200, 2);

    const tileSize = 64;
    for (let y = 176; y < 688; y += tileSize) {
      for (let x = 40; x < 1240; x += tileSize) {
        const isAlt = ((x / tileSize) + ((y - 176) / tileSize)) % 2 === 0;
        ctx.fillStyle = isAlt ? '#231956' : '#1c1347';
        const tw = Math.min(tileSize, 1240 - x);
        const th = Math.min(tileSize, 688 - y);
        ctx.fillRect(x, y, tw, th);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(x + 2, y + 2, 4, 4);
      }
    }

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.lineWidth = 2;
    ctx.strokeRect(72, 206, 1136, 450);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 28, 1200, 660);

    ctx.fillStyle = 'rgba(9, 7, 20, 0.96)';
    ctx.fillRect(240, 44, 800, 110);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(240, 44, 800, 110);

    ctx.fillStyle = '#ffffff';
    ctx.font = '16px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(window.t(`room${roomData.id}_name`), 640, 84);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '27px "VT323", monospace';
    ctx.fillText(window.t(`room${roomData.id}_sub`), 640, 128);
  }

  drawDoorMat(ctx, door, isNear, nowMs = 0) {
    ctx.save();
    const pulse = Math.sin(nowMs / 220) * 0.5 + 0.5;
    const x = door.x - door.w / 2;
    const y = door.y - door.h / 2;

    ctx.fillStyle = isNear ? '#312e81' : '#090714';
    ctx.fillRect(x, y, door.w, door.h);

    ctx.fillStyle = isNear ? '#34d399' : `rgba(56, 189, 248, ${0.45 + pulse * 0.4})`;
    ctx.fillRect(x + 6, y + 6, 10, door.h - 12);
    ctx.fillRect(x + door.w - 16, y + 6, 10, door.h - 12);

    ctx.strokeStyle = isNear ? '#34d399' : '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, door.w, door.h);

    ctx.fillStyle = '#ffffff';
    ctx.font = '12px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(window.t('hud_map'), door.x, door.y + 5);
    ctx.restore();
  }

  drawProp(ctx, prop, isHighlighted, nowMs = 0) {
    const sprite = window.AssetLoader.get(prop.sprite);
    ctx.save();

    const px = Math.round(prop.x);
    const py = Math.round(prop.y);

    if (isHighlighted) {
      ctx.fillStyle = 'rgba(56, 189, 248, 0.16)';
      ctx.fillRect(px - 8, py - 8, prop.w + 16, prop.h + 16);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.strokeRect(px - 6, py - 6, prop.w + 12, prop.h + 12);
    }

    if (sprite) {
      ctx.drawImage(sprite, px, py, prop.w, prop.h);
    }

    const tick = Math.floor(nowMs / 280);
    if (prop.sprite === 'prop_science') {

      const bubbleY = py + 40 - (( tick * 3 ) % 14);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(px + 88, bubbleY, 3, 3);
      ctx.fillStyle = tick % 2 === 0 ? '#38bdf8' : '#22c55e';
      ctx.fillRect(px + 110 + ((tick * 4) % 14), py + 30, 4, 3);
    } else if (prop.sprite === 'prop_comms') {

      const sweepX = px + 94 + ((tick * 4) % 16);
      ctx.fillStyle = '#86efac';
      ctx.fillRect(sweepX, py + 18, 3, 10);
    } else if (prop.sprite === 'prop_shaker') {

      ctx.fillStyle = tick % 2 === 0 ? '#38bdf8' : '#f43f5e';
      ctx.fillRect(px + 100, py + 20, 4, 3);
    } else if (prop.sprite === 'prop_launch') {

      if (tick % 2 === 0) {
        ctx.fillStyle = '#fde047';
        ctx.fillRect(px + 75, py + 6, 4, 4);
      }
    }

    const labelText = window.I18N.pick(prop.label);
    ctx.font = '24px "VT323", monospace';
    const textW = Math.max(216, ctx.measureText(labelText).width + 32);
    const bx = prop.x + prop.w / 2 - textW / 2;
    const by = prop.y + prop.h - 4;

    ctx.fillStyle = isHighlighted ? '#1e1b4b' : '#090714';
    ctx.fillRect(bx, by, textW, 34);
    ctx.strokeStyle = isHighlighted ? '#38bdf8' : '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, textW, 34);

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(labelText, prop.x + prop.w / 2, by + 24);

    ctx.restore();
  }

  drawCharacter(ctx, charObj, isActivePlayer) {
    let pose = 'front';
    const isMoving = Math.abs(charObj.vx) > 0.01 || Math.abs(charObj.vy) > 0.01;
    if (isMoving) {
      const dir = charObj.vx < -0.01 ? 'left' : charObj.vx > 0.01 ? 'right' : (charObj.lastHorizDir || 'right');
      const frameNum = (charObj.animFrame % 3) + 1;
      pose = `${dir}${frameNum}`;
    }

    const spriteKey = `${charObj.id}_${pose}`;
    const sprite = window.AssetLoader.get(spriteKey);

    const drawX = Math.round(charObj.x - 48);
    const drawY = Math.round(charObj.y - 48);

    ctx.save();
    if (sprite) {
      ctx.drawImage(sprite, drawX, drawY, 96, 96);
    }

    const isOtherOnlinePlayer =
      !isActivePlayer && window.Network && window.Network.isRoleTakenByOther(charObj.id);
    const baseName = window.t(`${charObj.id}_name`);
    const charName = isActivePlayer
      ? `${baseName} (${window.t('tag_you')})`
      : isOtherOnlinePlayer
      ? `${baseName} (${window.t('tag_online')})`
      : baseName;

    ctx.font = '11px "Press Start 2P", monospace';
    const tagW = Math.max(128, ctx.measureText(charName).width + 22);
    const tx = Math.round(charObj.x - tagW / 2);
    const ty = drawY - 28;

    ctx.fillStyle = isActivePlayer ? '#ffffff' : isOtherOnlinePlayer ? '#064e3b' : '#090714';
    ctx.fillRect(tx, ty, tagW, 26);
    ctx.strokeStyle = isOtherOnlinePlayer ? '#34d399' : '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(tx, ty, tagW, 26);

    ctx.fillStyle = isActivePlayer ? '#090714' : '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(charName, Math.round(charObj.x), ty + 18);

    ctx.restore();
  }

  drawPropPrompt(ctx, prop) {
    const actionText = window.t('prompt_interact');
    ctx.save();
    ctx.font = '12px "Press Start 2P", monospace';
    const w = Math.max(260, ctx.measureText(actionText).width + 32);
    const h = 38;
    const x = Math.max(56, Math.min(1224 - w, prop.x + prop.w / 2 - w / 2));
    const y = Math.max(38, prop.y - 48);

    ctx.fillStyle = '#090714';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(actionText, x + w / 2, y + 25);
    ctx.restore();
  }

  drawDoorPrompt(ctx, door) {
    const text = window.t('prompt_door');
    ctx.save();
    ctx.font = '12px "Press Start 2P", monospace';
    const w = ctx.measureText(text).width + 32;
    const x = door.x - w / 2;
    const y = door.y - 64;

    ctx.fillStyle = '#090714';
    ctx.fillRect(x, y, w, 38);
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, 38);

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(text, door.x, y + 25);
    ctx.restore();
  }

  renderLaunchCutscene(cutsceneCanvas, elapsedSec, state) {
    const ctx = cutsceneCanvas.getContext('2d');
    const w = cutsceneCanvas.width;
    const h = cutsceneCanvas.height;
    ctx.save();
    ctx.imageSmoothingEnabled = false;

    const evalData = window.GAME_DATA.evaluateSimulation(state);
    const isSls = state.rocketId === 'sls';
    const isElectron = state.rocketId === 'electron';

    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    if (elapsedSec < 4.2) {
      const p1 = elapsedSec / 4.2;
      skyGrad.addColorStop(0, '#070514');
      skyGrad.addColorStop(0.65, p1 < 0.5 ? '#1e1b4b' : '#0f172a');
      skyGrad.addColorStop(1, '#31102f');
    } else {
      skyGrad.addColorStop(0, '#04030c');
      skyGrad.addColorStop(0.75, '#09071a');
      skyGrad.addColorStop(1, '#0c4a6e');
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    const starScrollY = Math.floor(elapsedSec * (elapsedSec > 4.2 ? 22 : 5));
    this.drawStarfieldRegion(ctx, 0, 0, w, h, 115, starScrollY, elapsedSec);

    if (elapsedSec < 4.2) {

      const progress = elapsedSec / 4.2;
      const shakeX = elapsedSec < 3.2 ? (Math.random() - 0.5) * 6 : (Math.random() - 0.5) * 2;
      const shakeY = elapsedSec < 3.2 ? (Math.random() - 0.5) * 6 : 0;
      ctx.translate(shakeX, shakeY);

      const groundY = h - 105 + Math.pow(progress, 1.7) * 320;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.beginPath();
      ctx.moveTo(w * 0.22, groundY);
      ctx.lineTo(w * 0.46, groundY - 460);
      ctx.lineTo(w * 0.58, groundY - 460);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(w * 0.78, groundY);
      ctx.lineTo(w * 0.44, groundY - 460);
      ctx.lineTo(w * 0.56, groundY - 460);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, groundY, w, 280);
      ctx.fillStyle = '#334155';
      ctx.fillRect(w * 0.28, groundY - 18, w * 0.44, 24);
      ctx.strokeStyle = '#94a3b8';
      ctx.strokeRect(w * 0.28, groundY - 18, w * 0.44, 24);

      const towerX = w * 0.36;
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(towerX, groundY - 340, 34, 322);
      ctx.strokeStyle = '#fca5a5';
      ctx.strokeRect(towerX, groundY - 340, 34, 322);

      ctx.fillStyle = '#7f1d1d';
      for (let ty = groundY - 320; ty < groundY - 30; ty += 36) {
        ctx.fillRect(towerX + 4, ty, 26, 18);
      }

      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(towerX + 14, groundY - 390, 6, 50);

      const retract = Math.min(36, progress * 60);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(towerX + 34, groundY - 250, 74 - retract, 8);
      ctx.fillRect(towerX + 34, groundY - 170, 74 - retract, 8);

      const liftoffCurve = Math.max(0, progress - 0.12) / 0.88;
      const rocketBaseY = groundY - 22 - Math.pow(liftoffCurve, 2.15) * 560;
      const rx = Math.round(w * 0.5);

      const plumeLen = 65 + liftoffCurve * 160 + (Math.random() * 18);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(rx - 28, rocketBaseY, 56, plumeLen);
      ctx.fillStyle = '#f97316';
      ctx.fillRect(rx - 20, rocketBaseY, 40, plumeLen * 0.82);
      ctx.fillStyle = '#fde047';
      ctx.fillRect(rx - 12, rocketBaseY, 24, plumeLen * 0.58);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(rx - 6, rocketBaseY, 12, plumeLen * 0.35);

      for (let i = -5; i <= 5; i++) {
        const spread = i * (26 + progress * 48);
        const cloudSize = 36 + Math.abs(i) * 8 + progress * 24;
        const cloudY = groundY - 32 - ((Math.abs(i) * 7) % 24);
        ctx.fillStyle = i % 2 === 0 ? 'rgba(226, 232, 240, 0.85)' : 'rgba(148, 163, 184, 0.75)';
        ctx.fillRect(rx + spread - cloudSize / 2, cloudY, cloudSize, cloudSize * 0.65);
      }

      const bodyColor = isSls ? '#ea580c' : isElectron ? '#1e293b' : '#f8fafc';
      const trimColor = isSls ? '#ffffff' : isElectron ? '#38bdf8' : '#0f172a';

      if (isSls) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(rx - 38, rocketBaseY - 160, 12, 155);
        ctx.fillRect(rx + 26, rocketBaseY - 160, 12, 155);
        ctx.strokeStyle = '#0f172a';
        ctx.strokeRect(rx - 38, rocketBaseY - 160, 12, 155);
        ctx.strokeRect(rx + 26, rocketBaseY - 160, 12, 155);
      }

      ctx.fillStyle = bodyColor;
      ctx.fillRect(rx - 22, rocketBaseY - 210, 44, 200);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(rx - 22, rocketBaseY - 210, 44, 200);

      ctx.fillStyle = trimColor;
      ctx.fillRect(rx - 22, rocketBaseY - 135, 44, 16);
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(rx - 10, rocketBaseY - 180, 20, 20);

      ctx.fillStyle = isElectron ? '#0f172a' : '#ffffff';
      ctx.fillRect(rx - 24, rocketBaseY - 260, 48, 50);
      ctx.fillRect(rx - 16, rocketBaseY - 280, 32, 20);
      ctx.fillRect(rx - 8, rocketBaseY - 292, 16, 12);
      ctx.strokeStyle = '#ffffff';
      ctx.strokeRect(rx - 24, rocketBaseY - 260, 48, 50);

      ctx.fillStyle = '#475569';
      ctx.fillRect(rx - 18, rocketBaseY - 10, 10, 10);
      ctx.fillRect(rx - 4, rocketBaseY - 10, 8, 10);
      ctx.fillRect(rx + 8, rocketBaseY - 10, 10, 10);
    } else if (elapsedSec < 7.2) {

      const p2 = (elapsedSec - 4.2) / 3.0;

      ctx.fillStyle = '#0284c7';
      ctx.fillRect(0, h - 95, w, 95);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(0, h - 105, w, 12);
      ctx.fillStyle = '#bae6fd';
      ctx.fillRect(0, h - 109, w, 4);

      const cx = w * 0.45;
      const cy = h * 0.48;

      const stageX = cx - 140 - p2 * 80;
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(stageX - 50, cy - 14, 50, 28);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(stageX, cy - 24, 90, 48);
      ctx.strokeStyle = '#ffffff';
      ctx.strokeRect(stageX, cy - 24, 90, 48);

      ctx.fillStyle = '#d97706';
      ctx.fillRect(stageX + 90, cy - 16, 28, 32);
      ctx.strokeRect(stageX + 90, cy - 16, 28, 32);

      const fairOffset = 35 + p2 * 130;
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(cx - 20 + p2 * 40, cy - fairOffset - 28, 110, 26);
      ctx.fillRect(cx - 20 + p2 * 40, cy + fairOffset, 110, 26);
      ctx.strokeStyle = '#94a3b8';
      ctx.strokeRect(cx - 20 + p2 * 40, cy - fairOffset - 28, 110, 26);
      ctx.strokeRect(cx - 20 + p2 * 40, cy + fairOffset, 110, 26);

      const satEjectX = stageX + 135 + p2 * 220;
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(satEjectX, cy - 22, 56, 44);
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2;
      ctx.strokeRect(satEjectX, cy - 22, 56, 44);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(satEjectX + 18, cy - 10, 20, 20);
    } else {

      const orbitProg = Math.min(1, (elapsedSec - 7.2) / 4.0);

      const earthY = h - 135;
      ctx.fillStyle = '#0369a1';
      ctx.fillRect(0, earthY, w, 135);

      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(0, earthY - 8, w, 8);
      ctx.fillStyle = '#e0f2fe';
      ctx.fillRect(0, earthY - 12, w, 4);

      const scrollX = Math.floor((elapsedSec - 7.2) * 45);
      ctx.fillStyle = '#15803d';
      ctx.fillRect((180 - scrollX + w) % w, earthY + 24, 190, 55);
      ctx.fillRect((620 - scrollX + w) % w, earthY + 18, 240, 70);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.fillRect((260 - scrollX * 1.3 + w) % w, earthY + 14, 130, 14);
      ctx.fillRect((740 - scrollX * 1.3 + w) % w, earthY + 42, 160, 16);

      const satX = Math.round(w * 0.5 + Math.cos(elapsedSec * 1.5) * 45);
      const satY = Math.round(h * 0.42 + Math.sin(elapsedSec * 2.4) * 10);

      ctx.fillStyle = 'rgba(56, 189, 248, 0.16)';
      ctx.beginPath();
      ctx.moveTo(satX, satY + 30);
      ctx.lineTo(satX - 140, earthY);
      ctx.lineTo(satX + 140, earthY);
      ctx.closePath();
      ctx.fill();

      const waveOffset = Math.floor(elapsedSec * 60) % 45;
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 2;
      for (let wv = 0; wv < 3; wv++) {
        const wy = satY + 48 + wv * 38 + waveOffset;
        if (wy < earthY - 10) {
          const halfW = 24 + wv * 18;
          ctx.strokeRect(satX - halfW, wy, halfW * 2, 6);
        }
      }

      ctx.save();
      ctx.translate(satX, satY);

      const deployFactor = state.solarId === 'foldable' ? Math.min(1, orbitProg * 1.8) : 0.35;
      const wingW = Math.round(deployFactor * 115);

      if (wingW > 6) {

        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(-52 - wingW, -4, wingW, 8);
        ctx.fillRect(52, -4, wingW, 8);

        ctx.fillStyle = '#1d4ed8';
        ctx.fillRect(-52 - wingW, -26, wingW, 52);
        ctx.fillRect(52, -26, wingW, 52);
        ctx.strokeStyle = '#93c5fd';
        ctx.lineWidth = 2;
        ctx.strokeRect(-52 - wingW, -26, wingW, 52);
        ctx.strokeRect(52, -26, wingW, 52);

        ctx.fillStyle = '#60a5fa';
        for (let cx = 24; cx < wingW - 10; cx += 26) {
          ctx.fillRect(-52 - cx, -24, 2, 48);
          ctx.fillRect(52 + cx, -24, 2, 48);
        }
      }

      ctx.fillStyle = '#d97706';
      ctx.fillRect(-52, -38, 104, 76);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-46, -32, 92, 64);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(-52, -38, 104, 76);

      ctx.fillStyle = '#090714';
      ctx.fillRect(-20, -20, 40, 40);
      ctx.strokeStyle = '#38bdf8';
      ctx.strokeRect(-20, -20, 40, 40);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-12, -12, 24, 24);
      ctx.fillStyle = '#e0f2fe';
      ctx.fillRect(-8, -8, 8, 8);

      ctx.fillStyle = '#facc15';
      ctx.fillRect(-6, -58, 4, 20);
      ctx.fillRect(6, -54, 4, 16);

      ctx.restore();
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = 'rgba(9, 7, 20, 0.94)';
    ctx.fillRect(24, 18, w - 48, 82);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(24, 18, w - 48, 82);

    let phaseTitle = '';
    let telemetryLine = '';
    if (elapsedSec < 4.2) {
      const altKm = (Math.pow(elapsedSec / 4.2, 2) * 68).toFixed(1);
      const velKmh = Math.round(Math.pow(elapsedSec / 4.2, 1.6) * 7800).toLocaleString();
      phaseTitle = `FASE 1/3 - DECOLAGEM PAD 39A: ${window.I18N.pick(evalData.rocket.name)}`;
      telemetryLine = `ALTITUDE: ${altKm} km  |  VELOCIDADE: ${velKmh} km/h  |  PROPULSÃO: NOMINAL`;
    } else if (elapsedSec < 7.2) {
      const p2 = (elapsedSec - 4.2) / 3.0;
      const altKm = (68 + p2 * (evalData.orbit.altitudeKm - 68)).toFixed(0);
      const velKmh = Math.round(7800 + p2 * 19800).toLocaleString();
      phaseTitle = `FASE 2/3 - SEPARAÇÃO DE COIFA E EJEÇÃO DO DISPENSER P-POD`;
      telemetryLine = `ALTITUDE: ${altKm} km  |  VELOCIDADE: ${velKmh} km/h  |  CHASSI: ${evalData.chassis.id}`;
    } else {
      phaseTitle = `FASE 3/3 - EM ÓRBITA (${window.I18N.pick(evalData.orbit.shortName)}): PAINÉIS ABERTOS & SINAL TLE ATIVO`;
      telemetryLine = `ALTITUDE: ${evalData.orbit.altitudeKm.toLocaleString()} km  |  VELOCIDADE: 27.600 km/h  |  ENERGIA: +${evalData.effectiveSolarW}W`;
    }

    ctx.fillStyle = '#38bdf8';
    ctx.font = '14px "Press Start 2P", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(phaseTitle, 44, 52);

    ctx.fillStyle = '#ffffff';
    ctx.font = '26px "VT323", monospace';
    ctx.fillText(telemetryLine, 44, 84);

    ctx.restore();
  }
}

window.GameRenderer = GameRenderer;
