"use strict";

// ========================================
// 1. HTML要素の取得
// ========================================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;
const message = document.getElementById("message");
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
const multiCloseBtn = document.getElementById("multiCloseBtn");
const multiReturnBtn = document.getElementById("multiReturnBtn");
const nameInputStep = document.getElementById("nameInputStep");
const playerNameInput = document.getElementById("playerNameInput");
const confirmNameBtn = document.getElementById("confirmNameBtn");
const roomSelectStep = document.getElementById("roomSelectStep");
const createRoomBtn = document.getElementById("createRoomBtn");
const hostRoomCodeArea = document.getElementById("hostRoomCodeArea");
const generatedRoomCode = document.getElementById("generatedRoomCode");
const roomStatusText = document.getElementById("roomStatusText");
const startMultiGameBtn = document.getElementById("startMultiGameBtn");
const joinRoomInput = document.getElementById("joinRoomInput");
const joinRoomBtn = document.getElementById("joinRoomBtn");

const howtoScreen = document.getElementById("howtoScreen");
const howtoCloseBtn = document.getElementById("howtoCloseBtn");
const howtoReturnBtn = document.getElementById("howtoReturnBtn");

const zukanScreen = document.getElementById("zukanScreen");
const zukanCloseBtn = document.getElementById("zukanCloseBtn");
const zukanReturnBtn = document.getElementById("zukanReturnBtn");
const zukanGrid = document.getElementById("zukanGrid");

const gameHud = document.getElementById("gameHud");
const hudTitleBar = document.getElementById("hudTitleBar");
const hudToggleBtn = document.getElementById("hudToggleBtn");

const turnDisplay = document.getElementById("turnDisplay");
const vehicleDisplay = document.getElementById("vehicleDisplay");
const moneyDisplay = document.getElementById("moneyDisplay");
const productDisplay = document.getElementById("productDisplay");
const itemStatusDisplay = document.getElementById("itemStatusDisplay");
const myPlayerLabel = document.getElementById("myPlayerLabel");
const rewardDisplay = document.getElementById("rewardDisplay");

const botLabels = [
  document.getElementById("botLabel0"),
  document.getElementById("botLabel1"),
  document.getElementById("botLabel2")
];
const botDisplays = [
  document.getElementById("botDisplay0"),
  document.getElementById("botDisplay1"),
  document.getElementById("botDisplay2")
];

const shopScreen = document.getElementById("shopScreen");
const shopTitle = document.getElementById("shopTitle");
const shopCloseBtn = document.getElementById("shopCloseBtn");
const shopReturnBtn = document.getElementById("shopReturnBtn");
const shopMoney = document.getElementById("shopMoney");
const shopProductsContainer = document.getElementById("shopProducts");

const garageScreen = document.getElementById("garageScreen");
const garageTitle = document.getElementById("garageTitle");
const garageCloseBtn = document.getElementById("garageCloseBtn");
const garageReturnBtn = document.getElementById("garageReturnBtn");
const garageMoney = document.getElementById("garageMoney");
const garageCurrentVehicle = document.getElementById("garageCurrentVehicle");
const garageUpgradesContainer = document.getElementById("garageUpgrades");

const cardScreen = document.getElementById("cardScreen");
const cardCloseBtn = document.getElementById("cardCloseBtn");
const cardReturnBtn = document.getElementById("cardReturnBtn");
const cardList = document.getElementById("cardList");

const quizScreen = document.getElementById("quizScreen");
const quizQuestionText = document.getElementById("quizQuestionText");
const quizOptionsContainer = document.getElementById("quizOptionsContainer");

const resultScreen = document.getElementById("resultScreen");
const winnerMessage = document.getElementById("winnerMessage");
const resultTableBody = document.getElementById("resultTableBody");
const replayBtn = document.getElementById("replayBtn");
const restartBtn = document.getElementById("restartBtn");

if (!canvas || !ctx) {
  throw new Error('index.html に id="gameCanvas" の canvas がありません。');
}

// ========================================
// 2. 基本定数・データ
// ========================================
const TOTAL_NODES = 69;
const MAX_TURNS = 20;
const BRANCH_INDICES = [8, 18, 28, 39, 50, 60];
const SHORTCUT_LENGTH = 5;
const MILKY_WAY_LENGTH = 10;

// 境港を左上端（47番マス）へ配置
const GARAGE_SPOT_MAP = {
  0: "鳥取駅", 16: "道の駅 琴の浦", 28: "倉吉駅", 47: "境港", 51: "米子駅"
};

const VEHICLE_DATA = [
  { id: "bike", name: "自転車", icon: "🚲", cost: 0, redCut: 0, movePlus: 0, desc: "初期装備。標準的な自転車。" },
  { id: "motorcycle", name: "バイク", icon: "🛵", cost: 1000, redCut: 0.2, movePlus: 0, desc: "【スピードUP】赤マスダメージ20%軽減" },
  { id: "truck", name: "軽トラ", icon: "🛻", cost: 2500, redCut: 0.5, movePlus: 1, desc: "【最強車両】赤マス50%軽減＆出目+1！" }
];

const TOTTORI_QUIZZES = [
  { question: "鳥取県にある、日本最大級の砂丘の名前は何でしょう？", options: ["1. 吹上砂丘", "2. 鳥取砂丘", "3. 九十九里浜"], answer: 2 },
  { question: "鳥取県で特に有名な、甘くてジューシーな梨の品種はどれ？", options: ["1. 二十世紀梨", "2. 幸水", "3. 豊水"], answer: 1 },
  { question: "「ゲゲゲの鬼太郎」の作者・水木しげる先生の出身地として有名な境港市の通りは？", options: ["1. コナンロード", "2. 水木しげるロード", "3. 鬼太郎ロード"], answer: 2 },
  { question: "鳥取県の中部にある、レトロな赤い瓦の建物が並ぶ有名な観光地は？", options: ["1. 白壁土蔵群", "2. 出雲大社", "3. 大山阿夫利神社"], answer: 1 },
  { question: "鳥取県の名物ラーメンで、牛の骨から出汁をとる独特のラーメンは？", options: ["1. 牛骨ラーメン", "2. 高山ラーメン", "3. 喜多方ラーメン"], answer: 1 }
];

const ALL_PRODUCTS_MASTER = [
  { id: "pudding", name: "砂プリン", icon: "🍮", desc: "【東部】砂丘の砂をイメージした特製粉末カラメルで味わう大人気プリン！" },
  { id: "pear", name: "二十世紀梨", icon: "🍐", desc: "【東部】みずみずしさとシャキシャキ感が自慢の鳥取を代表する和梨。" },
  { id: "rabbit", name: "因幡の白うさぎ", icon: "🐇", desc: "【東部】山陰名菓！かわいいうさぎの形をした焼き饅頭。" },
  { id: "watermelon", name: "北栄町のすいか", icon: "🍉", desc: "【中部】大栄すいかとして全国的にも有名な甘くて大粒のすいか。" },
  { id: "ramen", name: "牛骨ラーメン", icon: "🍜", desc: "【中部】牛骨からとった香ばしいスープと澄んだコクが絶品のラーメン。" },
  { id: "crab", name: "松葉ガニ", icon: "🦀", desc: "【西部】境港で水揚げされる冬の味覚の王者！旨味が詰まった最高級品。" },
  { id: "negi", name: "白ネギ", icon: "🥬", desc: "【西部】弓ヶ浜半島で育てられた甘くシャキシャキしたネギ。" },
  { id: "milk", name: "大山白バラ牛乳", icon: "🥛", desc: "【西部】自然豊かな大山麓で育まれたフレッシュな白バラ牛乳。" }
];

const shopItemsByArea = {
  "東部": [
    { id: "pudding", name: "砂プリン", icon: "🍮", price: 300, reward: 2000, limitTurns: 3, redRate: 3, desc: "【超デリケート】赤マスダメージ3倍＆3ターン制限" },
    { id: "pear", name: "二十世紀梨", icon: "🍐", price: 400, reward: 2200, redRate: 2, desc: "【傷つきやすい】赤マスダメージ2倍" },
    { id: "rabbit", name: "因幡の白うさぎ", icon: "🐇", price: 300, reward: 1800, desc: "【人気のお土産】定番の特産品" }
  ],
  "中部": [
    { id: "watermelon", name: "北栄町のすいか", icon: "🍉", price: 500, reward: 2500, moveBonus: -1, desc: "【重たい】出目が常にマイナス1" },
    { id: "ramen", name: "牛骨ラーメン", icon: "🍜", price: 450, reward: 2300, limitTurns: 5, expireZero: true, desc: "【スープが命】5ターンで報酬0円" }
  ],
  "西部": [
    { id: "crab", name: "松葉ガニ", icon: "🦀", price: 800, reward: 3500, desc: "【最高級ロマン】成功で超高額報酬！" },
    { id: "negi", name: "白ネギ", icon: "🥬", price: 350, reward: 1900, ignoreRed: true, desc: "【頑丈で折れにくい】赤マスダメージ無効" },
    { id: "milk", name: "大山白バラ牛乳", icon: "🥛", price: 400, reward: 2100, limitTurns: 5, desc: "【新鮮さが命】5ターン以内のスピード配達" }
  ]
};

const NODE_COLORS = {
  normal: "#ffffff", blue: "#2788ff", red: "#ff5252", shop: "#ffad33", garage: "#9b72cf", branch: "#35b8a0", card: "#ffdf55"
};

const routeAnchors = [
  [1220, 320], [1280, 300], [1340, 290], [1400, 280], [1450, 280], [1490, 295], [1510, 325], [1510, 365],
  [1500, 405], [1510, 425], [1495, 445], [1480, 465], [1465, 480], [1445, 485], [1425, 480], [1405, 470],
  [1380, 475], [1355, 490], [1330, 510], [1300, 530], [1240, 550], [1170, 565], [1100, 575], [1030, 580],
  [960, 580], [890, 580], [820, 575], [750, 570], [680, 565], [610, 565], [540, 565], [470, 565],
  [400, 565], [350, 600], [300, 650], [250, 690], [215, 710], [180, 690], [170, 650], [180, 610],
  [195, 570], [200, 530], [225, 490], [225, 450], [220, 410], [215, 375], [220, 345], [250, 325],
  [235, 300], [220, 275], [215, 250], [220, 225], [250, 235], [280, 260], [315, 280], [350, 290],
  [420, 295], [490, 305], [540, 320], [610, 335], [680, 350], [750, 370], [820, 390], [880, 405],
  [915, 425], [940, 450], [965, 470], [1000, 465], [1035, 445], [1070, 420], [1100, 390], [1135, 365],
  [1175, 340], [1220, 320]
];

// 重なった時にずらすための座標差分オフセット
const PIECE_OFFSETS = [
  { x: 0, y: -10 },
  { x: -12, y: 10 },
  { x: 12, y: 10 },
  { x: 0, y: 20 }
];

// 69マスごとの固定19市町村マップデータ
const TOWN_NAME_MAP = {
  0: "鳥取市", 1: "鳥取市", 2: "岩美町", 3: "岩美町", 4: "鳥取市", 5: "若桜町", 6: "若桜町",
  7: "智頭町", 8: "智頭町", 9: "八頭町", 10: "八頭町", 11: "鳥取市", 12: "鳥取市", 13: "鳥取市",
  14: "鳥取市", 15: "琴浦町", 16: "琴浦町", 17: "北栄町", 18: "北栄町", 19: "倉吉市",
  20: "倉吉市", 21: "三朝町", 22: "三朝町", 23: "湯梨浜町", 24: "湯梨浜町", 25: "琴浦町",
  26: "琴浦町", 27: "北栄町", 28: "倉吉市", 29: "倉吉市", 30: "湯梨浜町", 31: "琴浦町",
  32: "北栄町", 33: "倉吉市", 34: "大山町", 35: "大山町", 36: "南部町", 37: "南部町",
  38: "伯耆町", 39: "伯耆町", 40: "日南町", 41: "日南町", 42: "日野町", 43: "日野町",
  44: "江府町", 45: "江府町", 46: "日吉津村", 47: "境港市", 48: "境港市", 49: "米子市",
  50: "米子市", 51: "米子市", 52: "米子市", 53: "南部町", 54: "伯耆町", 55: "大山町",
  56: "大山町", 57: "日吉津村", 58: "境港市", 59: "境港市", 60: "米子市", 61: "米子市",
  62: "米子市", 63: "米子市", 64: "大山町", 65: "琴浦町", 66: "倉吉市", 67: "鳥取市", 68: "鳥取市"
};

// ========================================
// 3. ゲーム状態 ＆ オンライン通信変数
// ========================================
let isMultiplayer = false;
let isHost = false;
let myPlayerIndex = 0;
let peer = null;
let connections = [];
let roomCode = "";

let unlockedProducts = new Set();
const BASE_MAP_WIDTH = 1695;
const BASE_MAP_HEIGHT = 928;
let MAP_WIDTH = BASE_MAP_WIDTH;
let MAP_HEIGHT = BASE_MAP_HEIGHT;

let boardNodes = [];
let currentTurn = 1;
let isNightMode = false;
let starPositions = [];

let turnPlayerIndex = 0;
let waitingForTapCallback = null;

let playerState = {
  name: "あなた", color: "#00c878", position: 0, money: 500, earned: 0, deliverCount: 0,
  hasProduct: false, product: null, itemHp: 100, turnsHeld: 0, vehicleIndex: 0,
  cards: [
    { id: "fixed", name: "🎯 マス指定カード", desc: "1〜6の好きな出目を選んで進める！" },
    { id: "dash", name: "🚀 ダッシュカード", desc: "サイコロを2個振って大移動できる！" }
  ]
};

let botStates = [
  { name: "トリピー号", color: "#ff3366", position: 0, money: 500, earned: 0, deliverCount: 0, hasProduct: false, product: null, vehicleIndex: 0, isHuman: false },
  { name: "ラビィ号", color: "#ffd700", position: 0, money: 500, earned: 0, deliverCount: 0, hasProduct: false, product: null, vehicleIndex: 0, isHuman: false },
  { name: "ラクダ号", color: "#b366ff", position: 0, money: 500, earned: 0, deliverCount: 0, hasProduct: false, product: null, vehicleIndex: 0, isHuman: false }
];

let remainingSteps = 0;
let isMoving = false;
let turnStartedByDice = false;
let nodeClosedThisTurn = false;
let forcedSteps = null;

let scaleX = 1;
let scaleY = 1;
let mapLoaded = false;
let selectedBranchRoute = null;
let branchOverlay = null;
let mission = null;

// ========================================
// 4. メッセージ・タップ ＆ HUD折りたたみ
// ========================================
function toggleHud() {
  if (!gameHud || !hudToggleBtn) return;
  const isCollapsed = gameHud.classList.toggle("collapsed");
  hudToggleBtn.textContent = isCollapsed ? "▼" : "▲";
}

if (hudTitleBar) hudTitleBar.addEventListener("click", toggleHud);

function setMessageWithTap(text, onTapNext) {
  if (messageText) messageText.textContent = text;
  else if (message) message.textContent = text;

  if (onTapNext) {
    waitingForTapCallback = onTapNext;
    if (tapHint) tapHint.removeAttribute("hidden");
  } else {
    waitingForTapCallback = null;
    if (tapHint) tapHint.setAttribute("hidden", "true");
  }
}

function handleTapProgress() {
  if (waitingForTapCallback) {
    const cb = waitingForTapCallback;
    waitingForTapCallback = null;
    if (tapHint) tapHint.setAttribute("hidden", "true");
    cb();
  }
}

if (message) message.addEventListener("click", handleTapProgress);
window.addEventListener("click", (e) => {
  if (!e.target.closest("button") && !e.target.closest(".modal-window") && !e.target.closest("#gameHud")) {
    handleTapProgress();
  }
});

// ========================================
// 5. オンラインルーム通信（PeerJS）
// ========================================
function setupPeer() {
  if (peer) return;
  const random4 = Math.floor(1000 + Math.random() * 9000).toString();
  roomCode = random4;
  
  // 無料のPeerJS公式クラウドサーバーへ確実に接続する設定
  peer = new Peer(`tottori-game-${random4}`, {
    debug: 2
  });

  peer.on('open', (id) => {
    if (generatedRoomCode) generatedRoomCode.textContent = roomCode;
  });

  peer.on('connection', (conn) => {
    // 接続が確立したらリストに追加
    connections.push(conn);

    conn.on('data', (data) => {
      if (data.type === "JOIN_REQUEST") {
        const joinedIdx = connections.length; // 参加者のインデックス
        botStates[joinedIdx].name = data.name || `P${joinedIdx + 1}`;
        botStates[joinedIdx].isHuman = true;

        if (roomStatusText) roomStatusText.textContent = `${botStates[joinedIdx].name} が参加しました！（計${joinedIdx + 1}人）`;
        if (startMultiGameBtn) startMultiGameBtn.disabled = false;

        // 相手に承認とプレイヤー番号を返す
        conn.send({ type: "JOIN_ACCEPTED", playerIndex: joinedIdx });
      } else {
        handleNetworkData(data);
      }
    });
  });

  peer.on('error', (err) => {
    console.error("PeerJS Error:", err);
    alert("通信エラーが発生しました: " + err.type);
  });
}

// ゲスト側の参加処理関数（※もし関数名が異なる場合は合わせ込んでください）
function joinRoom(inputCode, playerName) {
  if (!peer) {
    peer = new Peer(); // ゲストはランダムIDで初期化
  }

  peer.on('open', () => {
    const conn = peer.connect(`tottori-game-${inputCode}`);
    
    conn.on('open', () => {
      conn.send({ type: "JOIN_REQUEST", name: playerName });
    });

    conn.on('data', (data) => {
      if (data.type === "JOIN_ACCEPTED") {
        myPlayerIndex = data.playerIndex;
        if (roomStatusText) roomStatusText.textContent = "ホストの対戦開始を待っています...";
      } else {
        handleNetworkData(data);
      }
    });
  });
}

function joinRoom(targetCode) {
  if (!targetCode || targetCode.length !== 4) {
    alert("4桁のルームコードを正しく入力してください。");
    return;
  }
  isMultiplayer = true;
  isHost = false;

  peer = new Peer();
  peer.on('open', () => {
    const conn = peer.connect(`tottori-game-${targetCode}`);
    connections = [conn];

    conn.on('open', () => {
      conn.send({ type: "JOIN_REQUEST", name: playerState.name });
    });

    conn.on('data', (data) => handleNetworkData(data));
  });
}

function broadcastData(data) {
  connections.forEach(conn => {
    if (conn.open) conn.send(data);
  });
}

function handleNetworkData(data) {
  if (data.type === "JOIN_ACCEPTED") {
    myPlayerIndex = data.playerIndex;
    if (multiScreen) multiScreen.setAttribute("hidden", "true");
    if (titleScreen) titleScreen.setAttribute("hidden", "true");
    setMessageWithTap("ホストがゲームを開始するのを待っています…", null);
  } else if (data.type === "START_GAME") {
    isMultiplayer = true;
    if (multiScreen) multiScreen.setAttribute("hidden", "true");
    if (titleScreen) titleScreen.setAttribute("hidden", "true");
    if (data.nodes) boardNodes = data.nodes;
    if (data.mission) mission = data.mission;
    if (diceBtn) diceBtn.disabled = (turnPlayerIndex !== myPlayerIndex);
    if (cardBtn) cardBtn.disabled = (turnPlayerIndex !== myPlayerIndex);
  }
}

// ========================================
// 6. マス＆ルート生成
// ========================================
function createPath(anchors, count) {
  const points = anchors.map(([x, y]) => ({ x, y }));
  const lengths = [];
  let totalLength = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const len = Math.hypot(points[i + 1].x - points[i].x, points[i + 1].y - points[i].y);
    lengths.push(len);
    totalLength += len;
  }
  const result = [];
  for (let i = 0; i < count; i++) {
    const target = totalLength * i / count;
    let passed = 0, segment = 0;
    while (segment < lengths.length - 1 && passed + lengths[segment] < target) {
      passed += lengths[segment];
      segment++;
    }
    const ratio = (target - passed) / (lengths[segment] || 1);
    result.push({
      x: points[segment].x + (points[segment + 1].x - points[segment].x) * ratio,
      y: points[segment].y + (points[segment + 1].y - points[segment].y) * ratio
    });
  }
  return result;
}

function getTownByNodeId(id) {
  const townName = TOWN_NAME_MAP[id] || "鳥取市";
  let area = "東部";
  if (id >= 19 && id <= 33) area = "中部";
  else if (id >= 34) area = "西部";

  return { name: townName, area: area };
}

function generateBoardNodes() {
  const path = createPath(routeAnchors, TOTAL_NODES);

  const baseTypes = { normal: 20, blue: 15, red: 13, shop: 0, card: 2 };
  const randomPool = [];
  for (const [type, count] of Object.entries(baseTypes)) {
    for (let i = 0; i < count; i++) randomPool.push(type);
  }

  for (let i = randomPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [randomPool[i], randomPool[j]] = [randomPool[j], randomPool[i]];
  }

  function getGuaranteedShopIndices(start, end, count) {
    const candidates = [];
    for (let i = start; i <= end; i++) {
      if (!GARAGE_SPOT_MAP[i] && !BRANCH_INDICES.includes(i)) candidates.push(i);
    }
    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }
    return new Set(candidates.slice(0, count));
  }

  const guaranteedShops = new Set([
    ...getGuaranteedShopIndices(1, 18, 2),
    ...getGuaranteedShopIndices(19, 33, 2),
    ...getGuaranteedShopIndices(34, 68, 2)
  ]);

  let poolIndex = 0;
  boardNodes = path.map((point, index) => {
    const town = getTownByNodeId(index);
    let type;
    let spotName = null;

    if (GARAGE_SPOT_MAP[index]) {
      type = "garage";
      spotName = GARAGE_SPOT_MAP[index];
    } else if (BRANCH_INDICES.includes(index)) {
      type = "branch";
    } else if (guaranteedShops.has(index)) {
      type = "shop";
    } else {
      type = randomPool[poolIndex++] || "normal";
    }

    return { id: index, x: point.x, y: point.y, type, municipality: town.name, area: town.area, spotName };
  });

  starPositions = [];
  for (let i = 0; i < 45; i++) {
    starPositions.push({
      x: Math.random(), y: Math.random(), size: 1 + Math.random() * 2,
      speed: 0.002 + Math.random() * 0.003, phase: Math.random() * Math.PI * 2
    });
  }
  updateHUD();
}

// ========================================
// 7. HUD＆描画（ループ対応リアル道路＆拡大マス）
// ========================================
function updateHUD() {
  if (turnDisplay) turnDisplay.textContent = `${MAX_TURNS - currentTurn + 1} / ${MAX_TURNS}`;
  const veh = VEHICLE_DATA[playerState.vehicleIndex] || VEHICLE_DATA[0];
  if (vehicleDisplay) vehicleDisplay.textContent = `${veh.icon} ${veh.name}`;
  if (moneyDisplay) moneyDisplay.textContent = `${playerState.money}円`;
  if (productDisplay) {
    productDisplay.textContent = (playerState.hasProduct && playerState.product) ? `${playerState.product.name} (HP:${playerState.itemHp}%)` : "なし";
  }

  if (itemStatusDisplay) {
    if (!playerState.hasProduct || !playerState.product) itemStatusDisplay.textContent = "なし";
    else if (playerState.product.limitTurns) itemStatusDisplay.textContent = `残り${playerState.product.limitTurns - playerState.turnsHeld}ターン`;
    else itemStatusDisplay.textContent = "良好";
  }

  if (myPlayerLabel) myPlayerLabel.textContent = playerState.name;
  if (rewardDisplay) rewardDisplay.textContent = `${playerState.earned.toLocaleString()}円`;

  botDisplays.forEach((botDisp, i) => {
    if (!botDisp) return;
    const bot = botStates[i];
    if (!bot) return;

    if (botLabels[i]) botLabels[i].textContent = bot.isHuman ? `👤 ${bot.name}` : `🤖 ${bot.name}`;
    const bVeh = VEHICLE_DATA[bot.vehicleIndex] || VEHICLE_DATA[0];
    const itemInfo = (bot.hasProduct && bot.product) ? ` [📦${bot.product.name}]` : "";
    botDisp.textContent = `${bVeh.icon} 売上: ${bot.earned.toLocaleString()}円${itemInfo}`;
  });

  if (cardBtn) cardBtn.textContent = `🎴 カード(${playerState.cards.length})`;
  if (nodeCounter) nodeCounter.textContent = `${TOTAL_NODES}マス`;
}

function mapToScreen(x, y) {
  return { x: x * scaleX, y: y * scaleY };
}

function resizeCanvas() {
  const width = document.documentElement.clientWidth;
  const height = document.documentElement.clientHeight;
  const dpr = Math.max(1, window.devicePixelRatio || 1);

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  if (mapLoaded) {
    scaleX = width / MAP_WIDTH;
    scaleY = height / MAP_HEIGHT;
  }
}

function draw() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  if (mapLoaded) {
    ctx.drawImage(mapImage, 0, 0, MAP_WIDTH * scaleX, MAP_HEIGHT * scaleY);
  }

  if (isNightMode) {
    ctx.fillStyle = "rgba(10, 20, 50, 0.45)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const now = Date.now();
    starPositions.forEach(st => {
      const alpha = (Math.sin(now * st.speed + st.phase) + 1) / 2;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.2 + alpha * 0.8})`;
      ctx.beginPath();
      ctx.arc(st.x * canvas.width, st.y * canvas.height, st.size, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  const pulse = (Math.sin(Date.now() / 180) + 1) / 2;
  const nodeScale = Math.min(scaleX, scaleY);

  // --- 1. 道路の描画（スタートまで完全に繋がる道路） ---
  if (boardNodes.length > 1) {
    const roadWidth = Math.max(10, 18 * nodeScale);

    ctx.beginPath();
    for (let i = 0; i < boardNodes.length; i++) {
      const p1 = mapToScreen(boardNodes[i].x, boardNodes[i].y);
      if (i === 0) ctx.moveTo(p1.x, p1.y);
      else ctx.lineTo(p1.x, p1.y);
    }
    ctx.closePath();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = roadWidth + 4;
    ctx.strokeStyle = "#1a1a1a";
    ctx.stroke();

    ctx.lineWidth = roadWidth + 2;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();

    ctx.lineWidth = roadWidth;
    ctx.strokeStyle = "#383838";
    ctx.stroke();

    ctx.beginPath();
    for (let i = 0; i < boardNodes.length; i++) {
      const p1 = mapToScreen(boardNodes[i].x, boardNodes[i].y);
      if (i === 0) ctx.moveTo(p1.x, p1.y);
      else ctx.lineTo(p1.x, p1.y);
    }
    ctx.closePath();
    ctx.setLineDash([8 * nodeScale, 8 * nodeScale]);
    ctx.lineWidth = Math.max(2, 3 * nodeScale);
    ctx.strokeStyle = "#ffcc00";
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // --- 2. 拡大マスの描画 ---
  const nodeRadius = Math.max(10, Math.min(18, 15 * nodeScale));

  for (const node of boardNodes) {
    const pos = mapToScreen(node.x, node.y);

    if (playerState.hasProduct && mission && !mission.completed && node.id === mission.destinationNodeId) {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, nodeRadius + 8 + pulse * 6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 225, 0, ${0.4 + pulse * 0.4})`;
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#ff3300";
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(pos.x, pos.y, nodeRadius, 0, Math.PI * 2);
    ctx.fillStyle = NODE_COLORS[node.type] || "#ffffff";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#222222";
    ctx.stroke();

    if (node.type === "garage" && node.spotName) {
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText(`🔧 ${node.spotName}`, pos.x, pos.y - nodeRadius - 3);
    }
  }

  // --- 3. ライバルBot/他プレイヤーの描画 ---
  botStates.forEach((bot, idx) => {
    if (!boardNodes[bot.position]) return;
    const offset = PIECE_OFFSETS[(idx + 1) % PIECE_OFFSETS.length];
    const rawPos = mapToScreen(boardNodes[bot.position].x, boardNodes[bot.position].y);
    const botPos = { x: rawPos.x + offset.x, y: rawPos.y + offset.y };

    ctx.beginPath();
    ctx.arc(botPos.x, botPos.y, nodeRadius, 0, Math.PI * 2);
    ctx.fillStyle = bot.color;
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();

    const bVeh = VEHICLE_DATA[bot.vehicleIndex] || VEHICLE_DATA[0];
    ctx.font = `${Math.max(12, Math.round(nodeRadius * 1.1))}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(bVeh.icon, botPos.x, botPos.y);
  });

  // --- 4. 自分の駒（オーラ＆YOUタグ） ---
  if (boardNodes[playerState.position]) {
    const offset = PIECE_OFFSETS[0];
    const rawPos = mapToScreen(boardNodes[playerState.position].x, boardNodes[playerState.position].y);
    const playerPos = { x: rawPos.x + offset.x, y: rawPos.y + offset.y };

    ctx.beginPath();
    ctx.arc(playerPos.x, playerPos.y, nodeRadius + 8 + pulse * 5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 215, 0, ${0.4 + pulse * 0.4})`;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(playerPos.x, playerPos.y, nodeRadius + 2, 0, Math.PI * 2);
    ctx.fillStyle = playerState.color;
    ctx.fill();
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();

    const pVeh = VEHICLE_DATA[playerState.vehicleIndex] || VEHICLE_DATA[0];
    ctx.font = `${Math.max(14, Math.round(nodeRadius * 1.2))}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(pVeh.icon, playerPos.x, playerPos.y);

    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 3.5;
    ctx.font = "900 13px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.strokeText("★YOU", playerPos.x, playerPos.y - nodeRadius - 8);
    ctx.fillText("★YOU", playerPos.x, playerPos.y - nodeRadius - 8);
  }

  updateHUD();
}

function gameLoop() {
  draw();
  requestAnimationFrame(gameLoop);
}

// ========================================
// 8. ミッション＆進行（※マス番号の表示を削除）
// ========================================
function createMission() {
  let candidates = boardNodes.filter(node => {
    if (node.type === "branch") return false;
    let distance = (node.id - playerState.position + TOTAL_NODES) % TOTAL_NODES;
    return distance >= 5 && distance <= 25;
  });

  if (candidates.length === 0) {
    candidates = boardNodes.filter(node => node.type !== "branch" && node.id !== playerState.position);
  }

  const dest = candidates[Math.floor(Math.random() * candidates.length)];
  const rewards = [1500, 2000, 2500, 3000];

  mission = {
    destination: dest.municipality,
    destinationArea: dest.area,
    destinationNodeId: dest.id,
    reward: rewards[Math.floor(Math.random() * rewards.length)],
    completed: false
  };
  showMissionMessage();
}

function showMissionMessage() {
  if (!mission) return;
  if (turnPlayerIndex !== myPlayerIndex) return;

  // 「（◯番マス）」の表示を消し、市町村名とエリア名だけで案内
  if (!playerState.hasProduct || !playerState.product) {
    setMessageWithTap(`📋 買付依頼：${mission.destinationArea}の「${mission.destination}」が特産品を求めているよ！お店で仕入れて届けよう！【報酬: ${mission.reward.toLocaleString()}円】`, null);
  } else {
    setMessageWithTap(`🚚 配達中！ 『${playerState.product.name}』を ${mission.destinationArea}の「${mission.destination}」へ届けよう！【報酬: ${mission.reward.toLocaleString()}円】`, null);
  }
}

// ========================================
// 9. サイコロ・移動処理
// ========================================
function rollDice() {
  if (isMoving || turnStartedByDice || boardNodes.length === 0 || turnPlayerIndex !== myPlayerIndex) return;

  turnStartedByDice = true;
  nodeClosedThisTurn = false;

  let roll = forcedSteps ? forcedSteps : Math.floor(Math.random() * 6) + 1;
  forcedSteps = null;

  const playerVeh = VEHICLE_DATA[playerState.vehicleIndex] || VEHICLE_DATA[0];
  roll += playerVeh.movePlus;

  if (playerState.hasProduct && playerState.product && playerState.product.moveBonus) {
    roll = Math.max(1, roll + playerState.product.moveBonus);
  }

  remainingSteps = roll;
  isMoving = true;

  if (diceBtn) diceBtn.disabled = true;
  if (cardBtn) cardBtn.disabled = true;
  setMessageWithTap(`🎲 サイコロの出目：${remainingSteps}！ 移動中…`, null);

  setTimeout(movePlayerStep, 400);
}

function movePlayerStep() {
  if (!isMoving) return;

  if (checkDelivery()) return;

  if (remainingSteps <= 0) {
    finishPlayerTurn();
    return;
  }

  if (boardNodes[playerState.position].type === "branch" && selectedBranchRoute === null) {
    showBranchChoice();
    return;
  }

  if (selectedBranchRoute === "milkyway") {
    selectedBranchRoute = null;
    playerState.position = (playerState.position + MILKY_WAY_LENGTH) % TOTAL_NODES;
    remainingSteps = Math.max(0, remainingSteps - MILKY_WAY_LENGTH);
  } else if (selectedBranchRoute === "shortcut") {
    selectedBranchRoute = null;
    playerState.position = (playerState.position + SHORTCUT_LENGTH) % TOTAL_NODES;
    remainingSteps = Math.max(0, remainingSteps - SHORTCUT_LENGTH);
  } else {
    selectedBranchRoute = null;
    playerState.position = (playerState.position + 1) % TOTAL_NODES;
    remainingSteps--;
  }

  if (checkDelivery()) return;

  if (remainingSteps > 0) {
    setTimeout(movePlayerStep, 200);
  } else {
    finishPlayerTurn();
  }
}

function finishPlayerTurn() {
  isMoving = false;
  turnStartedByDice = false;
  remainingSteps = 0;

  const node = boardNodes[playerState.position];

  if (node && node.type === "red") {
    let basePenalty = 200;
    let baseDamage = 25;
    const playerVeh = VEHICLE_DATA[playerState.vehicleIndex] || VEHICLE_DATA[0];
    let penalty = Math.round(basePenalty * (1 - playerVeh.redCut));

    playerState.money = Math.max(0, playerState.money - penalty);
    let msg = `💥 赤マスを踏んでしまった！ 所持金 -${penalty}円！`;

    if (playerState.hasProduct && playerState.product) {
      if (playerState.product.ignoreRed) {
        msg += ` （『${playerState.product.name}』の頑丈な効果で荷物ダメージ無効！）`;
      } else {
        let dmgMult = playerState.product.redRate || 1;
        let actualDmg = Math.round(baseDamage * dmgMult);
        playerState.itemHp = Math.max(0, playerState.itemHp - actualDmg);
        msg += ` 📦 『${playerState.product.name}』の耐久が ${actualDmg}% 減少した！(残りHP:${playerState.itemHp}%)`;

        if (playerState.itemHp <= 0) {
          msg = `😱 赤マスの衝撃で『${playerState.product.name}』が完全に壊れてしまった…！`;
          playerState.hasProduct = false;
          playerState.product = null;
        }
      }
    }
    setMessageWithTap(msg, () => advanceNextTurnPlayer());
  } else if (node && node.type === "blue") {
    if (Math.random() < 0.6) {
      openQuizModal();
    } else {
      playerState.money += 300;
      setMessageWithTap(`✨ 青マス！ ボーナス 300円 を手に入れた！`, () => advanceNextTurnPlayer());
    }
  } else if (node && node.type === "card") {
    const newCard = getRandomCard();
    playerState.cards.push(newCard);
    setMessageWithTap(`🎴 カードマス！ 『${newCard.name}』を手に入れた！`, () => advanceNextTurnPlayer());
  } else if (node && node.type === "shop" && !nodeClosedThisTurn) {
    openShopScreen();
    return;
  } else if (node && node.type === "garage" && !nodeClosedThisTurn) {
    openGarageScreen();
    return;
  } else {
    advanceNextTurnPlayer();
  }
}

function checkDelivery() {
  if (!mission || mission.completed || turnPlayerIndex !== myPlayerIndex) return false;
  const node = boardNodes[playerState.position];

  if (node && node.id === mission.destinationNodeId) {
    if (!playerState.hasProduct || !playerState.product) return false;

    let earnedReward = mission.reward;
    earnedReward = Math.round(earnedReward * (0.5 + (playerState.itemHp / 200)));

    mission.completed = true;
    playerState.deliverCount++;
    playerState.earned += earnedReward;
    playerState.money += earnedReward;

    playerState.hasProduct = false;
    playerState.product = null;

    isMoving = false;
    setMessageWithTap(`🎉 配達成功！ (荷物品質:${playerState.itemHp}%) 報酬 ${earnedReward.toLocaleString()}円を獲得！`, () => {
      createMission();
      if (remainingSteps > 0) {
        isMoving = true;
        movePlayerStep();
      } else {
        finishPlayerTurn();
      }
    });
    return true;
  }
  return false;
}

// ========================================
// 10. ターン＆ライバルBot進行
// ========================================
function checkNightModeToggle() {
  if (currentTurn >= 12 && !isNightMode) {
    isNightMode = true;
    document.body.classList.add("night-mode");
    setMessageWithTap(`🌌 12ターン目！「星取県（夜モード）」突入！ 「天の川ルート」が開通したよ！`, null);
  }
}

function advanceNextTurnPlayer() {
  turnPlayerIndex++;
  if (turnPlayerIndex > 3) {
    turnPlayerIndex = 0;
    currentTurn++;
    checkNightModeToggle();
    if (currentTurn > MAX_TURNS) {
      endGame();
      return;
    }
  }

  if (turnPlayerIndex === myPlayerIndex) {
    if (diceBtn) diceBtn.disabled = false;
    if (cardBtn) cardBtn.disabled = false;
    showMissionMessage();
  } else {
    const currentBot = botStates[turnPlayerIndex > myPlayerIndex ? turnPlayerIndex - 1 : turnPlayerIndex];
    if (currentBot && !currentBot.isHuman) {
      startBotTurn(turnPlayerIndex > myPlayerIndex ? turnPlayerIndex - 1 : turnPlayerIndex);
    } else {
      setMessageWithTap(`👤 ${currentBot ? currentBot.name : "相手"} のターンです…`, null);
    }
  }
}

function startBotTurn(botIdx) {
  const bot = botStates[botIdx];
  if (diceBtn) diceBtn.disabled = true;
  if (cardBtn) cardBtn.disabled = true;

  setMessageWithTap(`🤖 ${bot.name} のターン！ サイコロを振ります…`, null);

  setTimeout(() => {
    const botVeh = VEHICLE_DATA[bot.vehicleIndex] || VEHICLE_DATA[0];
    let roll = Math.floor(Math.random() * 6) + 1 + botVeh.movePlus;

    bot.position = (bot.position + roll) % TOTAL_NODES;
    const botNode = boardNodes[bot.position];
    let actionMsg = `🤖 ${bot.name} は ${roll} 進んで ${botNode.municipality}（${botNode.spotName || botNode.type + "マス"}）に到着！`;

    if (botNode.type === "blue") {
      bot.money += 300;
      actionMsg += " ✨ ボーナス獲得！";
    } else if (botNode.type === "red") {
      let pen = Math.round(200 * (1 - botVeh.redCut));
      bot.money = Math.max(0, bot.money - pen);
      actionMsg += ` 💥 ペナルティ（-${pen}円）！`;
    } else if (botNode.type === "shop") {
      const areaItems = shopItemsByArea[botNode.area] || shopItemsByArea["東部"];
      const affordableItems = areaItems.filter(item => bot.money >= item.price);
      if (!bot.hasProduct && affordableItems.length > 0 && Math.random() < 0.75) {
        const selectedItem = affordableItems[Math.floor(Math.random() * affordableItems.length)];
        bot.money -= selectedItem.price;
        bot.hasProduct = true;
        bot.product = selectedItem;
        unlockedProducts.add(selectedItem.id);
        actionMsg += ` 🏪 特産品『${selectedItem.name}』を仕入れた！`;
      }
    }

    if (bot.hasProduct && Math.random() < 0.35) {
      const deliveredItem = bot.product;
      bot.hasProduct = false;
      bot.deliverCount++;
      const botReward = deliveredItem ? deliveredItem.reward : 2000;
      bot.earned += botReward;
      bot.money += botReward;
      bot.product = null;
      actionMsg += ` 🎉 配達成功！ (${botReward.toLocaleString()}円GET)`;
    }

    setMessageWithTap(actionMsg, null);
    setTimeout(() => advanceNextTurnPlayer(), 1800);
  }, 1000);
}

function endGame() {
  if (diceBtn) diceBtn.disabled = true;
  if (cardBtn) cardBtn.disabled = true;

  const allPlayers = [
    { name: playerState.name, count: playerState.deliverCount, earned: playerState.earned, veh: (VEHICLE_DATA[playerState.vehicleIndex] || VEHICLE_DATA[0]).name },
    ...botStates.map(b => ({ name: b.name, count: b.deliverCount, earned: b.earned, veh: (VEHICLE_DATA[b.vehicleIndex] || VEHICLE_DATA[0]).name }))
  ].sort((a, b) => b.earned - a.earned);

  const isPlayerWin = allPlayers[0].name === playerState.name;
  if (winnerMessage) winnerMessage.textContent = isPlayerWin ? "🎉 あなたの勝利！！ おめでとう！" : `😭 ${allPlayers[0].name} の勝ち！ 次回リベンジだ！`;

  if (resultTableBody) {
    resultTableBody.innerHTML = allPlayers.map((r, index) => `
      <tr class="${index === 0 ? 'rank-1' : ''}">
        <td>${index + 1}位</td>
        <td>${r.name}</td>
        <td>${r.veh}</td>
        <td>${r.count}回</td>
        <td><strong>${r.earned.toLocaleString()}円</strong></td>
      </tr>
    `).join("");
  }

  if (resultScreen) resultScreen.removeAttribute("hidden");
}

function resetGame(goToTitle = false) {
  currentTurn = 1;
  turnPlayerIndex = 0;
  isNightMode = false;
  document.body.classList.remove("night-mode");

  playerState = {
    name: "あなた", color: "#00c878", position: 0, money: 500, earned: 0, deliverCount: 0,
    hasProduct: false, product: null, itemHp: 100, turnsHeld: 0, vehicleIndex: 0,
    cards: [
      { id: "fixed", name: "🎯 マス指定カード", desc: "1〜6の好きな出目を選んで進める！" },
      { id: "dash", name: "🚀 ダッシュカード", desc: "サイコロを2個振って大移動できる！" }
    ]
  };

  botStates = [
    { name: "トリピー号", color: "#ff3366", position: 0, money: 500, earned: 0, deliverCount: 0, hasProduct: false, product: null, vehicleIndex: 0, isHuman: false },
    { name: "ラビィ号", color: "#ffd700", position: 0, money: 500, earned: 0, deliverCount: 0, hasProduct: false, product: null, vehicleIndex: 0, isHuman: false },
    { name: "ラクダ号", color: "#b366ff", position: 0, money: 500, earned: 0, deliverCount: 0, hasProduct: false, product: null, vehicleIndex: 0, isHuman: false }
  ];

  generateBoardNodes();
  createMission();

  if (resultScreen) resultScreen.setAttribute("hidden", "true");

  if (goToTitle) {
    if (titleScreen) titleScreen.removeAttribute("hidden");
  } else {
    if (titleScreen) titleScreen.setAttribute("hidden", "true");
    if (diceBtn) diceBtn.disabled = false;
    if (cardBtn) cardBtn.disabled = false;
  }
}

// ========================================
// 11. カード機能 ＆ 各種モーダル
// ========================================
function getRandomCard() {
  const pool = [
    { id: "fixed", name: "🎯 マス指定カード", desc: "1〜6の好きな出目を選んで進める！" },
    { id: "dash", name: "🚀 ダッシュカード", desc: "サイコロを2個振って大移動できる！" },
    { id: "repair", name: "🛠️ お直しカード", desc: "運んでいる特産品のHPを50回復する！" }
  ];
  return pool[Math.floor(Math.random() * pool.length)];
}

function openCardScreen() {
  if (!cardScreen || !cardList) return;
  cardList.innerHTML = "";

  if (playerState.cards.length === 0) {
    cardList.innerHTML = `<p style="text-align:center; color:#666; width:100%;">持っているカードはありません。</p>`;
  } else {
    playerState.cards.forEach((card, index) => {
      const cardEl = document.createElement("div");
      cardEl.className = "shop-product";
      const canUse = !isMoving && turnPlayerIndex === myPlayerIndex && !turnStartedByDice;

      cardEl.innerHTML = `
        <h2>${card.name}</h2>
        <div class="product-art">🎴</div>
        <div class="product-desc">${card.desc}</div>
        <button class="shop-buy" ${canUse ? "" : "disabled"}>使う</button>
      `;

      const buyBtn = cardEl.querySelector(".shop-buy");
      if (buyBtn && canUse) {
        buyBtn.addEventListener("click", () => useCard(index));
      }
      cardList.appendChild(cardEl);
    });
  }
  cardScreen.removeAttribute("hidden");
}

function useCard(index) {
  const card = playerState.cards[index];
  if (!card) return;

  playerState.cards.splice(index, 1);
  closeCardScreen();

  if (card.id === "fixed") {
    let num = prompt("1〜6の中から進みたいマス数を半角数字で入力してください：", "3");
    let parsed = parseInt(num, 10);
    if (isNaN(parsed) || parsed < 1 || parsed > 6) parsed = 3;
    forcedSteps = parsed;
    rollDice();
  } else if (card.id === "dash") {
    let roll1 = Math.floor(Math.random() * 6) + 1;
    let roll2 = Math.floor(Math.random() * 6) + 1;
    forcedSteps = roll1 + roll2;
    setMessageWithTap(`🚀 ダッシュカード発動！ 出目: ${roll1} + ${roll2} = ${forcedSteps}！`, () => rollDice());
  } else if (card.id === "repair") {
    if (playerState.hasProduct) {
      playerState.itemHp = Math.min(100, playerState.itemHp + 50);
      setMessageWithTap(`🛠️ 特産品を修理した！ 耐久度がHP:${playerState.itemHp}%に回復！`, null);
    } else {
      setMessageWithTap(`🛠️ カードを使ったが、運んでいる特産品がなかった！`, null);
    }
  }
}

function closeCardScreen() {
  if (cardScreen) cardScreen.setAttribute("hidden", "true");
}

function openQuizModal() {
  const q = TOTTORI_QUIZZES[Math.floor(Math.random() * TOTTORI_QUIZZES.length)];
  if (quizQuestionText) quizQuestionText.textContent = q.question;
  if (quizOptionsContainer) {
    quizOptionsContainer.innerHTML = "";
    q.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.className = "quiz-btn";
      btn.textContent = opt;
      btn.onclick = () => answerQuiz(idx + 1, q.answer);
      quizOptionsContainer.appendChild(btn);
    });
  }
  if (quizScreen) quizScreen.removeAttribute("hidden");
}

function answerQuiz(selected, correct) {
  if (quizScreen) quizScreen.setAttribute("hidden", "true");
  if (selected === correct) {
    playerState.money += 300;
    setMessageWithTap(`🎉 クイズ大正解！ ボーナス 300円 を獲得！`, () => advanceNextTurnPlayer());
  } else {
    setMessageWithTap(`😭 残念！ 正解は 【${correct}番】 でした！`, () => advanceNextTurnPlayer());
  }
}

function openShopScreen() {
  if (!shopScreen) return;
  const town = getTownByNodeId(playerState.position);
  if (shopTitle) shopTitle.textContent = `🏪 ${town.area}のお店マス`;
  shopScreen.removeAttribute("hidden");
  if (shopMoney) shopMoney.textContent = `${playerState.money}円`;
  renderShopProducts(town.area);
}

function renderShopProducts(areaName) {
  if (!shopProductsContainer) return;
  shopProductsContainer.innerHTML = "";
  const items = shopItemsByArea[areaName] || shopItemsByArea["東部"];

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "shop-product";
    const canBuy = playerState.money >= item.price && !playerState.hasProduct;

    card.innerHTML = `
      <h2>${item.name}</h2>
      <div class="product-art">${item.icon}</div>
      <div class="product-desc">${item.desc}</div>
      <div class="product-price">🪙 ${item.price}円</div>
      <button class="shop-buy" ${canBuy ? "" : "disabled"}>
        ${playerState.hasProduct ? "所持中" : (playerState.money < item.price ? "所持金不足" : "仕入れる")}
      </button>
    `;
    const buyBtn = card.querySelector(".shop-buy");
    if (buyBtn && canBuy) buyBtn.addEventListener("click", () => buyProduct(item));
    shopProductsContainer.appendChild(card);
  });
}

function buyProduct(item) {
  if (playerState.money < item.price || playerState.hasProduct) return;
  playerState.money -= item.price;
  playerState.hasProduct = true;
  playerState.product = item;
  playerState.itemHp = 100;
  playerState.turnsHeld = 0;

  unlockedProducts.add(item.id);
  createMission();
  renderShopProducts(getTownByNodeId(playerState.position).area);
}

function closeShopScreen() {
  if (shopScreen) shopScreen.setAttribute("hidden", "true");
  nodeClosedThisTurn = true;
  advanceNextTurnPlayer();
}

function openGarageScreen() {
  if (!garageScreen) return;
  const node = boardNodes[playerState.position];
  if (garageTitle) garageTitle.textContent = `🔧 ${node.spotName || "車庫マス"}`;
  garageScreen.removeAttribute("hidden");
  if (garageMoney) garageMoney.textContent = `${playerState.money}円`;
  renderGarageUpgrades();
}

function renderGarageUpgrades() {
  if (!garageUpgradesContainer) return;
  garageUpgradesContainer.innerHTML = "";
  VEHICLE_DATA.forEach((veh, index) => {
    const card = document.createElement("div");
    card.className = "shop-product";
    const isCurrent = playerState.vehicleIndex === index;
    const canUpgrade = !isCurrent && playerState.vehicleIndex < index && playerState.money >= veh.cost;

    card.innerHTML = `
      <h2>${veh.name}</h2>
      <div class="product-art">${veh.icon}</div>
      <div class="product-desc">${veh.desc}</div>
      <div class="product-price">${veh.cost === 0 ? "無料" : `🪙 ${veh.cost}円`}</div>
      <button class="shop-buy" ${canUpgrade ? "" : "disabled"}>
        ${isCurrent ? "使用中" : (playerState.vehicleIndex > index ? "所有済み" : (playerState.money < veh.cost ? "所持金不足" : "ランクアップ"))}
      </button>
    `;
    const buyBtn = card.querySelector(".shop-buy");
    if (buyBtn && canUpgrade) buyBtn.addEventListener("click", () => buyVehicleUpgrade(index, veh));
    garageUpgradesContainer.appendChild(card);
  });
}

function buyVehicleUpgrade(index, veh) {
  if (playerState.money < veh.cost || playerState.vehicleIndex >= index) return;
  playerState.money -= veh.cost;
  playerState.vehicleIndex = index;
  renderGarageUpgrades();
}

function closeGarageScreen() {
  if (garageScreen) garageScreen.setAttribute("hidden", "true");
  nodeClosedThisTurn = true;
  advanceNextTurnPlayer();
}

function createBranchOverlay() {
  if (branchOverlay) return;
  branchOverlay = document.createElement("div");
  Object.assign(branchOverlay.style, {
    position: "fixed", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
    width: "min(360px, 88vw)", padding: "22px", background: "#ffffff",
    border: "3px solid #35b8a0", borderRadius: "18px", textAlign: "center", zIndex: "9999"
  });
  document.body.appendChild(branchOverlay);
}

function showBranchChoice() {
  createBranchOverlay();
  branchOverlay.replaceChildren();

  const title = document.createElement("h2");
  title.textContent = "🪧 分岐地点！";
  const btn1 = document.createElement("button");
  btn1.textContent = "➡️ 通常ルート（＋1マス）";
  styleBranchBtn(btn1, "#2788ff");

  const btn2 = document.createElement("button");
  btn2.textContent = "🌲 近道ルート（＋5マススキップ！）";
  styleBranchBtn(btn2, "#ff8c32");

  branchOverlay.append(title, btn1, btn2);

  if (isNightMode) {
    const btn3 = document.createElement("button");
    btn3.textContent = "🌌 天の川ルート（＋10マス超スキップ！）";
    styleBranchBtn(btn3, "#9c27b0");
    branchOverlay.append(btn3);
    btn3.onclick = () => { selectedBranchRoute = "milkyway"; closeBranchChoice(); movePlayerStep(); };
  }

  btn1.onclick = () => { selectedBranchRoute = "normal"; closeBranchChoice(); movePlayerStep(); };
  btn2.onclick = () => { selectedBranchRoute = "shortcut"; closeBranchChoice(); movePlayerStep(); };
}

function styleBranchBtn(btn, col) {
  Object.assign(btn.style, { display: "block", width: "100%", padding: "12px", margin: "8px 0", background: col, color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" });
}

function closeBranchChoice() {
  if (branchOverlay) { branchOverlay.remove(); branchOverlay = null; }
}

function openZukanScreen() {
  if (!zukanGrid) return;
  zukanGrid.innerHTML = "";
  ALL_PRODUCTS_MASTER.forEach(item => {
    const isUnlocked = unlockedProducts.has(item.id);
    const card = document.createElement("div");
    card.className = `zukan-card ${isUnlocked ? "" : "locked"}`;
    card.innerHTML = `
      <div style="font-size:36px;">${isUnlocked ? item.icon : "❓"}</div>
      <h3 style="margin:6px 0; font-size:15px; color:#58351b;">${isUnlocked ? item.name : "？？？？"}</h3>
      <p style="margin:0; font-size:11px; color:#666;">${isUnlocked ? item.desc : "一度仕入れると図鑑が解放されるよ！"}</p>
    `;
    zukanGrid.appendChild(card);
  });
  if (zukanScreen) zukanScreen.removeAttribute("hidden");
}

// ========================================
// 12. イベントリスナー＆起動処理
// ========================================
if (startGameBtn) {
  startGameBtn.onclick = () => {
    isMultiplayer = false;
    myPlayerIndex = 0;
    playerState.name = "あなた";
    if (titleScreen) titleScreen.setAttribute("hidden", "true");
    if (diceBtn) diceBtn.disabled = false;
    if (cardBtn) cardBtn.disabled = false;
    createMission();
    resizeCanvas();
  };
}

if (multiMenuBtn) {
  multiMenuBtn.onclick = () => {
    if (nameInputStep) nameInputStep.removeAttribute("hidden");
    if (roomSelectStep) roomSelectStep.setAttribute("hidden", "true");
    if (multiScreen) multiScreen.removeAttribute("hidden");
  };
}

if (confirmNameBtn) {
  confirmNameBtn.onclick = () => {
    const nameVal = playerNameInput ? playerNameInput.value.trim() : "";
    if (!nameVal) {
      alert("お名前を入力してください。");
      return;
    }
    playerState.name = nameVal;
    if (nameInputStep) nameInputStep.setAttribute("hidden", "true");
    if (roomSelectStep) roomSelectStep.removeAttribute("hidden");
  };
}

if (multiCloseBtn) multiCloseBtn.onclick = () => multiScreen && multiScreen.setAttribute("hidden", "true");
if (multiReturnBtn) multiReturnBtn.onclick = () => multiScreen && multiScreen.setAttribute("hidden", "true");

if (createRoomBtn) {
  createRoomBtn.onclick = () => {
    isHost = true;
    myPlayerIndex = 0;
    setupPeer();
    if (createRoomBtn) createRoomBtn.hidden = true;
    if (hostRoomCodeArea) hostRoomCodeArea.removeAttribute("hidden");
  };
}

if (startMultiGameBtn) {
  startMultiGameBtn.onclick = () => {
    broadcastData({ type: "START_GAME", nodes: boardNodes, mission: mission });
    if (multiScreen) multiScreen.setAttribute("hidden", "true");
    if (titleScreen) titleScreen.setAttribute("hidden", "true");
    if (diceBtn) diceBtn.disabled = false;
    if (cardBtn) cardBtn.disabled = false;
  };
}

if (joinRoomBtn) {
  joinRoomBtn.onclick = () => {
    const code = joinRoomInput ? joinRoomInput.value.trim() : "";
    joinRoom(code);
  };
}

if (howtoBtn) howtoBtn.onclick = () => howtoScreen && howtoScreen.removeAttribute("hidden");
if (howtoCloseBtn) howtoCloseBtn.onclick = () => howtoScreen && howtoScreen.setAttribute("hidden", "true");
if (howtoReturnBtn) howtoReturnBtn.onclick = () => howtoScreen && howtoScreen.setAttribute("hidden", "true");

if (zukanBtn) zukanBtn.onclick = openZukanScreen;
if (zukanCloseBtn) zukanCloseBtn.onclick = () => zukanScreen && zukanScreen.setAttribute("hidden", "true");
if (zukanReturnBtn) zukanReturnBtn.onclick = () => zukanScreen && zukanScreen.setAttribute("hidden", "true");

if (shopCloseBtn) shopCloseBtn.onclick = closeShopScreen;
if (shopReturnBtn) shopReturnBtn.onclick = closeShopScreen;
if (garageCloseBtn) garageCloseBtn.onclick = closeGarageScreen;
if (garageReturnBtn) garageReturnBtn.onclick = closeGarageScreen;

if (cardBtn) cardBtn.onclick = openCardScreen;
if (cardCloseBtn) cardCloseBtn.onclick = closeCardScreen;
if (cardReturnBtn) cardReturnBtn.onclick = closeCardScreen;

if (replayBtn) replayBtn.onclick = () => resetGame(false);
if (restartBtn) restartBtn.onclick = () => resetGame(true);

if (diceBtn) diceBtn.onclick = rollDice;
window.onresize = resizeCanvas;

const mapImage = new Image();
mapImage.onload = () => {
  MAP_WIDTH = mapImage.naturalWidth || BASE_MAP_WIDTH;
  MAP_HEIGHT = mapImage.naturalHeight || BASE_MAP_HEIGHT;
  mapLoaded = true;
  resizeCanvas();
};
mapImage.src = "map.png";

generateBoardNodes();
resizeCanvas();
gameLoop();
