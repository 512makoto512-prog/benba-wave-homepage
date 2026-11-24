# BEMBA アクセス解析 導入準備（GA4・Search Console・UTM）

作成：2026-11-24。**2026-11-24 に GA4 を本番の全30ページへ導入済み**（測定ID `G-R58EK2MPC1`、ストリーム「BEMBA公式ホームページ」、ストリームID 16403224610）。
Googleタグマネージャーは使わない（直接設置のみ）。Search Console は未変更（3章）。
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
`site/js/bemba-analytics.js`（全30ページの `</body>` 直前で `<script src="js/bemba-analytics.js?v=20261124" defer>` として読み込み。404ページだけ絶対パス `/js/…` と `data-page-type="not_found"`）

- **キャッシュ注意：** `netlify.toml` で `/js/*` は1年キャッシュ（immutable）。スクリプトを直したら、全ページの `?v=` の日付を必ず更新する。
- **二重集計の防止：** 独自イベント名（`booking_form_click` / `line_click`）は拡張計測機能のイベント名（`click` など）と重ならない。ただし拡張計測機能の「離脱クリック」も同じリンクで `click` を送るため、GA4の管理画面で「離脱クリック」をオフにする（2章）。page_view は `config` の自動送信1回だけ。
- **取りこぼし防止：** gtag.js の読み込み前に起きたクリックは `dataLayer` に溜め、読み込み後に送信する。同じタブで移動するリンク（トップ予約欄のLINE、サンライズ・サンセットのヘッダー等）は、読み込み前に押された場合だけ送信完了まで最大0.6秒待ってから移動する。最初の操作（タップ・スクロール・キー入力）があった時点でも gtag.js を読み込む。
- **同意設定（Consent Mode）：** 広告用（`ad_storage`・`ad_user_data`・`ad_personalization`）は全地域で無効。アナリティクス用の保存（`analytics_storage`）は、欧州経済領域・英国・スイスでは既定で無効（Cookieを保存しない）、その他の地域（日本など）は有効。同意バナーは設置していない（下記「海外のお客様」）。
- **管理者の除外：** 自分の端末でURL末尾に `#bemba-internal-on` を付けて一度開くと、そのブラウザからのアクセスに `traffic_type=internal` が付く（端末・ブラウザごとに1回。解除は `#bemba-internal-off`）。GA4のデータフィルタ「Internal Traffic」を有効にすると集計から除外される。
- **動作確認用：** `#bemba-debug-on` で、そのブラウザのアクセスが GA4 の DebugView に表示される（解除は `#bemba-debug-off`）。

- 送るもの：ページの種類（`page_type`）、ツアー名（`tour_name`）、ボタンの場所（`link_location`：`header` / `hero` / `sticky_bar` / `booking_section` / `gallery` / `special_menu_card` / `faq` / `footer` / `body`）、言語（`site_language`）。
- **送らないもの：** 氏名・メールアドレス・電話番号・予約番号など個人情報。サイトには入力欄がなく、予約はGoogleフォームとLINE（別サイト）で行うため、GA4に渡る経路がない。さらにURLのクエリは `utm_` 以外を削除して送る（テストで `?name=…&email=…` が送信内容から除かれることを確認済み）。
- Googleシグナル・広告のパーソナライズは無効。
- page_referrer はドメインとパスだけに短縮（参照元URLのクエリに含まれる個人情報を送らない）。
- 表示速度：gtag.js はページの読み込み完了後（または最初の操作時）に読み込むため、メイン画像の表示（LCP）を遅らせない。

---

## 2. GA4 の管理画面でオーナーが行う設定

作成済み：プロパティとウェブストリーム「BEMBA公式ホームページ」（測定ID `G-R58EK2MPC1`、拡張計測機能 有効）。

1. **拡張計測機能の調整（二重集計の防止）**：管理 > データの収集と修正 > データストリーム > 「BEMBA公式ホームページ」> 拡張計測機能の歯車
   - **離脱クリック：オフ**（予約フォーム・LINEは独自イベントで計測するため）
   - **サイト内検索：オフ**（サイトに検索がなく、URLのパラメータを検索語として誤って記録するのを防ぐ）
   - **フォームの操作：オフ**（サイト内にフォームはない）
   - **ブラウザの履歴イベントに基づくページの変更：オフ**（ページ内リンク「#booking」等で閲覧数が水増しされるのを防ぐ）
   - ページビュー・スクロール数・動画エンゲージメント・ファイルのダウンロード：オンのままでよい
2. **データ保持**：管理 > データの収集と修正 > データの保持 > イベントデータの保持を「14か月」にして保存。
3. **Googleシグナル**：管理 > データの収集と修正 > データの収集 で、Googleシグナルを **オフ**（サイト側でも無効化済み）。
4. **カスタムディメンション**：管理 > データの表示 > カスタム定義 > カスタムディメンションを作成（範囲：**イベント**）。次の4つ（ディメンション名は日本語でよい、イベントパラメータは下記のとおり正確に）：
   - ページの種類：`page_type`
   - ツアー名：`tour_name`
   - ボタンの場所：`link_location`
   - 言語：`site_language`
5. **キーイベント**：イベントが届いた後（通常24時間以内）、管理 > データの表示 > イベント で `booking_form_click` と `line_click` の「キーイベントとしてマーク」をオン。レポート上の名前は「予約フォームを開いた」「LINEを開いた」とし、予約成立数とは区別する。
6. **自分のアクセスの除外**
   - 自分が使うスマホ・PCのブラウザで、それぞれ一度だけ `https://bemba-okinawa.netlify.app/#bemba-internal-on` を開く（Safari・Chromeなどブラウザごとに必要。履歴を消すと解除される）。
   - 管理 > データの収集と修正 > データフィルタ > 「Internal Traffic」を開き、状態を **有効** にして保存（最初は「テスト」状態。テストのままでも、探索レポートで「テストデータのフィルタ名」で確認できる）。
   - 補助として、自宅・事務所の固定IPがあれば、データストリーム > タグ設定を構成 > 内部トラフィックの定義 にも登録できる。
7. **受信の確認（DebugView）**
   - 自分のブラウザで `https://bemba-okinawa.netlify.app/#bemba-debug-on` を開き、続けて数ページを閲覧し、予約欄の「LINEで相談する」「予約フォームへ」を押す（開いたLINE・フォームは何も送信せずに閉じる。テスト予約は送らない）。
   - 管理 > データの表示 > **DebugView** に、`page_view`・`line_click`・`booking_form_click` とパラメータ（`link_location` など）が表示されれば受信成功。
   - 確認後、`https://bemba-okinawa.netlify.app/#bemba-debug-off` を開いて解除する。
   - レポート > **リアルタイム** でも、数十秒〜数分で表示される。
8. **Search Console との連携**：Search Console の所有権確認が済んだ後に、管理 > サービスとのリンク > Search Console のリンク から行う（今回は Search Console は変更しない）。

### 海外のお客様（Cookie同意について）
- 日本の法令（個人情報保護法）上、匿名のアクセス解析にCookie同意バナーは必須ではない。プライバシーポリシーでの公表で対応している。
- 欧州（EU一般データ保護規則など）では、アナリティクスCookieの保存に事前同意が必要とされるため、欧州経済領域・英国・スイスからのアクセスでは Cookie を保存しない設定（Consent Mode の地域別既定値）にした。この地域の訪問者数は、Cookieを使わない簡易な通知（Consent Mode の仕様）とGA4の推計で表示されるため、実数より少なく見える場合がある。
- 欧州からの集客を本格化する場合は、無料の同意バナー（自作または無料プランのCMP）を追加し、同意した人だけ `analytics_storage` を有効にする。

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
