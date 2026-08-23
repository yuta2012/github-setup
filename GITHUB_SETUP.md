# GitHub 接続作業の記録

## 実施したこと

- `c:\Users\yutao\vscode` をローカル Git リポジトリとして初期化しました。これは、このフォルダー内のファイル変更を Git で記録・管理できる状態にしたという意味です。
- 現在のファイル `hell` をステージングしました。ステージングとは、次のコミット（変更履歴）に含めるファイルとして選択する作業です。
- 初回コミット `Initial commit` を作成しました。
- 既定ブランチを `master` から `main` に変更しました。
- VS Code の GitHub 公開コマンドを起動しました。これは、GitHub アカウントに新しいリポジトリを作成し、ローカルの Git リポジトリと接続するための機能です。
- GitHub リポジトリ `https://github.com/yuta2012/vscode` を作成し、ローカルの内容を push しました。push とは、ローカルのコミットを GitHub にアップロードする作業です。

## 実行したコマンド

### 状態の確認

```powershell
Get-Location
Get-ChildItem -Force
git status --short --branch
git remote -v
```

現在のフォルダー、ファイル一覧、Git の状態、GitHub 接続先を確認しました。最初は Git リポジトリと接続先がありませんでした。

### Git の利用確認と初期化

```powershell
git --version
git init
git status --short --branch
```

Git が利用できることを確認し、現在のフォルダーを Git リポジトリとして初期化しました。

### 初回コミットの作成

```powershell
git add --all
git commit -m "Initial commit"
git branch -M main
git status --short --branch
```

`hell` をステージングし、初回コミットを作成して、ブランチ名を `main` に変更しました。

### GitHub への公開

VS Code のコマンドとして `GitHub: Publish to GitHub` を実行しました。GitHub アカウントとリポジトリを選択して、`origin` という名前のリモート接続を作成しました。

### 記録ファイルの反映と push

```powershell
git remote -v
git add GITHUB_SETUP.md
git commit -m "Document GitHub setup"
git push origin main
git status --short --branch
```

その後、説明を追加したため、次のコマンドでも更新を GitHub に反映しました。

```powershell
git add GITHUB_SETUP.md
git commit -m "Explain GitHub setup steps"
git push origin main
git status --short --branch
```

最後の `git status --short --branch` で `main...origin/main` と表示され、ローカルと GitHub が同期していることを確認しました。

## 現在の状態

- ローカルブランチ: `main`
- GitHub リモート: `https://github.com/yuta2012/vscode.git`
- GitHub への push: 完了

## 用語

- **Git**: ファイルの変更履歴を記録する仕組みです。
- **Git リポジトリ**: Git で変更履歴を管理しているフォルダーです。
- **コミット**: 変更内容を、後から確認できる履歴として保存することです。
- **ブランチ**: 変更履歴を分けて管理するための流れです。今回は `main` を使用しています。
- **リモート**: GitHub 上にある共有先リポジトリです。
- **push**: ローカルで作成したコミットを GitHub にアップロードすることです。