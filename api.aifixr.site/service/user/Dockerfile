# Build stage
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
RUN apk add --no-cache bash
COPY gradlew .
COPY gradle gradle
COPY build.gradle settings.gradle ./
COPY service/user service/user
COPY service/build.gradle service/
RUN chmod +x ./gradlew
RUN ./gradlew :service:user:bootJar --no-daemon

# Runtime stage
FROM eclipse-temurin:21-jdk-alpine
VOLUME /tmp
COPY --from=build /app/service/user/build/libs/user-*.jar user-service.jar
ENTRYPOINT ["java", "-jar", "/user-service.jar"]
