# Build stage
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
RUN apk add --no-cache bash
COPY gradlew .
COPY gradle gradle
COPY build.gradle settings.gradle ./
COPY service/environment service/environment
COPY service/build.gradle service/
RUN chmod +x ./gradlew
RUN ./gradlew :service:environment:bootJar --no-daemon

# Runtime stage
FROM eclipse-temurin:21-jdk-alpine
VOLUME /tmp
RUN apk update && apk add --no-cache curl
COPY --from=build /app/service/environment/build/libs/environment-*.jar environment-service.jar
ENTRYPOINT ["java", "-jar", "/environment-service.jar"]
