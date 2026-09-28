#Multi stage build for Java Spring Boot application
FROM maven:3.9.5-eclipse-temurin-17 AS build

WORKDIR /app

# copy the pom.xml file and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# copy the source code and build the application
COPY src ./src
RUN mvn clean install -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app 

# Create a non-root user
RUN addgroup -g 1001 appgroup && \
    adduser -D -u 1001 -G appgroup appuser

# Copy the JAR file from the build stage
COPY --from=build /app/target/app.jar app.jar

# Change ownership of the application directory
RUN chown -R appuser:appgroup /app

USER appuser

# Expose the application port on the container
EXPOSE 8080

# this steps it to check the spring boot application health status inside the container, 
#if the application is not healthy it will exit with status code 1
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

#start the application 
ENTRYPOINT ["java", "-jar", "app.jar"]