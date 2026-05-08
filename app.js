const PREFERENCE_OPTIONS = [
  { id: "beach", label: "海岛沙滩", hint: "海边度假、日落、海鲜" },
  { id: "photo", label: "摄影打卡", hint: "小红书/抖音热门机位" },
  { id: "food", label: "美食夜市", hint: "本地小吃、老字号" },
  { id: "culture", label: "文化古迹", hint: "博物馆、历史街区" },
  { id: "nature", label: "自然奇观", hint: "山海湖瀑、地貌" },
  { id: "family", label: "亲子友好", hint: "低强度、互动体验" },
  { id: "outdoor", label: "户外徒步", hint: "轻徒步、骑行、露营" },
  { id: "citywalk", label: "城市漫游", hint: "咖啡、街区、展览" },
  { id: "wellness", label: "温泉疗愈", hint: "温泉、慢生活" },
  { id: "hidden", label: "小众避世", hint: "低人流、非模板路线" }
];

const DESTINATION_CANDIDATES = [
  {
    city: "厦门",
    match: ["beach", "photo", "food", "citywalk"],
    pois: ["鼓浪屿", "沙坡尾", "厦门园林植物园", "环岛路", "八市", "集美学村", "曾厝垵", "钟鼓索道"],
    photoSpots: ["日光岩俯拍红屋顶", "沙坡尾避风坞彩色墙", "植物园雨林喷雾步道", "黄厝海滩日落机位"],
    food: ["沙茶面", "海蛎煎", "花生汤"]
  },
  {
    city: "北京",
    match: ["culture", "food", "family", "photo"],
    pois: ["故宫", "景山公园", "天坛", "什刹海", "颐和园", "国家博物馆", "前门", "慕田峪长城"],
    photoSpots: ["景山万春亭中轴线", "故宫角楼晨光", "祈年殿蓝调时刻", "长城敌楼转角"],
    food: ["烤鸭", "炸酱面", "铜锅涮肉"]
  },
  {
    city: "成都",
    match: ["food", "culture", "family", "wellness"],
    pois: ["武侯祠", "锦里", "人民公园", "宽窄巷子", "熊猫基地", "青城山", "都江堰", "太古里"],
    photoSpots: ["熊猫基地竹林步道", "鹤鸣茶社盖碗茶", "都江堰鱼嘴分水堤", "太古里夜景街角"],
    food: ["火锅", "担担面", "蛋烘糕"]
  },
  {
    city: "张家界",
    match: ["nature", "outdoor", "photo", "hidden"],
    pois: ["武陵源", "袁家界", "天子山", "金鞭溪", "天门山", "玻璃栈道", "黄石寨", "溪布街"],
    photoSpots: ["袁家界迷魂台", "天门洞阶梯仰拍", "金鞭溪峡谷水面", "天子山云海观景台"],
    food: ["三下锅", "土家腊肉", "莓茶"]
  },
  {
    city: "杭州",
    match: ["citywalk", "culture", "wellness", "food"],
    pois: ["西湖", "灵隐寺", "法喜寺", "龙井村", "良渚博物院", "小河直街", "西溪湿地", "南宋御街"],
    photoSpots: ["西湖断桥晨雾", "法喜寺黄墙转角", "龙井村茶山步道", "小河直街拱桥"],
    food: ["片儿川", "龙井虾仁", "定胜糕"]
  },
  {
    city: "大理",
    match: ["hidden", "beach", "wellness", "photo"],
    pois: ["洱海生态廊道", "喜洲古镇", "苍山", "双廊", "大理古城", "龙龛码头", "沙溪古镇", "周城扎染"],
    photoSpots: ["龙龛码头日出水杉", "喜洲麦田转角", "双廊临湖栈道", "苍山索道云海"],
    food: ["乳扇", "喜洲粑粑", "野生菌火锅"]
  }
];

const PLAN_STYLES = [
  { name: "省心舒适", pace: "均衡", focus: "直达交通/舒适住宿/经典体验", costFactor: 1 },
  { name: "高热打卡", pace: "紧凑", focus: "热门机位/地标/夜游", costFactor: 0.94 },
  { name: "深度小众", pace: "慢节奏", focus: "在地街区/非模板路线/留白", costFactor: 1.08 }
];

const TIER_BASE_COST = {
  经济: { transport: [420, 780], hotel: [260, 420], food: [80, 140], ticket: [80, 180] },
  舒适: { transport: [700, 1280], hotel: [520, 850], food: [150, 260], ticket: [140, 320] },
  高端: { transport: [1200, 2600], hotel: [980, 1800], food: [280, 520], ticket: [260, 680] }
};

const BOOKING_PROVIDERS = {
  transport: ["航司/铁路官网", "携程交通", "飞猪交通"],
  hotel: ["酒店官网", "携程酒店", "飞猪酒店"],
  visit: ["景区官网", "携程门票", "同程旅行"],
  food: ["大众点评", "高德地图"],
  rest: ["官方信息"]
};

const state = {
  plans: [],
  activePlanIndex: 0,
  savedTrips: migrateSavedTrips(JSON.parse(localStorage.getItem("trip-xuxiake.savedTrips") || "[]"))
const state = {
  plans: [],
  activePlanIndex: 0,
  savedTrips: JSON.parse(localStorage.getItem("trip-xuxiake.savedTrips") || "[]")
};

const destinationSeeds = {
  厦门: {
    pois: ["鼓浪屿", "沙坡尾", "厦门园林植物园", "环岛路", "八市", "集美学村", "曾厝垵", "钟鼓索道"],
    photoSpots: ["日光岩俯拍红屋顶", "沙坡尾避风坞彩色墙", "植物园雨林喷雾步道", "环岛路黄厝海滩日落"],
    food: ["沙茶面", "海蛎煎", "花生汤"]
  },
  北京: {
    pois: ["故宫", "景山公园", "天坛", "什刹海", "颐和园", "国家博物馆", "前门", "慕田峪长城"],
    photoSpots: ["景山万春亭俯拍中轴线", "故宫角楼晨光", "天坛祈年殿回音壁外侧", "长城敌楼转角"],
    food: ["烤鸭", "炸酱面", "豆汁焦圈"]
  },
  成都: {
    pois: ["武侯祠", "锦里", "人民公园", "宽窄巷子", "熊猫基地", "青城山", "都江堰", "太古里"],
    photoSpots: ["熊猫基地月亮产房外步道", "人民公园鹤鸣茶社", "都江堰鱼嘴分水堤", "太古里裸眼 3D 屏"],
    food: ["火锅", "担担面", "蛋烘糕"]
  },
  默认: {
    pois: ["城市地标", "老街市集", "博物馆", "滨水步道", "夜景观景台", "本地餐厅", "自然公园", "特色街区"],
    photoSpots: ["地标广场对称机位", "老街转角招牌墙", "滨水步道日落位", "夜景观景台栏杆前景"],
    food: ["本地小吃", "老字号", "咖啡甜品"]
  }
};

const planStyles = [
  { name: "松弛度假", pace: "慢节奏", multiplier: 1, focus: "海边/休闲/美食" },
  { name: "奇观打卡", pace: "高效率", multiplier: 0.92, focus: "地标/拍照/夜景" },
  { name: "文化深度", pace: "均衡", multiplier: 1.08, focus: "博物馆/街区/在地体验" }
];

const bookingProviders = {
  travel: ["12306", "携程交通"],
  hotel: ["酒店官网", "携程酒店"],
  visit: ["景区官网", "携程门票"],
  food: ["大众点评", "高德地图"]
};

const form = document.querySelector("#planner-form");
const tabs = document.querySelector("#plan-tabs");
const carousel = document.querySelector("#plan-carousel");
const savedTripsEl = document.querySelector("#saved-trips");
const tourAssistant = document.querySelector("#tour-assistant");
const preferenceGrid = document.querySelector("#preference-grid");
const plannerStatus = document.querySelector("#planner-status");

renderPreferenceChips();
generateInitialPlans();
renderSavedTrips();

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  await generatePlansFromInput();

generateInitialPlans();
renderSavedTrips();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = Object.fromEntries(new FormData(form).entries());
  input.days = Number(input.days);
  state.plans = buildPlans(input);
  state.activePlanIndex = 0;
  renderPlans();
});

document.querySelector("#clear-trips").addEventListener("click", () => {
  state.savedTrips = [];
  persistTrips();
  renderSavedTrips();
  tourAssistant.className = "tour-assistant empty";
  tourAssistant.textContent = "尚未开始行程。请先保存并展开一个行程。";
});

carousel.addEventListener("scroll", () => {
  const width = carousel.clientWidth || 1;
  const index = Math.round(carousel.scrollLeft / width);
  if (index !== state.activePlanIndex) {
    state.activePlanIndex = index;
    renderTabs();
  }
});

function migrateSavedTrips(trips) {
  return trips.map((trip) => {
    const budgetTier = trip.budgetTier || trip.budget || "舒适";
    const days = (trip.days || []).map((day) => ({
      ...day,
      segments: (day.segments || []).map((segment) => ({
        ...segment,
        type: segment.type === "travel" ? "transport" : segment.type,
        cost: segment.cost || estimateSegmentCost(segment.type === "travel" ? "transport" : segment.type || "visit", budgetTier, 1),
        bookingLinks: segment.bookingLinks || (BOOKING_PROVIDERS[segment.type] || BOOKING_PROVIDERS.visit).map((provider) => ({
          provider,
          url: `https://www.baidu.com/s?wd=${encodeURIComponent(`${segment.title} ${provider} 预订`)}`
        }))
      }))
    }));
    return {
      ...trip,
      budgetTier,
      preferences: Array.isArray(trip.preferences) ? trip.preferences : String(trip.preferences || "").split(/[,，、]/).filter(Boolean),
      destination: trip.destination || "已保存目的地",
      style: trip.style || PLAN_STYLES[0],
      days,
      budget: trip.budget?.min ? trip.budget : summarizeBudget(days),
      dataFreshness: trip.dataFreshness || "旧版本地数据",
      sourceNote: trip.sourceNote || "旧版本地保存行程已自动补齐预算字段"
    };
  });
}

function renderPreferenceChips() {
  preferenceGrid.innerHTML = PREFERENCE_OPTIONS.map((option, index) => `
    <label class="preference-chip">
      <input type="checkbox" name="preferences" value="${option.id}" ${index < 3 ? "checked" : ""} />
      <span><strong>${option.label}</strong><small>${option.hint}</small></span>
    </label>
  `).join("");
}

function readInput() {
  const formData = new FormData(form);
  return {
    origin: String(formData.get("origin") || "").trim(),
    days: Number(formData.get("days") || 3),
    budgetTier: formData.get("budgetTier"),
    groupType: formData.get("groupType"),
    preferences: formData.getAll("preferences"),
    aiEndpoint: String(formData.get("aiEndpoint") || "").trim()
  };
}

async function generateInitialPlans() {
  await generatePlansFromInput({ silent: true });
}

async function generatePlansFromInput({ silent = false } = {}) {
  const input = readInput();
  if (!input.preferences.length) {
    input.preferences = ["citywalk"];
  }
  if (!silent) setStatus("正在请求大模型规划服务，并准备授权 OTA/攻略数据上下文……");
  state.activePlanIndex = 0;
  try {
    state.plans = input.aiEndpoint ? await requestAiPlans(input) : buildFallbackPlans(input, "未配置大模型端点，使用本地预览后备");
    if (!silent) setStatus(input.aiEndpoint ? "已使用大模型接口生成方案。" : "未配置大模型端点，已用本地后备方案预览交互。", input.aiEndpoint ? "success" : "warning");
  } catch (error) {
    state.plans = buildFallbackPlans(input, `大模型接口不可用：${error.message}`);
    setStatus(`大模型接口不可用，已切换本地后备方案：${error.message}`, "warning");
  }
  renderPlans();
}

async function requestAiPlans(input) {
  const response = await fetch(input.aiEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      origin: input.origin,
      days: input.days,
      budgetTier: input.budgetTier,
      groupType: input.groupType,
      preferences: input.preferences.map(preferenceLabel),
      requiredOutput: "Return 2-3 itinerary plans. Destination must be inferred by the model; user does not provide destination.",
      dataPolicy: {
        otaPricing: "Use only official/partner APIs or cached licensed price snapshots.",
        ugc: "Use only authorized social content, creator partnerships, or user-imported notes. Do not bypass anti-bot systems."
      }
    })
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const payload = await response.json();
  return normalizeAiPlans(payload, input);
}

function normalizeAiPlans(payload, input) {
  const plans = Array.isArray(payload.plans) ? payload.plans : [];
  if (!plans.length) throw new Error("响应中没有 plans 数组");
  return plans.slice(0, 3).map((plan, index) => {
    const days = (plan.days || []).map((day, dayIndex) => ({
      id: day.id || crypto.randomUUID(),
      label: day.label || `Day ${dayIndex + 1}`,
      theme: day.theme || PLAN_STYLES[index]?.focus || "AI 推荐路线",
      segments: (day.segments || []).map((segment) => createSegment({
        type: segment.type || "visit",
        time: segment.time || "待定",
        title: segment.title || "待确认地点",
        description: segment.description || "来自大模型与授权数据源的结构化建议。",
        cost: segment.cost || estimateSegmentCost(segment.type || "visit", input.budgetTier, 1)
      }))
    }));
    const budget = summarizeBudget(days);
    return {
      id: plan.id || crypto.randomUUID(),
      title: plan.title || `${plan.destination || "AI 推荐目的地"}${PLAN_STYLES[index]?.name || "方案"}`,
      origin: input.origin,
      destination: plan.destination || plan.city || "AI 推荐目的地",
      budgetTier: input.budgetTier,
      preferences: input.preferences,
      style: PLAN_STYLES[index] || PLAN_STYLES[0],
      days,
      budget,
      dataFreshness: plan.dataFreshness || "由后端返回",
      sourceNote: plan.sourceNote || "大模型接口应基于授权 OTA/API/UGC 摘要生成",
      updatedAt: new Date().toISOString()
    };
  });
}

function buildFallbackPlans(input, sourceNote) {
  const ranked = rankDestinations(input.preferences);
  return PLAN_STYLES.map((style, index) => {
    const destination = ranked[index % ranked.length];
    const days = Array.from({ length: input.days }, (_, dayIndex) => buildDay(input, destination, style, dayIndex));
    const budget = summarizeBudget(days);
    return {
      id: crypto.randomUUID(),
      title: `${destination.city}${style.name}${input.days}日`,
      origin: input.origin,
      destination: destination.city,
      budgetTier: input.budgetTier,
      preferences: input.preferences,
      style,
      days,
      budget,
      dataFreshness: "本地预览估算，非实时价格",
      sourceNote,
function generateInitialPlans() {
  const input = Object.fromEntries(new FormData(form).entries());
  input.days = Number(input.days);
  state.plans = buildPlans(input);
  renderPlans();
}

function buildPlans(input) {
  const seed = destinationSeeds[input.destination] || destinationSeeds.默认;
  return planStyles.map((style, styleIndex) => {
    const days = Array.from({ length: input.days }, (_, dayIndex) => buildDay(input, seed, style, styleIndex, dayIndex));
    const baseBudget = input.budget === "经济" ? 1800 : input.budget === "高端" ? 7600 : 4200;
    return {
      id: crypto.randomUUID(),
      title: `${input.destination}${style.name}${input.days}日方案`,
      origin: input.origin,
      destination: input.destination,
      budget: input.budget,
      preferences: input.preferences,
      style,
      days,
      estimatedCost: Math.round(baseBudget * style.multiplier),
      bookingStatus: "待关联",
      updatedAt: new Date().toISOString()
    };
  });
}

function rankDestinations(preferences) {
  return [...DESTINATION_CANDIDATES].sort((a, b) => scoreDestination(b, preferences) - scoreDestination(a, preferences));
}

function scoreDestination(destination, preferences) {
  return preferences.reduce((score, preference) => score + (destination.match.includes(preference) ? 2 : 0), 0) + destination.match.length / 10;
}

function buildDay(input, destination, style, dayIndex) {
  const start = (dayIndex * 2) % destination.pois.length;
  const poiA = destination.pois[start];
  const poiB = destination.pois[(start + 1) % destination.pois.length];
  const food = destination.food[dayIndex % destination.food.length];
  const hotel = `${destination.city}${input.budgetTier}型酒店`;
  const photoSpot = destination.photoSpots[dayIndex % destination.photoSpots.length];
  const factor = style.costFactor;
function buildDay(input, seed, style, styleIndex, dayIndex) {
  const start = (dayIndex * 2 + styleIndex) % seed.pois.length;
  const poiA = seed.pois[start];
  const poiB = seed.pois[(start + 1) % seed.pois.length];
  const food = seed.food[(dayIndex + styleIndex) % seed.food.length];
  const hotel = `${input.destination}${input.budget}精选酒店`;
  const photoSpot = seed.photoSpots[(dayIndex + styleIndex) % seed.photoSpots.length];
  return {
    id: crypto.randomUUID(),
    label: `Day ${dayIndex + 1}`,
    theme: `${style.focus} · ${photoSpot}`,
    segments: [
      createSegment({ type: "transport", time: dayIndex === 0 ? "09:00" : "09:30", title: dayIndex === 0 ? `${input.origin} → ${destination.city}` : `${hotel} → ${poiA}`, description: `${style.pace}交通方案，生产环境会用地图/铁路/航班 API 计算实时耗时。`, cost: estimateSegmentCost("transport", input.budgetTier, dayIndex === 0 ? factor : 0.2 * factor) }),
      createSegment({ type: "visit", time: "10:30", title: poiA, description: `匹配偏好：${input.preferences.map(preferenceLabel).join("、")}；拍照点：${photoSpot}。`, cost: estimateSegmentCost("visit", input.budgetTier, factor) }),
      createSegment({ type: "food", time: "12:30", title: `${food}午餐`, description: "参考 OTA/点评类授权价格带预留餐饮预算。", cost: estimateSegmentCost("food", input.budgetTier, factor) }),
      createSegment({ type: "visit", time: "14:30", title: poiB, description: "结合官方开放时间、授权攻略热度和地理距离排序。", cost: estimateSegmentCost("visit", input.budgetTier, factor) }),
      createSegment({ type: "hotel", time: "19:00", title: hotel, description: "住宿预算按每晚分摊；生产环境应接入酒店官网或 OTA 授权报价。", cost: estimateSegmentCost("hotel", input.budgetTier, dayIndex === input.days - 1 ? 0 : factor) })
    ]
  };
}

function estimateSegmentCost(type, tier, factor) {
  const base = TIER_BASE_COST[tier] || TIER_BASE_COST.舒适;
  const key = type === "hotel" ? "hotel" : type === "food" ? "food" : type === "transport" ? "transport" : "ticket";
  return {
    min: Math.round(base[key][0] * factor),
    max: Math.round(base[key][1] * factor),
    currency: "CNY",
    source: "本地估算；生产环境替换为授权 OTA/官方 API 实时价"
  };
}

function createSegment({ type, time, title, description, cost }) {
      createSegment("travel", "09:00", dayIndex === 0 ? `${input.origin} → ${input.destination}` : `${hotel} → ${poiA}`, `${style.pace}交通路线，优先选择少换乘方案。`),
      createSegment("visit", "10:30", poiA, `游览重点：${input.preferences || style.focus}；拍照点：${photoSpot}。`),
      createSegment("food", "12:30", `${food}午餐`, `根据预算选择附近高评分餐厅，保留排队与休息时间。`),
      createSegment("visit", "14:30", poiB, `结合官方开放时间与授权攻略热度，安排下午核心体验。`),
      createSegment("hotel", "19:00", hotel, `住宿链接可关联酒店官网或 OTA，支持后续价格跟踪。`)
    ]
  };
}

function createSegment(type, time, title, description) {
  return {
    id: crypto.randomUUID(),
    type,
    time,
    title,
    description,
    cost,
    bookingLinks: (BOOKING_PROVIDERS[type] || BOOKING_PROVIDERS.visit).map((provider) => ({
    bookingLinks: (bookingProviders[type] || ["官方链接"]).map((provider) => ({
      provider,
      url: `https://www.baidu.com/s?wd=${encodeURIComponent(`${title} ${provider} 预订`)}`
    }))
  };
}

function summarizeBudget(days) {
  const segments = days.flatMap((day) => day.segments);
  const categories = { transport: [0, 0], hotel: [0, 0], food: [0, 0], visit: [0, 0] };
  for (const segment of segments) {
    const category = segment.type === "hotel" ? "hotel" : segment.type === "food" ? "food" : segment.type === "transport" ? "transport" : "visit";
    categories[category][0] += segment.cost?.min || 0;
    categories[category][1] += segment.cost?.max || 0;
  }
  return {
    min: Object.values(categories).reduce((sum, item) => sum + item[0], 0),
    max: Object.values(categories).reduce((sum, item) => sum + item[1], 0),
    categories
  };
}

function renderPlans() {
  renderTabs();
  carousel.innerHTML = state.plans.map((plan, index) => `
    <article class="plan-card" aria-label="${plan.title}">
      <div class="plan-title-row">
        <div>
          <h3>${plan.title}</h3>
          <p class="muted">从 ${plan.origin} 出发 · AI 推荐目的地：${plan.destination} · ${plan.style.pace}</p>
        </div>
        <span class="budget-pill">¥${plan.budget.min.toLocaleString()}-${plan.budget.max.toLocaleString()}</span>
      </div>
      <div class="plan-summary">
        <div class="metric"><span>交通</span><strong>¥${formatRange(plan.budget.categories.transport)}</strong></div>
        <div class="metric"><span>住宿</span><strong>¥${formatRange(plan.budget.categories.hotel)}</strong></div>
        <div class="metric"><span>餐饮</span><strong>¥${formatRange(plan.budget.categories.food)}</strong></div>
        <div class="metric"><span>门票/体验</span><strong>¥${formatRange(plan.budget.categories.visit)}</strong></div>
      </div>
      <p class="source-note">${plan.dataFreshness} · ${plan.sourceNote}</p>
      <h3>${plan.title}</h3>
      <p class="muted">从 ${plan.origin} 出发 · 偏好：${plan.preferences || "未填写"} · ${plan.style.pace}</p>
      <div class="plan-summary">
        <div class="metric"><span>预计预算</span><strong>¥${plan.estimatedCost}</strong></div>
        <div class="metric"><span>旅行天数</span><strong>${plan.days.length} 天</strong></div>
        <div class="metric"><span>方案风格</span><strong>${plan.style.name}</strong></div>
        <div class="metric"><span>预订状态</span><strong>${plan.bookingStatus}</strong></div>
      </div>
      <div class="days">${plan.days.map(renderDay).join("")}</div>
      <div class="segment-tools">
        <button data-save-plan="${index}">确认并保存到我的行程</button>
      </div>
    </article>
  `).join("");
  carousel.scrollTo({ left: state.activePlanIndex * carousel.clientWidth, behavior: "auto" });
  carousel.querySelectorAll("[data-save-plan]").forEach((button) => {
    button.addEventListener("click", () => savePlan(Number(button.dataset.savePlan)));
  });
}

function renderTabs() {
  tabs.innerHTML = state.plans.map((plan, index) => `
    <button role="tab" class="${index === state.activePlanIndex ? "active" : ""}" aria-selected="${index === state.activePlanIndex}" data-tab="${index}">
      <strong>${plan.destination}</strong>
      <small>${plan.style.name} · ¥${plan.budget.min.toLocaleString()}-${plan.budget.max.toLocaleString()}</small>
      ${plan.style.name}
    </button>
  `).join("");
  tabs.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      state.activePlanIndex = Number(button.dataset.tab);
      carousel.scrollTo({ left: state.activePlanIndex * carousel.clientWidth, behavior: "smooth" });
      renderTabs();
    });
  });
}

function renderDay(day) {
  return `
    <section class="day-card">
      <h3>${day.label}｜${day.theme}</h3>
      <div class="segment-list">${day.segments.map(renderSegment).join("")}</div>
    </section>
  `;
}

function renderSegment(segment) {
  const cost = segment.cost || estimateSegmentCost(segment.type || "visit", "舒适", 1);
  const links = segment.bookingLinks.map((link) => `<a href="${link.url}" target="_blank" rel="noopener">${link.provider}</a>`).join("");
  return `
    <article class="segment-card" data-segment-id="${segment.id}">
      <div class="segment-time">${segment.time}<span>¥${cost.min}-${cost.max}</span></div>
      <div>
        <h4>${segment.title}</h4>
        <p>${segment.description}</p>
        <small class="cost-source">${cost.source}</small>
  const links = segment.bookingLinks.map((link) => `<a href="${link.url}" target="_blank" rel="noopener">${link.provider}</a>`).join("");
  return `
    <article class="segment-card" data-segment-id="${segment.id}">
      <div class="segment-time">${segment.time}</div>
      <div>
        <h4>${segment.title}</h4>
        <p>${segment.description}</p>
        <div class="booking-links">${links}</div>
      </div>
    </article>
  `;
}

function savePlan(index) {
  const plan = structuredClone(state.plans[index]);
  plan.savedAt = new Date().toISOString();
  state.savedTrips.unshift(plan);
  persistTrips();
  renderSavedTrips();
  document.querySelector("#trips").scrollIntoView({ behavior: "smooth" });
}

function persistTrips() {
  localStorage.setItem("trip-xuxiake.savedTrips", JSON.stringify(state.savedTrips));
}

function renderSavedTrips() {
  if (!state.savedTrips.length) {
    savedTripsEl.innerHTML = `<p class="muted">还没有保存的行程。请先在推荐方案中点击「确认并保存」。</p>`;
    return;
  }
  savedTripsEl.innerHTML = state.savedTrips.map((trip, tripIndex) => `
    <article class="trip-card" data-trip-index="${tripIndex}">
      <button class="trip-header" data-toggle-trip="${tripIndex}">
        <span><strong>${trip.title}</strong><br><span class="muted">${trip.days.length} 天 · ¥${trip.budget.min.toLocaleString()}-${trip.budget.max.toLocaleString()} · ${new Date(trip.savedAt).toLocaleString("zh-CN")}</span></span>
        <span><strong>${trip.title}</strong><br><span class="muted">${trip.days.length} 天 · ¥${trip.estimatedCost} · ${new Date(trip.savedAt).toLocaleString("zh-CN")}</span></span>
        <span>展开 / 收起</span>
      </button>
      <div class="trip-body">
        <div class="days">${trip.days.map((day, dayIndex) => renderEditableDay(day, tripIndex, dayIndex)).join("")}</div>
        <div class="segment-tools">
          <button data-start-tour="${tripIndex}">开始游览</button>
          <button class="danger" data-delete-trip="${tripIndex}">删除行程</button>
        </div>
      </div>
    </article>
  `).join("");
  wireSavedTripEvents();
}

function renderEditableDay(day, tripIndex, dayIndex) {
  return `
    <section class="day-card">
      <h3>${day.label}｜${day.theme}</h3>
      <div class="segment-list">${day.segments.map((segment, segmentIndex) => `
        <div>
          ${renderSegment(segment)}
          <div class="segment-tools">
            <button class="secondary small" data-move-up="${tripIndex}:${dayIndex}:${segmentIndex}">上移</button>
            <button class="secondary small" data-move-down="${tripIndex}:${dayIndex}:${segmentIndex}">下移</button>
            <button class="danger small" data-remove-segment="${tripIndex}:${dayIndex}:${segmentIndex}">删除</button>
          </div>
        </div>
      `).join("")}</div>
      <div class="segment-tools">
        <input placeholder="新增地点，如：日落观景台" data-add-input="${tripIndex}:${dayIndex}" />
        <button class="secondary small" data-add-segment="${tripIndex}:${dayIndex}">增加地点</button>
      </div>
    </section>
  `;
}

function wireSavedTripEvents() {
  savedTripsEl.querySelectorAll("[data-toggle-trip]").forEach((button) => {
    button.addEventListener("click", () => button.closest(".trip-card").classList.toggle("open"));
  });
  savedTripsEl.querySelectorAll("[data-delete-trip]").forEach((button) => {
    button.addEventListener("click", () => {
      state.savedTrips.splice(Number(button.dataset.deleteTrip), 1);
      persistTrips();
      renderSavedTrips();
    });
  });
  savedTripsEl.querySelectorAll("[data-start-tour]").forEach((button) => {
    button.addEventListener("click", () => startTour(Number(button.dataset.startTour)));
  });
  savedTripsEl.querySelectorAll("[data-remove-segment]").forEach((button) => {
    button.addEventListener("click", () => mutateSegment(button.dataset.removeSegment, "remove"));
  });
  savedTripsEl.querySelectorAll("[data-move-up]").forEach((button) => {
    button.addEventListener("click", () => mutateSegment(button.dataset.moveUp, "up"));
  });
  savedTripsEl.querySelectorAll("[data-move-down]").forEach((button) => {
    button.addEventListener("click", () => mutateSegment(button.dataset.moveDown, "down"));
  });
  savedTripsEl.querySelectorAll("[data-add-segment]").forEach((button) => {
    button.addEventListener("click", () => {
      const [tripIndex, dayIndex] = button.dataset.addSegment.split(":").map(Number);
      const input = savedTripsEl.querySelector(`[data-add-input="${tripIndex}:${dayIndex}"]`);
      const title = input.value.trim();
      if (!title) return;
      const trip = state.savedTrips[tripIndex];
      trip.days[dayIndex].segments.push(createSegment({
        type: "visit",
        time: "待定",
        title,
        description: "手动新增地点：保存后可由大模型重新计算时间冲突、交通与预订链接。",
        cost: estimateSegmentCost("visit", trip.budgetTier, 1)
      }));
      trip.budget = summarizeBudget(trip.days);
      state.savedTrips[tripIndex].days[dayIndex].segments.push(createSegment("visit", "待定", title, "手动新增地点：保存后可重新计算时间冲突、交通与预订链接。"));
      persistTrips();
      renderSavedTrips();
      savedTripsEl.querySelector(`[data-trip-index="${tripIndex}"]`).classList.add("open");
    });
  });
}

function mutateSegment(payload, action) {
  const [tripIndex, dayIndex, segmentIndex] = payload.split(":").map(Number);
  const trip = state.savedTrips[tripIndex];
  const segments = trip.days[dayIndex].segments;
  if (action === "remove") segments.splice(segmentIndex, 1);
  if (action === "up" && segmentIndex > 0) [segments[segmentIndex - 1], segments[segmentIndex]] = [segments[segmentIndex], segments[segmentIndex - 1]];
  if (action === "down" && segmentIndex < segments.length - 1) [segments[segmentIndex + 1], segments[segmentIndex]] = [segments[segmentIndex], segments[segmentIndex + 1]];
  trip.budget = summarizeBudget(trip.days);
  const segments = state.savedTrips[tripIndex].days[dayIndex].segments;
  if (action === "remove") segments.splice(segmentIndex, 1);
  if (action === "up" && segmentIndex > 0) [segments[segmentIndex - 1], segments[segmentIndex]] = [segments[segmentIndex], segments[segmentIndex - 1]];
  if (action === "down" && segmentIndex < segments.length - 1) [segments[segmentIndex + 1], segments[segmentIndex]] = [segments[segmentIndex], segments[segmentIndex + 1]];
  persistTrips();
  renderSavedTrips();
  savedTripsEl.querySelector(`[data-trip-index="${tripIndex}"]`)?.classList.add("open");
}

function startTour(tripIndex) {
  const trip = state.savedTrips[tripIndex];
  const next = trip.days.flatMap((day) => day.segments).find((segment) => ["visit", "food", "hotel"].includes(segment.type));
  if (!next) {
    tourAssistant.className = "tour-assistant empty";
    tourAssistant.textContent = "当前行程没有可导航的下一站，请先新增地点。";
    return;
  }
  const destination = DESTINATION_CANDIDATES.find((candidate) => candidate.city === trip.destination) || DESTINATION_CANDIDATES[0];
  const photoSpots = (destinationSeeds[trip.destination] || destinationSeeds.默认).photoSpots;
  tourAssistant.className = "tour-assistant";
  tourAssistant.innerHTML = `
    <h3>${trip.title}｜旅中助手已启动</h3>
    <div class="route-line"><strong>当前位置</strong><span>→</span><strong>${next.title}</strong></div>
    <p>推荐路线：生产环境接入地图 SDK 后返回当前位置到下一站的公交/步行/驾车实时路线；离线状态下使用已缓存城市地图和行程点位。</p>
    <h4>下一站拍照出片点位</h4>
    <ul class="photo-list">${destination.photoSpots.map((spot) => `<li>${spot}：来自授权攻略摘要或人工审核点位，建议预留 15 分钟构图。</li>`).join("")}</ul>
    <p>推荐路线：步行 8 分钟到最近地铁/公交站，公共交通约 24 分钟，末段步行 6 分钟。生产环境接入高德/Google/OSRM 返回实时路线与离线缓存。</p>
    <h4>下一站拍照出片点位</h4>
    <ul class="photo-list">${photoSpots.map((spot) => `<li>${spot}：建议广角镜头，预留 15 分钟排队与构图。</li>`).join("")}</ul>
    <div class="translation-box">
      <strong>旅行翻译</strong>
      <p>中文：请问去 ${next.title} 怎么走？</p>
      <p>英文：How can I get to ${next.title}?</p>
      <p>日文：${next.title} へはどう行けばいいですか？</p>
    </div>
  `;
  tourAssistant.scrollIntoView({ behavior: "smooth" });
}

function preferenceLabel(id) {
  return PREFERENCE_OPTIONS.find((option) => option.id === id)?.label || id;
}

function formatRange(range) {
  return `${range[0].toLocaleString()}-${range[1].toLocaleString()}`;
}

function setStatus(message, type = "") {
  plannerStatus.textContent = message;
  plannerStatus.dataset.type = type;
}
