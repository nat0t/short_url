#!/bin/bash

set -e
set -x

host="$1"
MYSQL_USER=dbadmin
MYSQL_PASSWORD=dbpassword
MYSQL_DATABASE=shortener
shift
cmd="$@"

until mysql -h "$host" -u${MYSQL_USER} -p${MYSQL_PASSWORD} ${MYSQL_DATABASE} -e 'select 1'; do
  >&2 echo "MySQL is unavailable - sleeping"
  sleep 1
done

>&2 echo "Mysql is up - executing command"
exec $cmd