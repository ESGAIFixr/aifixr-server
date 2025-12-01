package site.aifixr.api.soccer;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;
import site.aifixr.api.soccer.common.Messenger;

@Slf4j
@RestController
public class SearchController {

    @GetMapping("/search")
    public Messenger search(@RequestParam String keyword) {
        // System.out으로 터미널에 출력 (Docker 컨테이너 로그에 표시됨)
        // 이 로그는 docker compose logs -f soccer-service로 확인 가능
        System.out.println("\n" + "=".repeat(50));
        System.out.println("🔍 [SOCCER-SERVICE] 프론트엔드에서 검색 요청 수신!");
        System.out.println("📝 입력된 키워드: " + keyword);
        System.out.println("⏰ 요청 시간: " + java.time.LocalDateTime.now());
        System.out.println("📍 엔드포인트: GET /search");
        System.out.println("=".repeat(50) + "\n");

        // SLF4J 로그 (application.yaml의 logging 설정에 따라 출력)
        log.info("=".repeat(50));
        log.info("🔍 [SOCCER-SERVICE] 프론트엔드에서 검색 요청 수신!");
        log.info("📝 입력된 키워드: {}", keyword);
        log.info("⏰ 요청 시간: {}", java.time.LocalDateTime.now());
        log.info("📍 엔드포인트: GET /search");
        log.info("=".repeat(50));

        // 키워드로 선수 검색
        // Discovery Server에서 /api/soccer/search로 요청이 오면
        // StripPrefix=2로 인해 /search로 변환되어 이 엔드포인트로 전달됨
        Messenger result = Messenger.builder()
                .code(200)
                .message("선수 검색 성공: " + keyword)
                .build();

        System.out.println("✅ [SOCCER-SERVICE] 응답 반환: " + result.getMessage());
        log.info("✅ [SOCCER-SERVICE] 응답 반환: {}", result.getMessage());
        return result;
    }
}
