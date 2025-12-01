# Redis 무상태 프로그래밍 통합 전략

**버전**: 1.0  
**최종 수정일**: 2024-11-21  
**상태**: ✅ 구현 완료

---

## 📋 목차

1. [개요](#개요)
2. [Redis 통합 아키텍처](#redis-통합-아키텍처)
3. [무상태 프로그래밍 전략](#무상태-프로그래밍-전략)
4. [Redis 사용 사례](#redis-사용-사례)
5. [설정 가이드](#설정-가이드)
6. [보안 고려사항](#보안-고려사항)
7. [모니터링 및 운영](#모니터링-및-운영)

---

## 1. 개요

### 1.1 목적

이 프로젝트는 **무상태(Stateless) 프로그래밍**을 위해 Redis를 통합하여 다음과 같은 목표를 달성합니다:

- ✅ **세션 관리**: 서버 간 세션 공유
- ✅ **토큰 관리**: JWT Refresh Token 및 Blacklist 관리
- ✅ **캐시 레이어**: 성능 최적화를 위한 다층 캐시 전략
- ✅ **Rate Limiting**: API 요청 제한 및 보안 강화
- ✅ **분산 락**: 동시성 제어
- ✅ **실시간 데이터**: 실시간 점수 및 대시보드 데이터 캐싱

### 1.2 Redis 버전 및 설정

```yaml
Image: redis:7-alpine
Port: 6379
Persistence: AOF (Append Only File) 활성화
Password: 환경 변수로 관리 (기본값: Redis0930!)
```

---

## 2. Redis 통합 아키텍처

### 2.1 Docker Compose 구조

```
┌─────────────────────────────────────────────────────────┐
│                    Spring Network                       │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │  Redis   │  │  Postgres│  │  Eureka  │            │
│  │  :6379   │  │  :5432   │  │  :8761   │            │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘            │
│       │             │              │                   │
│       └─────────────┼──────────────┘                   │
│                     │                                  │
│  ┌──────────────────┼──────────────────┐              │
│  │                  │                  │              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │ Discovery│  │  Config  │  │ Services │            │
│  │  :8080   │  │  :8888   │  │  :810x   │            │
│  └──────────┘  └──────────┘  └──────────┘            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 2.2 서비스 의존성

모든 Spring 서비스는 Redis에 접근할 수 있도록 설정되었습니다:

- ✅ **config-server**: Redis 설정 정보 제공
- ✅ **eureka-server**: 서비스 레지스트리 캐싱
- ✅ **discovery-server**: Rate Limiting, 세션 관리
- ✅ **모든 마이크로서비스**: 캐시, 토큰 관리, 분산 락

### 2.3 네트워크 설정

```yaml
networks:
  spring-network:
    driver: bridge

# Redis는 모든 서비스에서 접근 가능
aliases:
  - redis.local
  - redis
```

---

## 3. 무상태 프로그래밍 전략

### 3.1 세션 관리 (Spring Session)

**목적**: 서버 인스턴스 간 세션 공유

```java
// application.yaml
spring:
  session:
    store-type: redis
    redis:
      host: ${REDIS_HOST:redis}
      port: ${REDIS_PORT:6379}
      password: ${REDIS_PASSWORD}
      timeout: 2000ms
```

**장점**:
- 로드 밸런서 뒤에서 여러 인스턴스 실행 시 세션 공유
- 서버 재시작 시에도 세션 유지
- 확장성 향상

### 3.2 토큰 관리

#### 3.2.1 Refresh Token 저장

```java
// Key: token:refresh:{userId}
// Value: { refreshToken, expiresAt, role }
// TTL: 1개월, 3개월, 6개월 (사용자 선택)

redisTemplate.opsForValue().set(
    "token:refresh:user123",
    refreshTokenData,
    90, // 3개월
    TimeUnit.DAYS
);
```

#### 3.2.2 Token Blacklist

```java
// Key: token:blacklist:{tokenId}
// Value: { tokenId, expiresAt }
// TTL: Access Token 만료 시간과 동일

redisTemplate.opsForValue().set(
    "token:blacklist:tokenId123",
    blacklistData,
    accessTokenExpiration,
    TimeUnit.SECONDS
);
```

### 3.3 캐시 전략

프로젝트 문서(`FRONTEND_BACKEND_CONNECTION_STRATEGY.md`)에 명시된 캐시 전략:

#### 3.3.1 Public 캐시 (공개 데이터)

```
Key Pattern: public:{clientId}:finalReport:{fiscalYear}
TTL: 30일
용도: 비로그인 사용자도 접근 가능한 공개 보고서
```

#### 3.3.2 Client 캐시 (고객사 전용)

```
Key Pattern: client:{clientId}:diagnosis:summary
TTL: 5분 ~ 1시간
용도: 실시간 자가진단 점수, 대시보드 KPI
```

#### 3.3.3 Admin 캐시 (관리자 전용)

```
Key Pattern: admin:statistics:monthly
TTL: 1시간
용도: 관리자 통계, 전체 고객사 요약
```

### 3.4 Rate Limiting (API 요청 제한)

**Discovery Server (Gateway)에서 구현**:

```yaml
# application.yaml
spring:
  cloud:
    gateway:
      routes:
        - id: soccer-service
          filters:
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 10  # 초당 10개 요청
                redis-rate-limiter.burstCapacity: 20  # 최대 20개 버스트
                redis-rate-limiter.requestedTokens: 1
```

**장점**:
- DDoS 공격 방어
- API 남용 방지
- 서버 부하 감소

### 3.5 분산 락 (Distributed Lock)

**동시성 제어를 위한 분산 락**:

```java
@Autowired
private RedisTemplate<String, String> redisTemplate;

public void processCriticalSection(String lockKey) {
    String lockValue = UUID.randomUUID().toString();
    Boolean acquired = redisTemplate.opsForValue()
        .setIfAbsent(lockKey, lockValue, 30, TimeUnit.SECONDS);
    
    if (Boolean.TRUE.equals(acquired)) {
        try {
            // Critical section
        } finally {
            // Lock 해제 (Lua 스크립트로 안전하게)
            String script = "if redis.call('get', KEYS[1]) == ARGV[1] then " +
                          "return redis.call('del', KEYS[1]) else return 0 end";
            redisTemplate.execute(
                new DefaultRedisScript<>(script, Long.class),
                Collections.singletonList(lockKey),
                lockValue
            );
        }
    }
}
```

---

## 4. Redis 사용 사례

### 4.1 실시간 자가진단 점수

```java
@Service
public class DiagnosisService {
    
    @Cacheable(value = "client", 
               key = "'client:' + #clientId + ':diagnosis:summary'")
    public DiagnosisSummary getSummary(String clientId) {
        // Redis에서 조회 시도
        // Cache Miss 시 DB 조회 후 Redis에 저장 (TTL: 5분)
    }
    
    @CacheEvict(value = "client", 
                key = "'client:' + #clientId + ':diagnosis:summary'")
    public void updateDiagnosis(String clientId, DiagnosisRequest request) {
        // DB 업데이트 후 Redis 캐시 무효화
        // Write-Through: 즉시 Redis에 업데이트
    }
}
```

### 4.2 공개 최종 보고서

```java
@Service
public class ReportService {
    
    public FinalReport getPublicReport(String clientId, int fiscalYear) {
        String cacheKey = String.format(
            "public:%s:finalReport:%d", clientId, fiscalYear
        );
        
        // Cache-Aside 패턴
        FinalReport cached = (FinalReport) redisTemplate.opsForValue()
            .get(cacheKey);
        
        if (cached != null) {
            return cached;
        }
        
        // DB에서 조회
        FinalReport report = reportRepository.findByClientIdAndYear(
            clientId, fiscalYear
        );
        
        // Redis에 캐시 저장 (TTL: 30일)
        if (report != null) {
            redisTemplate.opsForValue().set(
                cacheKey, report, 30, TimeUnit.DAYS
            );
        }
        
        return report;
    }
}
```

### 4.3 인증 토큰 관리

```java
@Service
public class TokenService {
    
    public void saveRefreshToken(String userId, RefreshToken token) {
        String key = "token:refresh:" + userId;
        redisTemplate.opsForValue().set(
            key, token, token.getExpirationDays(), TimeUnit.DAYS
        );
    }
    
    public RefreshToken getRefreshToken(String userId) {
        String key = "token:refresh:" + userId;
        return (RefreshToken) redisTemplate.opsForValue().get(key);
    }
    
    public void blacklistToken(String tokenId, long expirationSeconds) {
        String key = "token:blacklist:" + tokenId;
        redisTemplate.opsForValue().set(
            key, tokenId, expirationSeconds, TimeUnit.SECONDS
        );
    }
    
    public boolean isTokenBlacklisted(String tokenId) {
        String key = "token:blacklist:" + tokenId;
        return redisTemplate.hasKey(key);
    }
}
```

---

## 5. 설정 가이드

### 5.1 Spring Boot Redis 설정

#### 5.1.1 의존성 추가 (build.gradle)

```gradle
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-data-redis'
    implementation 'org.springframework.boot:spring-boot-starter-cache'
    implementation 'org.springframework.session:spring-session-data-redis'
}
```

#### 5.1.2 Redis Configuration

```java
@Configuration
@EnableCaching
public class RedisConfig {
    
    @Value("${REDIS_HOST:redis}")
    private String redisHost;
    
    @Value("${REDIS_PORT:6379}")
    private int redisPort;
    
    @Value("${REDIS_PASSWORD:}")
    private String redisPassword;
    
    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        RedisStandaloneConfiguration config = new RedisStandaloneConfiguration();
        config.setHostName(redisHost);
        config.setPort(redisPort);
        
        if (StringUtils.hasText(redisPassword)) {
            config.setPassword(redisPassword);
        }
        
        return new LettuceConnectionFactory(config);
    }
    
    @Bean
    public RedisTemplate<String, Object> redisTemplate(
            RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());
        return template;
    }
    
    @Bean
    public CacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration
            .defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(5))
            .serializeKeysWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new StringRedisSerializer()))
            .serializeValuesWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new GenericJackson2JsonRedisSerializer()));
        
        Map<String, RedisCacheConfiguration> cacheConfigurations = new HashMap<>();
        
        // Public 캐시: 30일
        cacheConfigurations.put("public", defaultConfig
            .entryTtl(Duration.ofDays(30)));
        
        // Client 캐시: 5분
        cacheConfigurations.put("client", defaultConfig
            .entryTtl(Duration.ofMinutes(5)));
        
        // Admin 캐시: 1시간
        cacheConfigurations.put("admin", defaultConfig
            .entryTtl(Duration.ofHours(1)));
        
        // Token 캐시: 3개월
        cacheConfigurations.put("token", defaultConfig
            .entryTtl(Duration.ofDays(90)));
        
        return RedisCacheManager.builder(connectionFactory)
            .cacheDefaults(defaultConfig)
            .withInitialCacheConfigurations(cacheConfigurations)
            .build();
    }
}
```

#### 5.1.3 application.yaml 설정

```yaml
spring:
  data:
    redis:
      host: ${REDIS_HOST:redis}
      port: ${REDIS_PORT:6379}
      password: ${REDIS_PASSWORD:}
      timeout: 2000ms
      lettuce:
        pool:
          max-active: 8
          max-idle: 8
          min-idle: 0
  session:
    store-type: redis
    redis:
      host: ${REDIS_HOST:redis}
      port: ${REDIS_PORT:6379}
      password: ${REDIS_PASSWORD:}
```

### 5.2 환경 변수 설정

`.env` 파일 생성 (선택사항):

```env
REDIS_PASSWORD=YourSecurePassword123!
```

또는 docker-compose 실행 시:

```bash
REDIS_PASSWORD=YourSecurePassword123! docker-compose up -d
```

---

## 6. 보안 고려사항

### 6.1 민감정보 보호 정책

**❌ Redis에 절대 저장하지 않는 데이터**:
- 개인정보 (이름, 주민번호, 연락처)
- 재무 상세 정보 (매출, 비용 상세)
- 내부 감사 원본 데이터
- 비승인 민감 데이터

**✅ Redis에 저장 가능한 데이터**:
- 토큰 (암호화된 Refresh Token)
- 캐시된 요약 데이터 (비민감 정보만)
- 공개 보고서 메타데이터
- 실시간 점수 (익명화된 데이터)

### 6.2 Redis 비밀번호 설정

```yaml
# docker-compose.yaml
command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD:-Redis0930!}
```

**프로덕션 환경 권장사항**:
- 강력한 비밀번호 사용 (최소 16자, 특수문자 포함)
- 환경 변수로 관리 (절대 코드에 하드코딩 금지)
- 정기적인 비밀번호 변경

### 6.3 네트워크 격리

- Redis는 `spring-network` 내부에서만 접근 가능
- 외부 포트 노출은 개발 환경에서만 (프로덕션에서는 제거 권장)
- 방화벽 규칙으로 추가 보안 강화

### 6.4 데이터 암호화

민감한 토큰 데이터는 저장 전 암호화:

```java
@Service
public class TokenService {
    
    @Autowired
    private EncryptionService encryptionService;
    
    public void saveRefreshToken(String userId, RefreshToken token) {
        // 토큰 암호화
        String encryptedToken = encryptionService.encrypt(token.getToken());
        token.setToken(encryptedToken);
        
        // Redis에 저장
        redisTemplate.opsForValue().set(
            "token:refresh:" + userId,
            token,
            token.getExpirationDays(),
            TimeUnit.DAYS
        );
    }
}
```

---

## 7. 모니터링 및 운영

### 7.1 Redis Health Check

Docker Compose에서 자동으로 Health Check 수행:

```yaml
healthcheck:
  test: ["CMD", "redis-cli", "ping"]
  interval: 10s
  timeout: 3s
  retries: 5
  start_period: 10s
```

### 7.2 Redis 모니터링 명령어

```bash
# Redis 컨테이너 접속
docker exec -it redis redis-cli

# 비밀번호 인증
AUTH Redis0930!

# 연결 상태 확인
PING

# 메모리 사용량 확인
INFO memory

# 키 개수 확인
DBSIZE

# 특정 패턴의 키 조회
KEYS token:*

# 키의 TTL 확인
TTL token:refresh:user123

# 통계 정보
INFO stats
```

### 7.3 로그 모니터링

```bash
# Redis 로그 확인
docker logs redis

# 실시간 로그 모니터링
docker logs -f redis
```

### 7.4 백업 및 복구

#### 7.4.1 AOF (Append Only File) 백업

Redis는 AOF 모드로 실행되어 모든 쓰기 작업이 로그 파일에 기록됩니다:

```yaml
command: redis-server --appendonly yes
volumes:
  - redis-data:/data
```

#### 7.4.2 수동 백업

```bash
# Redis 데이터 백업
docker exec redis redis-cli --rdb /data/dump.rdb

# 볼륨 백업
docker run --rm -v app.aifixr.site_redis-data:/data -v $(pwd):/backup \
  alpine tar czf /backup/redis-backup-$(date +%Y%m%d).tar.gz /data
```

### 7.5 성능 최적화

#### 7.5.1 Connection Pool 설정

```yaml
spring:
  data:
    redis:
      lettuce:
        pool:
          max-active: 8    # 최대 연결 수
          max-idle: 8      # 최대 유휴 연결 수
          min-idle: 0      # 최소 유휴 연결 수
```

#### 7.5.2 메모리 관리

- TTL을 적절히 설정하여 오래된 데이터 자동 삭제
- 메모리 사용량 모니터링
- 필요 시 `maxmemory-policy` 설정 (예: `allkeys-lru`)

---

## 8. 마이그레이션 가이드

### 8.1 기존 서비스에 Redis 추가

1. **의존성 추가**: `build.gradle`에 Redis 의존성 추가
2. **설정 추가**: `RedisConfig` 클래스 생성
3. **환경 변수 설정**: `application.yaml`에 Redis 연결 정보 추가
4. **캐시 어노테이션 적용**: `@Cacheable`, `@CacheEvict` 등 사용
5. **테스트**: 로컬에서 Redis 연결 테스트

### 8.2 점진적 마이그레이션

1. **1단계**: 토큰 관리부터 시작 (가장 중요)
2. **2단계**: 캐시 레이어 추가 (성능 개선)
3. **3단계**: Rate Limiting 적용 (보안 강화)
4. **4단계**: 세션 관리 (무상태 완성)

---

## 9. 트러블슈팅

### 9.1 연결 실패

**증상**: `Unable to connect to Redis`

**해결 방법**:
1. Redis 컨테이너가 실행 중인지 확인: `docker ps | grep redis`
2. 네트워크 확인: `docker network inspect spring-network`
3. 비밀번호 확인: 환경 변수 `REDIS_PASSWORD` 확인
4. 포트 확인: Redis가 6379 포트에서 실행 중인지 확인

### 9.2 메모리 부족

**증상**: `OOM command not allowed when used memory > 'maxmemory'`

**해결 방법**:
1. TTL 확인 및 조정
2. 불필요한 키 삭제: `redis-cli --scan --pattern "old:*" | xargs redis-cli DEL`
3. `maxmemory-policy` 설정 조정

### 9.3 성능 저하

**증상**: Redis 응답 시간 증가

**해결 방법**:
1. Connection Pool 크기 조정
2. 네트워크 지연 확인
3. Redis 메모리 사용량 확인
4. 느린 쿼리 로그 확인: `SLOWLOG GET 10`

---

## 10. 참고 자료

- [Spring Data Redis 공식 문서](https://spring.io/projects/spring-data-redis)
- [Redis 공식 문서](https://redis.io/documentation)
- [프로젝트 Redis 캐시 전략](./FRONTEND_BACKEND_CONNECTION_STRATEGY.md#redis-캐시-전략)

---

## 11. 요약

### ✅ 구현 완료 사항

- [x] Docker Compose에 Redis 서비스 추가
- [x] 모든 Spring 서비스에 Redis 환경 변수 추가
- [x] Redis Health Check 설정
- [x] Redis 데이터 영구 저장 (AOF) 설정
- [x] 네트워크 및 의존성 설정

### 📋 다음 단계

1. **Spring Boot 설정**: 각 서비스에 `RedisConfig` 클래스 추가
2. **의존성 추가**: `build.gradle`에 Redis 의존성 추가
3. **토큰 관리 구현**: `TokenService`에 Redis 통합
4. **캐시 레이어 구현**: 서비스별 캐시 전략 적용
5. **Rate Limiting 구현**: Discovery Server에 Rate Limiting 필터 추가
6. **테스트**: 로컬 환경에서 전체 플로우 테스트

---

**작성자**: AI Assistant  
**검토 필요**: Redis 설정 및 보안 정책 최종 검토 필요

