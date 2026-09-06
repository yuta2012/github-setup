# 車予約アプリの環境構築から公開まで

この手順書は、Windowsに開発環境を用意し、GitHub・Supabase・Vercelを使って家族向け車予約アプリを作成・公開するまでの手順です。

## 0. 完成する構成

```text
VS Codeで編集・確認
  ↓ アップロードまたはWeb編集
GitHub Webでソースコードを管理
  ├─ Supabase: 予約データを保存
  └─ Vercel: Webアプリを公開
```

このリポジトリでは、アプリ本体を `app`、Supabaseのデータベース定義を `supabase`、説明書を `explanation` に置きます。

## 1. 必要なサービスと登録単位

| 登録するもの | 用途 | 登録・設定場所 |
| --- | --- | --- |
| VS Code | コードを編集する | Microsoft公式サイトからPCへインストール |
| Node.js LTS | Next.jsとnpmを実行する | Node.js公式サイトまたは `winget` |
| GitHubアカウント | ソースコードを保存・共有する | GitHubでアカウント作成 |
| GitHubリポジトリ | このアプリのコード置き場 | `yuta2012/github-setup` |
| Supabaseプロジェクト | 予約データベース | Supabaseでプロジェクト作成 |
| Vercelアカウント | アプリをインターネット公開 | GitHubアカウントで登録可能 |
| Vercelプロジェクト | GitHubからアプリをデプロイ | Root Directoryを `app` に設定 |

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

### 4.2 既存リポジトリを使う場合

このプロジェクトでは、次のGitHubリポジトリを使用します。

```text
https://github.com/yuta2012/github-setup.git
```

ブラウザーでリポジトリを確認する方法：

1. https://github.com/yuta2012/github-setup を開く。
2. ブランチの一覧から `github-setup` を選択する。
3. `app`、`supabase`、`explanation` フォルダーが表示されることを確認する。

### 4.3 GitHub Webで新しいリポジトリを作成する場合

1. GitHub右上の **+** → **New repository** を選択する。
2. Repository nameを入力する。
3. PublicまたはPrivateを選択する。
4. **Create repository** を押す。

GitアプリをPCへダウンロードしなくても、GitHub Webでファイルを追加できます。

## 5. Next.jsアプリを作成

このリポジトリでは、アプリを `app` フォルダーに作成します。

新規Next.jsプロジェクトを作る場合のコマンド：

```powershell
Set-Location C:\Users\yutao\vscode\github-setup
npx create-next-app@latest app --typescript --eslint --app --use-npm
```

既に `app` フォルダーとコードがある場合は、このコマンドを再実行せず、依存関係だけをインストールします。

```powershell
Set-Location C:\Users\yutao\vscode\github-setup\app
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
Set-Location C:\Users\yutao\vscode\github-setup\app
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

## 8. GitHub Webへファイルを登録

Gitアプリを使わず、GitHubのブラウザー画面からファイルを登録します。

1. `https://github.com/yuta2012/github-setup` を開く。
2. `github-setup` ブランチを選択する。
3. **Add file** → **Upload files** を選択する。
4. `app`、`supabase`、`explanation` のファイルを選択してアップロードする。
5. 下部の **Commit changes** を押す。
6. Commit messageに変更内容を入力する。
7. **Commit directly to the `github-setup` branch** を選択する。
8. **Commit changes** を押す。

既存ファイルを編集する場合は、GitHub上でファイルを開き、鉛筆アイコンの **Edit this file** を選択します。編集後、下部の **Commit changes** を押します。

GitHub Webで確認する項目：

- `app/package.json` がある
- `app/app/page.tsx` がある
- `supabase/migrations/20260906000000_create_reservations.sql` がある
- `.env.local` がない

`.env.local` は秘密情報を含むため、GitHub Webにもアップロードしません。

## 9. Vercelへ登録して公開

1. https://vercel.com/ を開く。
2. GitHubアカウントでサインインする。
3. **Add New Project** を選択する。
4. `yuta2012/github-setup` をImportする。
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

1. GitHubで `github-setup` リポジトリを開く。
2. 対象ファイルを開く。
3. 鉛筆アイコンの **Edit this file** を押す。
4. 内容を編集する。
5. **Commit changes** を押す。
6. `github-setup` ブランチへ直接commitするか、新しいブランチを作成する。
7. 新しいブランチを使った場合は **Open pull request** からPull Requestを作成する。

Vercelは `github-setup` ブランチへのcommitを検知すると、自動的に再デプロイします。

## 13. 重要なセキュリティ注意

- `.env.local` をGitHubへpushしない。
- `service_role` キーをブラウザーやVercelの公開コードに埋め込まない。
- Supabaseの匿名アクセス用ポリシーは試作向けであり、公開運用ではSupabase Authとユーザー単位のRLSを追加する。
- GitHubやSupabaseのパスワードをコードやMarkdownに書かない。
- 公開キーを誤ってGitHubにpushした場合は、Supabase Dashboardでキーを更新する。
