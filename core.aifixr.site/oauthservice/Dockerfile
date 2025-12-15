# Build stage
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
RUN apk add --no-cache bash
COPY api.aifixr.site/gradlew .
COPY api.aifixr.site/gradle gradle
COPY core.aifixr.site/build.gradle core.aifixr.site/settings.gradle ./
COPY core.aifixr.site/oauthservice oauthservice
RUN chmod +x ./gradlew
# Clean and build
RUN ./gradlew :oauthservice:clean :oauthservice:bootJar --no-daemon

# Runtime stage
FROM eclipse-temurin:21-jdk-alpine
VOLUME /tmp
COPY --from=build /app/oauthservice/build/libs/oauthservice-*.jar oauth-service.jar
ENTRYPOINT ["java", "-jar", "/oauth-service.jar"]
