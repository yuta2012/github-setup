# GitHub リポジトリ再作成の記録

## 実施したこと

以前の `vscode` リポジトリを GitHub 上から削除し、新しく `github-setup` という名前のリポジトリを作成しました。

これにより、ローカルの `github-setup` フォルダーを、GitHub の `github-setup` リポジトリと直接連携できる構成に変更しました。

## ローカルの構成

```text
vscode/
└─ github-setup/       Git リポジトリのルート
   ├─ GITHUB_SETUP.md
   ├─ REPOSITORY_RECREATE.md
   └─ hell
```

`github-setup` フォルダー内に `.git` という Git の管理情報を置いています。そのため、Git の操作は `github-setup` フォルダーを基準に行います。

## GitHub 側で行った操作

1. GitHub の `vscode` リポジトリを削除しました。
2. GitHub で新しい `github-setup` リポジトリを作成しました。
3. 新しいリポジトリには、既存の README や `.gitignore` を追加せず、空の状態で作成しました。

リポジトリを削除すると、GitHub 上のリポジトリ名、ファイル表示、ブランチなどが削除されます。ローカルに保存されている Git の履歴は、ローカルの `.git` を残しているため失われません。

## ローカルで行ったコマンド

### 接続先の変更

```powershell
git -C github-setup remote set-url origin https://github.com/yuta2012/github-setup.git
git -C github-setup remote -v
```

`origin` という名前の接続先を、削除した `vscode` から新しい `github-setup` に変更しました。

### 新しいリポジトリへの push

```powershell
git -C github-setup push --set-upstream origin github-setup
git -C github-setup status --short --branch
```

ローカルの `github-setup` ブランチを新しい GitHub リポジトリへ送信し、以後の push 先として登録しました。

## 確認結果

- GitHub リポジトリ: `https://github.com/yuta2012/github-setup`
- リモート URL: `https://github.com/yuta2012/github-setup.git`
- ローカルブランチ: `github-setup`
- GitHub への push: 完了
- ローカルと GitHub: 同期済み

今後このリポジトリを操作するときは、`github-setup` フォルダーを VS Code で開くと、Git の変更を正しく確認できます。