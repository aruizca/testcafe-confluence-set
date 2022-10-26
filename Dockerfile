FROM testcafe/testcafe:2.0.1
LABEL MAINTAINER @aruizca - Angel Ruiz

# Copy the files
COPY . /app/
WORKDIR app
ENTRYPOINT ["entrypoint.sh"]
