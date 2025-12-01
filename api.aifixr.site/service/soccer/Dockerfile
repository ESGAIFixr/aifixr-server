# Build stage
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
RUN apk add --no-cache bash
COPY gradlew .
COPY gradle gradle
COPY build.gradle settings.gradle ./
COPY service/soccer service/soccer
COPY service/build.gradle service/
RUN chmod +x ./gradlew
RUN ./gradlew :service:soccer:bootJar --no-daemon

# Runtime stage
FROM eclipse-temurin:21-jdk-alpine
VOLUME /tmp
COPY --from=build /app/service/soccer/build/libs/soccer-*.jar soccer-service.jar
ENTRYPOINT ["java", "-jar", "/soccer-service.jar"]
