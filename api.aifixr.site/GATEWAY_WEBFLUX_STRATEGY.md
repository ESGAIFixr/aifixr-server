# 🚀 Gateway WebFlux 전환 전략 (초보자용)

**버전**: 1.0  
**최종 수정일**: 2024-11-24  
**난이도**: ⭐⭐ (초급~중급)

---

## 📋 목차

1. [현재 구조 이해하기](#1-현재-구조-이해하기)
2. [WebFlux가 뭔가요?](#2-webflux가-뭔가요)
3. [왜 Gateway만 WebFlux로?](#3-왜-gateway만-webflux로)
4. [전환 전략 (단계별)](#4-전환-전략-단계별)
5. [코드 변경 사항](#5-코드-변경-사항)
6. [테스트 방법](#6-테스트-방법)
7. [트러블슈팅](#7-트러블슈팅)

---

## 1. 현재 구조 이해하기

### 1.1 현재 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                    프론트엔드 (Next.js)                  │
│                    http://localhost:3000                │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP 요청
                     ↓
┌─────────────────────────────────────────────────────────┐
│         Discovery Server (Gateway) - 현재 WebFlux       │
│                  http://localhost:8080                  │
│  ✅ 이미 WebFlux 사용 중! (Spring Cloud Gateway)        │
└────────────────────┬────────────────────────────────────┘
                     │ 서비스 검색 & 라우팅
                     ↓
┌─────────────────────────────────────────────────────────┐
│              Eureka Server - Spring Web                 │
│                  http://localhost:8761                  │
│  📝 서비스 레지스트리 (내부 전용)                        │
└────────────────────┬────────────────────────────────────┘
                     │ 서비스 등록/조회
                     ↓
┌─────────────────────────────────────────────────────────┐
│           마이크로서비스들 - Spring Web                  │
│  ├─ Soccer Service      (8103) - Spring Web            │
│  ├─ User Service        (8104) - Spring Web            │
│  ├─ Environment Service (8105) - Spring Web            │
│  ├─ Social Service      (8106) - Spring Web            │
│  ├─ Governance Service  (8107) - Spring Web            │
│  └─ Common Service      (8101) - Spring Web            │
└─────────────────────────────────────────────────────────┘
```

### 1.2 중요한 발견! 🎉

**좋은 소식**: Discovery Server는 **이미 WebFlux를 사용하고 있습니다!**

증거:
```gradle
// server/discovery/build.gradle
dependencies {
    implementation 'org.springframework.cloud:spring-cloud-starter-gateway'
    // ☝️ Spring Cloud Gateway는 기본적으로 WebFlux 사용!
}
```

```java
// server/discovery/src/main/java/site/aifixr/api/discovery/CorsConfig.java
import org.springframework.web.cors.reactive.CorsWebFilter;
// ☝️ reactive 패키지 = WebFlux 사용 중!
```

---

## 2. WebFlux가 뭔가요?

### 2.1 쉬운 비유로 이해하기

#### 🍔 Spring Web (기존 방식) - 식당의 웨이터

```
고객1 주문 → 웨이터1이 주방에 가서 기다림 (블로킹)
고객2 주문 → 웨이터2가 주방에 가서 기다림 (블로킹)
고객3 주문 → 웨이터3가 주방에 가서 기다림 (블로킹)

❌ 문제: 웨이터가 주방에서 음식 나올 때까지 다른 일을 못함
✅ 장점: 이해하기 쉽고, 디버깅 쉬움
```

#### ⚡ Spring WebFlux (새로운 방식) - 식당의 진동벨

```
고객1 주문 → 웨이터가 주방에 전달 + 진동벨 줌 → 다른 고객 응대
고객2 주문 → 웨이터가 주방에 전달 + 진동벨 줌 → 다른 고객 응대
고객3 주문 → 웨이터가 주방에 전달 + 진동벨 줌 → 다른 고객 응대

✅ 장점: 웨이터 한 명이 여러 고객 동시 처리 가능 (논블로킹)
❌ 단점: 진동벨 시스템 관리가 복잡함
```

### 2.2 기술적 차이

| 항목 | Spring Web | Spring WebFlux |
|------|-----------|----------------|
| **스레드 모델** | 요청당 1개 스레드 | 소수의 스레드로 많은 요청 처리 |
| **블로킹** | 블로킹 (기다림) | 논블로킹 (기다리지 않음) |
| **동시 처리** | 스레드 수만큼 | 거의 무제한 |
| **메모리 사용** | 많음 (스레드당 1MB) | 적음 |
| **학습 곡선** | 쉬움 ⭐ | 어려움 ⭐⭐⭐⭐ |
| **디버깅** | 쉬움 | 어려움 |
| **적합한 곳** | 일반 CRUD, DB 작업 | Gateway, 실시간, 대량 트래픽 |

---

## 3. 왜 Gateway만 WebFlux로?

### 3.1 Gateway의 역할

Gateway는 **중개자** 역할만 합니다:

```
프론트엔드 → Gateway → 마이크로서비스
              ↑
         단순 전달만!
         (DB 작업 없음)
```

### 3.2 Gateway에 WebFlux가 적합한 이유

#### ✅ Gateway의 특징
1. **단순 전달**: DB 작업 없음, 복잡한 비즈니스 로직 없음
2. **높은 트래픽**: 모든 요청이 Gateway를 거침
3. **I/O 대기 많음**: 백엔드 서비스 응답 기다림

#### ❌ 마이크로서비스에 WebFlux가 부적합한 이유
1. **복잡한 비즈니스 로직**: WebFlux로 작성하면 코드 복잡도 ↑↑
2. **DB 작업**: JPA는 블로킹 → WebFlux와 궁합 안 맞음
3. **개발 생산성**: 디버깅 어려움, 학습 곡선 높음

### 3.3 결론

```
✅ Gateway: WebFlux (이미 적용됨!)
   - 단순 라우팅만 담당
   - 높은 처리량 필요
   - 논블로킹 I/O 효과 극대화

✅ 마이크로서비스: Spring Web (현재 유지)
   - 복잡한 비즈니스 로직
   - JPA/DB 작업
   - 개발 생산성 우선
```

---

## 4. 전환 전략 (단계별)

### 4.1 현재 상태 확인 ✅

**이미 완료된 사항**:

1. ✅ Discovery Server는 이미 WebFlux 사용 중
2. ✅ Spring Cloud Gateway 의존성 추가됨
3. ✅ Reactive CORS 설정 완료
4. ✅ 논블로킹 라우팅 설정 완료

### 4.2 추가 최적화 (선택사항)

현재 구조는 이미 최적화되어 있지만, 더 개선할 수 있는 부분:

#### 단계 1: Redis Rate Limiting 추가 (논블로킹)

**목적**: API 요청 제한을 논블로킹 방식으로 처리

```yaml
# server/discovery/src/main/resources/application.yaml
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
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 10  # 초당 10개 요청
                redis-rate-limiter.burstCapacity: 20  # 최대 20개 버스트
```

**필요한 의존성**:
```gradle
// server/discovery/build.gradle
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-data-redis-reactive'
}
```

#### 단계 2: Circuit Breaker 추가 (논블로킹)

**목적**: 서비스 장애 시 빠른 실패 처리

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
            - name: CircuitBreaker
              args:
                name: soccerCircuitBreaker
                fallbackUri: forward:/fallback/soccer
```

**필요한 의존성**:
```gradle
dependencies {
    implementation 'org.springframework.cloud:spring-cloud-starter-circuitbreaker-reactor-resilience4j'
}
```

#### 단계 3: 로깅 및 모니터링 강화

**목적**: WebFlux 비동기 흐름 추적

```java
// server/discovery/src/main/java/site/aifixr/api/discovery/LoggingFilter.java
package site.aifixr.api.discovery;

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

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        Instant startTime = Instant.now();
        String requestId = exchange.getRequest().getId();
        String path = exchange.getRequest().getPath().value();
        
        System.out.println("🚀 [" + requestId + "] Request: " + path);
        
        return chain.filter(exchange)
            .doFinally(signalType -> {
                Duration duration = Duration.between(startTime, Instant.now());
                System.out.println("✅ [" + requestId + "] Response: " + path + 
                                 " (took " + duration.toMillis() + "ms)");
            });
    }

    @Override
    public int getOrder() {
        return -1; // 가장 먼저 실행
    }
}
```

---

## 5. 코드 변경 사항

### 5.1 현재 코드 검토

#### ✅ 이미 올바르게 구현된 부분

**1. Discovery Server Application**
```java
// server/discovery/src/main/java/site/aifixr/api/discovery/DiscoveryApplication.java
@EnableDiscoveryClient
@SpringBootApplication
public class DiscoveryApplication {
    // ✅ 완벽함! 변경 불필요
}
```

**2. CORS 설정 (Reactive)**
```java
// server/discovery/src/main/java/site/aifixr/api/discovery/CorsConfig.java
import org.springframework.web.cors.reactive.CorsWebFilter; // ✅ Reactive!

@Configuration
public class CorsConfig {
    @Bean
    public CorsWebFilter corsWebFilter() {
        // ✅ 완벽함! WebFlux용 CORS 설정
    }
}
```

**3. Gateway 라우팅 (Reactive)**
```yaml
# server/discovery/src/main/resources/application.yaml
spring:
  cloud:
    gateway:
      routes:
        - id: soccer-service
          uri: lb://SOCCER  # ✅ Eureka 로드 밸런싱 (논블로킹)
```

### 5.2 추가 권장 사항

#### 1. Redis 연결 설정 (Reactive)

```yaml
# server/discovery/src/main/resources/application.yaml
spring:
  data:
    redis:
      host: ${REDIS_HOST:redis}
      port: ${REDIS_PORT:6379}
      password: ${REDIS_PASSWORD:}
      # ✅ Lettuce 드라이버는 기본적으로 Reactive 지원
```

#### 2. WebFlux 튜닝

```yaml
# server/discovery/src/main/resources/application.yaml
spring:
  webflux:
    # 최대 메모리 버퍼 크기 (기본 256KB)
    codec:
      max-in-memory-size: 10MB
```

#### 3. Netty 서버 튜닝

```yaml
# server/discovery/src/main/resources/application.yaml
server:
  port: 8080
  netty:
    # 이벤트 루프 스레드 수 (기본: CPU 코어 수 * 2)
    # 보통 기본값이 최적이므로 변경 불필요
```

---

## 6. 테스트 방법

### 6.1 WebFlux 동작 확인

#### 테스트 1: 동시 요청 처리 확인

```bash
# Apache Bench로 부하 테스트
ab -n 1000 -c 100 http://localhost:8080/api/soccer/search?keyword=손흥민

# 결과 확인:
# - Requests per second: WebFlux가 더 높음
# - Time per request: WebFlux가 더 낮음
```

#### 테스트 2: 스레드 사용량 확인

```bash
# Gateway 컨테이너 접속
docker exec -it discovery sh

# JVM 스레드 수 확인
jps  # Java 프로세스 ID 확인
jstack <PID> | grep "http-nio" | wc -l  # Spring Web이면 많은 스레드
jstack <PID> | grep "reactor" | wc -l   # WebFlux면 적은 스레드
```

#### 테스트 3: 로그 확인

```bash
# Gateway 로그 확인
docker logs -f discovery

# 예상 출력:
# 🚀 [abc123] Request: /api/soccer/search
# ✅ [abc123] Response: /api/soccer/search (took 45ms)
```

### 6.2 성능 비교

| 지표 | Spring Web | Spring WebFlux |
|------|-----------|----------------|
| **동시 연결** | 200 (스레드 풀 크기) | 10,000+ |
| **메모리 사용** | 200MB (스레드당 1MB) | 50MB |
| **응답 시간** | 100ms | 80ms |
| **처리량** | 2,000 req/s | 5,000 req/s |

---

## 7. 트러블슈팅

### 7.1 자주 발생하는 문제

#### 문제 1: "Blocking call detected" 경고

**증상**:
```
reactor.core.publisher.BlockingOperationError: 
block()/blockFirst()/blockLast() are blocking
```

**원인**: WebFlux에서 블로킹 코드 사용

**해결**:
```java
// ❌ 잘못된 코드
String result = webClient.get()
    .retrieve()
    .bodyToMono(String.class)
    .block();  // 블로킹!

// ✅ 올바른 코드
return webClient.get()
    .retrieve()
    .bodyToMono(String.class);  // Mono 반환
```

#### 문제 2: Eureka 연결 안 됨

**증상**: Gateway가 서비스를 찾지 못함

**확인 사항**:
```yaml
# application.yaml
eureka:
  client:
    register-with-eureka: true  # ✅ true로 설정
    fetch-registry: true        # ✅ true로 설정
```

**확인 명령어**:
```bash
# Eureka 대시보드 확인
curl http://localhost:8761/

# Discovery가 등록되었는지 확인
curl http://localhost:8761/eureka/apps/DISCOVERY
```

#### 문제 3: CORS 오류

**증상**: 프론트엔드에서 `CORS policy` 오류

**해결**: CorsConfig 확인
```java
corsConfig.setAllowedOriginPatterns(List.of("*")); // ✅ 모든 오리진 허용
corsConfig.setAllowCredentials(true);              // ✅ 인증 정보 허용
```

### 7.2 디버깅 팁

#### 1. Reactor 디버깅 활성화

```java
// DiscoveryApplication.java
@SpringBootApplication
public class DiscoveryApplication {
    public static void main(String[] args) {
        // Reactor 디버그 모드 활성화
        Hooks.onOperatorDebug();
        SpringApplication.run(DiscoveryApplication.class, args);
    }
}
```

#### 2. 로깅 레벨 조정

```yaml
logging:
  level:
    reactor.netty: DEBUG           # Netty 로그
    org.springframework.cloud.gateway: DEBUG  # Gateway 로그
    io.netty: INFO                 # Netty 상세 로그
```

#### 3. Actuator로 모니터링

```gradle
// build.gradle
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-actuator'
}
```

```yaml
# application.yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,gateway
```

**확인**:
```bash
# Gateway 라우트 확인
curl http://localhost:8080/actuator/gateway/routes

# 메트릭 확인
curl http://localhost:8080/actuator/metrics/gateway.requests
```

---

## 8. 요약 및 결론

### 8.1 현재 상태

```
✅ Discovery Server (Gateway): 이미 WebFlux 사용 중!
✅ Eureka Server: Spring Web (유지)
✅ 마이크로서비스: Spring Web (유지)
```

### 8.2 이미 달성한 것

1. ✅ **논블로킹 Gateway**: Spring Cloud Gateway = WebFlux
2. ✅ **높은 처리량**: 이벤트 루프 기반 처리
3. ✅ **낮은 메모리**: 스레드 풀 대신 이벤트 루프
4. ✅ **Reactive CORS**: 논블로킹 CORS 처리

### 8.3 추가 개선 사항 (선택)

| 우선순위 | 개선 사항 | 효과 | 난이도 |
|---------|----------|------|--------|
| 🔥 높음 | Redis Rate Limiting | API 보호 | ⭐⭐ |
| 🔥 높음 | Circuit Breaker | 장애 격리 | ⭐⭐ |
| 🔶 중간 | 로깅 필터 | 모니터링 | ⭐ |
| 🔷 낮음 | Actuator 활성화 | 운영 편의 | ⭐ |

### 8.4 마이크로서비스는 왜 Spring Web?

```
✅ 장점:
- 간단한 코드 (동기 방식)
- JPA와 완벽한 호환
- 쉬운 디버깅
- 빠른 개발 속도

❌ WebFlux로 전환 시 단점:
- 코드 복잡도 ↑↑↑
- JPA 사용 불가 (R2DBC 필요)
- 디버깅 어려움
- 학습 곡선 높음
- 생산성 ↓↓↓
```

### 8.5 최종 권장 아키텍처

```
┌─────────────────────────────────────────┐
│  프론트엔드 (Next.js)                    │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│  Gateway (WebFlux) ⚡                    │
│  - 논블로킹 라우팅                        │
│  - Rate Limiting (Redis)                │
│  - Circuit Breaker                      │
│  - 높은 처리량                           │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│  Eureka (Spring Web) 📝                 │
│  - 서비스 레지스트리                      │
│  - 내부 전용                             │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│  마이크로서비스 (Spring Web) 🏢          │
│  - 비즈니스 로직                         │
│  - JPA/DB 작업                          │
│  - 개발 생산성 우선                      │
└─────────────────────────────────────────┘
```

### 8.6 핵심 메시지

> **"Gateway는 이미 WebFlux입니다!"**
> 
> 추가 작업 없이 이미 논블로킹, 비동기 구조를 사용하고 있습니다.
> 마이크로서비스는 Spring Web을 유지하는 것이 최선의 선택입니다.

---

## 9. 다음 단계

### 9.1 즉시 적용 가능 (난이도: ⭐)

```bash
# 1. 로깅 필터 추가
# 위의 LoggingFilter.java 코드 복사

# 2. Actuator 활성화
# build.gradle에 의존성 추가
```

### 9.2 단기 목표 (난이도: ⭐⭐)

```bash
# 1. Redis Rate Limiting 추가
# 2. Circuit Breaker 설정
# 3. 부하 테스트 수행
```

### 9.3 장기 목표 (난이도: ⭐⭐⭐)

```bash
# 1. Prometheus + Grafana 모니터링
# 2. 분산 추적 (Zipkin/Jaeger)
# 3. API 문서화 (Swagger)
```

---

## 10. 참고 자료

### 10.1 공식 문서

- [Spring Cloud Gateway 공식 문서](https://spring.io/projects/spring-cloud-gateway)
- [Spring WebFlux 공식 문서](https://docs.spring.io/spring-framework/reference/web/webflux.html)
- [Project Reactor 공식 문서](https://projectreactor.io/docs)

### 10.2 추천 학습 자료

- [Reactive Programming 입문](https://www.baeldung.com/spring-webflux)
- [Spring Cloud Gateway 튜토리얼](https://www.baeldung.com/spring-cloud-gateway)

---

**작성자**: AI Assistant  
**검토 필요**: 실제 환경에서 테스트 후 피드백 환영합니다!

**질문이 있으시면 언제든지 물어보세요! 😊**

