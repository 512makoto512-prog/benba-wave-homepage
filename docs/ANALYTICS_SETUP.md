# BEMBA アクセス解析 導入準備（GA4・Search Console・UTM）

作成：2026-11-24。**まだ本番サイトには何も導入していない。** 測定IDが届くまでは、仮のIDも入れない。
すべて無料の範囲で行う（GA4・Search Console は無料。有料版 GA4 360 や広告の課金設定は使わない）。

---

## 1. 計測したいことと方法

| 知りたいこと | GA4での見方 | 必要な作業 |
|---|---|---|
| 訪問者数 | レポート > ユーザー、セッション | タグ設置のみ |
| 流入元 | レポート > 集客 > トラフィック獲得（セッションの参照元/メディア） | タグ設置＋UTM（5章） |
| ツアー別の閲覧数 | レポート > ページとスクリーン、またはカスタムディメンション `tour_name` | タグ設置＋ディメンション登録 |
| 予約フォームへのクリック | イベント `booking_form_click` | 計測スクリプト（下記） |
| 公式LINEへのクリック | イベント `line_click` | 計測スクリプト |
| クリック元のページ・場所 | 上記イベントの `page_type` `tour_name` `link_location` | ディメンション登録 |
| Instagram・TikTok・Google検索からの流入 | 参照元/メディア（`instagram / social` など、Google検索は `google / organic`） | UTM（5章）。Google検索は自動 |

**予約の区別：** `booking_form_click` と `line_click` は「フォームやLINEを開いた」というクリックの数で、予約が成立した数ではない。予約の成立数は、Googleフォームの回答数とLINEでの確定数で数える。GA4のレポートでは「予約ボタンのクリック」と呼び、「予約数」とは呼ばない。

### 計測スクリプト
`docs/analytics/bemba-analytics.js`（準備済み・未設置）

- 送るもの：ページの種類（`page_type`）、ツアー名（`tour_name`）、ボタンの場所（`link_location`：`header` / `hero` / `sticky_bar` / `booking_section` / `gallery` / `special_menu_card` / `faq` / `footer` / `body`）、言語（`site_language`）。
- **送らないもの：** 氏名・メールアドレス・電話番号・予約番号など個人情報。サイトには入力欄がなく、予約はGoogleフォームとLINE（別サイト）で行うため、GA4に渡る経路がない。さらにURLのクエリは `utm_` 以外を削除して送る（テストで `?name=…&email=…` が送信内容から除かれることを確認済み）。
- Googleシグナル・広告のパーソナライズは無効。
- 表示速度：gtag.js はページの読み込み完了後に読み込むため、メイン画像の表示（LCP）を遅らせない。追加の通信は約100KB（圧縮後）。

---

## 2. GA4 の設定手順（オーナーのGoogleアカウントで行う作業）

1. https://analytics.google.com/ を開き、BEMBAで使うGoogleアカウントでログインする。
2. 「測定を開始」→ アカウント名：`BEMBA`。データ共有の設定は、必要なもの以外のチェックを外してよい。
3. プロパティ名：`BEMBA 公式サイト`、レポートのタイムゾーン：**日本**、通貨：**日本円**。
4. ビジネスの詳細（業種：旅行、規模：小規模）と目的（「見込み顧客の獲得」など）を選ぶ。
5. プラットフォームで **ウェブ** を選び、URL `https://bemba-okinawa.netlify.app`、ストリーム名 `BEMBA Web` を入力。「拡張計測機能」はオンのままでよい。
6. 表示される **測定ID（`G-` で始まる英数字）** を控えて、Claudeに伝える。**この時点で作業を止める。** タグの設置はClaudeが行う。
7. 管理 > データの収集と修正 > **データ保持** を「14か月」に変更（無料で可能。初期値は2か月）。
8. 管理 > データの表示 > **カスタム定義** で、次の4つを「イベント」スコープのカスタムディメンションとして作成する：
   `page_type`、`tour_name`、`link_location`、`site_language`
9. タグ設置後、管理 > データの表示 > **イベント** で `booking_form_click` と `line_click` が表示されたら、それぞれ **「キーイベントとしてマーク」** する。
10. 管理 > データ ストリーム > `BEMBA Web` > タグ設定を構成 > **内部トラフィックの定義** で、自宅など自分のIPアドレスを登録し、データフィルタで除外しておくと、自分のアクセスが混ざらない（任意）。

### タグ設置時にClaudeが行う作業（測定IDを受け取ってから）
1. `docs/analytics/bemba-analytics.js` に測定IDを入れて `site/js/` に置く。
2. 全30ページの `</body>` の直前に1行追加する。
3. プライバシーポリシーの追記（6章）を同時に反映する。
4. 公開後、GA4の「リアルタイム」レポートで、ページ表示と2つのクリックイベントが届くことを確認する（テスト用の予約は送信しない）。
5. Lighthouse で表示速度が大きく落ちていないことを確認する。

---

## 3. Google Search Console

### 既存の登録状況（重要）
- Gitの履歴によると、**2026-10-07（コミット `a5a2c8a`）に、トップページへ所有権確認用のメタタグが追加されている**：
  `<meta name="google-site-verification" content="o-PYITUF_5ebdEniPjjfEn9xTHlLO__GEy1n3gneX-A">`
  （対象URLは現在と同じ `https://bemba-okinawa.netlify.app/`）
- このタグは **2026-10-16 の全面リニューアル（コミット `25b004a`）で削除** され、現在の本番にはない。
- そのため、Search Consoleにはすでにプロパティが登録されている可能性が高い。ただしタグが消えたことで、**所有権の確認が外れている（または近く外れる）可能性** がある。

### 手順
1. https://search.google.com/search-console を開き、**10月7日にタグを発行したときと同じGoogleアカウント** でログインする。
2. 左上のプロパティ一覧に `https://bemba-okinawa.netlify.app/` があるか確認する。
   - **ある場合：** 設定 > 所有権の確認 を開き、状態（確認済み／確認できなかった）と、表示される確認用タグの文字列をClaudeに伝える。上記の文字列と同じなら、Claudeがそのタグを日英トップに戻すだけで再確認できる。
   - **ない場合：** プロパティを追加 > **URLプレフィックス** に `https://bemba-okinawa.netlify.app/` を入力 > 確認方法で **HTMLタグ** を選び、表示されたタグをClaudeに伝える。
   - GA4のタグを設置した後なら、確認方法で「Google アナリティクス」を選ぶこともできる（同じアカウントで、GA4の編集権限があることが条件）。
3. Claudeがタグを設置して本番に反映したら、Search Consoleで「確認」を押す。
4. 確認できたら、左メニュー **サイトマップ** に `sitemap.xml` と入力して送信する（`https://bemba-okinawa.netlify.app/sitemap.xml`、28ページ分。robots.txt にも記載済み）。
5. 数日後、**ページ**（インデックス作成）レポートで登録済み・未登録のページ数を確認する。重要ページは上部の **URL検査** に入力し、「インデックス登録をリクエスト」できる（例：トップ、マングローブ2ページ）。
6. GA4とSearch Consoleを連携すると、GA4で検索キーワードも見られる（GA4の管理 > サービスとのリンク > Search Console のリンク）。

**注意：** 確認用タグは削除すると所有権が外れる。今後のリニューアルでも `<head>` の `google-site-verification` は消さないこと。

---

## 4. 送信しない情報（個人情報の扱い）

- 氏名、メールアドレス、電話番号、予約番号、LINEのユーザー名、予約内容の自由記述などは、GA4に一切送信しない。
- サイトのURLにこれらを含めない（UTMにも人名などは使わない）。
- GA4の利用規約上も、個人を特定できる情報の送信は禁止されている。

---

## 5. UTMパラメータの設計（流入元の区別）

### 命名ルール
- すべて **英小文字・ハイフン区切り**、日本語や個人名は使わない。
- `utm_source`＝どこから、`utm_medium`＝媒体の種類、`utm_campaign`＝目的・時期、`utm_content`＝同じ媒体内の置き場所。

| 置き場所 | utm_source | utm_medium | utm_campaign | utm_content | URL例 |
|---|---|---|---|---|---|
| Instagram プロフィール（@bemba_okinawa） | instagram | social | profile | bio | `https://bemba-okinawa.netlify.app/?utm_source=instagram&utm_medium=social&utm_campaign=profile&utm_content=bio` |
| Instagram ストーリーズのリンク | instagram | social | 例: mangrove-2026-12 | story | `…/mangrove-kayak.html?utm_source=instagram&utm_medium=social&utm_campaign=mangrove-2026-12&utm_content=story` |
| TikTok プロフィール（@bemba_okinawa） | tiktok | social | profile | bio | `…/?utm_source=tiktok&utm_medium=social&utm_campaign=profile&utm_content=bio` |
| 沖縄の次男のSNS（Instagram／TikTok） | instagram / tiktok | social | profile | okinawanojinan | `…/?utm_source=instagram&utm_medium=social&utm_campaign=profile&utm_content=okinawanojinan` |
| 公式LINE（リッチメニュー・あいさつ文） | line | messaging | official-line | rich-menu／greeting | `…/?utm_source=line&utm_medium=messaging&utm_campaign=official-line&utm_content=rich-menu` |
| 名刺のQRコード | card | qr | business-card | 例: 2026-11 | `…/?utm_source=card&utm_medium=qr&utm_campaign=business-card&utm_content=2026-11` |
| フライヤーのQRコード | flyer | qr | 例: flyer-onna | 配布場所（例: hotel-a） | `…/?utm_source=flyer&utm_medium=qr&utm_campaign=flyer-onna&utm_content=hotel-a` |
| Google ビジネスプロフィールのウェブサイト欄 | google | business-profile | gbp | website | `…/?utm_source=google&utm_medium=business-profile&utm_campaign=gbp&utm_content=website` |

- Google検索（自然検索）は設定不要で、GA4に `google / organic` と表示される。
- 英語版に案内したい場合は、パスを `index-en.html` にする。

### 運用上の注意
- **既存のQRコード・SNSプロフィールのURLは、オーナーの判断なしに変更しない。** 新しいURLに変えるのは、印刷物を作り直すときやプロフィールを更新するときに、オーナーが行う。
- 印刷済みのQRコードを変えずに区別したい場合は、新しく刷るものから上記のURLを使う。
- UTM付きのURLは長いので、QRコードにするときはそのまま使う（短縮URLサービスは不要）。
- `canonical` が設定済みのため、UTM付きURLが検索結果に別ページとして出ることはない。

---

## 6. プライバシーポリシーの追記案（GA4設置時に同時に反映する）

### 日本語版（`privacy.html` に「アクセス解析ツールについて」として追加）

> **アクセス解析ツールについて**
>
> 当サイトでは、サイトの利用状況を把握し、内容の改善に役立てるため、Google LLCが提供するアクセス解析ツール「Googleアナリティクス」を利用しています。Googleアナリティクスは、Cookie（クッキー）を使用して、閲覧したページ、滞在時間、参照元、おおまかな地域、使用端末などの情報を収集します。これらの情報は匿名で収集され、個人を特定するものではありません。
>
> 当サイトでは、氏名・メールアドレス・電話番号・予約番号などの個人情報をGoogleアナリティクスに送信することはありません。ご予約やお問い合わせの内容は、Googleフォームおよび公式LINEで受け付けており、アクセス解析の対象にはしていません。
>
> Cookieの使用は、ブラウザの設定で無効にすることができます。また、Googleが提供する「Googleアナリティクス オプトアウト アドオン」（https://tools.google.com/dlpage/gaoptout?hl=ja ）を利用すると、Googleアナリティクスによる情報の収集を停止できます。
>
> Googleによるデータの取り扱いについては、Googleのポリシーと規約（https://policies.google.com/technologies/partner-sites?hl=ja ）をご確認ください。

あわせて、ページ下部の「最終改定日：—」を導入日に更新する。

### 英語版（`privacy-en.html` に "Analytics" として追加）

> **Use of Analytics Tools**
>
> This website uses Google Analytics, a web analytics service provided by Google LLC, to understand how visitors use the site and to improve its content. Google Analytics uses cookies to collect information such as the pages viewed, time spent, referring site, approximate region and device type. This information is collected anonymously and does not identify individuals.
>
> We do not send personal information such as names, email addresses, phone numbers or booking numbers to Google Analytics. Bookings and inquiries are handled through Google Forms and our official LINE account and are not tracked by our analytics.
>
> You can disable cookies in your browser settings, or install the Google Analytics Opt-out Browser Add-on (https://tools.google.com/dlpage/gaoptout ) to stop Google Analytics from collecting your data.
>
> For details on how Google uses this data, please see "How Google uses information from sites or apps that use our services" (https://policies.google.com/technologies/partner-sites ).
