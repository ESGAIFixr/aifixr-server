# 🚀 UI-Server, Eureka, Soccer 연동 전략

## 📊 현재 아키텍처

```
┌─────────────┐      ┌──────────────────┐      ┌───────────────┐
│  UI-Server  │─────▶│ Discovery Server │─────▶│ Soccer Service│
│ (Next.js)   │      │   (Gateway)      │      │ (Spring Boot) │
│   :3000     │      │     :8080        │      │     :8080     │
└─────────────┘      └──────────────────┘      └───────────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │  Eureka Server  │
                     │  (Service Reg.) │
                     │     :8761       │
                     └─────────────────┘
```

## 🎯 연동 흐름

### 1️⃣ 요청 흐름
```
사용자 브라우저 (localhost:3000)
    ↓ HTTP GET /soccer/search?keyword=test
UI-Server (Container: ui-server)
    ↓ Proxy to http://discovery:8080/soccer/search
Discovery Server (Container: discovery)
    ↓ Gateway Routes: /soccer/** → lb://soccer (StripPrefix=1)
    ↓ Eureka Load Balancing
Soccer Service (Container: soccer)
    ↓ Endpoint: /search
SearchController.search(keyword)
    ↓ Response
Messenger { code: 200, message: "선수 검색 성공: test" }
```

### 2️⃣ 서비스 등록 흐름
```
Soccer Service 시작
    ↓ @EnableDiscoveryClient
Eureka Client 활성화
    ↓ EUREKA_SERVER_URL=http://eureka:8761/eureka/
Eureka Server에 등록 (이름: "soccer")
    ↓ 30초마다 Heartbeat
Discovery Server가 Eureka에서 서비스 목록 조회
    ↓ fetch-registry: true
Gateway 라우팅 테이블 업데이트 (lb://soccer)
```

## 🔧 수정 사항

### ✅ 완료된 수정

#### 1. SearchController - 로깅 추가
```java
@Slf4j
@RestController
public class SearchController {
    @GetMapping("/search")
    public Messenger search(@RequestParam String keyword) {
        log.info("🔍 검색 요청 받음 - 키워드: {}", keyword);
        // ... 로직
        log.info("✅ 응답 반환: {}", result.getMessage());
        return result;
    }
}
```

#### 2. CorsConfig - CORS 설정 개선
- `setAllowedOriginPatterns("*")` 사용으로 모든 오리진 허용
- `setAllowCredentials(true)` 인증 정보 허용
- `setExposedHeaders` 추가

#### 3. application.yaml - 로깅 설정
**Discovery Server:**
```yaml
logging:
  level:
    org.springframework.cloud.gateway: DEBUG
    reactor.netty: INFO
```

**Soccer Service:**
```yaml
logging:
  level:
    org.springframework.web: DEBUG
    site.aifixr.api.soccer: DEBUG
```

## 🚀 배포 가이드

### 단계 1: 변경사항 확인
```bash
# 수정된 파일 확인
git status
```

### 단계 2: Docker 이미지 재빌드
```bash
# 전체 재빌드 (권장)
docker-compose build --no-cache soccer-service discovery-server

# 또는 특정 서비스만
docker-compose build soccer-service
docker-compose build discovery-server
```

### 단계 3: 컨테이너 재시작
```bash
# 특정 서비스만 재시작
docker-compose up -d soccer-service discovery-server

# 또는 전체 재시작
docker-compose down
docker-compose up -d
```

### 단계 4: 로그 확인
```bash
# Discovery Server 로그 실시간 확인
docker logs -f discovery

# Soccer Service 로그 실시간 확인
docker logs -f soccer

# 모든 서비스 로그 확인
docker-compose logs -f
```

### 단계 5: 동작 확인

#### 5-1. Eureka 등록 확인
```bash
# 브라우저에서 확인
http://localhost:8761

# 또는 curl로 확인
curl http://localhost:8761/eureka/apps/soccer
```

#### 5-2. Soccer 서비스 직접 호출
```bash
# 컨테이너 내부 포트로 직접 호출 (실패 예상)
curl http://localhost:8103/search?keyword=test

# 성공하면 다음과 같은 응답:
# {"code":200,"message":"선수 검색 성공: test"}
```

#### 5-3. Gateway를 통한 호출
```bash
# Discovery Server를 통한 호출
curl http://localhost:8080/soccer/search?keyword=test

# 성공하면 같은 응답 + 로그에 요청 기록
```

#### 5-4. UI에서 호출
```
브라우저에서: http://localhost:3000
검색창에 키워드 입력 후 검색

예상 결과:
- 브라우저: 검색 결과 표시
- Soccer 터미널: "🔍 검색 요청 받음 - 키워드: ..." 로그 출력
- Discovery 터미널: Gateway 라우팅 로그 출력
```

## 🐛 문제 해결

### 문제 1: CORS 오류
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**해결:**
1. Discovery Server가 재시작되었는지 확인
2. CorsConfig.java가 적용되었는지 확인
   ```bash
   docker logs discovery | grep CORS
   ```

### 문제 2: 404 Not Found
```
GET http://localhost:8080/soccer/search 404
```

**원인 및 해결:**
1. **Soccer 서비스가 Eureka에 등록되지 않음**
   ```bash
   curl http://localhost:8761/eureka/apps/soccer
   # 등록 안 되어 있으면 soccer 서비스 재시작
   ```

2. **엔드포인트 매핑 오류**
   - SearchController에 `@GetMapping("/search")` 확인
   - 직접 호출로 테스트: `curl http://localhost:8103/search?keyword=test`

3. **Gateway 라우팅 설정 오류**
   - `server/discovery/src/main/resources/application.yaml` 확인
   - `Path=/soccer/**` 및 `StripPrefix=1` 확인

### 문제 3: 로그가 표시되지 않음
```
터미널에 요청 로그가 표시되지 않음
```

**해결:**
1. 서비스가 재빌드되었는지 확인
   ```bash
   # 이미지 빌드 시간 확인
   docker images | grep soccer-service
   ```

2. application.yaml 로깅 설정 확인
   ```bash
   docker exec soccer cat /app/application.yaml
   ```

## 📋 체크리스트

### 배포 전
- [ ] 모든 변경사항을 커밋했는가?
- [ ] Gradle 빌드가 성공하는가?
- [ ] Dockerfile이 정상인가?

### 배포 중
- [ ] Docker 이미지가 재빌드되었는가?
- [ ] 컨테이너가 정상적으로 시작되었는가?
- [ ] Eureka에 서비스가 등록되었는가?

### 배포 후
- [ ] 직접 호출이 성공하는가? (curl http://localhost:8103/search)
- [ ] Gateway를 통한 호출이 성공하는가? (curl http://localhost:8080/soccer/search)
- [ ] UI에서 호출이 성공하는가?
- [ ] 터미널에 로그가 표시되는가?

## 🔍 디버깅 명령어

```bash
# 1. 컨테이너 상태 확인
docker ps

# 2. 네트워크 확인
docker network inspect spring-server-spring-network

# 3. 컨테이너 내부 접속
docker exec -it soccer sh

# 4. Eureka 서비스 목록 확인
curl http://eureka:8761/eureka/apps

# 5. Discovery Server에서 Soccer 호출 테스트
docker exec -it discovery curl http://soccer:8080/search?keyword=test

# 6. 로그 레벨 확인
docker logs soccer | grep "logging.level"

# 7. 전체 서비스 헬스체크
docker-compose ps
```

## 📊 예상 로그 출력

### Discovery Server
```
2025-11-17 08:15:23.456 [reactor-http-nio-2] DEBUG o.s.c.g.r.RouteDefinitionRouteLocator - Loaded RoutePredicates: [Path=/soccer/**]
2025-11-17 08:15:23.789 [reactor-http-nio-3] INFO  o.s.c.g.h.RoutePredicateHandlerMapping - Mapped [Exchange: GET http://discovery:8080/soccer/search]
```

### Soccer Service
```
2025-11-17 08:15:23.890 [http-nio-8080-exec-1] INFO  s.e.a.s.SearchController - ========================================
2025-11-17 08:15:23.891 [http-nio-8080-exec-1] INFO  s.e.a.s.SearchController - 🔍 검색 요청 받음
2025-11-17 08:15:23.892 [http-nio-8080-exec-1] INFO  s.e.a.s.SearchController - 키워드: test
2025-11-17 08:15:23.893 [http-nio-8080-exec-1] INFO  s.e.a.s.SearchController - ========================================
2025-11-17 08:15:23.900 [http-nio-8080-exec-1] INFO  s.e.a.s.SearchController - ✅ 응답 반환: 선수 검색 성공: test
```

## 🎓 학습 포인트

1. **Service Discovery 패턴**: Eureka를 통한 동적 서비스 검색
2. **API Gateway 패턴**: Discovery Server를 통한 라우팅 및 로드밸런싱
3. **CORS 처리**: Reactive Gateway에서의 CORS 설정
4. **컨테이너 네트워킹**: Docker Compose 네트워크를 통한 서비스 간 통신
5. **로깅 전략**: 분산 시스템에서의 로그 추적

## 📝 다음 단계

1. ✅ 기본 연동 완료
2. 🔄 실제 검색 로직 구현
3. 🔄 에러 핸들링 추가
4. 🔄 성능 모니터링 (Actuator, Prometheus)
5. 🔄 분산 추적 (Sleuth, Zipkin)

