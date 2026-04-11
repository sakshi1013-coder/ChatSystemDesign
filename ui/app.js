// Simple MD5-like string hash for demonstration (DJB2)
function hashString(str) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i); // hash * 33 + c
    }
    return Math.abs(hash);
}

// ==== SIMULATION CORE ====
class Message {
    constructor(userId, channelId, content) {
        this.userId = userId;
        this.channelId = channelId;
        this.content = content;
        this.timestamp = Date.now();
    }
}

class Shard {
    constructor(id) {
        this.id = id;
        this.messages = [];
    }
    store(msg) {
        this.messages.push(msg);
    }
}

class BaseShardManager {
    constructor(numShards) {
        this.shards = Array.from({length: numShards}, (_, i) => new Shard(i));
    }
    getTotalMessages() {
        return this.shards.reduce((sum, shard) => sum + shard.messages.length, 0);
    }
}

// Day 6
class UserShardManager extends BaseShardManager {
    sendMessage(msg) {
        const shardId = msg.userId % this.shards.length;
        this.shards[shardId].store(msg);
    }
}

// Day 7
class ChannelShardManager extends BaseShardManager {
    sendMessage(msg) {
        const shardId = msg.channelId % this.shards.length;
        this.shards[shardId].store(msg);
    }
}

// Day 8
class HashShardManager extends BaseShardManager {
    sendMessage(msg) {
        // Unique combo effectively distributing evenly like a Message ID
        const key = `${msg.userId}-${msg.channelId}-${Math.random()}`;
        const hash = hashString(key);
        const shardId = hash % this.shards.length;
        this.shards[shardId].store(msg);
    }
}

// ==== UI CONTROLLER ====
const UI = {
    manager: null,
    totalMessages: 0,
    MAX_CAPACITY: 5000, // Visual capacity to trigger hotspot warnings
    
    elements: {
        strategy: document.getElementById('strategy-select'),
        btnReset: document.getElementById('btn-reset'),
        btnNormal: document.getElementById('btn-normal'),
        btnSpike: document.getElementById('btn-spike'),
        shardsContainer: document.getElementById('shards-container'),
        logContent: document.getElementById('log-content'),
        totalBadge: document.getElementById('total-messages-badge')
    },

    init() {
        this.setupListeners();
        this.resetSystem();
    },

    setupListeners() {
        this.elements.strategy.addEventListener('change', () => this.resetSystem());
        this.elements.btnReset.addEventListener('click', () => this.resetSystem());
        
        this.elements.btnNormal.addEventListener('click', () => {
             this.simulateTraffic('normal', 1000);
        });
        
        this.elements.btnSpike.addEventListener('click', () => {
             this.simulateTraffic('spike', 3000);
        });
    },

    log(message, level = 'info') {
        const time = new Date().toLocaleTimeString('en-US', {hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit'});
        const el = document.createElement('div');
        el.className = `log-item ${level}`;
        el.innerHTML = `<span class="timestamp">[${time}]</span> ${message}`;
        this.elements.logContent.appendChild(el);
        this.elements.logContent.scrollTop = this.elements.logContent.scrollHeight;
    },

    resetSystem() {
        this.totalMessages = 0;
        this.elements.logContent.innerHTML = '';
        this.MAX_CAPACITY = 5000;
        
        const strategy = this.elements.strategy.value;
        if (strategy === 'user') this.manager = new UserShardManager(3);
        else if (strategy === 'channel') this.manager = new ChannelShardManager(3);
        else if (strategy === 'hash') this.manager = new HashShardManager(3);

        this.log(`System restarted using ${this.elements.strategy.options[this.elements.strategy.selectedIndex].text}`, 'warn');
        this.renderShards();
    },

    simulateTraffic(type, count) {
        if (!this.manager) return;
        this.log(`Injecting ${count} ${type} messages...`, type === 'spike' ? 'error' : 'info');

        const isSpike = type === 'spike';
        
        // Dynamically adjust capacity if we go over
        this.totalMessages += count;
        if (this.totalMessages > this.MAX_CAPACITY * 1.5) {
            this.MAX_CAPACITY += count;
        }

        for (let i = 0; i < count; i++) {
            const userId = isSpike ? 999 : Math.floor(Math.random() * 1000);
            const channelId = isSpike ? 99 : Math.floor(Math.random() * 50);
            
            const msg = new Message(userId, channelId, "test payload");
            this.manager.sendMessage(msg);
        }

        this.renderShards();
    },

    renderShards() {
        this.elements.shardsContainer.innerHTML = '';
        this.elements.totalBadge.innerText = `Total: ${this.totalMessages.toLocaleString()} msgs`;

        // Check for hotspots
        let hasHotspot = false;

        this.manager.shards.forEach(shard => {
            const count = shard.messages.length;
            const percentage = this.totalMessages > 0 ? (count / this.totalMessages) * 100 : 0;
            const fillHeight = Math.min((count / this.MAX_CAPACITY) * 100, 100);
            
            const isHotspot = this.totalMessages > 500 && percentage > 50;
            if (isHotspot) hasHotspot = true;

            const card = document.createElement('div');
            card.className = `shard-card ${isHotspot ? 'hotspot' : ''}`;
            
            card.innerHTML = `
                <div class="hotspot-badge">Hotspot Detected</div>
                <div class="shard-header">
                    <span class="shard-id">Shard ${shard.id}</span>
                    <span class="shard-count">${count.toLocaleString()}</span>
                </div>
                <div class="shard-meter-container">
                    <div class="shard-meter-fill" style="height: ${fillHeight}%"></div>
                </div>
                <div class="shard-footer">
                    <span>Load share:</span>
                    <span>${percentage.toFixed(1)}%</span>
                </div>
            `;
            
            this.elements.shardsContainer.appendChild(card);
        });

        if (hasHotspot) {
            this.log('WARNING: Hotspot detected! A single server is taking >50% load.', 'error');
        }
    }
};

// Boot
UI.init();
