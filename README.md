# Publisher — Premium Literary Works

**Publisher**는 출판사를 위한 고성능 비즈니스 웹사이트입니다.
삼성전자 뉴스룸 수준 이상의 부드러운 스크롤 경험과 미학적으로 완성도 높은 UI를 목표로 설계되었습니다.
회원 인증, 도서 카탈로그, 장바구니, 결제까지 이커머스의 전체 흐름을 포함합니다.

---

## Tech Stack

| 영역 | 기술 |
|---|---|
| **Framework** | Next.js 16 (App Router, TypeScript) |
| **Styling** | Tailwind CSS v4 |
| **Smooth Scroll** | Lenis — 관성 스크롤, GSAP ticker 동기화 |
| **Animation** | GSAP + ScrollTrigger — GPU 가속 (`transform`, `opacity`만 사용) |
| **State** | Zustand (장바구니 persist) |
| **Auth** | Supabase Auth (`@supabase/ssr`) — Email/Password + OAuth (Google, GitHub) |
| **Database** | Supabase (PostgreSQL) |
| **Payment** | PortOne v2 SDK — 동적 import, 서버 검증 |
| **Linting** | ESLint 9 + eslint-config-next |

---

## Features

### Scroll & Animation
- **Lenis 전역 관성 스크롤** — 60fps 이상 유지, GSAP ticker와 프레임 동기화
- **TextSplit** — 스크롤 진입 시 글자 단위로 쪼개지며 등장하는 타이포그래피 애니메이션
- **ParallaxImage** — 도서 이미지가 입체적으로 움직이는 패럴랙스 효과 (Next/Image + blur placeholder)
- **FadeIn** — 방향별(up/down/left/right) 스크롤 트리거 페이드인
- **Header 블러 전환** — 스크롤 위치에 따라 투명 → 반투명 블러 배경 GSAP 전환

### Authentication
- 이메일/비밀번호 회원가입 및 로그인
- Google / GitHub OAuth 소셜 로그인
- Supabase SSR 미들웨어 기반 세션 관리 (쿠키 자동 갱신)
- 보호 라우트 — 미인증 시 `/login?redirectTo=...`로 리다이렉트
- 로그인 상태에서 auth 페이지 접근 시 홈으로 리다이렉트

### Book Store
- 6종 도서 카탈로그 (Literary Fiction, Poetry, Essays, Short Stories, Philosophy)
- 카테고리 필터 — 전환 시 GSAP stagger 애니메이션
- 도서 상세 페이지 — 커버, 설명, 메타정보(페이지/ISBN/출판일), 재고 상태
- 3D 호버 효과 — 도서 커버 입체 회전 + 그림자

### Cart & Checkout
- Zustand + localStorage persist 장바구니
- 수량 조절(+/-), 개별 삭제, 전체 비우기
- 소계 / 배송비(무료) / 합계 실시간 계산
- Header 카트 배지 — 실시간 아이템 수 표시

### Payment (PortOne v2)
- PortOne SDK 동적 import — 미설치 시 데모 모드로 자동 전환
- 결제 완료 후 서버 API(`/api/payment/confirm`)에서 검증
- 웹훅 엔드포인트(`/api/payment/webhook`) — 결제/취소 상태 수신
- 결제 완료 화면 (`/checkout/complete`)

### Performance
- `Next/Image` — `priority`, `placeholder="blur"`로 LCP 최적화
- 모든 애니메이션 GPU 가속 (`transform`, `opacity`) — Jank 없는 60fps
- Route Group별 레이아웃 분리로 코드 스플릿
- PortOne SDK 동적 import로 초기 번들 최소화

---

## Getting Started

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 수정합니다:

```env
# Supabase (https://supabase.com 대시보드에서 확인)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# PortOne (https://admin.portone.io 에서 확인)
NEXT_PUBLIC_PORTONE_STORE_ID=your-store-id
NEXT_PUBLIC_PORTONE_CHANNEL_KEY=your-channel-key

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> 환경 변수 없이도 실행 가능합니다. 인증은 비활성 상태로, 결제는 데모 모드로 동작합니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다.

### 4. 프로덕션 빌드

```bash
npm run build
npm start
```

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                        # 루트 레이아웃 (SmoothScrollProvider)
│   ├── globals.css                       # Lenis + Tailwind 전역 스타일
│   ├── (main)/                           # 공개 페이지 (Header + Footer)
│   │   ├── page.tsx                      #   홈
│   │   ├── books/page.tsx                #   도서 카탈로그
│   │   ├── books/[id]/page.tsx           #   도서 상세
│   │   ├── about/page.tsx                #   소개
│   │   └── contact/page.tsx              #   문의
│   ├── (auth)/                           # 인증 (브랜드 패널 + 폼 레이아웃)
│   │   ├── login/page.tsx                #   로그인
│   │   └── signup/page.tsx               #   회원가입
│   ├── (store)/                          # 스토어 (Header + Footer)
│   │   ├── cart/page.tsx                 #   장바구니
│   │   ├── checkout/page.tsx             #   결제
│   │   └── checkout/complete/page.tsx    #   결제 완료
│   └── api/
│       ├── auth/callback/route.ts        #   OAuth 콜백
│       └── payment/
│           ├── confirm/route.ts          #   결제 확인
│           └── webhook/route.ts          #   PortOne 웹훅
├── components/
│   ├── animations/                       # TextSplit, ParallaxImage, FadeIn
│   ├── home/                             # HeroSection, FeaturedBooks, ...
│   └── layout/                           # Header, Footer
├── providers/
│   └── SmoothScrollProvider.tsx          # Lenis + GSAP ScrollTrigger 동기화
├── stores/
│   └── cart.ts                           # Zustand 장바구니 (localStorage persist)
├── hooks/
│   ├── useAuth.ts                        # Supabase 인증 훅
│   └── useScrollAnimation.ts             # 범용 스크롤 애니메이션 훅
├── lib/
│   ├── supabase/                         # client, server, middleware
│   ├── portone/payment.ts                # PortOne v2 결제 모듈
│   ├── gsap/register.ts                  # GSAP + ScrollTrigger 등록
│   └── books/data.ts                     # 도서 데이터 (데모)
├── types/                                # Book, User, Payment, PortOne 타입
└── constants/index.ts                    # 사이트·애니메이션 상수
```

---

## Routes

| Route | 설명 |
|---|---|
| `/` | 홈페이지 — Hero, Featured Books, Philosophy, CTA |
| `/books` | 도서 카탈로그 — 카테고리 필터 |
| `/books/[id]` | 도서 상세 — 커버, 정보, Add to Cart |
| `/about` | 출판사 소개 |
| `/contact` | 문의 |
| `/login` | 로그인 (Email + OAuth) |
| `/signup` | 회원가입 |
| `/cart` | 장바구니 |
| `/checkout` | 결제 (배송 정보 + PortOne 결제) |
| `/checkout/complete` | 결제 완료 |
| `/api/auth/callback` | OAuth 콜백 |
| `/api/payment/confirm` | 결제 서버 검증 |
| `/api/payment/webhook` | PortOne 웹훅 수신 |

---

## Supabase Setup

Supabase 대시보드에서 다음을 설정합니다:

1. **Authentication > Providers** — Email, Google, GitHub 활성화
2. **Authentication > URL Configuration** — Redirect URL에 `http://localhost:3000/api/auth/callback` 추가
3. **Database** — 필요 시 `books`, `orders` 테이블 생성 (현재는 정적 데이터 사용)

---

## PortOne Setup

1. [PortOne 관리자 콘솔](https://admin.portone.io)에서 Store ID / Channel Key 발급
2. `.env.local`에 입력
3. 선택: `npm install @portone/browser-sdk` 설치 (미설치 시 데모 모드 동작)

---

## Scripts

| 명령어 | 설명 |
|---|---|
| `npm run dev` | 개발 서버 (http://localhost:3000) |
| `npm run build` | 프로덕션 빌드 |
| `npm start` | 프로덕션 서버 |
| `npm run lint` | ESLint 검사 |
