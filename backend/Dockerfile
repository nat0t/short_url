FROM python:3.8.6

ENV DB=mysql
ENV CACHE=redis
ENV MYSQL_USER=dbadmin
ENV MYSQL_PASSWORD=dbpassword
ENV MYSQL_DATABASE=shortener
ENV DJANGO_SECRET_KEY="a28m2$9o(7_9glt(r050s1n#lpdb%975@b*j6z_i0ly)x#vgdv"

RUN apt-get update && apt-get install -y mariadb-client
RUN pip3 install --upgrade pip

COPY ./ ./
RUN pip3 install -r requirements.txt

RUN chmod +x wait-for-mysql.sh
RUN chmod +x maintain_db.sh

RUN pip3 install gunicorn