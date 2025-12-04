package site.aifixr.api.oauthservice.google;

import site.aifixr.api.oauthservice.google.dto.GoogleUserInfo;
import site.aifixr.api.oauthservice.google.dto.LoginResponse;
import site.aifixr.api.oauthservice.jwt.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/google")
public class GoogleController {

	private final GoogleAuthService googleAuthService;
	private final JwtTokenProvider jwtTokenProvider;

	@Value("${google.frontend-redirect-uri:http://localhost:3002/dashboard}")
	private String frontendRedirectUri;

	public GoogleController(GoogleAuthService googleAuthService, JwtTokenProvider jwtTokenProvider) {
		this.googleAuthService = googleAuthService;
		this.jwtTokenProvider = jwtTokenProvider;
	}

	/**
	 * 구글 인증 URL 생성
	 */
	@GetMapping("/auth-url")
	public ResponseEntity<Map<String, String>> getGoogleAuthUrl() {
		String authUrl = googleAuthService.generateAuthUrl();
		Map<String, String> response = new HashMap<>();
		response.put("authUrl", authUrl);
		return ResponseEntity.ok(response);
	}

	/**
	 * 구글 로그인 (인가 코드로 처리)
	 */
	@PostMapping("/login")
	public ResponseEntity<LoginResponse> googleLogin(@RequestBody Map<String, String> body) {
		System.out.println("\n========================================");
		System.out.println("🔐 [Google Login] 로그인 요청 시작");
		System.out.println("========================================");
		
		try {
			// 1. 인가 코드 및 state 추출
			String code = body.get("code");
			String state = body.get("state");
			
			System.out.println("📝 [Step 1] 인가 코드 수신");
			System.out.println("   - Code: " + (code != null ? code.substring(0, Math.min(20, code.length())) + "..." : "null"));
			System.out.println("   - State: " + (state != null ? state : "null"));
			
			if (code == null || code.isEmpty()) {
				System.out.println("❌ [Error] 인가 코드가 없습니다.");
				System.out.println("========================================\n");
				return ResponseEntity.badRequest().body(
						new LoginResponse(false, "인가 코드가 필요합니다.")
				);
			}

			// 2. 구글 액세스 토큰 요청
			System.out.println("\n📝 [Step 2] 구글 액세스 토큰 요청 중...");
			String googleAccessToken = googleAuthService.getAccessToken(code, state);
			System.out.println("✅ [Step 2] 구글 액세스 토큰 획득 성공");

			// 3. 구글 사용자 정보 조회
			System.out.println("\n📝 [Step 3] 구글 사용자 정보 조회 중...");
			GoogleUserInfo googleUserInfo = googleAuthService.getUserInfo(googleAccessToken);
			System.out.println("✅ [Step 3] 사용자 정보 조회 성공");
			System.out.println("   - Google ID: " + googleUserInfo.getId());
			System.out.println("   - Email: " + googleUserInfo.getEmail());
			System.out.println("   - Name: " + googleUserInfo.getName());

			// 4. JWT 토큰 생성
			System.out.println("\n📝 [Step 4] JWT 토큰 생성 중...");
			Map<String, Object> claims = new HashMap<>();
			claims.put("googleId", googleUserInfo.getId());
			claims.put("email", googleUserInfo.getEmail());
			claims.put("name", googleUserInfo.getName());
			
			String jwtToken = jwtTokenProvider.generateToken(googleUserInfo.getId(), claims);
			String refreshToken = jwtTokenProvider.generateRefreshToken(googleUserInfo.getId());
			System.out.println("✅ [Step 4] JWT 토큰 생성 완료");
			System.out.println("   - JWT Token: " + jwtToken.substring(0, Math.min(50, jwtToken.length())) + "...");
			System.out.println("   - Refresh Token: " + refreshToken.substring(0, Math.min(50, refreshToken.length())) + "...");

			// 5. 사용자 정보 맵 생성
			Map<String, Object> user = new HashMap<>();
			user.put("googleId", googleUserInfo.getId());
			user.put("email", googleUserInfo.getEmail());
			user.put("name", googleUserInfo.getName());
			user.put("givenName", googleUserInfo.getGivenName());
			user.put("familyName", googleUserInfo.getFamilyName());
			user.put("picture", googleUserInfo.getPicture());
			user.put("locale", googleUserInfo.getLocale());

			// 6. 응답 생성
			LoginResponse response = new LoginResponse();
			response.setSuccess(true);
			response.setMessage("구글 로그인 성공");
			response.setToken(jwtToken);
			response.setRefreshToken(refreshToken);
			response.setTokenType("Bearer");
			response.setExpiresIn(86400000L); // 24시간
			response.setUser(user);
			response.setRedirectUrl(frontendRedirectUri); // 백엔드에서 설정한 리디렉션 URL

			System.out.println("\n✅ [Success] 구글 로그인 성공!");
			System.out.println("   - 사용자: " + googleUserInfo.getName() + " (" + googleUserInfo.getEmail() + ")");
			System.out.println("   - 리디렉션 URL: " + frontendRedirectUri);
			System.out.println("========================================\n");

			return ResponseEntity.ok(response);

		} catch (Exception e) {
			System.out.println("\n❌ [Error] 구글 로그인 처리 중 오류 발생");
			System.out.println("   - 오류 메시지: " + e.getMessage());
			if (e.getCause() != null) {
				System.out.println("   - 원인: " + e.getCause().getMessage());
			}
			e.printStackTrace();
			System.out.println("========================================\n");
			
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
					new LoginResponse(false, "구글 로그인 처리 중 오류가 발생했습니다: " + e.getMessage())
			);
		}
	}

	/**
	 * 구글 콜백 (GET 요청)
	 */
	@GetMapping("/callback")
	public ResponseEntity<LoginResponse> googleCallback(
			@RequestParam(required = false) String code,
			@RequestParam(required = false) String state,
			@RequestParam(required = false) String error) {
		
		System.out.println("\n========================================");
		System.out.println("🔄 [Google Callback] 콜백 요청 수신");
		System.out.println("========================================");
		
		if (error != null) {
			System.out.println("❌ [Error] 구글 로그인 실패: " + error);
			System.out.println("========================================\n");
			return ResponseEntity.badRequest().body(
					new LoginResponse(false, "구글 로그인 실패: " + error)
			);
		}

		if (code == null || code.isEmpty()) {
			System.out.println("❌ [Error] 인가 코드가 없습니다.");
			System.out.println("========================================\n");
			return ResponseEntity.badRequest().body(
					new LoginResponse(false, "인가 코드가 필요합니다.")
			);
		}

		// POST /login과 동일한 로직 수행
		Map<String, String> body = new HashMap<>();
		body.put("code", code);
		body.put("state", state != null ? state : "");
		return googleLogin(body);
	}
}

