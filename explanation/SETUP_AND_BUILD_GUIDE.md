# 車予約アプリの完全新規構築手順

この手順書は、何もない状態からWindowsに開発環境を用意し、GitHub・Supabase・Vercelを使って家族向け車予約アプリを作成・公開するまでの手順です。GitアプリをPCへダウンロードせず、GitHub Webを基本に進めます。

## 0. 完成する構成

```text
VS Codeで編集・確認
  ↓ GitHub Webへアップロード
GitHubでソースコードと変更履歴を管理
  ├─ Supabase: 予約データを保存
  └─ Vercel: Webアプリを公開
```

この手順で使用するサンプル名は次のとおりです。自分の名前に置き換えて構いません。

| 項目 | サンプル |
| --- | --- |
| GitHubユーザー名 | `sample-family-user` |
| リポジトリ名 | `family-car-calendar` |
| Supabaseプロジェクト名 | `family-car-calendar-db` |
| Vercelプロジェクト名 | `family-car-calendar` |
| アプリフォルダー | `app` |

このリポジトリでは、アプリ本体を `app`、Supabaseのデータベース定義を `supabase`、説明書を `explanation` に置きます。

## Gitの解説

Gitは、ファイルの変更履歴を記録する仕組みです。いつ、何を変更したかを保存し、以前の状態を確認できます。

GitHubは、Gitの履歴とファイルをインターネット上で保存・共有するサービスです。GitとGitHubは同じものではありません。

| 用語 | 意味 |
| --- | --- |
| リポジトリ | ファイルと変更履歴をまとめて管理する場所 |
| commit | 変更を履歴として保存すること |
| branch | 作業の流れを分けること |
| push | PCの変更をGitHubへ送ること |
| pull | GitHubの変更をPCへ取得すること |
| clone | GitHubのリポジトリをPCへコピーすること |
| pull request | 変更を確認して、別ブランチを統合する依頼 |

今回はGitアプリを使わずGitHub Webでcommitとpushに相当する操作を行います。GitHubの **Commit changes** が変更履歴の保存、**Upload files** がPCからGitHubへファイルを送る操作です。

### Gitコマンドの例（参考）

以下はGitアプリをインストールした場合の代表的なコマンドです。今回の基本手順では実行せず、GitHub Webのボタン操作を使います。

```powershell
git status                 # 変更状態を確認
git add .                  # 変更をcommit対象にする
git commit -m "変更内容"   # 変更履歴を保存
git push                   # GitHubへ送信
git pull                   # GitHubから最新変更を取得
```

Web操作との対応は次のとおりです。

| Gitコマンド | GitHub Webで行う操作 |
| --- | --- |
| `git add` | **Upload files** でファイルを選択 |
| `git commit` | **Commit changes** |
| `git push` | **Commit changes** を押して保存 |
| `git pull` | ブラウザーを再読み込みして最新内容を表示 |

## 1. 必要なサービスと登録単位

| 登録するもの | 用途 | 登録・設定場所 |
| --- | --- | --- |
| VS Code | コードを編集する | Microsoft公式サイトからPCへインストール |
| Node.js LTS | Next.jsとnpmを実行する | Node.js公式サイトまたは `winget` |
| GitHubアカウント | ソースコードを保存・共有する | GitHubでアカウント作成 |
| GitHubリポジトリ | このアプリのコード置き場 | 例：`sample-family-user/family-car-calendar` |
| Supabaseプロジェクト | 予約データベース | Supabaseでプロジェクト作成 |
| Vercelアカウント | アプリをインターネット公開 | GitHubアカウントで登録可能 |
| Vercelプロジェクト | GitHubからアプリをデプロイ | Root Directoryを `app` に設定 |

## 1.1 無料プランの範囲

個人で試作し、家族内で少人数が使う場合は、次の無料プランで開始できます。無料枠の容量・回数・利用条件は変更されることがあるため、登録時は各サービスの料金ページも確認してください。

| サービス | 無料で使える範囲の目安 | 注意点 |
| --- | --- | --- |
| VS Code | エディターを無料で利用可能 | 公式版と拡張機能のライセンス条件を確認する |
| Node.js | 無料でインストール・利用可能 | サーバーを公開するサービスではなく、開発用ソフト |
| GitHub Free | 公開・非公開リポジトリ、Web編集、履歴管理を利用可能 | GitHub Actionsなど一部機能には無料枠の上限がある |
| GitHub Copilot Free | 月2,000件のコード補完、Haiku 4.5やGPT-5 miniなどへのアクセス、Copilot CLI、コミュニティサポート | クレジットカード不要。チャット回数や対象機能は公式ページ・登録画面で確認する |
| Supabase Free | 小規模なデータベース、認証、APIを試作可能 | データベース容量、帯域、プロジェクトの停止条件、同時接続数に上限がある |
| Vercel Hobby | 個人の検証用Webアプリを無料公開可能 | 商用利用の可否、帯域、ビルド時間、実行回数を確認する |

この車予約アプリでは、家族内の試作であれば無料枠から始められる可能性が高い構成です。ただし、利用者が増える、画像や動画を多く保存する、アクセスが集中する、商用サービスとして使う場合は有料プランが必要になる可能性があります。

### 無料枠で特に確認する項目

- GitHub：リポジトリをPrivateにした場合の共同作業者・Actionsの上限
- GitHub Copilot：無料補完数、チャット回数、試用期間終了後の扱い
- Supabase：データベース容量、ファイル容量、帯域、一定期間アクセスがない場合の停止
- Vercel：Hobbyプランの商用利用条件、帯域、ビルド時間、サーバー実行回数
- 支払い：有料プランへの変更、超過料金、請求先が登録されていないか

公式ページ：

- VS Code: https://code.visualstudio.com/Download
- GitHub: https://github.com/pricing
- GitHub Copilot: https://github.com/features/copilot/plans
- Supabase: https://supabase.com/pricing
- Vercel: https://vercel.com/pricing

## 2. VS Codeをインストール

1. https://code.visualstudio.com/ を開く。
2. Windows版をダウンロードする。
3. インストーラーを実行する。
4. VS Codeを起動する。
5. 拡張機能から次をインストールする。
   - Japanese Language Pack（必要な場合）
   - ESLint（必要な場合）
   - GitHub Pull Requests and Issues（必要な場合）

PowerShellで、VS Codeコマンドが使えるか確認します。

```powershell
code --version
```

`code` が認識されない場合は、VS Codeを再起動するか、インストーラーでPATH登録を有効にして再インストールします。

### 2.1 VS CodeとGitHubを接続

VS CodeとGitHubを接続すると、VS CodeからGitHubアカウントを確認したり、GitHub Copilotを使ったりできます。これはGitアプリをPCへインストールする操作とは別です。

1. VS Code右上のアカウント（人型）アイコンを押す。
2. **Sign in to Sync Settings** または **Sign in with GitHub** を選択する。
3. ブラウザーが開いたら、使用するGitHubアカウントでサインインする。
4. VS Codeに戻り、アカウント名が表示されることを確認する。
5. 拡張機能で **GitHub Pull Requests and Issues** を検索してインストールする（必要な場合）。

接続を確認する方法：

- 右上のアカウントアイコンにGitHubユーザー名が表示される。
- コマンドパレット（`Ctrl + Shift + P`）で `GitHub` と検索するとGitHub関連コマンドが表示される。
- 拡張機能の **GitHub Pull Requests and Issues** が有効になっている。

この手順書では、Gitの履歴操作はGitHub Webを使います。VS CodeとGitHubを接続しただけで、ファイルが自動的にGitHubへ保存されるわけではありません。GitHub Webで **Add file → Upload files** または **Commit changes** を実行します。

### 2.2 GitHub Copilotを登録・設定

GitHub Copilotは、コードの候補や質問への回答を支援するAI機能です。コードを自動で正しく完成させる機能ではないため、生成内容は自分で確認します。

#### GitHub Copilotの登録

1. https://github.com/features/copilot を開く。
2. **Get started** または料金プランの案内を選択する。
3. GitHubアカウントでサインインする。
4. 表示されたプランを確認して登録する。
5. 無料プランや試用期間の有無、利用上限、支払い条件を確認する。

GitHub公式料金ページのFree欄には、現在、月2,000件のコード補完、Haiku 4.5やGPT-5 miniなどへのアクセス、Copilot CLI、コミュニティサポートが記載されています。また、クレジットカード不要と案内されています。料金や無料枠は変更される可能性があるため、登録画面に表示された条件を確認してください。

公式料金ページ： https://github.com/features/copilot/plans

#### VS CodeにCopilot拡張機能を設定

1. VS Code左側の拡張機能アイコンを押す。
2. `GitHub Copilot` を検索する。
3. **GitHub Copilot** をインストールする。
4. 必要に応じて **GitHub Copilot Chat** もインストールする。
5. 右上のアカウントアイコンから、Copilotを登録したGitHubアカウントでサインインする。
6. 画面下部のステータスバーにCopilotのアイコンが表示され、無効になっていないことを確認する。

#### Copilotが使えるか確認

1. `app` フォルダー内に `test.ts` などのファイルを作る。
2. 次のコメントを入力する。

```typescript
// 2つの数値を受け取り、合計を返す関数
```

3. 少し待つと灰色のコード候補が表示される。
4. 候補を採用する場合は `Tab`、採用しない場合は `Esc` を押す。
5. 採用したコードを読み、型・動作・安全性を確認する。

#### Copilot Chatの使い方

1. VS CodeのCopilotアイコン、またはコマンドパレットの `Chat: Open Chat` を選択する。
2. 例えば次のように質問する。

```text
この関数の役割を初心者向けに説明してください。
```

```text
この予約処理で、時間が重なる場合に登録されないか確認してください。
```

3. 回答をそのまま採用せず、現在のコードやエラーメッセージと照らし合わせる。

#### Copilot使用時の注意

- Supabaseの `service_role` キー、パスワード、個人情報をチャットに貼り付けない。
- 生成されたコードは、必要なファイルだけに適用する。
- SQL、認証、権限設定は特に慎重に確認する。
- テスト、型チェック、画面操作で動作を確認する。
- Copilotの回答は参考情報であり、最終的な判断は開発者が行う。

## 3. Node.jsをインストール

Node.jsのLTS版をインストールします。WindowsのPowerShellからは次のコマンドを使えます。

```powershell
winget install OpenJS.NodeJS.LTS
```

インストール後、PowerShellとVS Codeのターミナルを開き直し、確認します。

```powershell
node --version
npm --version
```

`npm` が認識されない場合は、Node.jsをインストールした後にターミナルを開き直します。必要に応じて、Node.js公式サイトからLTS版を再インストールします。

## 4. GitHubアカウントとWebリポジトリを準備

### 4.1 GitHubアカウント

1. https://github.com/ を開く。
2. **Sign up** からアカウントを作成する。
3. メールアドレスを確認する。
4. 二要素認証を設定する。
5. GitHub Webにログインする。

### 4.2 GitHub Webで新しいリポジトリを作成

既存リポジトリは使わず、完全に新しいリポジトリを作成します。

1. GitHub右上の **+** → **New repository** を選択する。
2. Repository nameに `family-car-calendar` と入力する。
3. Descriptionに「家族の車予約カレンダー」と入力する（任意）。
4. `Public` または `Private` を選択する。家族だけで使う場合は `Private` を推奨します。
5. **Add a README file** はオフにする。
6. **Add .gitignore** は `None` のままにする。
7. **Choose a license** は `None` のままにする。
8. **Create repository** を押す。

リポジトリURLの例：

```text
https://github.com/sample-family-user/family-car-calendar
```

空のリポジトリを作る理由は、VS Codeで作成したNext.jsのファイルを後からまとめて登録するためです。READMEを先に作ると、アップロード時に不要な競合が起きる場合があります。

### 4.3 GitHub Webで作成したリポジトリを確認

1. 作成したリポジトリを開く。
2. ブランチが `main` になっていることを確認する。
3. まだファイルがないことを確認する。

GitアプリをPCへダウンロードしなくても、GitHub Webの **Add file → Upload files** でファイルを登録できます。

## 5. Next.jsアプリを作成

ローカルの作業フォルダーを作り、アプリを `app` フォルダーに作成します。これはGitHub上のリポジトリとは別に、PC上でコードを編集する場所です。

```powershell
New-Item -ItemType Directory -Path C:\Users\yutao\vscode\family-car-calendar -Force
Set-Location C:\Users\yutao\vscode\family-car-calendar
code .
```

フォルダーを作る理由は、アプリのコード、Supabase設定、説明書を1つのプロジェクトとして管理するためです。

新規Next.jsプロジェクトを作る場合のコマンド：

```powershell
Set-Location C:\Users\yutao\vscode\family-car-calendar
npx create-next-app@latest app --typescript --eslint --app --use-npm
```

既に `app` フォルダーとコードがある場合は、このコマンドを再実行せず、依存関係だけをインストールします。

```powershell
Set-Location C:\Users\yutao\vscode\family-car-calendar\app
npm install
```

開発サーバーを起動します。

```powershell
npm run dev
```

ブラウザーで次を開きます。

```text
http://localhost:3000
```

## 6. Supabaseプロジェクトを登録

1. https://supabase.com/ を開く。
2. GitHubアカウントでサインインする。
3. **New project** を選択する。
4. Organizationを選択する。
5. プロジェクト名を入力する。
6. データベースパスワードを設定する。
7. リージョンを選択する。
8. **Create new project** を押す。

### 6.1 予約テーブルを作成

Supabase Dashboardの **SQL Editor** を開き、次のファイルの内容を貼り付けて実行します。

```text
supabase/migrations/20260906000000_create_reservations.sql
```

`Success. No rows returned` と表示されれば、テーブルやポリシーの作成は成功です。

テーブルを確認するSQL：

```sql
select * from public.reservations;
```

### 6.2 SupabaseのURLと公開キーを取得

1. **Project Settings** を開く。
2. **API** または **API Keys** を開く。
3. Project URLをコピーする。
4. `anon` または `Publishable key` をコピーする。

`service_role` キーはブラウザー用アプリに入力しません。

## 7. ローカルアプリへSupabaseを設定

環境変数のサンプルをコピーします。

```powershell
Set-Location C:\Users\yutao\vscode\family-car-calendar\app
Copy-Item .env.local.example .env.local
```

`.env.local` を開き、実際の値に置き換えます。

```env
NEXT_PUBLIC_SUPABASE_URL=https://プロジェクトID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_実際の公開キー
```

`.env.local` は秘密情報を含むため、GitHubへpushしません。`.gitignore` で除外されています。

環境変数を変更したら、開発サーバーを再起動します。

```powershell
Ctrl + C
npm run dev
```

アプリで予約を登録し、SupabaseのSQL Editorで確認します。

```sql
select *
from public.reservations
order by reservation_date, start_time;
```

## 8. GitHub Webへ新規ファイルを登録

Gitアプリを使わず、GitHubのブラウザー画面からファイルを登録します。

1. 作成した `family-car-calendar` リポジトリを開く。
2. `main` ブランチを選択する。
3. **Add file** → **Upload files** を選択する。
4. VS Codeで作成した `app`、`supabase`、`explanation` のファイルを選択してアップロードする。
5. 下部の **Commit changes** を押す。
6. Commit messageに `Create family car reservation app` と入力する。
7. **Commit directly to the `main` branch** を選択する。
8. **Commit changes** を押す。

既存ファイルを編集する場合は、GitHub上でファイルを開き、鉛筆アイコンの **Edit this file** を選択します。編集後、下部の **Commit changes** を押します。

GitHub Webで確認する項目：

- `app/package.json` がある
- `app/app/page.tsx` がある
- `supabase/migrations/20260906000000_create_reservations.sql` がある
- `.env.local` がない

`.env.local` は秘密情報を含むため、GitHub Webにもアップロードしません。アップロード前に、ファイル一覧に `.env.local` が含まれていないことを確認します。

## 9. Vercelへ登録して公開

1. https://vercel.com/ を開く。
2. GitHubアカウントでサインインする。
3. **Add New Project** を選択する。
4. `sample-family-user/family-car-calendar` をImportする。
5. Project Nameを入力する。
6. **Framework Preset** は `Next.js` を選択する。
7. **Root Directory** は `app` を設定する。
8. **Environment Variables** に次の2つを登録する。

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

値はローカルの `.env.local` と同じですが、キーはVercelの入力欄へ直接貼り付けます。

9. Environmentは少なくとも **Production** を選択する。
10. **Deploy** を押す。

デプロイ後、状態が `Ready` になったら **Visit** で公開URLを開きます。

Vercel設定の確認場所：

- **Settings → Build and Deployment**：Framework Preset、Root Directory
- **Settings → Environment Variables**：Supabaseの2つの環境変数
- **Settings → Git**：Production Branch
- **Settings → Domains**：現在の公開URL

設定を変更した場合は、**Deployments → Redeploy** を実行します。環境変数の変更後は新しいデプロイが必要です。

## 10. 公開後の確認

公開URLで次を確認します。

- カレンダーが表示される
- 使用者・開始・終了・行き先を入力できる
- 予約を追加できる
- Supabaseの `reservations` に行が追加される
- 同じ時間帯の予約が拒否される
- 予約を削除できる
- 別の端末から同じ予約が表示される

## 11. トラブルシューティング

### `npm` が認識されない

Node.jsのインストール後、PowerShellとVS Codeを再起動します。

```powershell
node --version
npm --version
```

### `Failed to fetch`

`.env.local` またはVercelの環境変数がサンプル値になっていないか確認します。Supabase URLは実際のProject IDを使います。

### Vercelが404を表示する

Vercelの **Settings → Build and Deployment** でRoot Directoryが `app` か確認し、最新デプロイの **Visit** から開きます。古いデプロイURLではなく、**Settings → Domains** のドメインを使います。

### SupabaseでSQLが失敗する

SQL Editorでエラーの行を確認します。すでに一部を実行済みの場合は、同じポリシー名が存在することがあります。その場合は重複するポリシーを削除してから、SQLを分割して実行します。

## 12. GitHub Webで更新する手順

1. GitHubで `family-car-calendar` リポジトリを開く。
2. 対象ファイルを開く。
3. 鉛筆アイコンの **Edit this file** を押す。
4. 内容を編集する。
5. **Commit changes** を押す。
6. `main` ブランチへ直接commitするか、新しいブランチを作成する。
7. 新しいブランチを使った場合は **Open pull request** からPull Requestを作成する。

Vercelは `main` ブランチへのcommitを検知すると、自動的に再デプロイします。

## 13. 重要なセキュリティ注意

- `.env.local` をGitHubへpushしない。
- `service_role` キーをブラウザーやVercelの公開コードに埋め込まない。
- Supabaseの匿名アクセス用ポリシーは試作向けであり、公開運用ではSupabase Authとユーザー単位のRLSを追加する。
- GitHubやSupabaseのパスワードをコードやMarkdownに書かない。
- 公開キーを誤ってGitHubにpushした場合は、Supabase Dashboardでキーを更新する。
