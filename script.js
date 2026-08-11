document.addEventListener("DOMContentLoaded", () => {
  const config = window.PORTAL_CONFIG || { services: [] };
  const cardsGrid = document.getElementById("cards-grid");
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

  // Render Minimal Cards
  if (cardsGrid) {
    cardsGrid.innerHTML = "";
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

      const card = document.createElement("a");
      card.className = `service-card ${service.disabled ? "disabled" : ""}`;
      
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
