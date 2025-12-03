# Build stage
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
RUN apk add --no-cache bash
COPY api.aifixr.site/gradlew .
COPY api.aifixr.site/gradle gradle
COPY api.aifixr.site/build.gradle api.aifixr.site/settings.gradle ./
COPY core.aifixr.site/user services/user
COPY core.aifixr.site/build.gradle services/
RUN chmod +x ./gradlew
# Retry Gradle build up to 3 times in case of network issues
RUN for i in 1 2 3; do ./gradlew :services:user:bootJar --no-daemon && break || sleep 5; done

# Runtime stage
FROM eclipse-temurin:21-jdk-alpine
VOLUME /tmp
COPY --from=build /app/services/user/build/libs/user-*.jar user-service.jar
ENTRYPOINT ["java", "-jar", "/user-service.jar"]
