# Family Car Calendar

家族の車利用をSupabaseで共有するNext.jsアプリです。

## 現在の機能

- 月間カレンダーと予約一覧
- 使用者、開始・終了時刻、行き先、メモの登録
- 時間帯が重なる予約の防止
- 予約の削除
- Supabaseへの予約保存・読み込み・削除
- スマートフォン向けレイアウト

## 起動方法

Node.js（LTS版）をインストールしたあと、PowerShellで実行します。

```powershell
Set-Location C:\Users\yutao\vscode\github-setup\app
Copy-Item .env.local.example .env.local
npm install
npm run dev
```

`.env.local` を開き、Supabaseの `Project URL` と `anon public key` を設定します。

ブラウザーで `http://localhost:3000` を開きます。

## Supabaseの準備

1. Supabase DashboardのSQL Editorで、`supabase/migrations/20260906000000_create_reservations.sql` を実行します。
2. Project Settings > APIから `Project URL` と `anon public key` を確認します。
3. `app/.env.local` に値を設定します。

`service_role` keyはブラウザーで使わないでください。`.env.local` はGitに登録されない設定になっています。

## GitHubへ反映

リポジトリのルートで実行します。

```powershell
Set-Location C:\Users\yutao\vscode\github-setup
git add .gitignore app supabase
git commit -m "Connect car reservations to Supabase"
git push
```

現在のSQLポリシーは、ログイン機能を追加する前の家族内試作向けです。インターネットへ公開する場合はSupabase Authを追加し、`anon`向けポリシーをユーザー単位のRLSに変更してください。
