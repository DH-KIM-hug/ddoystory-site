# ddoystory

또이다은 스튜디오(ddoystory)의 홈페이지입니다. GitHub Pages로 ddoystory.com 에 올라갑니다.

## 폴더 구조

| 경로 | 내용 |
|---|---|
| `/` (`index.html`) | 스튜디오 홈: 소개, 만든 것들(작품 카드), 문의 |
| `/<작품>/` | 작품 소개 페이지 (예: `/tokitoki/` 톡톡 동화극장) |
| `/<작품>/support/` | 고객 지원: 자주 묻는 질문과 문의 (App Store 지원 URL) |
| `/<작품>/privacy/` | 개인정보 처리방침 (App Store 처리방침 URL) |
| `/assets/` | 그림, 아이콘, 로고 |

## 새 작품 추가 순서

1. `/<작품>/index.html` 을 만듭니다. `tokitoki/index.html` 을 복사해 글과 그림을 바꾸면 됩니다.
2. `/<작품>/support/index.html`, `/<작품>/privacy/index.html` 을 만듭니다.
3. 그림은 `assets/` 에 넣고, 작품 페이지에서는 `../assets/` 로 부릅니다.
4. 루트 `index.html` 의 `ul.grid` 안에서 `li.work` 하나를 복사해 붙이고 링크, 그림, 글, `--tone`(카드 색지 색)을 바꿉니다. 대표 작품 하나만 `class="work wide"` 로 둡니다.
5. 루트 바닥글의 지원·처리방침 링크 목록에 새 작품을 더합니다.
6. App Store 주소는 각 페이지 맨 아래 스크립트의 `APP_STORE_URL` 이나 단추의 `href` 에 넣습니다.
