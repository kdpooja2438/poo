# Stage 1: build the jar using Maven + JDK 21
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy only pom.xml first so Docker can cache the downloaded dependencies
# as a separate layer - they only get re-downloaded if pom.xml changes.
COPY pom.xml .
RUN mvn -B dependency:go-offline

# Now copy the actual source code and build the jar.
COPY src ./src
RUN mvn -B clean package -DskipTests

# Stage 2: run the jar using only a JRE (no Maven, no JDK, no source code)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /app/target/backend-0.1.0.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
