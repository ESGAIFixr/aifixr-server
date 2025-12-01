# Build stage
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
RUN apk add --no-cache bash
COPY gradlew .
COPY gradle gradle
COPY build.gradle settings.gradle ./
COPY service/governance service/governance
COPY service/build.gradle service/
RUN chmod +x ./gradlew
RUN ./gradlew :service:governance:bootJar --no-daemon

# Runtime stage
FROM eclipse-temurin:21-jdk-alpine
VOLUME /tmp
RUN apk update && apk add --no-cache curl
COPY --from=build /app/service/governance/build/libs/governance-*.jar governance-service.jar
ENTRYPOINT ["java", "-jar", "/governance-service.jar"]

