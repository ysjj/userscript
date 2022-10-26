# userscript
Userscript for Tampermonkey and/or other userscript managers

## gnu_emacs_lisp_reference_manual_adhoc_sidebar.user.js

[GNU Emacs Lisp Reference Manual](https://www.gnu.org/software/emacs/manual/elisp.html) の
[HTML - with one web page per node](https://www.gnu.org/software/emacs/manual/html_node/elisp/index.html) について
サイドバー化するものです。

Emacs 28.2 版でのみ表示確認しています。

HTML 構造に強く依存するため、旧版・今後の新版で同様に使えるかどうかは不明です。

## ruby_lang_docs_version_switcher.user.js

![バージョンセレクタ](/assets/images/ruby_lang_docs_version_switcher.png)

[Ruby リファレンスマニュアル](https://www.ruby-lang.org/ja/) で表示するバージョンを選択可能にするものです。

バージョンの選択肢は固定で埋め込んでいるので、好みに応じて修正して使用してください。

URL 中のバージョンを書き換えてリンクを作成しているだけなので
切り替え後のバージョンに存在しないページは Not Found エラーページが表示されます。

## ruby_on_rails_api_version_switcher.user.js

![バージョンセレクタ](/assets/images/ruby_on_rails_api_version_switcher.png)

[Ruby on Rails API](https://api.rubyonrails.org/) で表示するバージョンを選択可能にするものです。

バージョンの選択肢は固定で埋め込んでいるので、好みに応じて修正して使用してください。

URL 中のバージョンを書き換えてリンクを作成しているだけなので
切り替え後のバージョンに存在しないページは Edge ページにリダイレクトされます。

### 6.0 以前について

6.0 以前ではサイドバーに非対応となっています。

これは frame が使用されているための制限です。
