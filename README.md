# ddoystory

또이다은 스튜디오(ddoystory)의 홈페이지입니다. GitHub Pages로 ddoystory.com 에 올라갑니다.

## 폴더 구조

| 경로 | 내용 |
|---|---|
| `/` (`index.html`) | 스튜디오 홈: 소개, 만든 것들(작품 카드), 문의 |
| `/<작품>/` | 작품 소개 페이지 (예: `/tokitoki/` 톡톡 동화극장) |
| `/<작품>/support/` | 고객 지원: 자주 묻는 질문과 문의 (App Store 지원 URL) |
| `/<작품>/privacy/` | 개인정보 처리방침 (App Store 처리방침 URL) |
| `/assets/` | 그림, 아이콘, 로고. `paper.css` 는 네 페이지가 함께 쓰는 규칙(색 토큰, 종이 결, 꼬리 글자·금색 선 머리, 종이 카드, 구멍, 단추, 언덕 바닥글) |
| `/assets/paper/` | 종이 결 타일(`grain.webp`)과 오린 종이 층: 홈(`moon`·`pine`·`magpie`·`hills`·`tag`·`card`), 톡톡 동화극장(`sun`·`toki-hills`·`rabbit`·`turtle`·`persimmon`·`field`) |

## 새 작품 추가 순서

1. `/<작품>/index.html` 을 만듭니다. `tokitoki/index.html` 을 복사해 글과 그림을 바꾸면 됩니다.
2. `/<작품>/support/index.html`, `/<작품>/privacy/index.html` 을 만듭니다.
3. 그림은 `assets/` 에 넣고, 작품 페이지에서는 `../assets/` 로 부릅니다.
4. 루트 `index.html` 의 `article.card` 하나를 복사해 붙이고 세로 꼬리 글자 번호(`No. 02`), 링크, 그림, 글을 바꿉니다.
5. 루트 바닥글의 지원·처리방침 링크 목록에 새 작품을 더합니다.
6. App Store 주소는 각 페이지 맨 아래 스크립트의 `APP_STORE_URL` 이나 단추의 `href` 에 넣습니다.

## 디자인 규칙

- 바탕은 아주 연한 크림이 도는 흰 종이(`#FCFAF5`) 한 장입니다. 그 위에 오린 종이 조각(달, 솔가지, 언덕, 꼬리표, 카드)만 얹고, 글자는 띠나 밑장 없이 바탕에 바로 놓습니다. 남색은 쓰지 않습니다.
- 머리는 `ddoystory` ─ 금색 가는 선(1px, `#D9A94E`) ─ 작은 꼬리 글자(`iPhone · iPad`, `KO / EN`)입니다. 꼬리 글자는 Nunito 300~400 대문자, 자간 0.2~0.3em이고, 카드 가장자리에서는 세로로 돌립니다.
- 작품 카드는 흰 종이 + 크래프트 밑장(`assets/paper/card.webp`)을 `border-image` 9조각으로 써서 크기가 달라도 찌그러지지 않습니다. 창 안에는 앱의 진짜 동화 장면을 넣습니다.
- 맨 아래는 언덕 띠 그림 + 짙은 솔잎 앞 땅 한 장(물결 모양 마스크)이고, 메일 주소는 종이 꼬리표 위에 얹습니다.
- 종이 층 그림은 마젠타 배경으로 그린 뒤 오려 내고(가장자리 마젠타 빼기·1px 침식), 2배 화면 폭의 webp로 둡니다. 이미지 합계는 2.5MB 안쪽으로 둡니다.
- 그림자는 위쪽 빛에서 떨어지는 웜 다크(`#2E241C`)만 씁니다. 다크 모드(사람이 켰을 때만)는 짙은 갈색 종이(`#2B241D`)이고 종이 조각 그림은 그대로 둡니다.
- 글꼴은 제목 Jua(영어 Fredoka), 본문 Noto Sans KR(영어 Nunito)입니다. Jua는 굵기가 하나뿐이라 `font-synthesis:none`으로 가짜 굵게를 막습니다.
- 글꼴은 `display=block`으로 받고, 첫 화면은 글꼴이 준비된 뒤에 보입니다. Jua는 제목에 쓰는 한글만 담은 작은 파일(`text=`)로 받습니다. 제목 글자를 바꾸거나 새 페이지를 더하면 네 페이지의 h1~h4 한글을 모아 Jua 링크의 `text=`를 다시 만듭니다(빠진 글자는 다른 고딕으로 나옵니다).
- 감빛 App Store 단추(두 장 겹침)는 한 화면에 하나만 둡니다.
- 움직임은 `assets/motion.js`가 맡습니다. 첫 화면 그림 상자의 `data-art`(`home`·`toki`·`doc`)로 연출을 고르고, 카드·쪽지는 `data-piece`를 붙이면 스크롤할 때 한 장씩 놓입니다. 2D 이동, ±3도 이내 회전, 투명도만 쓰고, 움직임 줄이기를 켜거나 스크립트가 꺼지면 모두 그대로 보입니다.

## 외부 코드

- GSAP 3.15.1 (`gsap.min.js`, `ScrollTrigger.min.js`): npm `gsap@3.15.1`의 dist 파일을 그대로 `assets/vendor/gsap/`에 둡니다. GreenSock Standard 'no charge' License, https://gsap.com/standard-license
