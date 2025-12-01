# 🎯 실용적인 다음 단계 (우선순위 기반)

**작성일**: 2024-11-24  
**기반 문서**: GATEWAY_WEBFLUX_STRATEGY.md

---

## ✅ 현재 상태 요약

```
Discovery Server: 이미 WebFlux 사용 중 ✅
Eureka Server: Spring Web (유지) ✅
마이크로서비스: Spring Web (유지) ✅
```

**결론**: 추가 "변환" 작업 불필요. 선택적 최적화만 진행.

---

## 🚀 우선순위별 개선 계획

### 🔥 우선순위 1: Redis Rate Limiting (즉시 적용 권장)

**목적**: API 남용 방지 및 서비스 보호  
**난이도**: ⭐⭐  
**효과**: ⭐⭐⭐⭐⭐

#### 1.1 의존성 추가

```gradle
// server/discovery/build.gradle
dependencies {
    implementation 'org.springframework.cloud:spring-cloud-starter-gateway'
    implementation 'org.springframework.cloud:spring-cloud-starter-netflix-eureka-client'
    implementation 'org.springframework.cloud:spring-cloud-starter-config'
    
    // ✅ Redis Rate Limiting 추가
    implementation 'org.springframework.boot:spring-boot-starter-data-redis-reactive'
    
    developmentOnly 'org.springframework.boot:spring-boot-devtools'
}
```

#### 1.2 application.yaml 업데이트

```yaml
# server/discovery/src/main/resources/application.yaml
spring:
  application:
    name: discovery
  
  # Redis 연결 설정
  data:
    redis:
      host: ${REDIS_HOST:redis}
      port: ${REDIS_PORT:6379}
      password: ${REDIS_PASSWORD:}
      timeout: 2000ms
  
  cloud:
    gateway:
      routes:
        # Soccer Service - Rate Limiting 적용
        - id: soccer-service
          uri: lb://SOCCER
          predicates:
            - Path=/api/soccer/**
          filters:
            - StripPrefix=2
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 10  # 초당 10개
                redis-rate-limiter.burstCapacity: 20  # 최대 20개
                redis-rate-limiter.requestedTokens: 1
        
        # User Service - Rate Limiting 적용
        - id: user-service
          uri: lb://user
          predicates:
            - Path=/api/user/**
          filters:
            - StripPrefix=1
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 30
                redis-rate-limiter.burstCapacity: 50
        
        # 나머지 서비스들도 동일하게 적용...

logging:
  level:
    root: INFO
    org.springframework.cloud.gateway: DEBUG
    org.springframework.web: INFO
    reactor.netty: INFO
    site.aifixr.discovery: DEBUG

eureka:
  client:
    service-url:
      defaultZone: ${EUREKA_SERVER_URL:http://eureka-server:8761/eureka/}
    register-with-eureka: true
    fetch-registry: true
```

#### 1.3 적용 및 테스트

```bash
# 1. 빌드 및 재시작
docker-compose build discovery-server
docker-compose up -d discovery-server

# 2. Rate Limiting 테스트
# 빠르게 11번 요청 (10개 제한 초과)
for i in {1..11}; do 
  curl -w "\n" http://localhost:8080/api/soccer/search?keyword=test
done

# 예상 결과:
# 처음 10개: 정상 응답
# 11번째: HTTP 429 Too Many Requests

# 3. Redis 확인
docker exec -it redis redis-cli
AUTH Redis0930!
KEYS request_rate_limiter*
```

---

### 🔥 우선순위 2: Circuit Breaker (장애 격리)

**목적**: 서비스 장애 시 빠른 실패 및 폴백  
**난이도**: ⭐⭐  
**효과**: ⭐⭐⭐⭐

#### 2.1 의존성 추가

```gradle
// server/discovery/build.gradle
dependencies {
    // ... 기존 의존성
    
    // ✅ Circuit Breaker 추가
    implementation 'org.springframework.cloud:spring-cloud-starter-circuitbreaker-reactor-resilience4j'
}
```

#### 2.2 Fallback Controller 생성

```java
// server/discovery/src/main/java/site/aifixr/api/discovery/FallbackController.java
package site.aifixr.api.discovery;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/fallback")
public class FallbackController {

    @GetMapping("/soccer")
    public Mono<ResponseEntity<Map<String, Object>>> soccerFallback() {
        return Mono.just(ResponseEntity
            .status(HttpStatus.SERVICE_UNAVAILABLE)
            .body(Map.of(
                "code", 503,
                "message", "Soccer 서비스가 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요.",
                "timestamp", System.currentTimeMillis()
            ))
        );
    }

    @GetMapping("/user")
    public Mono<ResponseEntity<Map<String, Object>>> userFallback() {
        return Mono.just(ResponseEntity
            .status(HttpStatus.SERVICE_UNAVAILABLE)
            .body(Map.of(
                "code", 503,
                "message", "User 서비스가 일시적으로 사용할 수 없습니다.",
                "timestamp", System.currentTimeMillis()
            ))
        );
    }
}
```

#### 2.3 application.yaml 업데이트

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: soccer-service
          uri: lb://SOCCER
          predicates:
            - Path=/api/soccer/**
          filters:
            - StripPrefix=2
            - name: CircuitBreaker
              args:
                name: soccerCircuitBreaker
                fallbackUri: forward:/fallback/soccer
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 10
                redis-rate-limiter.burstCapacity: 20

# Resilience4j 설정
resilience4j:
  circuitbreaker:
    instances:
      soccerCircuitBreaker:
        sliding-window-size: 10              # 최근 10개 요청 기준
        failure-rate-threshold: 50           # 50% 실패 시 Circuit Open
        wait-duration-in-open-state: 10s     # Open 상태 10초 유지
        permitted-number-of-calls-in-half-open-state: 3
        automatic-transition-from-open-to-half-open-enabled: true
```

---

### 🔶 우선순위 3: Actuator 모니터링 (운영 필수)

**목적**: 실시간 모니터링 및 메트릭 수집  
**난이도**: ⭐  
**효과**: ⭐⭐⭐⭐

#### 3.1 의존성 추가

```gradle
// server/discovery/build.gradle
dependencies {
    // ... 기존 의존성
    
    // ✅ Actuator 추가
    implementation 'org.springframework.boot:spring-boot-starter-actuator'
    implementation 'io.micrometer:micrometer-registry-prometheus'
}
```

#### 3.2 application.yaml 업데이트

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus,gateway
  endpoint:
    health:
      show-details: always
  metrics:
    tags:
      application: ${spring.application.name}
```

#### 3.3 확인

```bash
# Health Check
curl http://localhost:8080/actuator/health

# Gateway 라우트 확인
curl http://localhost:8080/actuator/gateway/routes | jq

# Prometheus 메트릭
curl http://localhost:8080/actuator/prometheus

# 메트릭 확인
curl http://localhost:8080/actuator/metrics/gateway.requests
```

---

### 🔷 우선순위 4: 로깅 필터 (선택사항)

**목적**: 요청/응답 추적 및 디버깅  
**난이도**: ⭐  
**효과**: ⭐⭐⭐

#### 4.1 LoggingFilter 생성

```java
// server/discovery/src/main/java/site/aifixr/api/discovery/LoggingFilter.java
package site.aifixr.api.discovery;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.Instant;

@Component
public class LoggingFilter implements GlobalFilter, Ordered {

    private static final Logger log = LoggerFactory.getLogger(LoggingFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        Instant startTime = Instant.now();
        String requestId = exchange.getRequest().getId();
        String path = exchange.getRequest().getPath().value();
        String method = exchange.getRequest().getMethod().name();
        
        log.info("🚀 [{}] {} {}", requestId, method, path);
        
        return chain.filter(exchange)
            .doFinally(signalType -> {
                Duration duration = Duration.between(startTime, Instant.now());
                int statusCode = exchange.getResponse().getStatusCode() != null 
                    ? exchange.getResponse().getStatusCode().value() 
                    : 0;
                
                log.info("✅ [{}] {} {} - Status: {} ({}ms)", 
                    requestId, method, path, statusCode, duration.toMillis());
            });
    }

    @Override
    public int getOrder() {
        return -1; // 가장 먼저 실행
    }
}
```

---

## 📊 적용 순서 및 체크리스트

### 1주차: 기본 보안 및 모니터링
- [ ] Redis Rate Limiting 적용
- [ ] Actuator 활성화
- [ ] 로깅 필터 추가
- [ ] 부하 테스트 수행

### 2주차: 장애 대응
- [ ] Circuit Breaker 적용
- [ ] Fallback 엔드포인트 구현
- [ ] 장애 시나리오 테스트

### 3주차: 모니터링 강화
- [ ] Prometheus + Grafana 설정
- [ ] 알림 규칙 설정
- [ ] 대시보드 구성

---

## 🎯 성능 측정 방법

### Before (현재)
```bash
# 부하 테스트
ab -n 1000 -c 100 http://localhost:8080/api/soccer/search?keyword=test

# 결과 기록
# - Requests per second: ?
# - Time per request: ?
# - Failed requests: ?
```

### After (개선 후)
```bash
# 동일한 테스트 수행
ab -n 1000 -c 100 http://localhost:8080/api/soccer/search?keyword=test

# 비교 분석
# - Rate Limiting 작동 확인
# - Circuit Breaker 작동 확인
# - 메트릭 수집 확인
```

---

## ⚠️ 주의사항

### 1. 점진적 적용
```
❌ 한 번에 모든 기능 추가
✅ 하나씩 추가하고 테스트
```

### 2. 프로덕션 배포 전
```
✅ 개발 환경에서 충분히 테스트
✅ 부하 테스트로 성능 검증
✅ 장애 시나리오 테스트
✅ 롤백 계획 준비
```

### 3. 모니터링 필수
```
✅ Actuator로 실시간 모니터링
✅ 로그 레벨 적절히 조정
✅ 알림 설정 (장애 발생 시)
```

---

## 📚 참고 문서

1. **GATEWAY_WEBFLUX_STRATEGY.md** - 전체 전략 및 이론
2. **REDIS_INTEGRATION_STRATEGY.md** - Redis 통합 가이드
3. **FRONTEND_BACKEND_CONNECTION_STRATEGY.md** - 전체 아키텍처

---

**다음 단계**: 우선순위 1부터 차근차근 적용하세요! 🚀

