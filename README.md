# ddoystory

또이다은 스튜디오(ddoystory)의 홈페이지입니다. GitHub Pages로 ddoystory.com 에 올라갑니다.

## 폴더 구조

| 경로 | 내용 |
|---|---|
| `/` (`index.html`) | 스튜디오 홈: 소개, 만든 것들(작품 카드), 문의 |
| `/<작품>/` | 작품 소개 페이지 (예: `/tokitoki/` 톡톡 동화극장) |
| `/<작품>/support/` | 고객 지원: 자주 묻는 질문과 문의 (App Store 지원 URL) |
| `/<작품>/privacy/` | 개인정보 처리방침 (App Store 처리방침 URL) |
| `/assets/` | 그림, 아이콘, 로고. `paper.css` 는 네 페이지가 함께 쓰는 종이 규칙(색지 토큰, 종이 결, 오린 가장자리, 구멍, 단추, 머리글·바닥글) |
| `/assets/layers/` | 첫머리 구멍 안에 겹치는 투명 그림 층(앱 그림에서 가져옴) |

## 새 작품 추가 순서

1. `/<작품>/index.html` 을 만듭니다. `tokitoki/index.html` 을 복사해 글과 그림을 바꾸면 됩니다.
2. `/<작품>/support/index.html`, `/<작품>/privacy/index.html` 을 만듭니다.
3. 그림은 `assets/` 에 넣고, 작품 페이지에서는 `../assets/` 로 부릅니다.
4. 루트 `index.html` 의 `ul.grid` 안에서 `li.work` 하나를 복사해 붙이고 링크, 그림, 글, `--under`(밑장 색지 색)를 바꿉니다. 대표 작품 하나만 `class="work wide piece stack liftable"` 로 둡니다.
5. 루트 바닥글의 지원·처리방침 링크 목록에 새 작품을 더합니다.
6. App Store 주소는 각 페이지 맨 아래 스크립트의 `APP_STORE_URL` 이나 단추의 `href` 에 넣습니다.

## 디자인 규칙

- 모든 면은 색지 한 장입니다. 조각 하나는 한 색이고 그라데이션, 광택, 윤곽선을 쓰지 않습니다. 그림자는 위쪽 빛에서 떨어지는 웜 다크(`#2E241C`)만 씁니다.
- 글꼴은 제목 Jua(영어 Fredoka), 본문 Noto Sans KR(영어 Nunito)입니다. Jua는 굵기가 하나뿐이라 제목은 굵기 400으로 둡니다.
- 감빛 App Store 단추는 한 화면에 하나만 둡니다.
- 움직임은 `assets/motion.js`가 맡습니다. 2D 이동, ±3도 이내 회전, 투명도, 그림자 변화만 쓰고, 움직임 줄이기를 켜면 모두 끕니다.

## 외부 코드

- GSAP 3.15.1 (`gsap.min.js`, `ScrollTrigger.min.js`): npm `gsap@3.15.1`의 dist 파일을 그대로 `assets/vendor/gsap/`에 둡니다. GreenSock Standard 'no charge' License, https://gsap.com/standard-license
