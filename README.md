# prototyping-sfdc-app-sample

# 概要

ローカル環境でJsforceを通じてSalesforce APIを利用しながら、SPAなアプリケーションを開発する
ローカル環境で開発する際に必要なプロキシサーバをDockerで一元管理することで、
初心者でも簡単にローカルでの開発環境を構築することができると思います。
（Dockerのインストールと起動だけを意識して頂ければ・・・）

# 準備

## Docker

1. [Docker](https://www.docker.com/products/docker)をインストール
2. ドライブの共有設定  
   開発ソースが保存されているドライブの共有設定を有効に設定

![1.png](https://qiita-image-store.s3.amazonaws.com/0/30522/23749159-9dbf-18db-6088-85e51bb39d92.png)


## OAuth設定

ローカルの開発環境からSFDCに認証するために、SFDCのOAuth設定をします
設定が反映させるまで最大10分かかります

### 1. 新規接続アプリケーションの作成
![0.png](https://qiita-image-store.s3.amazonaws.com/0/30522/d8521fb5-69a8-fcc5-8ec6-e21d36862c21.png)

### 2. OAuth設定

- コールバックURLはローカル環境のWebサーバのURLを指定してください（デフォルトはhttp://localhost:3000/）
- OAuth範囲は「データへのアクセスと管理」
- Webアプリケーション設定の開始URL（デフォルトはhttp://localhost:3000/）
![1.png](https://qiita-image-store.s3.amazonaws.com/0/30522/b3524c68-d199-7936-7e12-63f63b3158a8.png)

### 3. 認証情報の保存

「app」-「static」-「js」-「jsforce.config.js」に手順2で保存後に表示されるコンシューマー鍵をclientIdに上書きしてください

```
if (!jsfConn) {
    jsforce.browser.init({
        clientId: 'salesforce コンシューマ鍵',
        redirectUri: 'http://localhost:3000/',
        proxyUrl: 'http://localhost:3123/proxy/'
    });
    var jsfConn = jsforce.browser.connection;

    // アクセストークンがない場合は、認証
    if (!jsfConn.accessToken) {
        jsforce.browser.login();
    }
}
```

## プロキシサーバとWebサーバの起動

ルートディレクトリで以下のコマンドを実行

```
> docker-compose up -d
```

これだけです！
これで開発用のプロキシーサーバとWebサーバが起動します！

## アプリケーションの開発

「app」-「static」配下がWebアプリケーションの公開ディレクトリになります

## サンプルコードを動かすには

appフォルダ配下で以下のコマンドを実行

```
bower install
```

# 参考にしたサイト

- [jsforce](https://jsforce.github.io/)
- [jsforce ajax proxy](https://github.com/jsforce/jsforce-ajax-proxy)
- [tyoshikawa1106のブログ](http://tyoshikawa1106.hatenablog.com/entry/2016/03/17/011316)
