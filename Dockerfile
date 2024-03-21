FROM openjdk:17-alpine

WORKDIR /app

COPY . /app

RUN chmod +x ./gradlew

RUN ./gradlew build --no-daemon

ENTRYPOINT ["java","-jar","build/libs/rest-0.0.1-SNAPSHOT.jar"]