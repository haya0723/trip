# ステージ1: ビルダー
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# 依存関係のインストール
COPY package*.json ./
RUN npm install

# アプリケーションソースのコピー
COPY . .
# RUN npm run build # もしビルドステップがあれば

# ステージ2: ランタイム
FROM node:20-alpine
WORKDIR /usr/src/app

# ビルダーステージから必要なものをコピー
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/src ./src
COPY --from=builder /usr/src/app/.env ./

EXPOSE 3001
# CMD命令を変更して、src/index.jsの内容をcatで出力してからnodeで実行
CMD sh -c "echo '--- Contents of src/index.js in container ---' && cat src/index.js && echo '--- End of src/index.js in container ---' && echo '--- Starting Node.js application ---' && node src/index.js"
