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
              <span class="badge badge-${service.badgeColor || "purple"}">${service.badge || "Game"}</span>
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
  // Guestbook System (글로벌 실시간 API 연동 & 비밀번호 삭제 기능)
  // ==========================================
  const gbForm = document.getElementById("guestbook-form");
  const gbNickname = document.getElementById("gb-nickname");
  const gbPassword = document.getElementById("gb-password");
  const gbMessage = document.getElementById("gb-message");
  const gbList = document.getElementById("guestbook-list");
  const gbCountText = document.getElementById("guestbook-count-text");

  let guestbookEntries = [];

  // Fetch Global Guestbook Entries from Server API
  async function fetchGuestbook() {
    try {
      const res = await fetch('/api/guestbook');
      if (res.ok) {
        const data = await res.json();
        if (data.entries) {
          guestbookEntries = data.entries;
          renderGuestbook();
          return;
        }
      }
    } catch (e) {
      console.warn("Guestbook API fetch fallback to local:", e);
    }
  }

  // Add New Guestbook Entry
  async function addGuestbook(nickname, password, message) {
    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, password, message })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.entries) {
          guestbookEntries = data.entries;
          renderGuestbook();
          return true;
        }
      }
    } catch (e) {
      console.error("Failed to post guestbook:", e);
    }
    return false;
  }

  // Delete Guestbook Entry by Password
  async function deleteGuestbookEntry(id) {
    const target = guestbookEntries.find(e => e.id === id);
    if (!target) return;

    const inputPass = prompt(`[${target.nickname}] 님의 방명록을 삭제하시겠습니까?\n작성할 때 설정한 비밀번호를 입력해 주세요:`);
    if (inputPass === null || !inputPass.trim()) return;

    try {
      const res = await fetch(`/api/guestbook/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: inputPass.trim() })
      });

      const data = await res.json();
      if (res.ok && data.entries) {
        guestbookEntries = data.entries;
        renderGuestbook();
        alert("방명록이 정상적으로 삭제되었습니다.");
      } else {
        alert(data.error || "비밀번호가 일치하지 않습니다.");
      }
    } catch (e) {
      console.error("Failed to delete guestbook:", e);
      alert("삭제 중 오류가 발생했습니다.");
    }
  }

  // Global delegate handler for delete button
  window.handleDeleteGuestbook = function(id) {
    deleteGuestbookEntry(id);
  };

  function renderGuestbook() {
    if (!gbList) return;
    gbList.innerHTML = "";

    if (gbCountText) {
      gbCountText.innerText = `${guestbookEntries.length} Messages`;
    }

    if (guestbookEntries.length === 0) {
      gbList.innerHTML = '<div class="empty-gb-msg">아직 작성된 방명록이 없습니다. 첫 번째 메시지를 남겨보세요! ✨</div>';
      return;
    }

    guestbookEntries.forEach(entry => {
      const card = document.createElement("div");
      card.className = "gb-card";
      
      const initial = (entry.nickname || "?").substring(0, 1).toUpperCase();

      card.innerHTML = `
        <div class="gb-avatar">${initial}</div>
        <div class="gb-content">
          <div class="gb-header">
            <div class="gb-name-box">
              <span class="gb-name">${entry.nickname}</span>
              <span class="gb-time">${entry.date}</span>
            </div>
            <button class="gb-delete-btn" onclick="window.handleDeleteGuestbook(${entry.id})">삭제</button>
          </div>
          <p class="gb-text">${entry.message}</p>
        </div>
      `;
      gbList.appendChild(card);
    });
  }

  if (gbForm) {
    gbForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const nickname = gbNickname.value.trim();
      const password = gbPassword.value.trim();
      const message = gbMessage.value.trim();

      if (!nickname || !password || !message) return;

      const success = await addGuestbook(nickname, password, message);
      if (success) {
        gbMessage.value = "";
        gbPassword.value = "";
      } else {
        alert("방명록 등록 중 오류가 발생했습니다.");
      }
    });
  }

  // Initial fetch from Server API
  fetchGuestbook();
});
