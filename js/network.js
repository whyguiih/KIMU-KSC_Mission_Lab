const RTC_ICE_CONFIG = {
  debug: 0,
  config: {
    iceCandidatePoolSize: 10,
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun.cloudflare.com:3478' },
      {
        urls: [
          'turn:openrelay.metered.ca:80',
          'turn:openrelay.metered.ca:443',
          'turn:openrelay.metered.ca:443?transport=tcp',
          'turns:openrelay.metered.ca:443?transport=tcp'
        ],
        username: 'openrelayproject',
        credential: 'openrelayproject'
      }
    ]
  }
};

const WSS_BROKERS = [
  'wss://broker.emqx.io:8084/mqtt',
  'wss://test.mosquitto.org:8081/mqtt'
];

class NetworkManager {
  constructor() {
    this.mode = 'local_mesh';
    this.roomCode = 'LOCAL-KSC';
    this.clientId = 'peer_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36).slice(-4);
    this.peer = null;
    this.connections = new Map();
    this.peerToClientMap = new Map();
    this.peerLastSeen = new Map();
    this.hostConn = null;
    this.bc = null;
    this.mqttClient = null;
    this.mqttConnected = false;
    this.mqttTopic = '';
    this.seenMsgIds = new Set();
    this.joinFallbackTimer = null;
    this.heartbeatInterval = null;
    this.peerRetryTimer = null;

    this.onStateSync = null;
    this.onPlayerSync = null;
    this.onRoleSync = null;
    this.onCutsceneTrigger = null;
    this.onConnectionUpdate = null;

    this.roleAssignments = {
      char1: null,
      char2: null,
      char3: null,
      char4: null
    };

    window.addEventListener('beforeunload', () => {
      this.announceLeave();
    });
    window.addEventListener('pagehide', () => {
      this.announceLeave();
    });
  }

  generateRoomCode() {
    const num = Math.floor(100 + Math.random() * 900);
    return `KSC-${num}`;
  }

  announceLeave() {
    try {
      this.broadcastPacket({
        type: 'PLAYER_LEFT',
        leavingClientId: this.clientId
      });
    } catch (e) {}
  }

  cleanup() {
    if (this.joinFallbackTimer) {
      clearTimeout(this.joinFallbackTimer);
      this.joinFallbackTimer = null;
    }
    if (this.peerRetryTimer) {
      clearTimeout(this.peerRetryTimer);
      this.peerRetryTimer = null;
    }
    if (this.bc) {
      try {
        this.bc.close();
      } catch (e) {}
      this.bc = null;
    }
    if (this.mqttClient) {
      try {
        this.mqttClient.end(true);
      } catch (e) {}
      this.mqttClient = null;
      this.mqttConnected = false;
    }
    if (this.peer) {
      try {
        this.peer.destroy();
      } catch (e) {}
      this.peer = null;
    }
    this.connections.clear();
    this.peerToClientMap.clear();
    this.peerLastSeen.clear();
    this.hostConn = null;
  }

  isRoleTakenByOther(charId) {
    const owner = this.roleAssignments[charId];
    return Boolean(owner && owner !== this.clientId);
  }

  isRoleActive(charId) {
    return Boolean(this.roleAssignments[charId]);
  }

  getMyAssignedRole() {
    return (
      ['char1', 'char2', 'char3', 'char4'].find(
        (charId) => this.roleAssignments[charId] === this.clientId
      ) || null
    );
  }

  getFirstFreeRole() {
    return (
      ['char1', 'char2', 'char3', 'char4'].find(
        (charId) => !this.roleAssignments[charId]
      ) || null
    );
  }

  releaseClientRoles(leavingClientId) {
    if (!leavingClientId) return false;
    let changed = false;
    ['char1', 'char2', 'char3', 'char4'].forEach((k) => {
      if (this.roleAssignments[k] === leavingClientId) {
        this.roleAssignments[k] = null;
        changed = true;
      }
    });
    this.peerLastSeen.delete(leavingClientId);
    if (changed && this.onRoleSync) {
      this.onRoleSync(this.roleAssignments);
    }
    return changed;
  }

  startHeartbeatLoop() {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    this.heartbeatInterval = setInterval(() => {
      const now = Date.now();
      this.peerLastSeen.forEach((lastTs, cid) => {
        if (cid !== this.clientId && now - lastTs > 8500) {
          this.releaseClientRoles(cid);
        }
      });

      if (window.GameApp) {
        const activeChar = window.GameApp.getActiveCharacter();
        if (activeChar && this.roleAssignments[activeChar.id] === this.clientId) {
          this.broadcastPacket({
            type: 'HEARTBEAT',
            charId: activeChar.id,
            player: this.serializeCharacter(activeChar)
          });
        }
      }
    }, 1600);
  }

  serializeCharacter(charObj) {
    return {
      id: charObj.id,
      room: charObj.room,
      x: Math.round(charObj.x),
      y: Math.round(charObj.y),
      vx: Math.round(charObj.vx || 0),
      vy: Math.round(charObj.vy || 0),
      animFrame: charObj.animFrame || 0,
      lastHorizDir: charObj.lastHorizDir || 'right',
      ownerId: this.clientId
    };
  }

  initBroadcastChannel(code) {
    if (typeof BroadcastChannel === 'undefined') return;
    const channelName = `valley-of-stars-${code.toUpperCase()}`;
    this.bc = new BroadcastChannel(channelName);
    this.bc.onmessage = (event) => {
      if (event && event.data) {
        this.handleIncomingPacket(event.data, null);
      }
    };
  }

  initCloudWssRelay(code, brokerIdx = 0) {
    if (typeof window.mqtt === 'undefined') return;
    const cleanCode = code.toUpperCase();
    this.mqttTopic = `kimu-ksc-mission-lab/v2/room/${cleanCode}`;
    const brokerUrl = WSS_BROKERS[brokerIdx % WSS_BROKERS.length];

    try {
      const client = window.mqtt.connect(brokerUrl, {
        clientId: `kimu_${this.clientId}_${Math.random().toString(16).slice(2, 6)}`,
        clean: true,
        connectTimeout: 5000,
        reconnectPeriod: 2500
      });

      this.mqttClient = client;

      client.on('connect', () => {
        if (this.mqttClient !== client) return;
        this.mqttConnected = true;
        client.subscribe(this.mqttTopic, { qos: 0 }, (err) => {
          if (!err) {

            this.broadcastPacket({
              type: 'HELLO_JOIN',
              senderId: this.clientId
            });
            if (this.onConnectionUpdate) this.onConnectionUpdate();
          }
        });
      });

      client.on('message', (topic, payloadBuf) => {
        if (topic !== this.mqttTopic) return;
        try {
          const parsed = JSON.parse(payloadBuf.toString());
          if (parsed) {
            this.handleIncomingPacket(parsed, null);
          }
        } catch (e) {}
      });

      client.on('error', () => {
        if (this.mqttClient === client && !this.mqttConnected && brokerIdx === 0) {
          try {
            client.end(true);
          } catch (e) {}
          this.initCloudWssRelay(code, 1);
        }
      });
    } catch (e) {
      console.warn('Cloud WSS Relay notice:', e);
    }
  }

  startSolo() {
    this.announceLeave();
    this.cleanup();
    this.mode = 'local_mesh';
    this.roomCode = 'LOCAL-KSC';
    this.roleAssignments = {
      char1: null,
      char2: null,
      char3: null,
      char4: null
    };

    this.initBroadcastChannel(this.roomCode);
    this.startHeartbeatLoop();

    this.broadcastPacket({
      type: 'HELLO_JOIN',
      senderId: this.clientId
    });

    this.joinFallbackTimer = setTimeout(() => {
      if (!this.getMyAssignedRole()) {
        const freeSlot = this.getFirstFreeRole() || 'char1';
        this.claimRole(freeSlot);
      }
    }, 90);

    if (this.onConnectionUpdate) this.onConnectionUpdate();
  }

  hostRoom(customCode) {
    this.announceLeave();
    this.cleanup();
    this.mode = 'host';
    this.roomCode = (customCode || this.generateRoomCode()).toUpperCase();
    this.roleAssignments = {
      char1: this.clientId,
      char2: null,
      char3: null,
      char4: null
    };

    this.initBroadcastChannel(this.roomCode);

    this.initCloudWssRelay(this.roomCode);
    this.startHeartbeatLoop();

    if (typeof Peer !== 'undefined') {
      const peerId = `valley-of-stars-${this.roomCode}`;
      try {
        this.peer = new Peer(peerId, RTC_ICE_CONFIG);

        this.peer.on('open', () => {
          if (this.onConnectionUpdate) this.onConnectionUpdate();
        });

        this.peer.on('connection', (conn) => {
          conn.on('open', () => {
            this.connections.set(conn.peer, conn);
            if (this.onConnectionUpdate) this.onConnectionUpdate();
            if (window.GameApp) {
              this.sendFullSnapshot();
            }
          });

          conn.on('data', (data) => {
            if (data && data.senderId) {
              this.peerToClientMap.set(conn.peer, data.senderId);
            }
            this.handleIncomingPacket(data, conn);
          });

          conn.on('close', () => {
            this.connections.delete(conn.peer);
            const disconnectedClientId = this.peerToClientMap.get(conn.peer);
            if (disconnectedClientId) {
              this.peerToClientMap.delete(conn.peer);
              if (this.releaseClientRoles(disconnectedClientId)) {
                this.sendFullSnapshot();
              }
            }
            if (this.onConnectionUpdate) this.onConnectionUpdate();
          });
        });

        this.peer.on('error', (err) => {
          console.warn('PeerJS Host notice (WSS Cloud Relay remains active):', err.type || err);
        });
      } catch (err) {
        console.warn('PeerJS initialization skipped, using WSS Cloud Relay:', err);
      }
    }

    if (this.onRoleSync) this.onRoleSync(this.roleAssignments);
    if (this.onConnectionUpdate) this.onConnectionUpdate();
    return this.roomCode;
  }

  joinRoom(codeInput) {
    const cleanCode = (codeInput || '').trim().toUpperCase();
    if (!cleanCode) return null;

    this.announceLeave();
    this.cleanup();
    this.mode = 'client';
    this.roomCode = cleanCode.startsWith('KSC-')
      ? cleanCode
      : `KSC-${cleanCode.replace(/[^A-Z0-9]/g, '').slice(0, 4)}`;

    this.roleAssignments = {
      char1: null,
      char2: null,
      char3: null,
      char4: null
    };

    this.initBroadcastChannel(this.roomCode);

    this.initCloudWssRelay(this.roomCode);
    this.startHeartbeatLoop();

    this.broadcastPacket({
      type: 'HELLO_JOIN',
      senderId: this.clientId
    });

    this.joinFallbackTimer = setTimeout(() => {
      if (!this.getMyAssignedRole()) {
        const freeSlot = this.getFirstFreeRole();
        if (freeSlot) {
          this.claimRole(freeSlot);
        }
      }
    }, 650);

    if (typeof Peer !== 'undefined') {
      const connectToHostPeer = () => {
        if (this.mode !== 'client') return;
        try {
          if (this.peer) {
            try {
              this.peer.destroy();
            } catch (e) {}
          }
          this.peer = new Peer(undefined, RTC_ICE_CONFIG);
          this.peer.on('open', () => {
            const targetPeerId = `valley-of-stars-${this.roomCode}`;
            const conn = this.peer.connect(targetPeerId, { reliable: true });
            this.hostConn = conn;

            conn.on('open', () => {
              this.sendOverPeer(
                this.makePacket({
                  type: 'HELLO_JOIN',
                  senderId: this.clientId
                })
              );
              if (this.onConnectionUpdate) this.onConnectionUpdate();
            });

            conn.on('data', (data) => {
              this.handleIncomingPacket(data, conn);
            });
          });

          this.peer.on('error', () => {

            if (this.mode === 'client' && !this.peerRetryTimer) {
              this.peerRetryTimer = setTimeout(() => {
                this.peerRetryTimer = null;
                if (this.mode === 'client' && (!this.hostConn || !this.hostConn.open)) {
                  connectToHostPeer();
                }
              }, 3500);
            }
          });
        } catch (err) {}
      };

      connectToHostPeer();
    }

    if (this.onConnectionUpdate) this.onConnectionUpdate();
    return this.roomCode;
  }

  makePacket(payload) {
    const msgId = `${this.clientId}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    this.seenMsgIds.add(msgId);
    if (this.seenMsgIds.size > 700) {
      const first = this.seenMsgIds.values().next().value;
      this.seenMsgIds.delete(first);
    }
    return {
      ...payload,
      msgId,
      senderId: this.clientId
    };
  }

  sendOverPeer(packet, excludeConn = null) {
    if (this.mode === 'host') {
      this.connections.forEach((conn) => {
        if (conn !== excludeConn && conn.open) {
          try {
            conn.send(packet);
          } catch (e) {}
        }
      });
    } else if (this.mode === 'client' && this.hostConn && this.hostConn.open) {
      try {
        this.hostConn.send(packet);
      } catch (e) {}
    }
  }

  broadcastPacket(payload) {
    const packet = this.makePacket(payload);

    if (this.bc) {
      try {
        this.bc.postMessage(packet);
      } catch (e) {}
    }

    this.sendOverPeer(packet);

    if (this.mqttClient && this.mqttConnected && this.mqttTopic) {
      try {
        this.mqttClient.publish(this.mqttTopic, JSON.stringify(packet), { qos: 0 });
      } catch (e) {}
    }
  }

  handleIncomingPacket(packet, sourceConn) {
    if (!packet || !packet.msgId) return;
    if (packet.senderId === this.clientId) return;
    if (this.seenMsgIds.has(packet.msgId)) return;
    this.seenMsgIds.add(packet.msgId);

    if (packet.senderId) {
      this.peerLastSeen.set(packet.senderId, Date.now());
    }

    if (this.mode === 'host' && sourceConn) {
      this.sendOverPeer(packet, sourceConn);
      if (this.bc) {
        try {
          this.bc.postMessage(packet);
        } catch (e) {}
      }
    }

    switch (packet.type) {
      case 'HELLO_JOIN': {
        const iHaveRole = Boolean(this.getMyAssignedRole());
        if ((this.mode === 'host' || iHaveRole) && window.GameApp) {
          const existingRole = ['char1', 'char2', 'char3', 'char4'].find(
            (k) => this.roleAssignments[k] === packet.senderId
          );
          if (!existingRole) {
            const freeSlot = ['char1', 'char2', 'char3', 'char4'].find(
              (k) => !this.roleAssignments[k]
            );
            if (freeSlot) {
              this.roleAssignments[freeSlot] = packet.senderId;
            }
          }
          if (this.onRoleSync) this.onRoleSync(this.roleAssignments);
          this.sendFullSnapshot();
        }
        break;
      }

      case 'FULL_SNAPSHOT': {
        if (this.joinFallbackTimer) {
          clearTimeout(this.joinFallbackTimer);
          this.joinFallbackTimer = null;
        }
        if (packet.roleAssignments) {
          ['char1', 'char2', 'char3', 'char4'].forEach((k) => {
            if (packet.roleAssignments[k]) {
              this.roleAssignments[k] = packet.roleAssignments[k];
              this.peerLastSeen.set(packet.roleAssignments[k], Date.now());
            }
          });
          if (!this.getMyAssignedRole()) {
            const freeSlot = this.getFirstFreeRole();
            if (freeSlot) {
              this.roleAssignments[freeSlot] = this.clientId;
              this.broadcastPacket({
                type: 'CLAIM_ROLE',
                charId: freeSlot,
                roleAssignments: this.roleAssignments
              });
            }
          }
          if (this.onRoleSync) this.onRoleSync(this.roleAssignments);
        }
        if (packet.missionState && this.onStateSync) {
          this.onStateSync(packet.missionState);
        }
        if (packet.players && this.onPlayerSync) {
          Object.values(packet.players).forEach((p) => this.onPlayerSync(p));
        }
        break;
      }

      case 'STATE_UPDATE':
        if (packet.missionState && this.onStateSync) {
          this.onStateSync(packet.missionState);
        }
        break;

      case 'PLAYER_MOVE':
        if (packet.player && this.onPlayerSync) {
          this.onPlayerSync(packet.player);
        }
        break;

      case 'HEARTBEAT':
        if (packet.charId && packet.senderId) {
          if (!this.roleAssignments[packet.charId]) {
            this.roleAssignments[packet.charId] = packet.senderId;
            if (this.onRoleSync) this.onRoleSync(this.roleAssignments);
          }
        }
        if (packet.player && this.onPlayerSync) {
          this.onPlayerSync(packet.player);
        }
        break;

      case 'CLAIM_ROLE': {
        if (!packet.charId) break;
        const targetChar = packet.charId;
        const currentOwner = this.roleAssignments[targetChar];

        if (currentOwner === this.clientId && packet.senderId !== this.clientId) {
          this.sendFullSnapshot();
          break;
        }

        ['char1', 'char2', 'char3', 'char4'].forEach((k) => {
          if (this.roleAssignments[k] === packet.senderId) {
            this.roleAssignments[k] = null;
          }
        });

        this.roleAssignments[targetChar] = packet.senderId;
        if (this.onRoleSync) this.onRoleSync(this.roleAssignments);
        break;
      }

      case 'PLAYER_LEFT':
        if (packet.leavingClientId) {
          this.releaseClientRoles(packet.leavingClientId);
        }
        break;

      case 'TRIGGER_CUTSCENE':
        if (this.onCutsceneTrigger) {
          this.onCutsceneTrigger();
        }
        break;
    }
  }

  sendFullSnapshot() {
    if (!window.GameApp) return;
    const serializedPlayers = {};
    Object.values(window.GameApp.characters).forEach((c) => {
      serializedPlayers[c.id] = {
        id: c.id,
        room: c.room,
        x: Math.round(c.x),
        y: Math.round(c.y),
        vx: Math.round(c.vx || 0),
        vy: Math.round(c.vy || 0),
        animFrame: c.animFrame || 0,
        lastHorizDir: c.lastHorizDir || 'right',
        ownerId: this.roleAssignments[c.id] || null
      };
    });

    this.broadcastPacket({
      type: 'FULL_SNAPSHOT',
      missionState: window.GameApp.missionState,
      players: serializedPlayers,
      roleAssignments: this.roleAssignments
    });
  }

  syncMissionState(missionState) {
    this.broadcastPacket({
      type: 'STATE_UPDATE',
      missionState
    });
  }

  syncPlayerPosition(charObj) {
    if (!charObj) return;
    if (this.isRoleTakenByOther(charObj.id)) return;

    this.broadcastPacket({
      type: 'PLAYER_MOVE',
      player: this.serializeCharacter(charObj)
    });
  }

  claimRole(charId) {
    if (this.isRoleTakenByOther(charId)) {
      return false;
    }

    ['char1', 'char2', 'char3', 'char4'].forEach((k) => {
      if (this.roleAssignments[k] === this.clientId) {
        this.roleAssignments[k] = null;
      }
    });

    this.roleAssignments[charId] = this.clientId;
    this.broadcastPacket({
      type: 'CLAIM_ROLE',
      charId,
      roleAssignments: this.roleAssignments
    });
    if (this.onRoleSync) this.onRoleSync(this.roleAssignments);
    return true;
  }

  triggerLaunchCutscene() {
    this.broadcastPacket({
      type: 'TRIGGER_CUTSCENE'
    });
  }
}

window.Network = new NetworkManager();
