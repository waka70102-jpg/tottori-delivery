"use strict";

// ========================================
// 1. HTML要素の取得
// ========================================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;
const messageText = document.getElementById("messageText");
const tapHint = document.getElementById("tapHint");
const diceBtn = document.getElementById("diceBtn");
const cardBtn = document.getElementById("cardBtn");
const nodeCounter = document.getElementById("nodeCounter");

const titleScreen = document.getElementById("titleScreen");
const startGameBtn = document.getElementById("startGameBtn");
const multiMenuBtn = document.getElementById("multiMenuBtn");
const howtoBtn = document.getElementById("howtoBtn");
const zukanBtn = document.getElementById("zukanBtn");

const multiScreen = document.getElementById("multiScreen");

const zukanModal = document.getElementById("zukanModal");
const zukanList = document.getElementById("zukanList");
const closeZukanBtn = document.getElementById("closeZukanBtn");

const howtoModal = document.getElementById("howtoModal");
const closeHowtoBtn = document.getElementById("closeHowtoBtn");

const endingModal = document.getElementById("endingModal");
const endingRankText = document.getElementById("endingRankText");
const endingLogList = document.getElementById("endingLogList");
const endingTitleBtn = document.getElementById("endingTitleBtn");

// ========================================
// 2. ゲーム状態・データ構造
// ========================================
let mapImage = new Image();
mapImage.src = "map.png";

let boardNodes = [];
let mission = null;

let turnPlayerIndex = 0;
let phase = "WAITING"; // "WAITING", "DICE_ROLLED", "CHOOSING_NODE", "EVENT", "BOT_TURN", "GAME_OVER"
let rolledValue = 0;
let selectableNodes = [];
let isTapPending = false;
let tapCallback = null;

const PLAYER_COLORS = ["#FF5722", "#2196F3", "#4CAF50", "#9C27B0"];

let playerState = {
  name: "プレイヤー",
  nodeId: 1,
  score: 0,
  cards: { double: 1, teleport: 0 },
  history: []
};

let botStates = [
  playerState,
  { name: "Bot 1", nodeId: 1, score: 0 },
  { name: "Bot 2", nodeId: 1, score: 0 },
  { name: "Bot 3", nodeId: 1, score: 0 }
];

// 鳥取県19市町村の基本ノードデータ
const DEFAULT_NODES = [
  { id: 1, name: "鳥取市", x: 750, y: 300, type: "START", info: "鳥取県の県庁所在地。鳥取砂丘が有名！" },
  { id: 2, name: "岩美町", x: 830, y: 220, type: "SPECIAL", info: "透明度抜群の浦富海岸がある町。" },
  { id: 3, name: "八頭町", x: 780, y: 400, type: "NORMAL", info: "フルーツの里。若桜鉄道が走る。" },
  { id: 4, name: "若桜町", x: 850, y: 460, type: "NORMAL", info: "緑豊かな自然と若桜鬼ヶ城跡。" },
  { id: 5, name: "智頭町", x: 760, y: 520, type: "NORMAL", info: "杉のまち。歴史ある智頭宿。" },
  { id: 6, name: "倉吉市", x: 500, y: 360, type: "SPECIAL", info: "白壁土蔵群が残る歴史ある街並み。" },
  { id: 7, name: "湯梨浜町", x: 580, y: 300, type: "NORMAL", info: "東郷湖のハワイ温泉・東郷温泉。" },
  { id: 8, name: "三朝町", x: 560, y: 440, type: "SPECIAL", info: "世界屈指のラジウム温泉、三朝温泉！" },
  { id: 9, name: "北栄町", x: 480, y: 280, type: "NORMAL", info: "名探偵コナンの里＆スイカの名産地。" },
  { id: 10, name: "琴浦町", x: 400, y: 300, type: "NORMAL", info: "琴浦サーモンや東伯牛が美味しい！" },
  { id: 11, name: "米子市", x: 220, y: 360, type: "SPECIAL", info: "山陰の商都。皆生温泉がある。" },
  { id: 12, name: "境港市", x: 180, y: 220, type: "SPECIAL", info: "水木しげるロードと美味しいカニ！" },
  { id: 13, name: "日吉津村", x: 270, y: 320, type: "NORMAL", info: "鳥取県唯一の「村」。チューリップの名所。" },
  { id: 14, name: "大山町", x: 330, y: 340, type: "SPECIAL", info: "雄大な国立公園・大山を擁する。" },
  { id: 15, name: "南部町", x: 200, y: 450, type: "NORMAL", info: "とっとり花回廊がある緑豊かな町。" },
  { id: 16, name: "伯耆町", x: 270, y: 440, type: "NORMAL", info: "植田正治写真美術館がある。" },
  { id: 17, name: "日南町", x: 160, y: 580, type: "NORMAL", info: "広大な森林と美しい清流の町。" },
  { id: 18, name: "日野町", x: 240, y: 540, type: "NORMAL", info: "金運アップで有名な金持神社がある。" },
  { id: 19, name: "江府町", x: 320, y: 500, type: "NORMAL", info: "奥大山の水と美しい奥大山渓谷。" }
];

// 隣接ルート定義
const EDGES = [
  [1, 2], [1, 3], [2, 3], [3, 4], [3, 5], [1, 7],
  [7, 6], [7, 9], [6, 8], [6, 9], [9, 10], [8, 19],
  [10, 14], [14, 11], [14, 13], [11, 12], [11, 13], [11, 15], [11, 16],
  [15, 17], [16, 18], [18, 19], [18, 17]
];

// ========================================
// 3. 初期化処理
// ========================================
function initGame() {
  // 「みんなでプレイ」のボタンと画面を完全に削除・非表示にする
  if (multiMenuBtn) multiMenuBtn.remove();
  if (multiScreen) multiScreen.remove();

  boardNodes = DEFAULT_NODES.map(node => {
    const neighbors = [];
    EDGES.forEach(([u, v]) => {
      if (u === node.id) neighbors.push(v);
      if (v === node.id) neighbors.push(u);
    });
    return { ...node, neighbors };
  });

  setupEventListeners();
  drawMap();
}

function setupEventListeners() {
  if (startGameBtn) startGameBtn.addEventListener("click", startSingleGame);
  if (diceBtn) diceBtn.addEventListener("click", onDiceClick);
  if (cardBtn) cardBtn.addEventListener("click", onCardClick);
  
  if (howtoBtn) howtoBtn.addEventListener("click", () => howtoModal.removeAttribute("hidden"));
  if (closeHowtoBtn) closeHowtoBtn.addEventListener("click", () => howtoModal.setAttribute("hidden", "true"));
  
  if (zukanBtn) zukanBtn.addEventListener("click", openZukan);
  if (closeZukanBtn) closeZukanBtn.addEventListener("click", () => zukanModal.setAttribute("hidden", "true"));

  if (endingTitleBtn) endingTitleBtn.addEventListener("click", () => location.reload());

  if (canvas) canvas.addEventListener("click", onCanvasClick);
}

// ========================================
// 4. ゲーム進行ロジック
// ========================================
function startSingleGame() {
  if (titleScreen) titleScreen.setAttribute("hidden", "true");
  
  // ミッション決定（スタート地点の鳥取市以外からランダム）
  const targetNode = boardNodes[Math.floor(Math.random() * (boardNodes.length - 1)) + 1];
  mission = { targetId: targetNode.id, name: targetNode.name };

  setMessageWithTap(`ゲーム開始！目的地は「${mission.name}」です！サイコロを振ってください。`, null);
  updateUI();
  drawMap();
}

function setMessageWithTap(msg, callback) {
  if (messageText) messageText.textContent = msg;
  tapCallback = callback;
  if (tapHint) {
    if (callback) {
      tapHint.removeAttribute("hidden");
      isTapPending = true;
    } else {
      tapHint.setAttribute("hidden", "true");
      isTapPending = false;
    }
  }
}

function onCanvasClick(e) {
  if (isTapPending && tapCallback) {
    const cb = tapCallback;
    tapCallback = null;
    isTapPending = false;
    if (tapHint) tapHint.setAttribute("hidden", "true");
    cb();
    return;
  }

  if (phase === "CHOOSING_NODE") {
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) * (canvas.width / rect.width);
    const clickY = (e.clientY - rect.top) * (canvas.height / rect.height);

    const clickedNode = selectableNodes.find(n => {
      const dist = Math.hypot(n.x - clickX, n.y - clickY);
      return dist <= 25;
    });

    if (clickedNode) {
      movePlayerToNode(turnPlayerIndex, clickedNode.id);
    }
  }
}

function onDiceClick() {
  if (phase !== "WAITING") return;
  if (turnPlayerIndex !== 0) return;

  rolledValue = Math.floor(Math.random() * 6) + 1;
  phase = "DICE_ROLLED";
  if (diceBtn) diceBtn.disabled = true;

  setMessageWithTap(`「${rolledValue}」が出ました！移動先の市町村をタップしてください。`, () => {
    calculateSelectableNodes(botStates[0].nodeId, rolledValue);
    phase = "CHOOSING_NODE";
    drawMap();
  });
}

function onCardClick() {
  if (phase !== "WAITING" || turnPlayerIndex !== 0) return;
  if (playerState.cards.double <= 0) {
    alert("使えるカードがありません！");
    return;
  }
  
  playerState.cards.double--;
  rolledValue = (Math.floor(Math.random() * 6) + 1) * 2;
  phase = "DICE_ROLLED";
  if (diceBtn) diceBtn.disabled = true;

  setMessageWithTap(`ダブルダイス発動！合計「${rolledValue}」が出ました！移動先をタップしてください。`, () => {
    calculateSelectableNodes(botStates[0].nodeId, rolledValue);
    phase = "CHOOSING_NODE";
    drawMap();
  });
}

function calculateSelectableNodes(startId, steps) {
  let currentSet = new Set([startId]);
  for (let i = 0; i < steps; i++) {
    let nextSet = new Set();
    currentSet.forEach(id => {
      const node = boardNodes.find(n => n.id === id);
      if (node) {
        node.neighbors.forEach(nbr => nextSet.add(nbr));
      }
    });
    currentSet = nextSet;
  }
  selectableNodes = boardNodes.filter(n => currentSet.has(n.id));
}

function movePlayerToNode(pIdx, nodeId) {
  const p = botStates[pIdx];
  p.nodeId = nodeId;
  selectableNodes = [];
  phase = "EVENT";

  const targetNode = boardNodes.find(n => n.id === nodeId);
  
  if (pIdx === 0 && !playerState.history.includes(targetNode.name)) {
    playerState.history.push(targetNode.name);
  }

  drawMap();

  // 目的地到達判定
  if (nodeId === mission.targetId) {
    p.score += 500;
    setMessageWithTap(`🎉 ${p.name} が目的地の「${targetNode.name}」に到着！ボーナス500pt！`, () => {
      endGame();
    });
    return;
  }

  // ノードイベント
  const bonus = targetNode.type === "SPECIAL" ? 200 : 100;
  p.score += bonus;
  const eventMsg = `${p.name} は「${targetNode.name}」に到着（+${bonus}pt）。${targetNode.info}`;

  setMessageWithTap(eventMsg, () => {
    nextTurn();
  });
}

function nextTurn() {
  turnPlayerIndex = (turnPlayerIndex + 1) % 4;
  updateUI();

  if (turnPlayerIndex === 0) {
    phase = "WAITING";
    if (diceBtn) diceBtn.disabled = false;
    setMessageWithTap("あなたのターンです。サイコロを振ってください！", null);
  } else {
    phase = "BOT_TURN";
    if (diceBtn) diceBtn.disabled = true;
    const bot = botStates[turnPlayerIndex];
    setMessageWithTap(`${bot.name} のターンです…`, () => {
      setTimeout(playBotTurn, 600);
    });
  }
}

function playBotTurn() {
  const bot = botStates[turnPlayerIndex];
  const roll = Math.floor(Math.random() * 6) + 1;
  
  calculateSelectableNodes(bot.nodeId, roll);
  const chosenNode = selectableNodes[Math.floor(Math.random() * selectableNodes.length)];
  
  setMessageWithTap(`${bot.name} は「${roll}」を出して「${chosenNode.name}」へ移動します。`, () => {
    movePlayerToNode(turnPlayerIndex, chosenNode.id);
  });
}

function endGame() {
  phase = "GAME_OVER";
  if (diceBtn) diceBtn.disabled = true;

  const sorted = [...botStates].sort((a, b) => b.score - a.score);
  const myRank = sorted.findIndex(p => p.name === playerState.name) + 1;

  if (endingRankText) endingRankText.textContent = `あなたの順位: ${myRank}位 (${playerState.score}pt)`;
  
  if (endingLogList) {
    endingLogList.innerHTML = sorted.map((p, i) => `<li>${i + 1}位: ${p.name} - ${p.score}pt</li>`).join("");
  }

  if (endingModal) endingModal.removeAttribute("hidden");
}

// ========================================
// 5. 描画・UI更新
// ========================================
function updateUI() {
  if (nodeCounter) {
    nodeCounter.textContent = `訪れた市町村: ${playerState.history.length} / 19`;
  }
}

function openZukan() {
  if (!zukanList) return;
  zukanList.innerHTML = DEFAULT_NODES.map(node => {
    const visited = playerState.history.includes(node.name);
    return `
      <div style="padding: 10px; border-bottom: 1px solid #ccc; background: ${visited ? '#e8f5e9' : '#f5f5f5'};">
        <strong>${visited ? '✅ ' + node.name : '🔒 ???'}</strong>
        <p style="margin: 4px 0 0; font-size: 0.9em; color: #555;">${visited ? node.info : 'まだ訪れていません'}</p>
      </div>
    `;
  }).join("");
  if (zukanModal) zukanModal.removeAttribute("hidden");
}

function drawMap() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 背景マップ描画
  if (mapImage.complete && mapImage.naturalWidth !== 0) {
    ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = "#e0f2fe";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // ルート描画
  ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
  ctx.lineWidth = 3;
  EDGES.forEach(([u, v]) => {
    const nodeA = boardNodes.find(n => n.id === u);
    const nodeB = boardNodes.find(n => n.id === v);
    if (nodeA && nodeB) {
      ctx.beginPath();
      ctx.moveTo(nodeA.x, nodeA.y);
      ctx.lineTo(nodeB.x, nodeB.y);
      ctx.stroke();
    }
  });

  // ノード描画
  boardNodes.forEach(node => {
    const isSelectable = selectableNodes.some(n => n.id === node.id);
    const isTarget = mission && mission.targetId === node.id;

    ctx.beginPath();
    ctx.arc(node.x, node.y, isSelectable ? 22 : 16, 0, Math.PI * 2);
    
    if (isSelectable) {
      ctx.fillStyle = "#FFEB3B";
    } else if (isTarget) {
      ctx.fillStyle = "#E91E63";
    } else {
      ctx.fillStyle = "#FFFFFF";
    }
    ctx.fill();
    ctx.strokeStyle = isSelectable ? "#FF9800" : "#333";
    ctx.lineWidth = isSelectable ? 4 : 2;
    ctx.stroke();

    // ノード名
    ctx.fillStyle = "#111";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(node.name, node.x, node.y + 30);
  });

  // プレイヤー位置描画
  botStates.forEach((p, idx) => {
    const node = boardNodes.find(n => n.id === p.nodeId);
    if (node) {
      const offsetX = (idx % 2 - 0.5) * 16;
      const offsetY = (Math.floor(idx / 2) - 0.5) * 16;

      ctx.beginPath();
      ctx.arc(node.x + offsetX, node.y + offsetY, 10, 0, Math.PI * 2);
      ctx.fillStyle = PLAYER_COLORS[idx];
      ctx.fill();
      ctx.strokeStyle = "#FFF";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  });
}

// 起動
window.addEventListener("DOMContentLoaded", initGame);
mapImage.onload = () => drawMap();
