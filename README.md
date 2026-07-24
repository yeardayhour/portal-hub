# ⚡ Portal Hub (`portal-hub`)

Oracle Cloud Infrastructure(OCI) 인프라 서비스와 Pokémantle, Champdle, FastAPI 등 개인 프로젝트 및 마이크로서비스를 한눈에 모아서 이동할 수 있는 독립 웹 포털 프로젝트입니다.

---

## 🌟 주요 특징

1. **독립된 모던 포털 리포지토리**: Pokemantle & Champdle 프로젝트와 완전히 분리된 전용 허브 웹사이트.
2. **단일 OCI IP 연동**: OCI 서버 IP (`129.225.197.60`)를 바탕으로 각 서비스 포트(`:3000`, `:3100`, `:8002` 등)로 원클릭 이동.
3. **유연한 서비스 확장성**: `config.js` 수정만으로 새로운 도커 컨테이너나 웹 애플리케이션 카드를 즉시 추가 가능.
4. **감각적인 모던 디자인**: Glassmorphism, 다크 모드, 네온 아우라 백그라운드 및 반응형 카드 UI 적용.

---

## 🚀 빠른 시작

### 1. 로컬에서 열기
`index.html` 파일을 웹 브라우저(Chrome, Edge 등)로 열어 바로 확인하실 수 있습니다.

### 2. OCI 서버에 배포하기 (Nginx / Docker)
OCI 서버(`129.225.197.60`)의 80번 포트에 이 `portal-hub` 프로젝트를 배포하면 메인 관문 웹사이트로 작동합니다.

```bash
# Nginx 예시: /var/www/html/portal 복사 또는 도커 컨테이너 실행
git clone <your-repo-url> portal-hub
```

---

## 🛠 서비스 구성 (`config.js`)

| 서비스 | 아이콘 | 기본 포트 | 설명 |
|---|---|---|---|
| **OCI Main Server** | 🌐 | `:80` | OCI 인프라 메인 웹 서버 |
| **Champdle Game** | ⚔️ | `:3100` | Champdle (오늘의 롤 챔피언 맞추기) |
| **Pokémantle Game** | 🎮 | `:3000` | Pokémantle (날짜/퍼즐 오버라이드 지원) |
| **FastAPI Playground** | ⚡ | `:8002` | FastAPI 백엔드 연습 API |
