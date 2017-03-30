FROM node:6.9.1

# 環境変数の設定
ENV APP_ROOT /usr/src/proxy

# ディレクトリの作成
RUN mkdir -p ${APP_ROOT}

# 作業ディレクトリの変更
WORKDIR ${APP_ROOT}

# package.jsonのコピー
COPY ./package.json ./

RUN npm install

ENTRYPOINT npm start
