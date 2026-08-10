document.addEventListener("DOMContentLoaded", () => {
  const config = window.PORTAL_CONFIG || { services: [] };
  const cardsGrid = document.getElementById("cards-grid");
  
  // Host Detection
  let currentHost = window.location.hostname;
  const isFileProtocol = window.location.protocol === "file:";
  if (!currentHost || currentHost === "" || currentHost === "null" || isFileProtocol) {
    currentHost = "localhost";
  }
  const currentHostDisplay = document.getElementById("current-host-display");
  if (currentHostDisplay) {
    currentHostDisplay.innerText = `Host: ${currentHost}`;
  }

  // Clock Widget
  function updateClock() {
    const now = new Date();
    document.getElementById("clock-time").innerText = now.toLocaleTimeString('en-US', { hour12: false });
    document.getElementById("clock-date").innerText = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }
  setInterval(updateClock, 1000);
  updateClock();

  // Terminal Widget
  const terminalLogs = [
    "Checking Docker container health...",
    "Champdle container: OK",
    "Pokemantle container: OK",
    "FastAPI Lab: Active",
    "Routing traffic through NGINX proxy...",
    "yeardayhour.duckdns.org is secure.",
    "Loading One Card multiplayer sockets...",
    "Ready for new connections."
  ];
  const termBody = document.getElementById("terminal-body");
  let logIdx = 0;
  setInterval(() => {
    if (logIdx < terminalLogs.length) {
      const line = document.createElement("div");
      line.className = "term-line";
      line.innerText = terminalLogs[logIdx];
      termBody.appendChild(line);
      termBody.scrollTop = termBody.scrollHeight;
      logIdx++;
    } else {
      logIdx = 0;
      termBody.innerHTML = '<div class="term-line">Log rotated.</div>';
    }
  }, 3500);

  // Render Cards
  if (cardsGrid) {
    config.services.forEach((service, index) => {
      let fullUrl = "#";
      let displayUrl = "";

      if (service.path && !isFileProtocol && currentHost !== "localhost") {
        fullUrl = `${window.location.protocol}//${currentHost}${service.path}`;
        displayUrl = `${currentHost}${service.path}`;
      } else {
        fullUrl = service.port ? `${service.protocol}://${currentHost}:${service.port}` : `${service.protocol}://${currentHost}`;
        displayUrl = service.port ? `${currentHost}:${service.port}` : `${currentHost}`;
      }

      const card = document.createElement("a");
      card.className = `service-card bento-item ${service.disabled ? "disabled" : ""}`;
      card.style.animationDelay = `${index * 0.15}s`;
      
      if (!service.disabled) {
        card.href = fullUrl;
        card.target = "_blank";
        card.rel = "noopener noreferrer";
      }

      card.innerHTML = `
        <div>
          <div class="card-header">
            <div class="card-icon">${service.icon || "💻"}</div>
            <span class="card-badge badge-${service.badgeColor || "cyan"}">${service.badge || "Service"}</span>
          </div>
          <h2 class="card-title">${service.title}</h2>
          <p class="card-desc">${service.description}</p>
          <div class="card-tags">
            ${(service.tags || []).map(t => `<span class="tag">#${t}</span>`).join('')}
          </div>
        </div>
        <div class="card-footer">
          <span class="service-url">${service.disabled ? 'Coming soon...' : displayUrl}</span>
          <i class="ph-bold ph-arrow-right arrow-icon"></i>
        </div>
      `;
      cardsGrid.appendChild(card);
    });
  }
});
