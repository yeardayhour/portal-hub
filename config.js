/**
 * Hub Portal Service Configuration
 * OCI IP 및 포트/서브패스 서비스 링크 설정
 */
const PORTAL_CONFIG = {
  defaultOciIp: "129.225.197.60",
  title: "yeardayhour.hub",
  subtitle: "Your ultimate playground on Oracle Cloud",

  services: [
    {
      id: "oci-main",
      title: "OCI Main Server",
      category: "Infrastructure",
      icon: "🌐",
      description: "Oracle Cloud 인프라 메인 웹 서버 및 관리 도구",
      port: 80,
      protocol: "http",
      badge: "Active",
      badgeColor: "cyan",
      tags: ["OCI", "Cloud", "Ubuntu"]
    },
    {
      id: "champdle",
      title: "Champdle Game",
      category: "Web App",
      icon: "⚔️",
      description: "오늘의 롤(LoL) 챔피언 맞추기 추리 게임",
      path: "/champdle/",
      protocol: "http",
      badge: "Game",
      badgeColor: "purple",
      tags: ["Nuxt.js", "FastAPI", "LoL"]
    },
    {
      id: "pokemantle",
      title: "Pokémantle Game",
      category: "Web App",
      icon: "🎮",
      description: "오늘의 포켓몬 맞추기 추리 게임 (Date/Puzzle 오버라이드 지원)",
      path: "/pokemantle/",
      protocol: "http",
      badge: "Game",
      badgeColor: "purple",
      tags: ["Nuxt.js", "FastAPI", "Vue3"]
    },
    {
      id: "fastapi-lab",
      title: "FastAPI Lab",
      category: "Backend API",
      icon: "⚡",
      description: "FastAPI 비동기 백엔드 연습 및 API 서버 (80번 포트 Nginx 우회 연동)",
      path: "/fastapi/",
      protocol: "http",
      badge: "Dev API",
      badgeColor: "emerald",
      tags: ["Python", "FastAPI", "Uvicorn"]
    },
    {
      id: "strike",
      title: "Strike Game",
      category: "Web App",
      icon: "🎲",
      description: "주사위와 운으로 승부하는 짜릿한 스트라이크 보드게임 웹 이식판",
      path: "/strike/",
      protocol: "http",
      badge: "Game",
      badgeColor: "amber",
      tags: ["Vue3", "Vite", "BoardGame"]
    },
    {
      id: "onecard",
      title: "One Card Online",
      category: "Web App",
      icon: "🃏",
      description: "실시간 멀티플레이어 원카드 게임! 친구들과 방을 파서 대결해보세요.",
      path: "/onecard/",
      protocol: "http",
      badge: "New Game",
      badgeColor: "red",
      tags: ["Vue3", "Socket.IO", "Multiplayer"]
    },
    {
      id: "lolsearch",
      title: "LoLSearch",
      category: "Web App",
      icon: "🔍",
      description: "리그오브레전드 프리미엄 소환사 전적검색 서비스",
      path: "/lolsearch/",
      protocol: "http",
      badge: "Search",
      badgeColor: "cyan",
      tags: ["Express", "Riot API", "LoL"]
    }
  ]
};

if (typeof window !== "undefined") {
  window.PORTAL_CONFIG = PORTAL_CONFIG;
}
