# Build stage
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
RUN apk add --no-cache bash
COPY gradlew .
COPY gradle gradle
COPY build.gradle settings.gradle ./
COPY service/common service/common
COPY service/build.gradle service/
RUN chmod +x ./gradlew
RUN ./gradlew :service:common:bootJar --no-daemon

# Runtime stage
FROM eclipse-temurin:21-jdk-alpine
VOLUME /tmp
COPY --from=build /app/service/common/build/libs/common-*.jar common-service.jar
ENTRYPOINT ["java", "-jar", "/common-service.jar"]
