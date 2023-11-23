#!/bin/sh
# private-isu用（コンテナごとにサービスが別れているのでローカルPCがある環境で実行する）

set -e

now=`date +%Y%m%d-%H%M%S`

# nginxにログファイルを開き直すシグナルを送信する
docker compose run --rm --entrypoint "mv /var/log/nginx/access.log /var/log/nginx/access.log.$now && nginx -s reopen" nginx

# mysqlも同様
docker compose run --rm --entrypoint "mv /var/log/mysql/mysql-slow.log /var/log/mysql/mysql-slow.log.$now && mysql -proot -e \"FLUSH SLOW LOGS;\"" mysql
