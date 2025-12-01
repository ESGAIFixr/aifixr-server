package site.aifixr.api.soccer.common;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
@Schema(description = "API 응답 메시지")
public class Messenger {
    @Schema(description = "응답 코드", example = "200")
    private int code;

    @Schema(description = "응답 메시지", example = "API Server is running. visit /docs for Swagger UI.")
    private String message;

}
