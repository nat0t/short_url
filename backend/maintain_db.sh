#!/bin/bash

host="$1"
MYSQL_USER=dbadmin
MYSQL_PASSWORD=dbpassword
MYSQL_DATABASE=shortener

mysql -h "$host" -u${MYSQL_USER} -p${MYSQL_PASSWORD} ${MYSQL_DATABASE} -e 'DROP EVENT IF EXISTS clear_expired;CREATE EVENT clear_expired ON SCHEDULE EVERY 1 DAY DO DELETE FROM main_shorter WHERE UNIX_TIMESTAMP(NOW()) > UNIX_TIMESTAMP(expires_at);';