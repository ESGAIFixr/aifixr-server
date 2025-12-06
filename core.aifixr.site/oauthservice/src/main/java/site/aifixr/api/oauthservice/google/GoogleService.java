package site.aifixr.api.oauthservice.google;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import site.aifixr.api.oauthservice.config.GoogleConfig;
import site.aifixr.api.oauthservice.google.dto.GoogleTokenResponse;
import site.aifixr.api.oauthservice.google.dto.GoogleUserInfo;
import site.aifixr.api.oauthservice.jwt.JwtTokenProvider;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class GoogleService {
    private final GoogleConfig googleConfig;
    private final RestTemplate restTemplate;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * Authorization Code로 Access Token 요청
     */
    public GoogleTokenResponse getAccessToken(String code, String state) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", googleConfig.getClientId());
        params.add("client_secret", googleConfig.getClientSecret());
        params.add("redirect_uri", googleConfig.getRedirectUri());
        params.add("code", code);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        try {
            String tokenUri = googleConfig.getTokenUri();
            if (tokenUri == null) {
                throw new IllegalStateException("Google token URI is not configured");
            }
            ResponseEntity<GoogleTokenResponse> response = restTemplate.postForEntity(
                    tokenUri,
                    request,
                    GoogleTokenResponse.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return response.getBody();
            } else {
                log.error("Failed to get access token. Status: {}", response.getStatusCode());
                throw new RuntimeException("Failed to get access token from Google");
            }
        } catch (Exception e) {
            log.error("Error getting access token from Google", e);
            throw new RuntimeException("Error getting access token from Google", e);
        }
    }

    /**
     * Access Token으로 사용자 정보 조회
     */
    public GoogleUserInfo getUserInfo(String accessToken) {
        if (accessToken == null) {
            throw new IllegalArgumentException("Access token cannot be null");
        }

        String userInfoUri = googleConfig.getUserInfoUri();
        if (userInfoUri == null) {
            throw new IllegalStateException("Google user info URI is not configured");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        try {
            HttpMethod method = Objects.requireNonNull(HttpMethod.GET);
            ResponseEntity<GoogleUserInfo> response = restTemplate.exchange(
                    userInfoUri,
                    method,
                    request,
                    GoogleUserInfo.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return response.getBody();
            } else {
                log.error("Failed to get user info. Status: {}", response.getStatusCode());
                throw new RuntimeException("Failed to get user info from Google");
            }
        } catch (Exception e) {
            log.error("Error getting user info from Google", e);
            throw new RuntimeException("Error getting user info from Google", e);
        }
    }

    /**
     * 구글 로그인 처리 (메인 로직)
     */
    public OAuthUserResponse processGoogleLogin(String code, String state) {
        // 1. Access Token 획득
        GoogleTokenResponse tokenResponse = getAccessToken(code, state);

        // 2. 사용자 정보 조회
        GoogleUserInfo userInfo = getUserInfo(tokenResponse.getAccessToken());

        // 3. 구글 사용자 정보 추출
        String googleId = userInfo.getId();
        String email = userInfo.getEmail();
        String name = userInfo.getName();
        String givenName = userInfo.getGivenName();
        String familyName = userInfo.getFamilyName();
        String picture = userInfo.getPicture();
        String locale = userInfo.getLocale();

        // 4. JWT 토큰 생성
        Map<String, Object> claims = new HashMap<>();
        if (email != null) {
            claims.put("email", email);
        }
        if (name != null) {
            claims.put("name", name);
        }
        claims.put("googleId", googleId);
        String jwtAccessToken = jwtTokenProvider.generateToken(googleId, claims);
        String jwtRefreshToken = jwtTokenProvider.generateRefreshToken(googleId);

        // 5. 응답 생성
        return OAuthUserResponse.builder()
                .accessToken(jwtAccessToken)
                .refreshToken(jwtRefreshToken)
                .user(OAuthUserResponse.UserInfo.builder()
                        .id(googleId)
                        .email(email)
                        .name(name)
                        .givenName(givenName)
                        .familyName(familyName)
                        .picture(picture)
                        .locale(locale)
                        .provider("google")
                        .build())
                .build();
    }

    /**
     * 구글 OAuth 응답 DTO
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OAuthUserResponse {
        private String accessToken;
        private String refreshToken;
        private UserInfo user;

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class UserInfo {
            private String id;
            private String email;
            private String name;
            private String givenName;
            private String familyName;
            private String picture;
            private String locale;
            private String provider; // "google"
        }
    }
}
