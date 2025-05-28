#!/usr/bin/env sh

# 當發生錯誤時中止腳本
set -e

# 構建
npm run build

# cd 到構建輸出目錄
cd dist

# 發布到自定義域名
# echo 'www.example.com' > CNAME

git init
git checkout -B main
git add -A
git commit -m 'deploy'

# 如果發布到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git main

# 如果發布到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:alchalade/10-Year-Financial-Plan.git main:gh-pages

cd -