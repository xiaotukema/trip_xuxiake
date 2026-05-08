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
    bookingLinks: (bookingProviders[type] || ["官方链接"]).map((provider) => ({
      provider,
      url: `https://www.baidu.com/s?wd=${encodeURIComponent(`${title} ${provider} 预订`)}`
    }))
  };
}

function renderPlans() {
  renderTabs();
  carousel.innerHTML = state.plans.map((plan, index) => `
    <article class="plan-card" aria-label="${plan.title}">
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
      state.savedTrips[tripIndex].days[dayIndex].segments.push(createSegment("visit", "待定", title, "手动新增地点：保存后可重新计算时间冲突、交通与预订链接。"));
      persistTrips();
      renderSavedTrips();
      savedTripsEl.querySelector(`[data-trip-index="${tripIndex}"]`).classList.add("open");
    });
  });
}

function mutateSegment(payload, action) {
  const [tripIndex, dayIndex, segmentIndex] = payload.split(":").map(Number);
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
  const photoSpots = (destinationSeeds[trip.destination] || destinationSeeds.默认).photoSpots;
  tourAssistant.className = "tour-assistant";
  tourAssistant.innerHTML = `
    <h3>${trip.title}｜旅中助手已启动</h3>
    <div class="route-line"><strong>当前位置</strong><span>→</span><strong>${next.title}</strong></div>
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
