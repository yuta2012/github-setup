# コード作成・修正の手順書

この手順書は、`github-setup` リポジトリでコードを作成または修正し、GitHub へ反映するまでの流れをまとめたものです。

## 1. 作業フォルダーを開く

VS Code で Git リポジトリのルートである `github-setup` フォルダーを開きます。

PowerShell から開く場合:

```powershell
code c:\Users\yutao\vscode\github-setup
```

## 2. 作業前の状態を確認する

```powershell
Set-Location c:\Users\yutao\vscode\github-setup
git status --short --branch
git remote -v
git pull origin github-setup
```

- `Set-Location`: 作業するフォルダーへ移動します。
- `git status`: 現在のブランチと未保存の変更を確認します。
- `git remote`: GitHub の接続先を確認します。
- `git pull`: GitHub にある最新の変更を取り込みます。

作業開始時に、意図しない変更が表示されていないことを確認します。未保存の変更がある場合は、内容を確認してから作業を始めます。

## 3. 作業用ブランチを作成する

```powershell
git switch github-setup
git pull origin github-setup
git switch -c feature/変更内容
```

`feature/変更内容` は、実際の変更内容が分かる名前に置き換えます。例えば、ログイン機能を追加する場合は次のようにします。

```powershell
git switch -c feature/add-login
```

ブランチを分けると、作業中の変更を `github-setup` の基準ブランチから分離できます。

## 4. コードを作成・修正する

VS Code でコードを編集し、必要なファイルを保存します。新しいファイルを作成した場合は、Git が未追跡ファイルとして検出できる場所に保存します。

変更中は、次のコマンドで差分を確認できます。

```powershell
git status --short
git diff
```

- `git status --short`: 変更されたファイルの一覧を表示します。
- `git diff`: 保存済みファイルと直前の commit の差分を表示します。

## 5. 動作確認とエラーチェックを行う

プロジェクトで決められているテスト、ビルド、Lint、型チェックなどを実行します。例えば、次のようなコマンドを使用します。

```powershell
npm test
npm run lint
npm run build
```

利用できるコマンドはプロジェクトの `package.json` を確認してください。

```powershell
Get-Content package.json
```

Git に登録する前に、Markdown やテキストの空白エラーも確認できます。

```powershell
git diff --check
```

エラーが出た場合は、commit する前に修正して同じチェックを再実行します。

## 6. commit に含めるファイルを選ぶ

```powershell
git add --all
git status --short
```

`git add --all` は、作成・変更・削除したファイルを次の commit の対象として登録します。`git status` の一覧を確認し、不要なファイルや秘密情報が含まれていないことを確認します。

特定のファイルだけを登録する場合:

```powershell
git add path\to\file
```

## 7. commit を作成する

```powershell
git commit -m "変更内容を短く説明"
```

commit は、登録した変更を Git の履歴として保存する操作です。メッセージには、何を変更したかを短く書きます。

## 8. GitHub へ push する

作業用ブランチを初めて push する場合:

```powershell
git push --set-upstream origin feature/変更内容
```

2回目以降の push は次のコマンドで実行できます。

```powershell
git push
```

`origin` は GitHub リポジトリ、`feature/変更内容` は作業用ブランチを表します。

## 9. push 後の状態を確認する

```powershell
git status --short --branch
git log -3 --oneline
git remote -v
```

変更が残っていないこと、最新 commit が表示されること、接続先が `https://github.com/yuta2012/github-setup.git` であることを確認します。

## 10. 作業用ブランチを統合する

GitHub で Pull Request を作成し、レビューと確認が完了したら `github-setup` ブランチへ統合します。統合後にローカルの基準ブランチを更新します。

```powershell
git switch github-setup
git pull origin github-setup
git branch -d feature/変更内容
```

まだ統合していないブランチを削除する場合は、内容が失われる可能性があるため、削除してよいことを確認してから実行します。

## よく使うコマンド一覧

| コマンド | 目的 |
| --- | --- |
| `git status --short --branch` | ブランチと変更状態を確認する |
| `git pull origin github-setup` | GitHub の最新変更を取り込む |
| `git switch -c feature/変更内容` | 作業用ブランチを作成する |
| `git diff` | 変更内容を確認する |
| `git diff --check` | 空白などの差分エラーを確認する |
| `git add --all` | 変更を commit 対象に登録する |
| `git commit -m "メッセージ"` | 変更を履歴に保存する |
| `git push` | commit を GitHub へ送信する |
| `git log -3 --oneline` | 最新の履歴を確認する |