FROM node:6.9.1

# 環境変数の設定
ENV APP_ROOT /usr/src/app

# ディレクトリの作成
RUN mkdir -p ${APP_ROOT}  \
    && mkdir -p ${APP_ROOT}/static

# 作業ディレクトリの変更
WORKDIR ${APP_ROOT}

# package.jsonのコピー
COPY ./package.json ./

RUN npm install

# express serverのコピー
COPY ./app.js ./

# 処理開始
ENTRYPOINT npm start
