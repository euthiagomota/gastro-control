# ====================================================
# Build stage
# ====================================================
FROM maven:3.9.6-amazoncorretto-21 AS builder

WORKDIR /app

# Copy pom.xml first for dependency caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build
COPY src ./src
RUN mvn package -DskipTests -B

# ====================================================
# Runtime stage
# ====================================================
FROM amazoncorretto:21-alpine

WORKDIR /app

# Security: create non-root user
RUN addgroup -S gastrocontrol && adduser -S gastrocontrol -G gastrocontrol

# Create required directories
RUN mkdir -p /app/uploads /app/logs && \
    chown -R gastrocontrol:gastrocontrol /app

# Copy JAR from builder
COPY --from=builder /app/target/*.jar app.jar

# Switch to non-root user
USER gastrocontrol

# JVM optimizations for containers
ENV JAVA_OPTS="-Xms256m -Xmx512m \
    -XX:+UseG1GC \
    -XX:MaxGCPauseMillis=200 \
    -XX:+UseStringDeduplication \
    -Djava.security.egd=file:/dev/./urandom \
    -Dspring.profiles.active=docker"

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget -qO- http://localhost:8080/api/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
