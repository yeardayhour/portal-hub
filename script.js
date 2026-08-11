document.addEventListener("DOMContentLoaded", () => {
  const config = window.PORTAL_CONFIG || { services: [] };
  const servicesList = document.getElementById("services-list");
  const countText = document.getElementById("service-count-text");
  
  // Host Detection
  let currentHost = window.location.hostname;
  const isFileProtocol = window.location.protocol === "file:";
  if (!currentHost || currentHost === "" || currentHost === "null" || isFileProtocol) {
    currentHost = "localhost";
  }

  // Update Service Count
  if (countText && config.services) {
    countText.innerText = `${config.services.length} Services`;
  }

  // Clock Widget
  function updateClock() {
    const now = new Date();
    const clockEl = document.getElementById("clock-time");
    if (clockEl) {
      clockEl.innerText = now.toLocaleTimeString('en-US', { hour12: false });
    }
  }
  setInterval(updateClock, 1000);
  updateClock();

  // Render Services Row List
  if (servicesList) {
    servicesList.innerHTML = "";
    config.services.forEach((service) => {
      let fullUrl = "#";
      let displayUrl = "";

      if (service.path && !isFileProtocol && currentHost !== "localhost") {
        fullUrl = `${window.location.protocol}//${currentHost}${service.path}`;
        displayUrl = `${currentHost}${service.path}`;
      } else {
        fullUrl = service.port ? `${service.protocol}://${currentHost}:${service.port}` : `${service.protocol}://${currentHost}`;
        displayUrl = service.port ? `${currentHost}:${service.port}` : `${currentHost}`;
      }

      const row = document.createElement("a");
      row.className = `service-row-item ${service.disabled ? "disabled" : ""}`;
      
      if (!service.disabled) {
        row.href = fullUrl;
        row.target = "_blank";
        row.rel = "noopener noreferrer";
      }

      row.innerHTML = `
        <div class="row-left">
          <div class="row-icon">${service.icon || "💻"}</div>
          <div class="row-info">
            <div class="row-title-wrap">
              <span class="row-title">${service.title}</span>
              <span class="badge badge-${service.badgeColor || "cyan"}">${service.badge || "Service"}</span>
            </div>
            <p class="row-desc">${service.description}</p>
          </div>
        </div>
        <div class="row-right">
          <span class="row-url">${service.disabled ? 'Coming soon...' : displayUrl}</span>
          <i class="ph-bold ph-arrow-right arrow-icon"></i>
        </div>
      `;
      servicesList.appendChild(row);
    });
  }

  // ==========================================
  // Guestbook System (방명록 기능)
  // ==========================================
  const gbForm = document.getElementById("guestbook-form");
  const gbNickname = document.getElementById("gb-nickname");
  const gbMessage = document.getElementById("gb-message");
  const gbList = document.getElementById("guestbook-list");
  const gbCountText = document.getElementById("guestbook-count-text");

  const STORAGE_KEY = "yeardayhour_guestbook_v1";

  // Initial Sample Messages
  const initialEntries = [
    {
      id: 1,
      nickname: "yeardayhour",
      message: "포탈에 오신 것을 환영합니다! 방명록을 자유롭게 작성해보세요 🚀",
      date: "2026-08-11 20:00"
    },
    {
      id: 2,
      nickname: "스트라이커",
      message: "Strike 3D 주사위 멀티플레이어 진짜 꿀잼이네요 🎲",
      date: "2026-08-11 20:15"
    }
  ];

  function getGuestbookEntries() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialEntries;
  }

  function saveGuestbookEntries(entries) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (e) {}
  }

  function renderGuestbook() {
    if (!gbList) return;
    const entries = getGuestbookEntries();
    gbList.innerHTML = "";

    if (gbCountText) {
      gbCountText.innerText = `${entries.length} Messages`;
    }

    if (entries.length === 0) {
      gbList.innerHTML = '<div class="gb-card text-center text-slate-500">첫 번째 방명록을 작성해보세요!</div>';
      return;
    }

    entries.forEach(entry => {
      const card = document.createElement("div");
      card.className = "gb-card";
      
      const initial = (entry.nickname || "?").substring(0, 1).toUpperCase();

      card.innerHTML = `
        <div class="gb-avatar">${initial}</div>
        <div class="gb-content">
          <div class="gb-header">
            <span class="gb-name">${entry.nickname}</span>
            <span class="gb-time">${entry.date}</span>
          </div>
          <p class="gb-text">${entry.message}</p>
        </div>
      `;
      gbList.appendChild(card);
    });
  }

  if (gbForm) {
    gbForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nickname = gbNickname.value.trim();
      const message = gbMessage.value.trim();

      if (!nickname || !message) return;

      const entries = getGuestbookEntries();
      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const newEntry = {
        id: Date.now(),
        nickname,
        message,
        date: dateStr
      };

      entries.unshift(newEntry);
      saveGuestbookEntries(entries);
      renderGuestbook();

      gbMessage.value = "";
    });
  }

  // Initial render
  renderGuestbook();
});
