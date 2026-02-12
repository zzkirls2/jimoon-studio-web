# jimoon-studio-web

프리미엄 문학 출판사 **지문(JIMOON)**의 공식 웹사이트 겸 온라인 서점.
책 소개, 연재 콘텐츠, 장바구니/결제까지 포함하는 풀스택 이커머스 플랫폼이다.

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) · React 19 · TypeScript |
| 스타일링 | Tailwind CSS v4 (PostCSS) |
| 애니메이션 | GSAP 3 + ScrollTrigger · Lenis (smooth scroll) |
| 상태 관리 | Zustand (장바구니, localStorage persist) |
| 인증 | Supabase Auth (이메일 + Google OAuth, SSR 쿠키 세션) |
| 데이터베이스 | Supabase (PostgreSQL) |
| 결제 | PortOne v2 SDK (데모 모드 지원) |
| 콘텐츠 렌더링 | react-markdown |

---

## 디렉터리 구조

```
src/
├── app/
│   ├── layout.tsx              # 루트 레이아웃 (SmoothScrollProvider)
│   ├── globals.css             # 전역 CSS 변수 + Tailwind
│   │
│   ├── (main)/                 # 공개 페이지 (Header + Footer)
│   │   ├── page.tsx            # 홈 (히어로만 사용 중)
│   │   ├── books/
│   │   │   ├── page.tsx        # 도서 목록 (카테고리 필터)
│   │   │   └── [id]/page.tsx   # 도서 상세
│   │   ├── serial/
│   │   │   ├── page.tsx        # 연재 목록
│   │   │   └── [id]/page.tsx   # 연재 상세
│   │   └── contact/page.tsx    # 문의 [네비게이션 미연결]
│   │
│   ├── (auth)/                 # 인증 페이지 (브랜드 스플릿 레이아웃)
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   │
│   ├── (store)/                # 이커머스 (로그인 필수)
│   │   ├── cart/page.tsx       # 장바구니
│   │   └── checkout/
│   │       ├── page.tsx        # 결제 [데모 모드]
│   │       └── complete/page.tsx # 주문 완료
│   │
│   └── api/
│       ├── auth/callback/      # OAuth 콜백
│       └── payment/
│           ├── confirm/        # 결제 검증 [데모 모드 - 항상 성공 반환]
│           └── webhook/        # PortOne 웹훅 [스텁 - 로그만 출력]
│
├── components/
│   ├── layout/                 # Header, Footer
│   ├── home/
│   │   ├── HeroSection.tsx     # 홈 히어로 배너 [사용 중]
│   │   ├── FeaturedBooks.tsx   # 추천 도서 3D 캐러셀 [미사용 - 하드코딩 데이터]
│   │   ├── PhilosophySection.tsx # 브랜드 철학 섹션 [미사용]
│   │   └── CTASection.tsx      # CTA 섹션 [미사용]
│   ├── animations/
│   │   ├── FadeIn.tsx          # 스크롤 페이드인 [사용 중]
│   │   ├── ParallaxImage.tsx   # 패럴랙스 이미지 [미사용]
│   │   └── TextSplit.tsx       # 텍스트 분할 애니메이션 [미사용]
│   ├── BooksContent.tsx        # 도서 목록 클라이언트 컴포넌트
│   ├── BookDetailContent.tsx   # 도서 상세 클라이언트 컴포넌트
│   ├── BookImageCarousel.tsx   # 표지 3D 플립 캐러셀
│   ├── SerialListContent.tsx   # 연재 목록
│   └── SerialDetailContent.tsx # 연재 상세
│
├── hooks/
│   ├── useAuth.ts              # 인증 훅 (로그인/회원가입/OAuth/로그아웃)
│   └── useScrollAnimation.ts   # 스크롤 애니메이션 유틸 [미사용]
│
├── lib/
│   ├── supabase/               # client.ts · server.ts · middleware.ts
│   ├── books/                  # data.ts (SSR 데이터 페칭) · constants.ts (카테고리, 가격 포맷)
│   ├── serial/                 # data.ts (연재 데이터 페칭)
│   ├── gsap/                   # register.ts (GSAP + ScrollTrigger 등록)
│   └── portone/                # payment.ts (결제 래퍼)
│
├── providers/
│   └── SmoothScrollProvider.tsx # Lenis + GSAP ScrollTrigger 연동
│
├── stores/
│   └── cart.ts                 # Zustand 장바구니 스토어
│
└── types/
    ├── book.ts                 # Book 인터페이스 (in_stock 필드 미사용)
    ├── serial.ts               # SerialPost 인터페이스
    ├── user.ts                 # UserProfile 인터페이스 (avatar_url 필드 미사용)
    └── payment.ts              # Order, OrderItem 인터페이스 [전체 미사용]
```

---

## 라우팅 & 접근 제어

| 경로 | 그룹 | 인증 | 설명 |
|------|------|------|------|
| `/` | main | 불필요 | 홈 (히어로 배너) |
| `/books` | main | 불필요 | 도서 목록 |
| `/books/[id]` | main | 불필요 | 도서 상세 |
| `/serial` | main | 불필요 | 연재 목록 |
| `/serial/[id]` | main | 불필요 | 연재 상세 |
| `/contact` | main | 불필요 | 문의 **(네비게이션 미연결, URL 직접 접근만 가능)** |
| `/login` | auth | 비로그인만 | 로그인 |
| `/signup` | auth | 비로그인만 | 회원가입 |
| `/cart` | store | **필수** | 장바구니 |
| `/checkout` | store | **필수** | 결제 |
| `/checkout/complete` | store | **필수** | 주문 완료 |

미들웨어(`middleware.ts`)가 `/cart`, `/checkout` 접근 시 세션을 검사하고, 미인증 사용자는 `/login?redirectTo=...`로 리다이렉트한다. 로그인 상태에서 `/login`, `/signup` 접근 시 `/`로 리다이렉트한다.

---

## 데이터 흐름

### Supabase 테이블

- **books** — 도서 카탈로그 (제목, 저자, 가격, 이미지, ISBN, 카테고리, 외부 서점 링크 등)
- **serial_posts** — 연재 게시물 (제목, 본문(Markdown), 시리즈 정보, 썸네일 등)

### 데이터 페칭 함수

```
lib/books/data.ts
  getBooks()                    → 전체 도서 (발행일 내림차순)
  getBookById(id)               → 단일 도서
  getBooksByCategory(category)  → 카테고리별 도서

lib/serial/data.ts
  getSerialPosts()              → 전체 연재 (발행일 내림차순)
  getSerialPostById(id)         → 단일 연재
  getSeriesPosts(seriesName)    → 시리즈별 연재
  getAdjacentPosts(publishedAt) → 이전/다음 글 네비게이션
```

모든 데이터 페칭은 **서버 컴포넌트**에서 수행하고, 결과를 클라이언트 컴포넌트에 props로 전달한다.

### 상태 관리 (3계층)

1. **서버 상태** — Supabase에서 서버 컴포넌트가 직접 조회
2. **클라이언트 상태** — Zustand 장바구니 스토어 (`stores/cart.ts`, localStorage 키: `publisher-cart`)
3. **세션 상태** — Supabase Auth + 미들웨어 (쿠키 기반 SSR 세션)

---

## 디자인 시스템

### 컬러 팔레트

| 용도 | 값 | CSS 변수 |
|------|-----|---------|
| 배경 | `#fef9f3` (크림) | `--background` |
| 텍스트 | `#111111` (블랙) | `--foreground` |
| 강조 | `#b5737a` (모브/더스티 로즈) | `--accent` |
| 보조 | `#5d6a7a` (슬레이트 블루) | `--muted` |
| 테두리 | `#e8c4b8` (라이트 탠) | `--border` |

### 타이포그래피

- 기본 폰트: Geist Sans (light/extralight 위주의 세련된 톤)
- 모노스페이스: Geist Mono

### 애니메이션 패턴

- **Lenis** — 앱 전체 부드러운 관성 스크롤 (duration 1.2s)
- **Header blur** — `scrollY > 50`에서 배경 블러 전환 (GSAP, 0.4s)
- **도서 그리드 stagger** — 카테고리 변경 시 GSAP fromTo (opacity 0→1, Y 40→0)
- **FadeIn** — ScrollTrigger 기반 방향별 페이드인 (상/하/좌/우)
- **표지 3D 플립** — CSS perspective + rotateY (700ms transition)

---

## 환경 변수

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# PortOne 결제
NEXT_PUBLIC_PORTONE_STORE_ID=
NEXT_PUBLIC_PORTONE_CHANNEL_KEY=

# 사이트
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

환경 변수 없이도 데모 모드로 실행 가능하다.

---

## 개발 명령어

```bash
npm install          # 의존성 설치
npm run dev          # 개발 서버 (http://localhost:3000)
npm run build        # 프로덕션 빌드
npm run start        # 프로덕션 서버
npm run lint         # ESLint 검사
```

---

## 핵심 비즈니스 흐름

1. **탐색** — 홈 히어로 → 도서 목록 (카테고리 필터) → 도서 상세 (메타데이터, 표지 캐러셀, 외부 서점 링크)
2. **연재** — 연재 목록 (검색, 페이지네이션) → 연재 상세 (Markdown 본문, 이전/다음 네비게이션)
3. **구매** — 장바구니 담기 → 로그인 → 배송 정보 입력 → PortOne 결제 → 주문 완료
4. **외부 서점** — 교보문고, 알라딘, YES24, 영풍문고 링크 제공

---

## 비활성/미완성 기능 현황

아래 기능들은 코드가 작성되어 있으나 현재 비활성 상태이다. 활성화하거나 완성할 때 참고할 것.

### 결제 시스템 (데모 모드)

사업자 등록 전까지 PortOne 실결제가 비활성화되어 있다.

| 파일 | 현재 상태 | 활성화 시 필요 작업 |
|------|-----------|---------------------|
| `app/(store)/checkout/page.tsx` | `simulateDemoPayment()`으로 2초 딜레이 후 완료 처리 | 실제 `requestPayment()` 호출로 교체 |
| `api/payment/confirm/route.ts` | 항상 성공 반환 (`"demo mode"`) | 주석 해제하여 PortOne API로 결제 검증 |
| `api/payment/webhook/route.ts` | 이벤트 로그만 출력 | 주석 해제하여 Supabase orders 테이블 업데이트 |

### Header 인증 UI (숨김)

`components/layout/Header.tsx`에서 데스크톱/모바일 모두 인증 관련 UI(로그인/회원가입 버튼)가 `{/* Auth - hidden for now */}` 주석으로 숨겨져 있다. 현재는 `/login`으로 직접 URL 접근해야만 로그인할 수 있다.

### 미사용 홈 섹션 컴포넌트

홈 페이지는 현재 `HeroSection`만 렌더링한다. 아래 3개 컴포넌트는 구현 완료되었으나 어디에서도 import되지 않는다.

| 컴포넌트 | 설명 | 비고 |
|----------|------|------|
| `FeaturedBooks.tsx` | 추천 도서 3D 애니메이션 캐러셀 | 하드코딩된 예시 데이터 사용 (DB 연동 필요) |
| `PhilosophySection.tsx` | 브랜드 철학 다크 섹션 + 패럴랙스 숫자 애니메이션 | 정적 콘텐츠 |
| `CTASection.tsx` | 도서 컬렉션으로 유도하는 CTA 섹션 | TextSplit 애니메이션 사용 |

### 미사용 애니메이션 컴포넌트

| 컴포넌트 | 설명 |
|----------|------|
| `ParallaxImage.tsx` | GSAP 기반 패럴랙스 스크롤 이미지 |
| `TextSplit.tsx` | 텍스트 분할 등장 애니메이션 |

### 미사용 훅

| 훅 | 설명 |
|----|------|
| `useScrollAnimation.ts` | 커스텀 ScrollTrigger 타임라인 훅 (트리거 옵션 커스터마이징 가능) |

### 미사용 타입/필드

| 위치 | 항목 | 설명 |
|------|------|------|
| `types/payment.ts` | `Order`, `OrderItem` 인터페이스 전체 | 주문 관리 시스템 타입이 정의되어 있으나 어디에서도 사용되지 않음 |
| `types/book.ts` | `in_stock` 필드 | 재고 여부 필드가 정의되어 있으나 UI에서 체크/표시하지 않음 |
| `types/user.ts` | `avatar_url` 필드 | 아바타 URL 필드가 정의되어 있으나 어디에서도 렌더링하지 않음 |

### 네비게이션 미연결 페이지

| 경로 | 설명 |
|------|------|
| `/contact` | 문의 페이지 (이메일 링크). Header/Footer 어디에도 링크되어 있지 않아 URL 직접 입력으로만 접근 가능 |

### Supabase 폴백

`lib/supabase/client.ts`에서 환경 변수가 없을 경우 더미 클라이언트를 생성한다. 실제 배포 시 반드시 환경 변수를 설정해야 한다.

---

## 작업 시 참고사항

- **서버/클라이언트 분리**: 페이지 파일(`page.tsx`)은 서버 컴포넌트로 데이터를 페칭하고, `*Content.tsx` 클라이언트 컴포넌트에 props로 전달하는 패턴을 따른다.
- **절대 경로 임포트**: `@/*`로 `src/` 디렉터리를 참조한다 (예: `@/components/...`).
- **이미지**: 도서 표지는 `public/books/`에 저장하고 Next.js `Image` 컴포넌트로 렌더링한다.
- **애니메이션 등록**: GSAP 사용 시 `lib/gsap/register.ts`에서 플러그인을 먼저 등록해야 한다.
- **장바구니**: Zustand 스토어(`stores/cart.ts`)를 사용하며, `publisher-cart` 키로 localStorage에 자동 저장된다.
- **결제**: PortOne SDK를 dynamic import로 로드하며, 환경 변수 미설정 시 데모 모드(alert)로 동작한다.
