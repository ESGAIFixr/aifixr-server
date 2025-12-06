package site.aifixr.api.oauthservice.google;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import site.aifixr.api.oauthservice.config.GoogleConfig;
import site.aifixr.api.oauthservice.google.GoogleService.OAuthUserResponse;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/google")
@RequiredArgsConstructor
@Slf4j
public class GoogleController {
    private final GoogleService googleService;
    private final GoogleConfig googleConfig;

    /**
     * 구글 로그인 URL 생성
     * GET /google/login
     */
    @GetMapping("/login")
    public ResponseEntity<Map<String, String>> getGoogleLoginUrl() {
        try {
            // Validate configuration
            if (googleConfig.getClientId() == null || googleConfig.getClientId().isEmpty()) {
                log.error("GOOGLE_CLIENT_ID is not configured");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Google OAuth is not properly configured. Please set GOOGLE_CLIENT_ID."));
            }

            if (googleConfig.getRedirectUri() == null || googleConfig.getRedirectUri().isEmpty()) {
                log.error("GOOGLE_REDIRECT_URI is not configured");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("error", "Google redirect URI is not configured."));
            }

            log.info("Generating Google login URL with client_id: {}, redirect_uri: {}",
                    googleConfig.getClientId().substring(0, Math.min(4, googleConfig.getClientId().length())) + "...",
                    googleConfig.getRedirectUri());

            // State 파라미터 생성 (CSRF 방지)
            String state = UUID.randomUUID().toString();

            // URL 인코딩 적용
            String encodedRedirectUri = URLEncoder.encode(googleConfig.getRedirectUri(), StandardCharsets.UTF_8);
            String encodedScope = URLEncoder.encode("profile email", StandardCharsets.UTF_8);

            String loginUrl = UriComponentsBuilder
                    .fromUriString(googleConfig.getAuthorizeUri())
                    .queryParam("client_id", googleConfig.getClientId())
                    .queryParam("redirect_uri", googleConfig.getRedirectUri())
                    .queryParam("response_type", "code")
                    .queryParam("scope", "profile email")
                    .queryParam("state", state)
                    .queryParam("access_type", "offline")
                    .queryParam("prompt", "consent")
                    .build()
                    .toUriString();

            log.info("Generated Google login URL: {}", loginUrl.replaceAll("client_id=[^&]+", "client_id=***"));
            return ResponseEntity.ok(Map.of("authUrl", loginUrl));
        } catch (Exception e) {
            log.error("Error generating Google login URL", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to generate login URL: " + e.getMessage()));
        }
    }

    /**
     * 구글 로그인 콜백 처리
     * GET /google/callback?code=AUTHORIZATION_CODE&state=STATE
     * 토큰을 생성한 후 프론트엔드로 리다이렉트
     */
    @GetMapping("/callback")
    public ResponseEntity<?> googleCallback(
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String error) {
        String frontendUrl = "http://localhost:3000/oauth/google/callback";

        if (error != null) {
            log.error("Google callback: error parameter received: {}", error);
            String redirectUrl = UriComponentsBuilder.fromUriString(frontendUrl)
                    .queryParam("error", URLEncoder.encode(error, StandardCharsets.UTF_8))
                    .build()
                    .toUriString();
            return ResponseEntity.status(HttpStatus.FOUND)
                    .header("Location", redirectUrl)
                    .build();
        }

        // code 파라미터 검증
        if (code == null || code.isEmpty()) {
            log.error("Google callback: code parameter is missing");
            String redirectUrl = UriComponentsBuilder.fromUriString(frontendUrl)
                    .queryParam("error", URLEncoder.encode("인증 코드가 없습니다.", StandardCharsets.UTF_8))
                    .build()
                    .toUriString();
            return ResponseEntity.status(HttpStatus.FOUND)
                    .header("Location", redirectUrl)
                    .build();
        }

        try {
            log.info("Processing Google login with code: {}", code.substring(0, Math.min(10, code.length())) + "...");

            OAuthUserResponse response = googleService.processGoogleLogin(code, state);
            OAuthUserResponse.UserInfo userInfo = response.getUser();

            if (response == null || response.getAccessToken() == null) {
                throw new RuntimeException("Failed to generate tokens");
            }

            // 프론트엔드로 리다이렉트하면서 토큰과 사용자 정보를 URL 파라미터로 전달
            UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(frontendUrl)
                    .queryParam("accessToken", URLEncoder.encode(response.getAccessToken(), StandardCharsets.UTF_8))
                    .queryParam("refreshToken", URLEncoder.encode(response.getRefreshToken(), StandardCharsets.UTF_8));

            // 사용자 정보를 개별 파라미터로 전달
            if (userInfo != null) {
                if (userInfo.getId() != null) {
                    builder.queryParam("userId", URLEncoder.encode(userInfo.getId(), StandardCharsets.UTF_8));
                }
                if (userInfo.getEmail() != null) {
                    builder.queryParam("email", URLEncoder.encode(userInfo.getEmail(), StandardCharsets.UTF_8));
                }
                if (userInfo.getName() != null) {
                    builder.queryParam("name", URLEncoder.encode(userInfo.getName(), StandardCharsets.UTF_8));
                }
                if (userInfo.getGivenName() != null) {
                    builder.queryParam("givenName", URLEncoder.encode(userInfo.getGivenName(), StandardCharsets.UTF_8));
                }
                if (userInfo.getFamilyName() != null) {
                    builder.queryParam("familyName",
                            URLEncoder.encode(userInfo.getFamilyName(), StandardCharsets.UTF_8));
                }
                if (userInfo.getPicture() != null) {
                    builder.queryParam("picture", URLEncoder.encode(userInfo.getPicture(), StandardCharsets.UTF_8));
                }
                if (userInfo.getLocale() != null) {
                    builder.queryParam("locale", URLEncoder.encode(userInfo.getLocale(), StandardCharsets.UTF_8));
                }
                if (userInfo.getProvider() != null) {
                    builder.queryParam("provider", URLEncoder.encode(userInfo.getProvider(), StandardCharsets.UTF_8));
                }
            }

            String redirectUrl = builder.build().toUriString();

            log.info("Successfully processed login, redirecting to frontend");
            return ResponseEntity.status(HttpStatus.FOUND)
                    .header("Location", redirectUrl)
                    .build();
        } catch (Exception e) {
            log.error("Google login failed with error: {}", e.getMessage(), e);
            // 에러 발생 시 프론트엔드로 리다이렉트하면서 에러 메시지 전달
            String errorMessage = "로그인 처리 중 오류가 발생했습니다: " + e.getMessage();
            if (errorMessage.length() > 200) {
                errorMessage = errorMessage.substring(0, 200);
            }
            String redirectUrl = UriComponentsBuilder.fromUriString(frontendUrl)
                    .queryParam("error", URLEncoder.encode(errorMessage, StandardCharsets.UTF_8))
                    .build()
                    .toUriString();
            log.info("Redirecting to frontend with error: {}", errorMessage);
            return ResponseEntity.status(HttpStatus.FOUND)
                    .header("Location", redirectUrl)
                    .build();
        }
    }
}
