FROM gradle:8.10-jdk21 AS build
WORKDIR /app

COPY build.gradle.kts settings.gradle.kts gradlew gradlew.bat /app/
COPY gradle /app/gradle
RUN ./gradlew --no-daemon dependencies

COPY src /app/src
RUN ./gradlew --no-daemon clean bootJar -x test

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/build/libs/*.jar /app/app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
