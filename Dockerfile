# ステージ1: ビルド環境
FROM node:18-alpine AS build

# 作業ディレクトリを設定
WORKDIR /app

# package.json と package-lock.json (または yarn.lock) をコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# ソースコードをコピー
COPY . .

# アプリケーションをビルド
RUN npm run build

# ステージ2: 本番環境 (Nginx)
FROM nginx:1.25-alpine

# ビルドステージからビルド成果物 (dist ディレクトリ) をコピー
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx の設定ファイルをコピー (後で作成)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ポート 8080 を公開
EXPOSE 8080

# Nginx をフォアグラウンドで実行
CMD ["nginx", "-g", "daemon off;"]
