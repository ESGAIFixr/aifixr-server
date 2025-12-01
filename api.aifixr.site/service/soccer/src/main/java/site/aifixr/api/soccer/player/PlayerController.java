package site.aifixr.api.soccer.player;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import site.aifixr.api.soccer.common.Messenger;

@RestController
@RequestMapping("/players")
@RequiredArgsConstructor
public class PlayerController {

    private final PlayerService playerService;

    @PostMapping("")
    public Messenger save(PlayerModel player) {
        return playerService.save(player);
    }

    @PostMapping("/all")
    public Messenger saveAll(List<PlayerModel> players) {
        return playerService.saveAll(players);
    }

    @PutMapping("/{playerId}")
    public Messenger update(PlayerModel player) {
        return playerService.update(player);
    }

    @DeleteMapping("/{playerId}")
    public Messenger delete(String playerId) {
        return playerService.delete(playerId);
    }

    @GetMapping("playerId/{playerId}")
    public Messenger findById(String playerId) {
        return playerService.findById(playerId);
    }

    @GetMapping("/all")
    public Messenger findAll() {
        return playerService.findAll();
    }
}
