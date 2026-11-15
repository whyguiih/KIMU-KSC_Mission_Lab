class KscSoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.volume = 0.85;
    this.isMuted = false;
    this.musicPlaying = false;
    this.chordIndex = 0;
    this.arpIndex = 0;
    this.musicInterval = null;
    this.lastStepAt = 0;
    this.lastSliderPreviewAt = 0;
  }

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      if (!this.musicPlaying) {
        this.startAmbientMusic();
      }
      return;
    }

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    try {
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.musicGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();

      this.masterGain.gain.value = this.volume;
      this.musicGain.gain.value = 0.28;
      this.sfxGain.gain.value = 0.65;

      this.musicGain.connect(this.masterGain);
      this.sfxGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      this.startAmbientMusic();
    } catch (err) {
      console.warn('Web Audio API indisponível:', err);
    }
  }

  setVolume(volPct, playPreview = false) {
    const clamped = Math.max(0, Math.min(100, Number(volPct) || 0));
    this.volume = clamped / 100;
    this.isMuted = clamped <= 0;

    if (!this.ctx) {
      this.init();
    }
    if (this.ctx && this.masterGain) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      const now = this.ctx.currentTime;
      const targetGain = this.isMuted ? 0.0001 : Math.pow(this.volume, 1.35);
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setTargetAtTime(targetGain, now, 0.03);
    }

    if (playPreview && !this.isMuted) {
      const nowMs = performance.now();
      if (nowMs - this.lastSliderPreviewAt > 90) {
        this.lastSliderPreviewAt = nowMs;
        this.playTone(520 + clamped * 2.8, 0.055, 'sine', 0.16);
      }
    }
  }

  startAmbientMusic() {
    if (!this.ctx || this.musicPlaying) return;
    this.musicPlaying = true;

    const chords = [
      [174.61, 220.0, 261.63, 329.63],
      [146.83, 220.0, 261.63, 329.63],
      [116.54, 174.61, 220.0, 293.66],
      [130.81, 196.0, 261.63, 329.63]
    ];

    const starNotes = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 880.0, 659.25];

    const playCycle = () => {
      if (!this.ctx || this.ctx.state !== 'running' || this.isMuted) return;
      const now = this.ctx.currentTime;
      const chord = chords[this.chordIndex % chords.length];
      this.chordIndex += 1;

      chord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        osc.detune.setValueAtTime(idx * 3 - 4, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(680, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.045, now + 1.4);
        gain.gain.setValueAtTime(0.045, now + 2.6);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.4);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);

        osc.start(now);
        osc.stop(now + 4.5);
      });

      [0.6, 2.3].forEach((offsetSec) => {
        const noteFreq = starNotes[this.arpIndex % starNotes.length];
        this.arpIndex += 1;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startAt = now + offsetSec;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(noteFreq, startAt);

        gain.gain.setValueAtTime(0.0001, startAt);
        gain.gain.linearRampToValueAtTime(0.032, startAt + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 1.35);

        osc.connect(gain);
        gain.connect(this.musicGain);

        osc.start(startAt);
        osc.stop(startAt + 1.4);
      });
    };

    playCycle();
    if (this.musicInterval) clearInterval(this.musicInterval);
    this.musicInterval = setInterval(playCycle, 4000);
  }

  playTone(freq, duration = 0.09, type = 'triangle', peakGain = 0.22, slideToFreq = null) {
    if (this.isMuted) return;
    if (!this.ctx) this.init();
    if (!this.ctx || !this.sfxGain) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (slideToFreq) {
      osc.frequency.exponentialRampToValueAtTime(slideToFreq, now + duration);
    }

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(peakGain, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  playClick() {
    this.playTone(620, 0.06, 'triangle', 0.2, 780);
  }

  playSelect() {
    this.playTone(523.25, 0.075, 'triangle', 0.22);
    setTimeout(() => this.playTone(659.25, 0.1, 'triangle', 0.24), 55);
  }

  playOpenModal() {
    this.playTone(392.0, 0.08, 'sine', 0.2, 587.33);
  }

  playCloseModal() {
    this.playTone(523.25, 0.08, 'sine', 0.18, 349.23);
  }

  playSuccess() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, idx) => {
      setTimeout(() => this.playTone(n, 0.14, 'triangle', 0.25), idx * 65);
    });
  }

  playError() {
    this.playTone(210, 0.12, 'sawtooth', 0.2, 165);
    setTimeout(() => this.playTone(165, 0.16, 'sawtooth', 0.22, 130), 110);
  }

  playStep() {
    const nowMs = performance.now();
    if (nowMs - this.lastStepAt < 230) return;
    this.lastStepAt = nowMs;
    this.playTone(145 + Math.random() * 25, 0.035, 'sine', 0.08, 95);
  }

  playCountdownTick(secondsLeft) {
    const freq = secondsLeft <= 3 ? 987.77 : 659.25;
    this.playTone(freq, 0.11, 'sine', 0.26);
  }

  playRocketLaunch() {
    if (this.isMuted) return;
    if (!this.ctx) this.init();
    if (!this.ctx || !this.sfxGain) return;

    const now = this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * 4.5;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(160, now);
    filter.frequency.exponentialRampToValueAtTime(920, now + 3.8);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.38, now + 0.5);
    gain.gain.setValueAtTime(0.35, now + 2.8);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.4);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    whiteNoise.start(now);
    whiteNoise.stop(now + 4.5);

    const fanfare = [261.63, 329.63, 392.0, 523.25];
    fanfare.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 0.35, 'triangle', 0.24), 300 + idx * 180);
    });
  }
}

window.SoundEngine = new KscSoundEngine();

class KscMissionLabApp {
  constructor() {
    this.missionState = window.GAME_DATA.createInitialMissionState();
    this.characters = {};
    this.activeCharId = 'char1';
    this.inGame = false;
    this.activeModalId = null;
    this.volume = 85;
    this.savedVolume = 85;
    this.pendingLang = window.currentLang || 'pt';
    this.activeGlossaryId = 'term_cubesat';

    this.keys = {};
    this.touchVector = { x: 0, y: 0 };
    this.lastFrameTime = performance.now();
    this.lastNetSyncTime = 0;

    this.countdownTimer = null;
    this.countdownSeconds = 10;
    this.cutsceneActive = false;
    this.cutsceneStartTime = 0;

    this.initCharacters();
  }

  initCharacters() {
    window.GAME_DATA.specialists.forEach((spec) => {
      this.characters[spec.id] = {
        id: spec.id,
        num: spec.num,
        room: spec.startRoom,
        x: spec.startX,
        y: spec.startY,
        vx: 0,
        vy: 0,
        animFrame: 0,
        animTimerMs: 0,
        lastHorizDir: 'right',
        walkTarget: null
      };
    });
  }

  init() {
    window.AssetLoader.init();

    const canvas = document.getElementById('game-canvas');
    this.renderer = new window.GameRenderer(canvas);
    this.drawMenuBackground();

    this.bindAudioUnlockEvents();
    this.bindNetworkCallbacks();
    window.Network.startSolo();
    this.bindMenuAndLobbyEvents();
    this.bindKeyboardAndMouseEvents(canvas);
    this.bindTouchControls();

    this.pendingLang = window.currentLang || 'pt';
    this.syncVolumeSliderUI(this.volume);
    this.renderLanguageDropdown();
    this.refreshAllTranslations();
    this.renderLobbySpecialistCards();
    this.renderSidebarGlossaryButtons();

    requestAnimationFrame((ts) => this.gameLoop(ts));
  }

  bindAudioUnlockEvents() {
    const unlock = () => {
      window.SoundEngine.init();
      window.SoundEngine.setVolume(this.volume, false);
    };
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      if (btn.id === 'btn-opt-save') return;
      window.SoundEngine.playClick();
    });
  }

  syncVolumeSliderUI(val) {
    const volInput = document.getElementById('volume-range-input');
    const volFill = document.getElementById('volume-slider-fill');
    const volThumb = document.getElementById('volume-slider-thumb');
    if (volInput) volInput.value = String(val);
    if (volFill) volFill.style.width = `${val}%`;
    if (volThumb) volThumb.style.left = `${val}%`;
  }

  refreshCharacterPreviews() {
    this.renderLobbySpecialistCards();
    this.updateSidebar();
    if (this.activeModalId === 'modal_intro') {
      this.renderModalContent('modal_intro', true);
    }
  }

  drawMenuBackground() {
    const menuCanvas = document.getElementById('menu-bg-canvas');
    if (menuCanvas && this.renderer) {
      this.renderer.renderMenuBackground(menuCanvas);
    }
  }

  getActiveCharacter() {
    return this.characters[this.activeCharId] || this.characters.char1;
  }

  advanceMissionDay(daysToAdd = 4) {
    this.missionState.missionDay = Math.min(90, (this.missionState.missionDay || 1) + daysToAdd);
  }

  showMenuView(viewName) {
    const mainView = document.getElementById('menu-main-view');
    const optView = document.getElementById('menu-options-view');
    const srvView = document.getElementById('menu-server-view');
    const dropMenu = document.getElementById('lang-dropdown-menu');

    mainView?.classList.add('hidden');
    optView?.classList.add('hidden');
    srvView?.classList.add('hidden');
    dropMenu?.classList.add('hidden');

    if (viewName === 'options') {
      this.pendingLang = window.currentLang;
      this.savedVolume = this.volume;
      this.syncVolumeSliderUI(this.volume);
      optView?.classList.remove('hidden');
      this.renderLanguageDropdown();
    } else if (viewName === 'server') {
      srvView?.classList.remove('hidden');
      this.updateLobbyStatusUI();
      this.renderLobbySpecialistCards();
    } else {
      mainView?.classList.remove('hidden');
    }
  }

  renderLanguageDropdown() {
    const menuEl = document.getElementById('lang-dropdown-menu');
    const optLangText = document.getElementById('opt-lang-text');
    const optFlagHolder = document.getElementById('opt-flag-holder');

    const selectedCode = this.pendingLang || window.currentLang;
    const activeMeta = window.I18N.getLangMeta(selectedCode);
    if (optLangText && activeMeta) {
      optLangText.textContent = activeMeta.label;
    }
    if (optFlagHolder && activeMeta) {
      optFlagHolder.innerHTML = activeMeta.flagSvg;
    }

    if (!menuEl) return;
    menuEl.innerHTML = '';

    window.LANGUAGES_LIST.forEach((langItem) => {
      const isAct = langItem.code === selectedCode;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `kimu-dropdown-item ${isAct ? 'is-active' : ''}`;
      btn.setAttribute('role', 'option');
      btn.setAttribute('aria-selected', isAct ? 'true' : 'false');
      btn.innerHTML = `
        <span class="inline-flex items-center shrink-0">${langItem.flagSvg}</span>
        <span>${langItem.label}</span>
      `;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.pendingLang = langItem.code;
        window.SoundEngine.playSelect();
        menuEl.classList.add('hidden');
        document.getElementById('btn-opt-lang-select')?.setAttribute('aria-expanded', 'false');
        this.renderLanguageDropdown();
      });
      menuEl.appendChild(btn);
    });
  }

  bindNetworkCallbacks() {
    window.Network.onStateSync = (remoteState) => {
      this.missionState = { ...this.missionState, ...remoteState };
      this.updateHUD();
      if (this.activeModalId) {
        this.renderModalContent(this.activeModalId, true);
      }
    };

    window.Network.onPlayerSync = (remotePlayer) => {
      if (!remotePlayer || !remotePlayer.id) return;

      if (
        remotePlayer.id === this.activeCharId &&
        !window.Network.isRoleTakenByOther(this.activeCharId)
      ) {
        return;
      }
      const target = this.characters[remotePlayer.id];
      if (target) {
        const roomChanged = target.room !== remotePlayer.room;
        const dist = Math.hypot((remotePlayer.x || 0) - target.x, (remotePlayer.y || 0) - target.y);

        target.room = remotePlayer.room;
        target.vx = remotePlayer.vx || 0;
        target.vy = remotePlayer.vy || 0;
        target.animFrame = remotePlayer.animFrame || 0;
        target.lastHorizDir = remotePlayer.lastHorizDir || 'right';
        target.lastRemoteUpdateTs = performance.now();

        if (roomChanged || !target.hasRemotePos || dist > 110) {
          target.x = remotePlayer.x;
          target.y = remotePlayer.y;
          target.netTargetX = remotePlayer.x;
          target.netTargetY = remotePlayer.y;
          target.hasRemotePos = true;
        } else {
          target.netTargetX = remotePlayer.x;
          target.netTargetY = remotePlayer.y;
          target.hasRemotePos = true;
        }

        if (roomChanged) {
          this.updateHUDPlayerLocations();
        }
      }
    };

    window.Network.onRoleSync = () => {
      const myAssigned = window.Network.getMyAssignedRole();
      if (myAssigned && this.activeCharId !== myAssigned) {
        this.activeCharId = myAssigned;
        if (this.inGame) {
          window.Network.syncPlayerPosition(this.getActiveCharacter());
        }
      } else if (window.Network.isRoleTakenByOther(this.activeCharId)) {
        const freeRole = window.Network.getFirstFreeRole();
        if (freeRole) {
          this.activeCharId = freeRole;
          window.Network.claimRole(freeRole);
          if (this.inGame) {
            window.Network.syncPlayerPosition(this.getActiveCharacter());
          }
        }
      }
      this.renderLobbySpecialistCards();
      this.updateHUDPlayerLocations();
      this.updateSidebar();
    };

    window.Network.onCutsceneTrigger = () => {
      if (!this.cutsceneActive) {
        this.startLaunchCutscene();
      }
    };

    window.Network.onConnectionUpdate = () => {
      this.updateLobbyStatusUI();
      this.renderLobbySpecialistCards();
      this.updateHUD();
    };
  }

  bindMenuAndLobbyEvents() {

    document.getElementById('btn-menu-play')?.addEventListener('click', () => {
      if (!window.Network.getMyAssignedRole()) {
        const freeRole = window.Network.getFirstFreeRole();
        if (freeRole) {
          this.activeCharId = freeRole;
          window.Network.claimRole(freeRole);
        }
      }
      this.enterLab();
    });

    document.getElementById('btn-menu-server')?.addEventListener('click', () => {
      this.showMenuView('server');
    });

    document.getElementById('btn-menu-options')?.addEventListener('click', () => {
      this.showMenuView('options');
    });

    const volInput = document.getElementById('volume-range-input');
    if (volInput) {
      volInput.addEventListener('input', (e) => {
        const val = Number(e.target.value);
        this.volume = val;
        this.syncVolumeSliderUI(val);
        window.SoundEngine.setVolume(val, true);
      });
    }

    const langSelectBtn = document.getElementById('btn-opt-lang-select');
    const langDropMenu = document.getElementById('lang-dropdown-menu');
    const langDropWrap = document.getElementById('lang-dropdown-wrap');
    if (langSelectBtn && langDropMenu) {
      langSelectBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = langDropMenu.classList.contains('hidden');
        if (isHidden) {
          langDropMenu.classList.remove('hidden');
          langSelectBtn.setAttribute('aria-expanded', 'true');
        } else {
          langDropMenu.classList.add('hidden');
          langSelectBtn.setAttribute('aria-expanded', 'false');
        }
      });

      window.addEventListener('click', (e) => {
        if (langDropWrap && !langDropWrap.contains(e.target)) {
          langDropMenu.classList.add('hidden');
          langSelectBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    document.getElementById('btn-opt-back')?.addEventListener('click', () => {

      this.pendingLang = window.currentLang;
      this.volume = this.savedVolume;
      this.syncVolumeSliderUI(this.volume);
      window.SoundEngine.setVolume(this.volume, false);
      this.renderLanguageDropdown();
      this.showMenuView('main');
    });

    document.getElementById('btn-opt-save')?.addEventListener('click', () => {

      this.savedVolume = this.volume;
      window.SoundEngine.setVolume(this.volume, false);
      if (this.pendingLang && this.pendingLang !== window.currentLang) {
        window.setLanguage(this.pendingLang);
      }
      this.refreshAllTranslations();
      if (this.activeModalId) {
        this.renderModalContent(this.activeModalId, true);
      }
      window.SoundEngine.playSuccess();
      this.showToast(window.t('toast_saved'));
      this.showMenuView('main');
    });

    document.getElementById('btn-host-room')?.addEventListener('click', () => {
      window.Network.hostRoom();
      this.updateLobbyStatusUI();
      this.renderLobbySpecialistCards();
      this.updateHUD();
    });

    const joinBtn = document.getElementById('btn-join-room');
    const joinInput = document.getElementById('input-join-code');
    if (joinBtn && joinInput) {
      joinBtn.addEventListener('click', () => {
        const val = joinInput.value.trim();
        if (!val) {
          joinInput.focus();
          return;
        }
        window.Network.joinRoom(val);
        this.updateLobbyStatusUI();
        this.updateHUD();
      });
      joinInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') joinBtn.click();
      });
    }

    document.getElementById('btn-copy-code')?.addEventListener('click', () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.Network.roomCode);
      }
      this.showToast(window.t('toast_copied'));
    });

    document.getElementById('btn-server-back')?.addEventListener('click', () => {
      this.showMenuView('main');
    });

    document.getElementById('btn-start-game')?.addEventListener('click', () => {
      this.enterLab();
    });

    document.getElementById('btn-hud-home')?.addEventListener('click', () => {
      this.inGame = false;
      this.closeModal();
      document.getElementById('game-view-shell')?.classList.add('hidden');
      document.getElementById('main-menu-screen')?.classList.remove('hidden');
      this.showMenuView('main');
      this.drawMenuBackground();
    });

    document.getElementById('btn-hud-intro')?.addEventListener('click', () => this.openModal('modal_intro'));
    document.getElementById('btn-hud-mission-info')?.addEventListener('click', () => this.openModal('modal_intro'));
    document.getElementById('btn-hud-map')?.addEventListener('click', () => this.openModal('modal_map'));

    document.getElementById('btn-fix-warning')?.addEventListener('click', () => {
      this.teleportToRoom(2);
      this.openModal('modal_cleanroom');
    });

    document.getElementById('btn-next-fact')?.addEventListener('click', () => {
      const facts = window.GAME_DATA.nasaFacts;
      this.missionState.factIndex = ((this.missionState.factIndex || 0) + 1) % facts.length;
      this.updateSidebar();
    });

    document.getElementById('btn-close-modal')?.addEventListener('click', () => this.closeModal());

    const modalBackdrop = document.getElementById('modal-overlay');
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) this.closeModal();
      });
    }

    document.getElementById('btn-skip-cutscene')?.addEventListener('click', () => this.finishLaunchCutscene());
  }

  updateLobbyStatusUI() {
    const code = window.Network.roomCode === 'SOLO' ? window.t('hud_local') : window.Network.roomCode;
    const codeEl = document.getElementById('lobby-room-code');
    if (codeEl) codeEl.textContent = code;
    const hudCodeEl = document.getElementById('hud-room-code-val');
    if (hudCodeEl) hudCodeEl.textContent = code;
  }

  renderLobbySpecialistCards() {
    const container = document.getElementById('lobby-specialists-grid');
    if (!container) return;

    container.innerHTML = '';
    window.GAME_DATA.specialists.forEach((spec) => {
      const isTakenByOther = window.Network.isRoleTakenByOther(spec.id);
      const isSelected = this.activeCharId === spec.id && !isTakenByOther;
      const portraitUrl = window.AssetLoader.getPortraitDataUrl(spec.id);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `option-card p-3 flex items-center gap-3.5 text-left transition-colors ${
        isSelected
          ? 'is-selected'
          : isTakenByOther
          ? 'opacity-55 cursor-not-allowed border-rose-500/80'
          : ''
      }`;
      const statusLabel = isSelected
        ? window.t('role_yours')
        : isTakenByOther
        ? window.t('role_taken')
        : window.t('role_free');
      const statusColorClass = isSelected
        ? 'text-emerald-300'
        : isTakenByOther
        ? 'text-rose-400'
        : 'text-white';

      btn.innerHTML = `
        <img src="${portraitUrl}" alt="${window.t(`${spec.id}_name`)}" class="char-portrait-rect" />
        <div class="min-w-0 flex-1">
          <div class="font-pixel text-xs text-white truncate">${window.t(`${spec.id}_name`)}</div>
          <div class="font-pixel-body text-2xl text-slate-200 leading-tight mt-1">${window.t(`${spec.id}_role`)}</div>
          <div class="font-pixel text-[10px] ${statusColorClass} mt-2">${statusLabel}</div>
        </div>
      `;
      btn.addEventListener('click', () => {
        this.selectSpecialist(spec.id);
      });
      container.appendChild(btn);
    });
  }

  selectSpecialist(charId) {
    if (window.Network.isRoleTakenByOther(charId)) {
      this.showToast(window.t('toast_role_taken'), true);
      return;
    }
    const prevChar = this.getActiveCharacter();
    if (prevChar && prevChar.id !== charId) {
      prevChar.vx = 0;
      prevChar.vy = 0;
      prevChar.walkTarget = null;
      window.Network.syncPlayerPosition(prevChar);
    }
    if (!window.Network.claimRole(charId)) {
      this.showToast(window.t('toast_role_taken'), true);
      return;
    }
    this.activeCharId = charId;
    window.SoundEngine.playSelect();
    window.Network.syncPlayerPosition(this.getActiveCharacter());
    this.renderLobbySpecialistCards();
    this.updateHUD();
  }

  enterLab() {
    this.inGame = true;
    document.getElementById('main-menu-screen').classList.add('hidden');
    document.getElementById('game-view-shell').classList.remove('hidden');
    this.renderer.resize();
    this.updateHUD();
    window.Network.syncPlayerPosition(this.getActiveCharacter());

    if (!this.missionState.introSeen) {
      this.missionState.introSeen = true;
      this.openModal('modal_intro');
    }
  }

  bindKeyboardAndMouseEvents(canvas) {
    window.addEventListener('keydown', (e) => {
      if (e.target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      const k = e.key.toLowerCase();
      this.keys[k] = true;

      if (k === 'escape') {
        if (this.activeModalId) {
          this.closeModal();
        }
        return;
      }

      if (!this.inGame || this.cutsceneActive) return;

      if (k === 'm') {
        e.preventDefault();
        if (this.activeModalId === 'modal_map') {
          this.closeModal();
        } else {
          this.openModal('modal_map');
        }
        return;
      }

      if ((k === 'e' || k === ' ') && !this.activeModalId) {
        e.preventDefault();
        this.triggerInteraction();
      }
    });

    window.addEventListener('keyup', (e) => {
      const k = e.key.toLowerCase();
      this.keys[k] = false;
    });

    canvas.addEventListener('mousemove', (e) => {
      if (!this.inGame || this.activeModalId) return;
      const pt = this.renderer.clientToLogical(e.clientX, e.clientY);
      const activeChar = this.getActiveCharacter();
      const roomData = window.GAME_DATA.rooms[activeChar.room];

      this.renderer.hoveredProp =
        roomData.props.find(
          (p) => pt.x >= p.x - 10 && pt.x <= p.x + p.w + 10 && pt.y >= p.y - 10 && pt.y <= p.y + p.h + 24
        ) || null;
      canvas.style.cursor = this.renderer.hoveredProp ? 'pointer' : 'default';
    });

    canvas.addEventListener('pointerdown', (e) => {
      if (!this.inGame || this.activeModalId || this.cutsceneActive) return;
      const pt = this.renderer.clientToLogical(e.clientX, e.clientY);
      const activeChar = this.getActiveCharacter();
      const roomData = window.GAME_DATA.rooms[activeChar.room];

      const clickedProp = roomData.props.find(
        (p) => pt.x >= p.x - 16 && pt.x <= p.x + p.w + 16 && pt.y >= p.y - 40 && pt.y <= p.y + p.h + 30
      );

      if (clickedProp) {
        const dist = Math.hypot(
          activeChar.x - (clickedProp.x + clickedProp.w / 2),
          activeChar.y - (clickedProp.y + clickedProp.h + 28)
        );
        if (dist < 135) {
          this.openModal(clickedProp.modalId);
        } else {
          activeChar.walkTarget = {
            x: clickedProp.x + clickedProp.w / 2,
            y: Math.min(600, clickedProp.y + clickedProp.h + 34),
            openModalOnArrive: clickedProp.modalId
          };
        }
        return;
      }

      const d = roomData.door;
      if (
        pt.x >= d.x - d.w / 2 - 15 &&
        pt.x <= d.x + d.w / 2 + 15 &&
        pt.y >= d.y - d.h / 2 - 20 &&
        pt.y <= d.y + d.h / 2 + 15
      ) {
        const distDoor = Math.hypot(activeChar.x - d.x, activeChar.y - (d.y - 36));
        if (distDoor < 125) {
          this.openModal('modal_map');
        } else {
          activeChar.walkTarget = {
            x: d.x,
            y: d.y - 38,
            openModalOnArrive: 'modal_map'
          };
        }
        return;
      }

      activeChar.walkTarget = {
        x: Math.max(96, Math.min(1184, pt.x)),
        y: Math.max(225, Math.min(615, pt.y)),
        openModalOnArrive: null
      };
    });
  }

  bindTouchControls() {
    const dpadBtns = document.querySelectorAll('[data-dpad]');
    dpadBtns.forEach((btn) => {
      const dir = btn.getAttribute('data-dpad');
      const setDir = (active) => {
        if (dir === 'up') this.touchVector.y = active ? -1 : 0;
        if (dir === 'down') this.touchVector.y = active ? 1 : 0;
        if (dir === 'left') this.touchVector.x = active ? -1 : 0;
        if (dir === 'right') this.touchVector.x = active ? 1 : 0;
      };

      btn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        setDir(true);
      });
      btn.addEventListener('pointerup', (e) => {
        e.preventDefault();
        setDir(false);
      });
      btn.addEventListener('pointerleave', () => setDir(false));
      btn.addEventListener('pointercancel', () => setDir(false));
    });

    document.getElementById('btn-touch-interact')?.addEventListener('click', () => {
      if (!this.activeModalId) {
        this.triggerInteraction();
      }
    });

    document.getElementById('btn-touch-map')?.addEventListener('click', () => {
      this.openModal('modal_map');
    });
  }

  teleportToRoom(roomId) {
    const activeChar = this.getActiveCharacter();
    const spawnOffsets = { 1: 500, 2: 590, 3: 690, 4: 780 };
    activeChar.room = Number(roomId);
    activeChar.x = spawnOffsets[activeChar.num] || 640;
    activeChar.y = 540;
    activeChar.vx = 0;
    activeChar.vy = 0;
    activeChar.walkTarget = null;
    this.closeModal();
    this.updateHUD();
    window.Network.syncPlayerPosition(activeChar);
  }

  triggerInteraction() {
    if (this.renderer.nearProp) {
      this.openModal(this.renderer.nearProp.modalId);
    } else if (this.renderer.nearDoor) {
      this.openModal('modal_map');
    } else {
      const activeChar = this.getActiveCharacter();
      const roomData = window.GAME_DATA.rooms[activeChar.room];
      if (roomData.props.length > 0) {
        let closest = roomData.props[0];
        let bestDist = Infinity;
        roomData.props.forEach((p) => {
          const d = Math.hypot(activeChar.x - (p.x + p.w / 2), activeChar.y - (p.y + p.h));
          if (d < bestDist) {
            bestDist = d;
            closest = p;
          }
        });
        activeChar.walkTarget = {
          x: closest.x + closest.w / 2,
          y: Math.min(600, closest.y + closest.h + 34),
          openModalOnArrive: closest.modalId
        };
      }
    }
  }

  gameLoop(timestamp) {
    const dtMs = Math.min(50, timestamp - this.lastFrameTime);
    this.lastFrameTime = timestamp;

    if (this.inGame) {
      if (this.cutsceneActive) {
        const cutsceneCanvas = document.getElementById('cutscene-canvas');
        const elapsedSec = (timestamp - this.cutsceneStartTime) / 1000;
        if (cutsceneCanvas) {
          this.renderer.renderLaunchCutscene(cutsceneCanvas, elapsedSec, this.missionState);
        }
        if (elapsedSec >= 11.5) {
          this.finishLaunchCutscene();
        }
      } else {
        this.updateMovementAndAnimations(dtMs, timestamp);
        this.renderer.render(this);
      }
    }

    requestAnimationFrame((ts) => this.gameLoop(ts));
  }

  updateMovementAndAnimations(dtMs, timestamp) {
    const activeChar = this.getActiveCharacter();
    const roomData = window.GAME_DATA.rooms[activeChar.room];

    let dx = 0;
    let dy = 0;

    if (!this.activeModalId) {
      if (this.keys['w'] || this.keys['arrowup']) dy -= 1;
      if (this.keys['s'] || this.keys['arrowdown']) dy += 1;
      if (this.keys['a'] || this.keys['arrowleft']) dx -= 1;
      if (this.keys['d'] || this.keys['arrowright']) dx += 1;

      if (this.touchVector.x !== 0 || this.touchVector.y !== 0) {
        dx = this.touchVector.x;
        dy = this.touchVector.y;
      }

      if (dx !== 0 || dy !== 0) {
        activeChar.walkTarget = null;
      } else if (activeChar.walkTarget) {
        const tx = activeChar.walkTarget.x - activeChar.x;
        const ty = activeChar.walkTarget.y - activeChar.y;
        const dist = Math.hypot(tx, ty);
        if (dist < 10) {
          const modalToOpen = activeChar.walkTarget.openModalOnArrive;
          activeChar.walkTarget = null;
          if (modalToOpen) {
            this.openModal(modalToOpen);
          }
        } else {
          dx = tx / dist;
          dy = ty / dist;
        }
      }
    }

    const len = Math.hypot(dx, dy);
    const speedPxPerSec = 265;
    if (len > 0.01) {
      activeChar.vx = (dx / len) * speedPxPerSec;
      activeChar.vy = (dy / len) * speedPxPerSec;

      if (activeChar.vx < -1) activeChar.lastHorizDir = 'left';
      else if (activeChar.vx > 1) activeChar.lastHorizDir = 'right';

      let nextX = activeChar.x + (activeChar.vx * dtMs) / 1000;
      let nextY = activeChar.y + (activeChar.vy * dtMs) / 1000;

      nextX = Math.max(96, Math.min(1184, nextX));
      nextY = Math.max(220, Math.min(625, nextY));

      roomData.props.forEach((prop) => {
        const boxLeft = prop.x - 18;
        const boxRight = prop.x + prop.w + 18;
        const boxTop = prop.y + 20;
        const boxBottom = prop.y + prop.h - 4;

        if (nextX > boxLeft && nextX < boxRight && nextY > boxTop && nextY < boxBottom) {
          if (activeChar.x <= boxLeft || activeChar.x >= boxRight) {
            nextX = activeChar.x;
          }
          if (activeChar.y <= boxTop || activeChar.y >= boxBottom) {
            nextY = activeChar.y;
          }
        }
      });

      activeChar.x = nextX;
      activeChar.y = nextY;
      window.SoundEngine.playStep();
    } else {
      activeChar.vx = 0;
      activeChar.vy = 0;
    }

    Object.values(this.characters).forEach((c) => {
      if (c.id !== this.activeCharId) {
        if (c.netTargetX !== undefined && c.netTargetY !== undefined) {
          const dxNet = c.netTargetX - c.x;
          const dyNet = c.netTargetY - c.y;
          if (Math.hypot(dxNet, dyNet) < 0.8) {
            c.x = c.netTargetX;
            c.y = c.netTargetY;
          } else {
            const blend = Math.min(1, dtMs / 38);
            c.x += dxNet * blend;
            c.y += dyNet * blend;
          }
        }
        if (c.lastRemoteUpdateTs && timestamp - c.lastRemoteUpdateTs > 200) {
          c.vx = 0;
          c.vy = 0;
        }
      }

      const moving = Math.abs(c.vx) > 0.1 || Math.abs(c.vy) > 0.1;
      if (moving) {
        c.animTimerMs = (c.animTimerMs || 0) + dtMs;
        if (c.animTimerMs >= 120) {
          c.animTimerMs -= 120;
          c.animFrame = ((c.animFrame || 0) + 1) % 3;
        }
      } else {
        c.animFrame = 0;
        c.animTimerMs = 0;
      }
    });

    this.renderer.nearProp = null;
    let minPropDist = 128;
    roomData.props.forEach((prop) => {
      const px = prop.x + prop.w / 2;
      const py = prop.y + prop.h * 0.72;
      const d = Math.hypot(activeChar.x - px, activeChar.y - py);
      if (d < minPropDist) {
        minPropDist = d;
        this.renderer.nearProp = prop;
      }
    });

    const door = roomData.door;
    const doorDist = Math.hypot(activeChar.x - door.x, activeChar.y - door.y);
    this.renderer.nearDoor = !this.renderer.nearProp && doorDist < 105;

    const isMovingNow = len > 0.01;
    const stateTransition = Boolean(this.wasMovingLastFrame) !== isMovingNow;
    this.wasMovingLastFrame = isMovingNow;

    if (
      stateTransition ||
      (isMovingNow && timestamp - this.lastNetSyncTime >= 25) ||
      (!isMovingNow && timestamp - this.lastNetSyncTime >= 450)
    ) {
      this.lastNetSyncTime = timestamp;
      window.Network.syncPlayerPosition(activeChar);
    }
  }

  syncAndRefresh(invalidateTests = false, advanceDays = 3) {
    if (advanceDays > 0) {
      this.advanceMissionDay(advanceDays);
    }

    if (invalidateTests) {
      window.SoundEngine.playSelect();
      const hadAnyTest =
        this.missionState.tests.cac ||
        this.missionState.tests.shaker ||
        this.missionState.tests.tvac ||
        this.missionState.tests.ditl;
      if (hadAnyTest) {
        this.missionState.tests = { cac: false, shaker: false, tvac: false, ditl: false };
        this.missionState.testsInvalidatedByChange = true;
      }
    } else if (advanceDays > 0) {
      window.SoundEngine.playSuccess();
    }

    this.updateHUD();
    window.Network.syncMissionState(this.missionState);
    if (this.activeModalId) {
      this.renderModalContent(this.activeModalId, true);
    }
  }

  refreshAllTranslations() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      el.textContent = window.t(key);
    });

    this.renderLanguageDropdown();
    this.updateLobbyStatusUI();
    this.renderLobbySpecialistCards();
    this.renderSidebarGlossaryButtons();
    this.updateHUD();
  }

  updateHUD() {
    const evalData = window.GAME_DATA.evaluateSimulation(this.missionState);

    const missionEl = document.getElementById('hud-mission-val');
    if (missionEl) {
      missionEl.textContent = window.I18N.pick(evalData.mission.shortTitle || evalData.mission.name);
    }

    const orbitEl = document.getElementById('hud-orbit-val');
    if (orbitEl) {
      orbitEl.textContent = window.I18N.pick(evalData.orbit.shortName || evalData.orbit.name);
    }

    const massEl = document.getElementById('hud-mass-val');
    const massBox = document.getElementById('hud-mass-box');
    if (massEl) {
      massEl.textContent = `${evalData.totalMass.toFixed(2)} / ${evalData.maxMass.toFixed(2)} kg`;
    }
    if (massBox) {
      massBox.style.borderColor = evalData.massOk ? '#ffffff' : '#f43f5e';
      massBox.style.backgroundColor = evalData.massOk ? '#090714' : '#4c0519';
    }

    const powerEl = document.getElementById('hud-power-val');
    const powerBox = document.getElementById('hud-power-box');
    if (powerEl) {
      const sign = evalData.powerBalanceW >= 0 ? '+' : '';
      powerEl.textContent = `${sign}${evalData.powerBalanceW} W`;
    }
    if (powerBox) {
      powerBox.style.borderColor = evalData.powerOk ? '#ffffff' : '#f43f5e';
      powerBox.style.backgroundColor = evalData.powerOk ? '#090714' : '#4c0519';
    }

    const budgetEl = document.getElementById('hud-budget-val');
    const budgetBox = document.getElementById('hud-budget-box');
    if (budgetEl) {
      budgetEl.textContent = `$${(evalData.remainingBudget / 1000).toFixed(0)}k / $${(evalData.totalBudget / 1000).toFixed(0)}k (${evalData.reservePct}%)`;
    }
    if (budgetBox) {
      budgetBox.style.borderColor = evalData.reserveOk && evalData.budgetOk ? '#ffffff' : '#f43f5e';
    }

    const warnBanner = document.getElementById('top-warning-banner');
    const warnTitle = document.getElementById('top-warning-title');
    const warnDesc = document.getElementById('top-warning-desc');
    if (warnBanner && warnTitle && warnDesc) {
      if (!evalData.powerOk) {
        warnBanner.classList.remove('hidden');
        warnTitle.textContent = window.t('warn_power_title');
        warnDesc.textContent = window.t('warn_power_desc').replace('{power}', String(evalData.powerBalanceW));
      } else if (!evalData.massOk) {
        warnBanner.classList.remove('hidden');
        warnTitle.textContent = window.t('warn_mass_title');
        warnDesc.textContent = window
          .t('warn_mass_desc')
          .replace('{mass}', evalData.totalMass.toFixed(2))
          .replace('{max}', evalData.maxMass.toFixed(2));
      } else {
        warnBanner.classList.add('hidden');
      }
    }

    this.updateLobbyStatusUI();
    this.updateHUDPlayerLocations();
    this.updateSidebar(evalData);
  }

  updateHUDPlayerLocations() {
    const bar = document.getElementById('hud-specialists-bar');
    if (!bar) return;

    bar.innerHTML = '';
    const activeChar = this.getActiveCharacter();

    [1, 2, 3, 4].forEach((rNum) => {
      const isHere = activeChar && activeChar.room === rNum;
      const otherPlayersInRoom = Object.values(this.characters).filter(
        (c) =>
          c.room === rNum &&
          c.id !== this.activeCharId &&
          window.Network &&
          window.Network.isRoleTakenByOther(c.id)
      ).length;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `h-[44px] px-3.5 border-2 font-pixel text-[11px] transition-colors flex items-center gap-1.5 ${
        isHere
          ? 'bg-white text-[#090714] border-white'
          : 'bg-[#090714] text-white border-white/60 hover:border-white'
      }`;
      const label = window.t(`room${rNum}_short`);
      btn.innerHTML = `
        <span>${label}</span>
        ${
          otherPlayersInRoom > 0
            ? `<span class="px-1.5 py-0.5 text-[9px] bg-emerald-600 text-white border border-white">+${otherPlayersInRoom}</span>`
            : ''
        }
      `;
      btn.addEventListener('click', () => {

        this.teleportToRoom(rNum);
      });
      bar.appendChild(btn);
    });
  }

  updateSidebar(evalDataInput) {
    const evalData = evalDataInput || window.GAME_DATA.evaluateSimulation(this.missionState);
    const activeChar = this.getActiveCharacter();
    const roomNum = activeChar ? activeChar.room : 1;

    const dayBadge = document.getElementById('sidebar-day-badge');
    if (dayBadge) {
      dayBadge.textContent = `${window.t('hud_day_label')} ${this.missionState.missionDay || 1} / 90`;
    }
    const stageText = document.getElementById('sidebar-stage-text');
    if (stageText) {
      stageText.textContent = evalData.currentCML;
    }
    const progText = document.getElementById('sidebar-progress-text');
    if (progText) {
      progText.textContent = `${evalData.completedGatesCount} / 8 (${evalData.overallProgressPct}%)`;
    }
    const progFill = document.getElementById('sidebar-progress-fill');
    if (progFill) {
      progFill.style.width = `${evalData.overallProgressPct}%`;
    }

    const guidance = window.GAME_DATA.getSpecialistGuidance(roomNum, this.missionState, evalData);
    const portraitEl = document.getElementById('sidebar-char-portrait');
    const nameEl = document.getElementById('sidebar-char-name');
    const roleEl = document.getElementById('sidebar-char-role');
    const speechEl = document.getElementById('sidebar-char-speech');

    if (portraitEl) {
      portraitEl.src = window.AssetLoader.getPortraitDataUrl(guidance.charId);
    }
    if (nameEl) {
      nameEl.textContent = window.t(`${guidance.charId}_name`);
    }
    if (roleEl) {
      roleEl.textContent = window.t(`${guidance.charId}_role`);
    }
    if (speechEl) {
      speechEl.textContent = window.I18N.pick(guidance.text);
      speechEl.style.borderColor = guidance.mood === 'warn' ? '#f43f5e' : '#ffffff';
      speechEl.style.backgroundColor = guidance.mood === 'warn' ? '#4c0519' : '#140e38';
    }

    const missionExplainer = document.getElementById('sidebar-mission-explainer');
    if (missionExplainer) {
      missionExplainer.innerHTML = `
        <div class="font-pixel text-xs text-white mb-1">${window.I18N.pick(evalData.mission.name)}</div>
        <p class="text-xl text-slate-200 leading-snug">${window.I18N.pick(evalData.mission.plainWhy)}</p>
      `;
    }
  }

  renderSidebarGlossaryButtons() {
    const btnHolder = document.getElementById('sidebar-glossary-buttons');
    const ansBox = document.getElementById('sidebar-glossary-answer');
    if (!btnHolder || !ansBox) return;

    btnHolder.innerHTML = '';
    window.GAME_DATA.glossaryTerms.forEach((term) => {
      const isAct = this.activeGlossaryId === term.id;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `w-full text-left px-3 py-2 border font-pixel-body text-2xl transition-colors ${
        isAct
          ? 'bg-white text-[#090714] border-white font-bold'
          : 'bg-[#090714] text-white border-white/50 hover:border-white'
      }`;
      btn.textContent = window.I18N.pick(term.title);
      btn.addEventListener('click', () => {
        this.activeGlossaryId = term.id;
        this.renderSidebarGlossaryButtons();
      });
      btnHolder.appendChild(btn);
    });

    const activeTerm =
      window.GAME_DATA.glossaryTerms.find((t) => t.id === this.activeGlossaryId) ||
      window.GAME_DATA.glossaryTerms[0];
    if (activeTerm) {
      ansBox.classList.remove('hidden');
      ansBox.textContent = window.I18N.pick(activeTerm.text);
    }
  }

  openModal(modalId) {
    this.activeModalId = modalId;
    window.SoundEngine.playOpenModal();
    document.getElementById('modal-overlay')?.classList.remove('hidden');
    this.renderModalContent(modalId, false);
  }

  closeModal() {
    if (this.activeModalId) {
      window.SoundEngine.playCloseModal();
    }
    this.activeModalId = null;
    document.getElementById('modal-overlay')?.classList.add('hidden');
  }

  getTopModalWarningHtml(evalData) {
    const warnings = [];
    if (!evalData.powerOk) {
      warnings.push(`
        <div class="p-4 border-2 border-white bg-rose-950 text-white">
          <div class="font-pixel text-xs mb-1.5">${window.t('warn_power_title')}</div>
          <p class="text-2xl leading-snug">${window.t('warn_power_desc').replace('{power}', String(evalData.powerBalanceW))}</p>
        </div>
      `);
    }
    if (!evalData.massOk) {
      warnings.push(`
        <div class="p-4 border-2 border-white bg-rose-950 text-white">
          <div class="font-pixel text-xs mb-1.5">${window.t('warn_mass_title')}</div>
          <p class="text-2xl leading-snug">${window
            .t('warn_mass_desc')
            .replace('{mass}', evalData.totalMass.toFixed(2))
            .replace('{max}', evalData.maxMass.toFixed(2))}</p>
        </div>
      `);
    }
    return warnings.join('');
  }

  getStageProgressBarHtml(label, completedCount, totalCount) {
    const pct = Math.round((completedCount / Math.max(1, totalCount)) * 100);
    return `
      <div class="kimu-progress-wrap">
        <div class="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <span class="font-pixel text-xs text-white">${label}</span>
          <span class="font-pixel text-xs text-white">${completedCount} / ${totalCount} (${pct}%)</span>
        </div>
        <div class="kimu-progress-track">
          <div class="kimu-progress-fill" style="width: ${pct}%;"></div>
        </div>
      </div>
    `;
  }

  renderModalContent(modalId, preserveScroll = false) {
    const titleEl = document.getElementById('modal-header-title');
    const subEl = document.getElementById('modal-header-sub');
    const bodyEl = document.getElementById('modal-body-content');
    if (!titleEl || !subEl || !bodyEl) return;

    const prevScroll = preserveScroll ? bodyEl.scrollTop : 0;
    const evalData = window.GAME_DATA.evaluateSimulation(this.missionState);

    switch (modalId) {
      case 'modal_intro':
        titleEl.textContent = window.t('intro_title');
        subEl.textContent = window.t('intro_subtitle');
        this.renderIntroModal(bodyEl, evalData);
        break;
      case 'modal_science':
        titleEl.textContent = window.t('s1_title');
        subEl.textContent = window.t('s1_desc');
        this.renderScienceModal(bodyEl, evalData);
        break;
      case 'modal_board':
        titleEl.textContent = window.t('s1_reviews');
        subEl.textContent = window.t('s1_desc');
        this.renderBoardModal(bodyEl, evalData);
        break;
      case 'modal_cleanroom':
        titleEl.textContent = window.t('s2_title');
        subEl.textContent = window.t('s2_desc');
        this.renderCleanroomModal(bodyEl, evalData);
        break;
      case 'modal_shaker':
        titleEl.textContent = window.t('s3_tests_top_title');
        subEl.textContent = window.t('s2_desc');
        this.renderShakerModal(bodyEl, evalData);
        break;
      case 'modal_comms':
        titleEl.textContent = window.t('s3_title');
        subEl.textContent = window.t('s3_desc');
        this.renderCommsModal(bodyEl, evalData);
        break;
      case 'modal_launch':
        titleEl.textContent = window.t('s4_title');
        subEl.textContent = window.t('s4_desc');
        this.renderLaunchModal(bodyEl, evalData);
        break;
      case 'modal_map':
        titleEl.textContent = window.t('map_title');
        subEl.textContent = window.t('map_subtitle');
        this.renderMapModal(bodyEl);
        break;
      case 'modal_report':
        titleEl.textContent = evalData.readyForLaunch
          ? window.t('rep_success_title')
          : window.t('rep_fail_title');
        subEl.textContent = window.I18N.pick(evalData.mission.name);
        this.renderPostMissionReportModal(bodyEl, evalData);
        break;
    }

    bodyEl.scrollTop = prevScroll;
  }

  renderIntroModal(container, evalData) {
    container.innerHTML = `
      <div class="space-y-5">
        <div class="bench-black-box p-5">
          <div class="font-pixel text-xs sm:text-sm text-white mb-3.5">CONHEÇA SUA EQUIPE DO KENNEDY SPACE CENTER:</div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            ${window.GAME_DATA.specialists
              .map((spec) => {
                const portrait = window.AssetLoader.getPortraitDataUrl(spec.id);
                return `
                  <div class="p-3 border border-white/60 bg-[#120d2b] flex items-center gap-3">
                    <img src="${portrait}" alt="${window.t(`${spec.id}_name`)}" class="char-portrait-rect" />
                    <div class="min-w-0">
                      <div class="font-pixel text-xs text-white">${window.t(`${spec.id}_name`)}</div>
                      <div class="text-xl text-slate-200 leading-tight mt-1">${window.t(`${spec.id}_role`)}</div>
                    </div>
                  </div>
                `;
              })
              .join('')}
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bench-black-box p-5">
            <div class="font-pixel text-xs sm:text-sm text-white mb-2.5">${window.t('intro_step1_title')}</div>
            <p class="text-2xl text-slate-100 leading-snug">${window.t('intro_step1_desc')}</p>
          </div>
          <div class="bench-black-box p-5">
            <div class="font-pixel text-xs sm:text-sm text-white mb-2.5">${window.t('intro_step2_title')}</div>
            <p class="text-2xl text-slate-100 leading-snug">${window.t('intro_step2_desc')}</p>
          </div>
          <div class="bench-black-box p-5">
            <div class="font-pixel text-xs sm:text-sm text-white mb-2.5">${window.t('intro_step3_title')}</div>
            <p class="text-2xl text-slate-100 leading-snug">${window.t('intro_step3_desc')}</p>
          </div>
        </div>

        <div class="bench-black-box p-5 space-y-2.5">
          <div class="font-pixel text-xs sm:text-sm text-white">DADOS DA SUA MISSÃO ATUAL: ${window.I18N.pick(evalData.mission.name)}</div>
          <p class="text-2xl text-slate-100">${window.I18N.pick(evalData.mission.plainWhy)}</p>
          <p class="text-2xl text-slate-200">${window.I18N.pick(evalData.mission.realStoryWho)}</p>
          <div class="spec-metrics-row">
            <span>Orçamento Base: $${evalData.mission.budget.toLocaleString()}</span>
            <span>Categoria: ${window.I18N.pick(evalData.mission.category)}</span>
            <span>Órbita Selecionada: ${window.I18N.pick(evalData.orbit.shortName)}</span>
          </div>
        </div>

        <button id="btn-intro-start" type="button" class="kimu-btn w-full h-[54px] text-sm">${window.t('intro_start_btn')}</button>
      </div>
    `;

    container.querySelector('#btn-intro-start')?.addEventListener('click', () => {
      this.closeModal();
    });
  }

  renderScienceModal(container, evalData) {
    const s = this.missionState;
    const stepDone = (evalData.payloadMatchesMission ? 1 : 0) + (s.meritReviewPassed ? 1 : 0) + (evalData.noaaOk ? 1 : 0);

    container.innerHTML = `
      <div class="space-y-6">
        ${this.getStageProgressBarHtml(window.t('wb_progress_label'), stepDone, 3)}

        <div>
          <h3 class="font-pixel text-sm sm:text-base text-white mb-3.5">${window.t('s1_contracts')}</h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            ${window.GAME_DATA.missions
              .map((m) => {
                const active = s.missionId === m.id;
                return `
                  <div data-select-mission="${m.id}" class="option-card cursor-pointer p-5 flex flex-col justify-between ${active ? 'is-selected' : ''}">
                    <div>
                      <div class="flex items-start justify-between gap-2 mb-2.5">
                        <span class="font-pixel text-xs sm:text-sm text-white">${window.I18N.pick(m.name)}</span>
                        ${active ? `<span class="px-2.5 py-1 bg-white text-[#090714] font-pixel text-[10px] shrink-0">${window.t('wb_selected')}</span>` : ''}
                      </div>
                      <p class="text-slate-100 text-2xl leading-snug mb-2.5">${window.I18N.pick(m.description)}</p>
                      <p class="text-slate-300 text-xl leading-snug">${window.I18N.pick(m.plainWhy)}</p>
                    </div>
                    <div class="spec-metrics-row">
                      <span>Orçamento: $${(m.budget / 1000).toFixed(0)}k</span>
                      <span>Categoria: ${window.I18N.pick(m.category)}</span>
                    </div>
                  </div>
                `;
              })
              .join('')}
          </div>
        </div>

        <div>
          <h3 class="font-pixel text-sm sm:text-base text-white mb-3.5">${window.t('s1_payloads')}</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            ${window.GAME_DATA.payloads
              .map((p) => {
                const active = s.payloadId === p.id;
                return `
                  <div data-select-payload="${p.id}" class="option-card cursor-pointer p-5 flex flex-col justify-between ${active ? 'is-selected' : ''}">
                    <div>
                      <div class="flex items-start justify-between gap-2 mb-2.5">
                        <span class="font-pixel text-xs sm:text-sm text-white">${window.I18N.pick(p.name)}</span>
                        ${active ? `<span class="px-2.5 py-1 bg-white text-[#090714] font-pixel text-[10px] shrink-0">${window.t('wb_selected')}</span>` : ''}
                      </div>
                      <p class="text-slate-100 text-2xl leading-snug mb-2">${window.I18N.pick(p.desc)}</p>
                    </div>
                    <div class="spec-metrics-row">
                      <span>${p.mass.toFixed(2)} kg</span>
                      <span>-${p.powerUse} W</span>
                      <span>${p.dataMB} MB/dia</span>
                      <span>$${(p.cost / 1000).toFixed(0)}k</span>
                    </div>
                  </div>
                `;
              })
              .join('')}
          </div>
        </div>
      </div>
    `;

    container.querySelectorAll('[data-select-mission]').forEach((el) => {
      el.addEventListener('click', () => {
        const mId = el.getAttribute('data-select-mission');
        this.missionState.missionId = mId;
        this.syncAndRefresh(false, 2);
      });
    });

    container.querySelectorAll('[data-select-payload]').forEach((el) => {
      el.addEventListener('click', () => {
        this.missionState.payloadId = el.getAttribute('data-select-payload');
        this.syncAndRefresh(true, 2);
      });
    });
  }

  renderBoardModal(container, evalData) {
    const s = this.missionState;
    const revDoneCount =
      (s.meritReviewPassed ? 1 : 0) +
      (s.feasibilityReviewPassed ? 1 : 0) +
      (evalData.noaaOk ? 1 : 0);

    const allStage1Ready = s.meritReviewPassed && s.feasibilityReviewPassed && evalData.noaaOk;

    container.innerHTML = `
      <div class="space-y-5">
        ${this.getStageProgressBarHtml(window.t('wb_progress_label'), revDoneCount, 3)}

        <div class="p-4 border-2 border-white ${allStage1Ready ? 'bg-emerald-950' : 'bg-[#090714]'} text-white font-pixel text-xs">
          ${allStage1Ready ? window.t('s1_status_ready') : window.t('s1_status_pending')}
        </div>

        <div class="bench-black-box p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div class="text-slate-300 text-xl">ORÇAMENTO TOTAL</div>
            <div class="font-pixel text-sm text-white mt-1.5">$${evalData.totalBudget.toLocaleString()}</div>
          </div>
          <div>
            <div class="text-slate-300 text-xl">CUSTO DO PROJETO</div>
            <div class="font-pixel text-sm text-white mt-1.5">$${evalData.totalCost.toLocaleString()}</div>
          </div>
          <div>
            <div class="text-slate-300 text-xl">SALDO LIVRE</div>
            <div class="font-pixel text-sm text-white mt-1.5">$${evalData.remainingBudget.toLocaleString()}</div>
          </div>
          <div>
            <div class="text-slate-300 text-xl">RESERVA (MÍN 10%)</div>
            <div class="font-pixel text-sm text-white mt-1.5">${evalData.reservePct}%</div>
          </div>
        </div>

        <div class="font-pixel text-sm text-white pt-1">${window.t('s1_extra_options')}</div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="option-card p-5 flex flex-col justify-between ${s.meritReviewPassed && s.feasibilityReviewPassed ? 'is-selected' : ''}">
            <div>
              <div class="font-pixel text-xs text-white mb-2.5">1. REVISÃO CIENTÍFICA E PATROCÍNIO NASA</div>
              <p class="text-slate-100 text-2xl mb-4">Aprova o mérito científico da missão e libera a carona gratuita no foguete pelo programa CSLI da NASA.</p>
            </div>
            <button id="btn-merit-review" type="button" class="kimu-btn w-full ${s.meritReviewPassed && s.feasibilityReviewPassed ? 'kimu-btn-done' : ''}">
              ${s.meritReviewPassed && s.feasibilityReviewPassed ? window.t('s1_merit_done') : window.t('s1_merit_btn')}
            </button>
          </div>

          <div class="option-card p-5 flex flex-col justify-between ${s.outreachCompleted ? 'is-selected' : ''}">
            <div>
              <div class="font-pixel text-xs text-white mb-2.5">2. CAMPANHA PÚBLICA E EDUCATIVA</div>
              <p class="text-slate-100 text-2xl mb-4">Apresenta o satélite para escolas e visitantes no Kennedy Space Center, arrecadando +$40.000 extras para o orçamento.</p>
            </div>
            <button id="btn-outreach" type="button" class="kimu-btn w-full ${s.outreachCompleted ? 'kimu-btn-done' : ''}">
              ${s.outreachCompleted ? window.t('s1_crowdfund_done') : window.t('s1_crowdfund_btn')}
            </button>
          </div>

          <div class="option-card p-5 flex flex-col justify-between ${s.noaaLicenseApproved ? 'is-selected' : ''}">
            <div>
              <div class="font-pixel text-xs text-white mb-2.5">3. LICENÇA DE CÂMERA (NOAA)</div>
              <p class="text-slate-100 text-2xl mb-4">Autorização oficial obrigatória para todo satélite que possui câmeras apontadas para a Terra (como BisonSat e LightSail).</p>
            </div>
            <button id="btn-noaa" type="button" class="kimu-btn w-full ${s.noaaLicenseApproved ? 'kimu-btn-done' : ''}">
              ${s.noaaLicenseApproved ? window.t('s1_licenses_done') : window.t('s1_licenses_btn')}
            </button>
          </div>
        </div>
      </div>
    `;

    container.querySelector('#btn-merit-review')?.addEventListener('click', () => {
      this.missionState.meritReviewPassed = true;
      this.missionState.feasibilityReviewPassed = true;
      this.syncAndRefresh(false, 5);
      this.showToast(window.t('toast_merit_ok'));
    });
    container.querySelector('#btn-outreach')?.addEventListener('click', () => {
      if (!this.missionState.outreachCompleted) {
        this.missionState.outreachCompleted = true;
        this.syncAndRefresh(false, 4);
        this.showToast(window.t('toast_crowdfund_ok'));
      }
    });
    container.querySelector('#btn-noaa')?.addEventListener('click', () => {
      this.missionState.noaaLicenseApproved = true;
      this.syncAndRefresh(false, 3);
      this.showToast(window.t('toast_licenses_ok'));
    });
  }

  renderCleanroomModal(container, evalData) {
    const s = this.missionState;
    const checksOkCount =
      (evalData.massOk ? 1 : 0) +
      (evalData.powerOk ? 1 : 0) +
      (evalData.cmgOk ? 1 : 0) +
      (evalData.burnWireOk ? 1 : 0);

    container.innerHTML = `
      <div class="space-y-6">
        ${this.getTopModalWarningHtml(evalData)}
        ${this.getStageProgressBarHtml('EQUILÍBRIO TÉCNICO DO SATÉLITE (PESO, ENERGIA E SEGURANÇA)', checksOkCount, 4)}

        <div class="bench-black-box p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div class="text-slate-300 text-xl">PESO ATUAL / MÁXIMO</div>
            <div class="font-pixel text-sm text-white mt-1.5">${evalData.totalMass.toFixed(2)} / ${evalData.maxMass.toFixed(2)} kg</div>
          </div>
          <div>
            <div class="text-slate-300 text-xl">GERAÇÃO SOLAR</div>
            <div class="font-pixel text-sm text-white mt-1.5">+${evalData.effectiveSolarW} W</div>
          </div>
          <div>
            <div class="text-slate-300 text-xl">CONSUMO DAS PEÇAS</div>
            <div class="font-pixel text-sm text-white mt-1.5">-${evalData.totalPowerUseW} W</div>
          </div>
          <div>
            <div class="text-slate-300 text-xl">SALDO DE ENERGIA</div>
            <div class="font-pixel text-sm text-white mt-1.5">${evalData.powerBalanceW >= 0 ? '+' : ''}${evalData.powerBalanceW} W</div>
          </div>
        </div>

        <div>
          <h3 class="font-pixel text-sm sm:text-base text-white mb-3">${window.t('s2_bus_title')}</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            ${window.GAME_DATA.chassis
              .map((c) => {
                const active = s.chassisId === c.id;
                return `
                  <div data-select-chassis="${c.id}" class="option-card cursor-pointer p-4 flex flex-col justify-between ${active ? 'is-selected' : ''}">
                    <div>
                      <div class="flex items-center justify-between gap-2 mb-1.5">
                        <span class="font-pixel text-sm text-white">${window.I18N.pick(c.name)}</span>
                        ${active ? `<span class="px-2.5 py-1 bg-white text-[#090714] font-pixel text-[10px] shrink-0">${window.t('wb_selected')}</span>` : ''}
                      </div>
                      <p class="text-slate-100 text-2xl leading-snug">${window.I18N.pick(c.desc)}</p>
                    </div>
                    <div class="spec-metrics-row">
                      <span>Máx ${c.maxMass.toFixed(2)} kg</span>
                      <span>$${(c.cost / 1000).toFixed(0)}k</span>
                    </div>
                  </div>
                `;
              })
              .join('')}
          </div>
        </div>

        <div>
          <h3 class="font-pixel text-sm sm:text-base text-white mb-3">2. Material da Estrutura (Segurança de Reentrada)</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${window.GAME_DATA.structures
              .map((st) => {
                const active = s.structureId === st.id;
                return `
                  <div data-select-structure="${st.id}" class="option-card cursor-pointer p-4 flex flex-col justify-between ${active ? 'is-selected' : ''}">
                    <div>
                      <div class="flex items-center justify-between gap-2 mb-1.5">
                        <span class="font-pixel text-xs sm:text-sm text-white">${window.I18N.pick(st.name)}</span>
                        ${active ? `<span class="px-2.5 py-1 bg-white text-[#090714] font-pixel text-[10px] shrink-0">${window.t('wb_selected')}</span>` : ''}
                      </div>
                      <p class="text-slate-100 text-2xl leading-snug">${window.I18N.pick(st.desc)}</p>
                    </div>
                    <div class="spec-metrics-row">
                      <span>Peso: ${st.mass.toFixed(2)} kg</span>
                      <span>Custo: $${(st.cost / 1000).toFixed(0)}k</span>
                    </div>
                  </div>
                `;
              })
              .join('')}
          </div>
        </div>

        <div>
          <h3 class="font-pixel text-sm sm:text-base text-white mb-3">${window.t('s2_sub_title')}</h3>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div class="space-y-3">
              ${window.GAME_DATA.solarPanels
                .map((sp) => {
                  const active = s.solarId === sp.id;
                  return `
                    <div data-select-solar="${sp.id}" class="option-card cursor-pointer p-4 ${active ? 'is-selected' : ''}">
                      <div class="flex items-start justify-between gap-2 mb-1.5">
                        <span class="font-pixel text-xs text-white">${window.I18N.pick(sp.name)}</span>
                        ${active ? `<span class="px-2 py-0.5 bg-white text-[#090714] font-pixel text-[9px] shrink-0">${window.t('wb_selected')}</span>` : ''}
                      </div>
                      <p class="text-slate-100 text-xl my-1.5">${window.I18N.pick(sp.desc)}</p>
                      <div class="spec-metrics-row">
                        <span>+${sp.powerGen} W</span>
                        <span>${sp.mass.toFixed(2)} kg</span>
                        <span>$${sp.cost / 1000}k</span>
                      </div>
                    </div>
                  `;
                })
                .join('')}
            </div>

            <div class="space-y-3">
              ${window.GAME_DATA.batteries
                .map((b) => {
                  const active = s.batteryId === b.id;
                  return `
                    <div data-select-battery="${b.id}" class="option-card cursor-pointer p-4 ${active ? 'is-selected' : ''}">
                      <div class="flex items-start justify-between gap-2 mb-1.5">
                        <span class="font-pixel text-xs text-white">${window.I18N.pick(b.name)}</span>
                        ${active ? `<span class="px-2 py-0.5 bg-white text-[#090714] font-pixel text-[9px] shrink-0">${window.t('wb_selected')}</span>` : ''}
                      </div>
                      <p class="text-slate-100 text-xl my-1.5">${window.I18N.pick(b.desc)}</p>
                      <div class="spec-metrics-row">
                        <span>${b.mass.toFixed(2)} kg</span>
                        <span>$${b.cost / 1000}k</span>
                      </div>
                    </div>
                  `;
                })
                .join('')}
            </div>

            <div class="space-y-3">
              ${window.GAME_DATA.adcs
                .map((a) => {
                  const active = s.adcsId === a.id;
                  return `
                    <div data-select-adcs="${a.id}" class="option-card cursor-pointer p-4 ${active ? 'is-selected' : ''}">
                      <div class="flex items-start justify-between gap-2 mb-1.5">
                        <span class="font-pixel text-xs text-white">${window.I18N.pick(a.name)}</span>
                        ${active ? `<span class="px-2 py-0.5 bg-white text-[#090714] font-pixel text-[9px] shrink-0">${window.t('wb_selected')}</span>` : ''}
                      </div>
                      <p class="text-slate-100 text-xl my-1.5">${window.I18N.pick(a.desc)}</p>
                      <div class="spec-metrics-row">
                        <span>Luz: ${Math.round(a.solarEfficiency * 100)}%</span>
                        <span>-${a.powerUse} W</span>
                        <span>$${a.cost / 1000}k</span>
                      </div>
                    </div>
                  `;
                })
                .join('')}
            </div>
          </div>
        </div>

        <div class="bench-black-box p-5 space-y-3">
          <div class="font-pixel text-sm text-white">4. Trava de Segurança de Abertura (Burn Wire)</div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div data-select-burn="single" class="option-card cursor-pointer p-4 ${s.burnWireType === 'single' ? 'is-selected' : ''}">
              <div class="flex items-center justify-between gap-2">
                <span class="font-pixel text-xs text-white">Trava Simples (1 Fio de Nylon)</span>
                ${s.burnWireType === 'single' ? `<span class="px-2 py-0.5 bg-white text-[#090714] font-pixel text-[9px] shrink-0">${window.t('wb_selected')}</span>` : ''}
              </div>
              <p class="text-slate-100 text-xl mt-1.5">Mecanismo leve de retenção mecânica por fio único de nylon térmico.</p>
            </div>
            <div data-select-burn="double" class="option-card cursor-pointer p-4 ${s.burnWireType === 'double' ? 'is-selected' : ''}">
              <div class="flex items-center justify-between gap-2">
                <span class="font-pixel text-xs text-white">Trava Dupla Redundante (Double Burn Wire)</span>
                ${s.burnWireType === 'double' ? `<span class="px-2 py-0.5 bg-white text-[#090714] font-pixel text-[9px] shrink-0">${window.t('wb_selected')}</span>` : ''}
              </div>
              <p class="text-slate-100 text-xl mt-1.5">Mecanismo duplo independente de retenção para estruturas articuladas e desdobráveis.</p>
            </div>
          </div>
        </div>
      </div>
    `;

    const bindClick = (attr, prop) => {
      container.querySelectorAll(`[${attr}]`).forEach((el) => {
        el.addEventListener('click', () => {
          this.missionState[prop] = el.getAttribute(attr);
          if (prop === 'chassisId') this.missionState.dispenserLoaded = false;
          this.syncAndRefresh(true, 2);
        });
      });
    };

    bindClick('data-select-chassis', 'chassisId');
    bindClick('data-select-structure', 'structureId');
    bindClick('data-select-solar', 'solarId');
    bindClick('data-select-battery', 'batteryId');
    bindClick('data-select-adcs', 'adcsId');
    bindClick('data-select-burn', 'burnWireType');
  }

  renderShakerModal(container, evalData) {
    const s = this.missionState;
    const testsList = [
      {
        key: 'cac',
        title: '1. Inspeção de Peso e Medidas (CAC)',
        desc: 'Confere na balança de precisão se o satélite respeita o peso máximo do chassi escolhido.',
        passed: s.tests.cac,
        canPass: () => {
          if (!evalData.massOk) {
            return {
              ok: false,
              msg: `Excesso de peso (${evalData.totalMass} kg > ${evalData.maxMass} kg)! Escolha um chassi maior na Bancada 1.`
            };
          }
          return { ok: true, msg: 'Inspeção de peso e medidas aprovada!' };
        }
      },
      {
        key: 'shaker',
        title: '2. Mesa de Vibração (Shaker DS-9000)',
        desc: 'Sacode o satélite simulando a vibração violenta do foguete na decolagem.',
        passed: s.tests.shaker,
        canPass: () => {
          if (evalData.doubleBurnRequired && s.burnWireType !== 'double') {
            this.missionState.shakerReworkPenalty = (this.missionState.shakerReworkPenalty || 0) + 5000;
            return {
              ok: false,
              msg: 'Falha na vibração! Revise o sistema de trava de abertura na Bancada 1.'
            };
          }
          return { ok: true, msg: 'Teste de vibração aprovado com sucesso!' };
        }
      },
      {
        key: 'tvac',
        title: '3. Câmara de Vácuo Térmico (TVAC)',
        desc: 'Testa o satélite sem ar e sob temperaturas extremas do espaço (-40°C a +80°C).',
        passed: s.tests.tvac,
        canPass: () => ({ ok: true, msg: 'Câmara de vácuo térmico aprovada!' })
      },
      {
        key: 'ditl',
        title: '4. Simulação de Energia em Órbita (DITL)',
        desc: 'Liga todos os instrumentos por 24 horas para provar que o saldo de energia não fica negativo.',
        passed: s.tests.ditl,
        canPass: () => {
          if (!evalData.powerOk) {
            return {
              ok: false,
              msg: `Falta de energia (${evalData.powerBalanceW} W)! Ajuste a geração ou o consumo elétrico na Bancada 1.`
            };
          }
          return { ok: true, msg: 'Simulação de energia em órbita aprovada!' };
        }
      }
    ];

    const passedCount = testsList.filter((t) => t.passed).length;

    container.innerHTML = `
      <div class="space-y-5">
        ${this.getTopModalWarningHtml(evalData)}

        <div class="bench-black-box p-5 space-y-3.5">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div class="font-pixel text-sm text-white">
                ${evalData.allTestsPassed ? 'STATUS: TODOS OS 4 TESTES APROVADOS' : `PROGRESSO DOS TESTES: ${passedCount} DE 4 CONCLUÍDOS`}
              </div>
              <p class="text-slate-100 text-2xl mt-1">
                ${evalData.allTestsPassed ? window.t('s3_all_approved_banner') : window.t('s3_pending_banner')}
              </p>
            </div>
            <button id="btn-run-all-tests" type="button" class="kimu-btn ${evalData.allTestsPassed ? 'kimu-btn-done' : ''}">
              ${evalData.allTestsPassed ? 'TODOS OS TESTES APROVADOS' : 'EXECUTAR TODOS OS 4 TESTES'}
            </button>
          </div>
          <div class="kimu-progress-track">
            <div class="kimu-progress-fill" style="width: ${Math.round((passedCount / 4) * 100)}%;"></div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${testsList
            .map(
              (tItem) => `
              <div class="option-card p-5 flex flex-col justify-between ${tItem.passed ? 'is-selected' : ''}">
                <div>
                  <div class="flex items-center justify-between gap-2 mb-2.5">
                    <span class="font-pixel text-xs sm:text-sm text-white">${tItem.title}</span>
                    <span class="px-2.5 py-1 border border-white font-pixel text-[10px] ${tItem.passed ? 'bg-white text-[#090714]' : 'bg-[#090714] text-white'}">
                      ${tItem.passed ? window.t('wb_completed') : window.t('wb_pending')}
                    </span>
                  </div>
                  <p class="text-slate-100 text-2xl mb-4">${tItem.desc}</p>
                </div>
                <button data-run-test="${tItem.key}" type="button" class="kimu-btn w-full ${tItem.passed ? 'kimu-btn-done' : ''}">
                  ${tItem.passed ? 'TESTE APROVADO' : 'EXECUTAR ESTE TESTE'}
                </button>
              </div>
            `
            )
            .join('')}
        </div>
      </div>
    `;

    const runSingle = (key) => {
      const item = testsList.find((x) => x.key === key);
      if (!item) return;
      const res = item.canPass();
      this.missionState.tests[key] = res.ok;
      if (this.missionState.tests.cac && this.missionState.tests.shaker && this.missionState.tests.tvac && this.missionState.tests.ditl) {
        this.missionState.testsInvalidatedByChange = false;
      }
      this.syncAndRefresh(false, 4);
      this.showToast(res.msg, !res.ok);
    };

    container.querySelectorAll('[data-run-test]').forEach((btn) => {
      btn.addEventListener('click', () => runSingle(btn.getAttribute('data-run-test')));
    });

    container.querySelector('#btn-run-all-tests')?.addEventListener('click', () => {
      let allOk = true;
      let firstError = '';
      testsList.forEach((item) => {
        const res = item.canPass();
        this.missionState.tests[item.key] = res.ok;
        if (!res.ok && allOk) {
          allOk = false;
          firstError = res.msg;
        }
      });
      if (allOk) {
        this.missionState.testsInvalidatedByChange = false;
        this.showToast('Todos os 4 testes ambientais foram aprovados!');
      } else {
        this.showToast(firstError, true);
      }
      this.syncAndRefresh(false, 8);
    });
  }

  renderCommsModal(container, evalData) {
    const s = this.missionState;
    const activeTab = s.activeCommsTab || 'comms';
    const stage3DoneCount =
      (s.fccLicenseApproved ? 1 : 0) +
      (s.weatherStatus === 'clear' ? 1 : 0) +
      (evalData.dataEfficiencyPct >= 100 ? 1 : 0);

    const tabsHtml = `
      <div class="space-y-4 mb-5">
        ${this.getTopModalWarningHtml(evalData)}
        ${this.getStageProgressBarHtml('PREPARAÇÃO DE COMUNICAÇÃO E CLIMA', stage3DoneCount, 3)}

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          ${[
            { id: 'comms', label: '1. RÁDIO E ANTENA' },
            { id: 'weather', label: '2. CLIMA NO CABO' },
            { id: 'poll', label: '3. CHECKLIST (8 ITENS)' },
            { id: 'tracking', label: '4. RASTREIO TLE' }
          ]
            .map(
              (tObj) => `
              <button data-comms-tab="${tObj.id}" type="button" class="kimu-btn kimu-btn-sm w-full ${
                activeTab === tObj.id ? 'bg-white text-[#090714]' : ''
              }">${tObj.label}</button>
            `
            )
            .join('')}
        </div>
      </div>
    `;

    let tabBody = '';

    if (activeTab === 'comms') {
      tabBody = `
        <div class="space-y-5">
          <div class="bench-black-box p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div class="font-pixel text-xs sm:text-sm text-white">REGISTRO DE FREQUÊNCIA DE RÁDIO (FCC / IARU)</div>
              <p class="text-slate-100 text-2xl mt-1">Autoriza o satélite a transmitir sinais de rádio para as estações na Terra sem interferência.</p>
            </div>
            <button id="btn-fcc-license" type="button" class="kimu-btn shrink-0 ${s.fccLicenseApproved ? 'kimu-btn-done' : ''}">
              ${s.fccLicenseApproved ? 'FREQUÊNCIA FCC APROVADA' : 'APROVAR LICENÇA DE RÁDIO FCC'}
            </button>
          </div>

          <div>
            <h3 class="font-pixel text-sm sm:text-base text-white mb-3">${window.t('s3_gs_title')} (Volume gerado pelo sensor atual: ${evalData.generatedMB} MB/dia)</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              ${window.GAME_DATA.groundStations
                .map((gs) => {
                  const active = s.groundStationId === gs.id;
                  return `
                    <div data-select-ground="${gs.id}" class="option-card cursor-pointer p-5 flex flex-col justify-between ${active ? 'is-selected' : ''}">
                      <div>
                        <div class="flex items-start justify-between gap-2 mb-2">
                          <span class="font-pixel text-xs sm:text-sm text-white">${window.I18N.pick(gs.name)}</span>
                          ${active ? `<span class="px-2.5 py-1 bg-white text-[#090714] font-pixel text-[10px] shrink-0">${window.t('wb_selected')}</span>` : ''}
                        </div>
                        <p class="text-slate-100 text-2xl mb-3">${window.I18N.pick(gs.desc)}</p>
                      </div>
                      <div class="spec-metrics-row">
                        <span>Envia: ${gs.downlinkMB} MB/dia</span>
                        <span>-${gs.powerUse} W</span>
                        <span>$${gs.cost / 1000}k</span>
                      </div>
                    </div>
                  `;
                })
                .join('')}
            </div>
          </div>
        </div>
      `;
    } else if (activeTab === 'weather') {
      const isStorm = s.weatherStatus !== 'clear';
      tabBody = `
        <div class="bench-black-box p-6 space-y-4">
          <div class="font-pixel text-sm text-white">
            ${isStorm ? 'STATUS DO RADAR: TEMPESTADE E RAIOS SOBRE A PLATAFORMA 39A' : 'STATUS DO RADAR: CÉU LIMPO E VENTOS SEGUROS PARA LANÇAMENTO'}
          </div>
          <p class="text-slate-100 text-2xl">
            Na Flórida, foguetes não podem decolar durante tempestades elétricas. Se o radar indicar tempestade, aguarde a próxima janela meteorológica limpa!
          </p>
          <div class="flex flex-wrap gap-3">
            <button id="btn-weather-scrub" type="button" class="kimu-btn ${!isStorm ? 'kimu-btn-done' : ''}">
              ${!isStorm ? 'JANELA METEOROLÓGICA LIMPA (APROVADO)' : 'AGUARDAR CÉU LIMPO PARA LANÇAMENTO'}
            </button>
          </div>
        </div>
      `;
    } else if (activeTab === 'poll') {
      tabBody = `
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            ${evalData.pollGates
              .map(
                (gate) => `
                <div class="p-4 border-2 ${gate.ok ? 'border-white bg-[#090714]' : 'border-rose-400 bg-rose-950/70'} flex items-center justify-between gap-3">
                  <span class="text-white text-2xl">${window.I18N.pick(gate.label)}</span>
                  <span class="font-pixel text-[10px] px-2.5 py-1 border border-white ${gate.ok ? 'bg-white text-[#090714]' : 'bg-rose-900 text-white'}">
                    ${gate.ok ? 'PRONTO' : 'PENDENTE'}
                  </span>
                </div>
              `
              )
              .join('')}
          </div>
          <button id="btn-lcc-launch" type="button" class="kimu-btn w-full h-[54px] text-sm">${window.t('s4_launch_btn')}</button>
        </div>
      `;
    } else if (activeTab === 'tracking') {
      const tle = window.GAME_DATA.generateTLE(s);
      tabBody = `
        <div class="space-y-4">
          <div class="bench-black-box p-5 font-mono text-base text-white space-y-1.5">
            <div class="font-pixel text-xs text-slate-300 mb-2">DADOS DE RASTREIO ORBITAL (TLE DA NASA):</div>
            <div>0 ${tle.satName}</div>
            <div>${tle.line1}</div>
            <div>${tle.line2}</div>
            <p class="font-pixel-body text-2xl text-slate-200 pt-2">
              Explicação: Estas duas linhas de números (chamadas TLE) dizem para as antenas na Terra exatamente onde o seu satélite está passando a cada minuto!
            </p>
          </div>
          <div class="flex flex-wrap gap-3">
            <button id="btn-decode-beacon" type="button" class="kimu-btn flex-1">TESTAR SINAL DO SATÉLITE</button>
            <button id="btn-open-report-from-tracking" type="button" class="kimu-btn flex-1">VER RELATÓRIO E PONTUAÇÃO</button>
          </div>
        </div>
      `;
    }

    container.innerHTML = tabsHtml + tabBody;

    container.querySelectorAll('[data-comms-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.missionState.activeCommsTab = btn.getAttribute('data-comms-tab');
        this.renderModalContent('modal_comms', false);
      });
    });

    container.querySelectorAll('[data-select-ground]').forEach((el) => {
      el.addEventListener('click', () => {
        this.missionState.groundStationId = el.getAttribute('data-select-ground');
        this.syncAndRefresh(true, 2);
      });
    });

    container.querySelector('#btn-fcc-license')?.addEventListener('click', () => {
      this.missionState.fccLicenseApproved = true;
      this.syncAndRefresh(false, 4);
      this.showToast(window.t('toast_licenses_ok'));
    });

    container.querySelector('#btn-weather-scrub')?.addEventListener('click', () => {
      this.missionState.weatherStatus = 'clear';
      this.missionState.weatherScrubCount = (this.missionState.weatherScrubCount || 0) + 1;
      this.syncAndRefresh(false, 2);
      this.showToast('Céu limpo na Plataforma 39A!');
    });

    container.querySelector('#btn-lcc-launch')?.addEventListener('click', () => {
      if (!evalData.readyForLaunch) {
        this.showToast('Conclua os itens pendentes do checklist antes de lançar!', true);
        return;
      }
      this.initiateCountdownAndLaunch();
    });

    container.querySelector('#btn-decode-beacon')?.addEventListener('click', () => {
      this.missionState.firstContactDecoded = true;
      this.syncAndRefresh(false, 1);
      this.showToast('Sinal do satélite recebido com sucesso!');
    });

    container.querySelector('#btn-open-report-from-tracking')?.addEventListener('click', () => {
      this.openModal('modal_report');
    });
  }

  renderLaunchModal(container, evalData) {
    const s = this.missionState;
    const padDoneCount =
      (s.dispenserLoaded ? 1 : 0) +
      (s.rbfRemovedAtPad ? 1 : 0) +
      (s.crawlerTransported ? 1 : 0);

    container.innerHTML = `
      <div class="space-y-6">
        ${this.getTopModalWarningHtml(evalData)}
        ${this.getStageProgressBarHtml('PREPARAÇÃO NA PLATAFORMA 39A', padDoneCount, 3)}

        <div class="bench-black-box p-5 space-y-3.5">
          <div class="font-pixel text-sm text-white">1. Preparação Final na Plataforma 39A (Clique nos 3 passos)</div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <button id="btn-step1-dispenser" type="button" class="kimu-btn w-full ${s.dispenserLoaded ? 'kimu-btn-done' : ''}">
              ${s.dispenserLoaded ? '1. NO EJETOR (OK)' : '1. COLOCAR NO EJETOR'}
            </button>
            <button id="btn-step2-rbf" type="button" class="kimu-btn w-full ${s.rbfRemovedAtPad ? 'kimu-btn-done' : ''}">
              ${s.rbfRemovedAtPad ? '2. PINO RBF REMOVIDO (OK)' : '2. RETIRAR PINO RBF'}
            </button>
            <button id="btn-step3-crawler" type="button" class="kimu-btn w-full ${s.crawlerTransported ? 'kimu-btn-done' : ''}">
              ${s.crawlerTransported ? '3. NA PLATAFORMA 39A (OK)' : '3. LEVAR COM TRATOR CRAWLER'}
            </button>
          </div>
        </div>

        <div>
          <h3 class="font-pixel text-sm sm:text-base text-white mb-3">${window.t('s2_orbit_title')}</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${window.GAME_DATA.orbits
              .map((orb) => {
                const active = s.orbitId === orb.id;
                return `
                  <div data-select-orbit="${orb.id}" class="option-card cursor-pointer p-5 ${active ? 'is-selected' : ''}">
                    <div class="flex items-start justify-between gap-2 mb-1.5">
                      <span class="font-pixel text-xs sm:text-sm text-white">${window.I18N.pick(orb.name)}</span>
                      ${active ? `<span class="px-2.5 py-1 bg-white text-[#090714] font-pixel text-[10px] shrink-0">${window.t('wb_selected')}</span>` : ''}
                    </div>
                    <p class="text-slate-100 text-2xl leading-snug">${window.I18N.pick(orb.coverage)}</p>
                    <div class="spec-metrics-row">
                      <span>Altura: ${orb.altitudeKm.toLocaleString()} km</span>
                      <span>Inclinação: ${orb.inclinationDeg}°</span>
                    </div>
                  </div>
                `;
              })
              .join('')}
          </div>
        </div>

        <div>
          <h3 class="font-pixel text-sm sm:text-base text-white mb-3">${window.t('s4_rocket_title')}</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${window.GAME_DATA.rockets
              .map((rk) => {
                const active = s.rocketId === rk.id;
                return `
                  <div data-select-rocket="${rk.id}" class="option-card cursor-pointer p-5 flex flex-col justify-between ${active ? 'is-selected' : ''}">
                    <div>
                      <div class="flex items-start justify-between gap-2 mb-2">
                        <span class="font-pixel text-xs sm:text-sm text-white">${window.I18N.pick(rk.name)}</span>
                        ${active ? `<span class="px-2.5 py-1 bg-white text-[#090714] font-pixel text-[10px] shrink-0">${window.t('wb_selected')}</span>` : ''}
                      </div>
                      <p class="text-slate-100 text-2xl leading-snug mb-3">${window.I18N.pick(rk.desc)}</p>
                    </div>
                    <div class="spec-metrics-row">
                      <span>Custo: ${rk.cost === 0 ? '$0 (Patrocínio NASA)' : `$${rk.cost / 1000}k`}</span>
                      <span>Suporta até ${rk.maxUnits}U</span>
                    </div>
                  </div>
                `;
              })
              .join('')}
          </div>
        </div>

        <button id="btn-pad39a-launch" type="button" class="kimu-btn w-full h-[58px] text-sm ${evalData.readyForLaunch ? 'kimu-btn-done' : ''}">
          ${window.t('s4_launch_btn')}
        </button>
      </div>
    `;

    container.querySelectorAll('[data-select-orbit]').forEach((el) => {
      el.addEventListener('click', () => {
        const orbId = el.getAttribute('data-select-orbit');
        this.missionState.orbitId = orbId;
        this.syncAndRefresh(false, 2);
      });
    });

    container.querySelectorAll('[data-select-rocket]').forEach((el) => {
      el.addEventListener('click', () => {
        this.missionState.rocketId = el.getAttribute('data-select-rocket');
        this.syncAndRefresh(false, 2);
      });
    });

    container.querySelector('#btn-step1-dispenser')?.addEventListener('click', () => {
      this.missionState.dispenserLoaded = true;
      this.syncAndRefresh(false, 3);
    });
    container.querySelector('#btn-step2-rbf')?.addEventListener('click', () => {
      this.missionState.dispenserLoaded = true;
      this.missionState.rbfRemovedAtPad = true;
      this.syncAndRefresh(false, 2);
    });
    container.querySelector('#btn-step3-crawler')?.addEventListener('click', () => {
      this.missionState.dispenserLoaded = true;
      this.missionState.rbfRemovedAtPad = true;
      this.missionState.crawlerTransported = true;
      this.syncAndRefresh(false, 4);
    });
    container.querySelector('#btn-pad39a-launch')?.addEventListener('click', () => {
      if (!evalData.readyForLaunch) {
        const missingGate = evalData.pollGates.find((g) => !g.ok);
        const msg = missingGate
          ? `Pendência antes de lançar: ${window.I18N.pick(missingGate.label)}`
          : 'Conclua as etapas nas 4 salas antes de lançar!';
        this.showToast(msg, true);
        return;
      }
      this.initiateCountdownAndLaunch();
    });
  }

  renderMapModal(container) {
    const activeChar = this.getActiveCharacter();
    container.innerHTML = `
      <div class="space-y-5">
        <div id="ksc-map-canvas-holder" class="w-full border-2 border-white bg-[#090714] flex justify-center"></div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${[1, 2, 3, 4]
            .map((rId) => {
              const isHere = activeChar.room === rId;
              return `
                <div data-teleport-room="${rId}" class="option-card cursor-pointer p-5 flex flex-col justify-between ${isHere ? 'is-selected' : ''}">
                  <div>
                    <div class="font-pixel text-xs sm:text-sm text-white mb-2">${window.t(`room${rId}_name`)}</div>
                    <p class="text-slate-100 text-2xl mb-4">${window.t(`room${rId}_sub`)}</p>
                  </div>
                  <button type="button" class="kimu-btn w-full">${isHere ? 'VOCÊ ESTÁ NESTA SALA' : `IR PARA A SALA ${rId}`}</button>
                </div>
              `;
            })
            .join('')}
        </div>
      </div>
    `;

    const mapHolder = container.querySelector('#ksc-map-canvas-holder');
    const mapSprite = window.AssetLoader.get('map_ksc');
    if (mapHolder && mapSprite) {
      const c = document.createElement('canvas');
      c.width = 960;
      c.height = 440;
      c.className = 'w-full max-h-[290px] object-contain cursor-pointer';
      const cctx = c.getContext('2d');
      cctx.imageSmoothingEnabled = false;
      cctx.drawImage(mapSprite, 0, 0, 960, 440);

      const mapNodes =
        typeof window.AssetLoader.getKscMapNodes === 'function'
          ? window.AssetLoader.getKscMapNodes()
          : [
              { num: 1, x: 235, y: 335 },
              { num: 2, x: 265, y: 135 },
              { num: 3, x: 565, y: 315 },
              { num: 4, x: 755, y: 140 }
            ];

      const currentNode = mapNodes.find((n) => n.num === activeChar.room);
      if (currentNode) {
        cctx.strokeStyle = '#34d399';
        cctx.lineWidth = 4;
        cctx.strokeRect(currentNode.x - 120, currentNode.y - 40, 240, 76);

        cctx.fillStyle = '#064e3b';
        cctx.fillRect(currentNode.x - 62, currentNode.y - 62, 124, 22);
        cctx.strokeStyle = '#ffffff';
        cctx.lineWidth = 2;
        cctx.strokeRect(currentNode.x - 62, currentNode.y - 62, 124, 22);
        cctx.fillStyle = '#34d399';
        cctx.font = '10px "Press Start 2P", monospace';
        cctx.textAlign = 'center';
        cctx.fillText(window.t('tag_you'), currentNode.x, currentNode.y - 47);
      }

      c.addEventListener('click', (e) => {
        const rect = c.getBoundingClientRect();
        const mx = ((e.clientX - rect.left) / rect.width) * 960;
        const my = ((e.clientY - rect.top) / rect.height) * 440;

        let bestRoom = activeChar.room;
        let bestDist = Infinity;
        mapNodes.forEach((n) => {
          const d = Math.hypot(mx - n.x, my - n.y);
          if (d < bestDist) {
            bestDist = d;
            bestRoom = n.num;
          }
        });
        this.teleportToRoom(bestRoom);
      });
      mapHolder.appendChild(c);
    }

    container.querySelectorAll('[data-teleport-room]').forEach((el) => {
      el.addEventListener('click', () => this.teleportToRoom(Number(el.getAttribute('data-teleport-room'))));
    });
  }

  initiateCountdownAndLaunch() {
    this.closeModal();
    const banner = document.getElementById('countdown-overlay');
    const numEl = document.getElementById('countdown-number');
    if (!banner || !numEl) {
      this.startLaunchCutscene();
      return;
    }

    banner.classList.remove('hidden');
    this.countdownSeconds = 10;
    numEl.textContent = `T-00:10`;
    window.SoundEngine.playCountdownTick(10);

    if (this.countdownTimer) clearInterval(this.countdownTimer);
    this.countdownTimer = setInterval(() => {
      this.countdownSeconds -= 1;
      if (this.countdownSeconds > 0) {
        numEl.textContent = `T-00:0${this.countdownSeconds}`;
        window.SoundEngine.playCountdownTick(this.countdownSeconds);
      } else {
        clearInterval(this.countdownTimer);
        this.countdownTimer = null;
        banner.classList.add('hidden');
        this.missionState.launched = true;
        this.missionState.firstContactDecoded = true;
        this.syncAndRefresh(false, 10);
        window.Network.triggerLaunchCutscene();
        this.startLaunchCutscene();
      }
    }, 350);
  }

  startLaunchCutscene() {
    this.cutsceneActive = true;
    this.cutsceneStartTime = performance.now();
    window.SoundEngine.playRocketLaunch();
    document.getElementById('cutscene-overlay')?.classList.remove('hidden');
  }

  finishLaunchCutscene() {
    this.cutsceneActive = false;
    document.getElementById('cutscene-overlay')?.classList.add('hidden');
    this.openModal('modal_report');
  }

  renderPostMissionReportModal(container, evalData) {
    const sb = evalData.scoreBreakdown;
    const m = evalData.mission;

    const scoreRows = [
      { label: 'Ciência e Sensor Correto', val: sb.scienceScore, max: 300 },
      { label: 'Capacidade de Transmissão de Dados', val: sb.dataScore, max: 200 },
      { label: 'Engenharia, Segurança e 4 Testes', val: sb.engScore, max: 220 },
      { label: 'Licenças (NOAA/FCC), Clima e Operações', val: sb.opsScore, max: 140 },
      { label: 'Gestão do Orçamento e Reserva de 10%', val: sb.financeScore, max: 140 }
    ];

    container.innerHTML = `
      <div class="space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bench-black-box p-5 text-center space-y-2">
            <div class="font-pixel text-xs text-slate-300">${window.t('rep_score')}</div>
            <div class="font-pixel text-2xl text-white">${sb.totalScore} / 1000</div>
          </div>
          <div class="bench-black-box p-5 text-center space-y-2">
            <div class="font-pixel text-xs text-slate-300">${window.t('rep_budget_left')}</div>
            <div class="font-pixel text-xl text-white">$${evalData.remainingBudget.toLocaleString()} (${evalData.reservePct}%)</div>
          </div>
          <div class="bench-black-box p-5 text-center space-y-2">
            <div class="font-pixel text-xs text-slate-300">${window.t('rep_mass_final')}</div>
            <div class="font-pixel text-xl text-white">${evalData.totalMass.toFixed(2)} / ${evalData.maxMass.toFixed(2)} kg</div>
          </div>
          <div class="bench-black-box p-5 text-center space-y-2">
            <div class="font-pixel text-xs text-slate-300">${window.t('rep_power_final')}</div>
            <div class="font-pixel text-xl text-white">${evalData.powerBalanceW >= 0 ? '+' : ''}${evalData.powerBalanceW} W</div>
          </div>
        </div>

        <div class="bench-black-box p-6 space-y-4">
          <div class="font-pixel text-sm text-white">${window.t('rep_checklist_title')}</div>
          <div class="space-y-3.5">
            ${scoreRows
              .map((row) => {
                const pct = Math.round((row.val / row.max) * 100);
                return `
                  <div class="space-y-1.5">
                    <div class="flex items-center justify-between text-2xl text-white">
                      <span>${row.label}</span>
                      <span class="font-pixel text-xs text-white">${row.val} / ${row.max} pts</span>
                    </div>
                    <div class="kimu-progress-track">
                      <div class="kimu-progress-fill" style="width: ${pct}%;"></div>
                    </div>
                  </div>
                `;
              })
              .join('')}
          </div>
        </div>

        <div class="bench-black-box p-6 space-y-4">
          <div class="font-pixel text-sm text-white">${window.t('rep_real_history_title')}: ${window.I18N.pick(m.name)}</div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-4 border border-white/50 bg-[#120d2b] space-y-2">
              <div class="font-pixel text-xs text-white">1. QUEM CONSTRUIU E POR QUÊ?</div>
              <p class="text-slate-100 text-2xl leading-snug">${window.I18N.pick(m.realStoryWho)}</p>
              <p class="text-slate-300 text-xl leading-snug pt-1">${window.I18N.pick(m.plainWhy)}</p>
            </div>

            <div class="p-4 border border-white/50 bg-[#120d2b] space-y-2">
              <div class="font-pixel text-xs text-white">2. COMO FOI O VOO REAL?</div>
              <p class="text-slate-100 text-2xl leading-snug">${window.I18N.pick(m.realStoryLaunch)}</p>
              <p class="text-slate-300 text-xl leading-snug pt-1">${window.I18N.pick(m.realStoryImpact)}</p>
            </div>

            <div class="p-4 border border-white/50 bg-[#120d2b] space-y-2">
              <div class="font-pixel text-xs text-white">3. SEU SATÉLITE VS. SATÉLITE REAL</div>
              <p class="text-slate-100 text-2xl leading-snug">${window.I18N.pick(m.nasaRealBenchmark)}</p>
              <div class="border-t border-white/30 pt-2 mt-2 text-xl text-white space-y-1">
                <div>• Seu Chassi: ${this.missionState.chassisId} (${evalData.totalMass} kg)</div>
                <div>• Sua Órbita: ${window.I18N.pick(evalData.orbit.shortName)}</div>
                <div>• Seu Foguete: ${window.I18N.pick(evalData.rocket.name)}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap gap-3">
          <button id="btn-report-continue" type="button" class="kimu-btn flex-1">${window.t('rep_close_btn')}</button>
          <button id="btn-report-reset" type="button" class="kimu-btn flex-1">${window.t('rep_new_btn')}</button>
        </div>
      </div>
    `;

    container.querySelector('#btn-report-continue')?.addEventListener('click', () => {
      this.closeModal();
    });
    container.querySelector('#btn-report-reset')?.addEventListener('click', () => {
      this.missionState = window.GAME_DATA.createInitialMissionState();
      this.missionState.introSeen = true;
      this.syncAndRefresh(false, 0);
      this.teleportToRoom(1);
    });
  }

  showToast(message, isError = false) {
    if (isError) {
      window.SoundEngine.playError();
    }
    const toast = document.getElementById('game-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = `fixed bottom-7 left-1/2 -translate-x-1/2 z-50 px-6 py-3.5 font-pixel text-xs border-2 border-white ${
      isError ? 'bg-rose-900 text-white' : 'bg-[#090714] text-white'
    }`;
    toast.classList.remove('hidden');
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.add('hidden');
    }, 3400);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.GameApp = new KscMissionLabApp();
  window.GameApp.init();
});
