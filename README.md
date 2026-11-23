# ddoystory

또이다은 스튜디오(ddoystory)의 홈페이지입니다. GitHub Pages로 ddoystory.com 에 올라갑니다.

## 폴더 구조

| 경로 | 내용 |
|---|---|
| `/` (`index.html`) | 스튜디오 홈: 소개, 만든 것들(작품 카드), 문의 |
| `/<작품>/` | 작품 소개 페이지 (예: `/tokitoki/` 톡톡 동화극장) |
| `/<작품>/support/` | 고객 지원: 자주 묻는 질문과 문의 (App Store 지원 URL) |
| `/<작품>/privacy/` | 개인정보 처리방침 (App Store 처리방침 URL) |
| `/assets/` | 그림, 아이콘, 로고. `paper.css` 는 네 페이지가 함께 쓰는 종이 규칙(색지 토큰, 종이 결, 구멍, 오린 글자, 단추, 머리글, 땅 바닥글) |
| `/assets/paper/` | 종이 결 타일과 첫머리 아치 구멍 안 층(하늘·해·산·언덕·솔가지·까치), 땅 능선 |
| `/assets/layers/` | 톡톡 동화극장 아치의 앞 층(억새·솔가지, 앱 그림에서 가져옴) |

## 새 작품 추가 순서

1. `/<작품>/index.html` 을 만듭니다. `tokitoki/index.html` 을 복사해 글과 그림을 바꾸면 됩니다.
2. `/<작품>/support/index.html`, `/<작품>/privacy/index.html` 을 만듭니다.
3. 그림은 `assets/` 에 넣고, 작품 페이지에서는 `../assets/` 로 부릅니다.
4. 루트 `index.html` 의 `ul.grid` 안에서 `li.work` 하나를 복사해 붙이고 링크, 그림, 글을 바꿉니다. 대표 작품 하나만 `class="work wide piece"` 로 둡니다.
5. 루트 바닥글의 지원·처리방침 링크 목록에 새 작품을 더합니다.
6. App Store 주소는 각 페이지 맨 아래 스크립트의 `APP_STORE_URL` 이나 단추의 `href` 에 넣습니다.

## 디자인 규칙

- 페이지는 크림 종이 한 장 위의 종이 작품입니다. 모든 면은 색지 한 장이고, 조각 하나는 한 색입니다. 그라데이션, 광택, 윤곽선을 쓰지 않습니다. 그림자는 위쪽 빛에서 떨어지는 웜 다크(`#2E241C`)만 씁니다.
- 색은 크림 바탕, 나무 갈색 오린 제목, 초록·짚색 땅 능선, 크래프트·감빛 조각입니다. 남색은 쓰지 않습니다. 다크 모드는 짙은 갈색 종이와 짙은 솔잎 땅입니다.
- 종이 결은 `assets/paper/grain.webp`(크림 종이 사진에서 뽑은 밝기 결)를 색지 위에 soft-light 로 겹쳐 만듭니다.
- 첫머리 아치 구멍의 층(`assets/paper/`)은 마젠타 배경으로 그린 종이 그림을 오려 낸 것입니다. 짚색 능선은 초록 능선을 뒤집어 색만 바꾼 것입니다.
- 글꼴은 제목 Jua(영어 Fredoka), 본문 Noto Sans KR(영어 Nunito)입니다. Jua는 굵기가 하나뿐이라 `font-synthesis:none`으로 가짜 굵게를 막습니다.
- 글꼴은 `display=block`으로 받아 대체 글꼴이 잠깐 보였다 바뀌지 않게 하고, 첫 화면은 글꼴이 준비된 뒤에 보입니다. Jua는 제목에 쓰는 한글만 담은 작은 파일(`text=`)로 받습니다. 제목 글자를 바꾸거나 새 페이지를 더하면 네 페이지의 h1~h4 한글을 모아 Jua 링크의 `text=`를 다시 만듭니다(빠진 글자는 다른 고딕으로 나옵니다).
- 감빛 App Store 단추(두 장 겹침)는 한 화면에 하나만 둡니다.
- 움직임은 `assets/motion.js`가 맡습니다. 2D 이동, ±3도 이내 회전, 투명도, 그림자 변화만 쓰고, 움직임 줄이기를 켜면 모두 끕니다.

## 외부 코드

- GSAP 3.15.1 (`gsap.min.js`, `ScrollTrigger.min.js`): npm `gsap@3.15.1`의 dist 파일을 그대로 `assets/vendor/gsap/`에 둡니다. GreenSock Standard 'no charge' License, https://gsap.com/standard-license
