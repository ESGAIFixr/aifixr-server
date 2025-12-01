package site.aifixr.api.soccer.player;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import site.aifixr.api.soccer.common.Messenger;

@Service
@RequiredArgsConstructor
public class PlayerServiceImpl implements PlayerService {
    private final PlayerRepository playerRepository;

    @Override
    public Messenger save(PlayerModel player) {
        return null;   // playerRepository.save(player);
    }

    @Override
    public Messenger saveAll(List<PlayerModel> players) {
        return null;   // playerRepository.saveAll(players);
    }

    @Override
    public Messenger update(PlayerModel player) {
        return null;   // playerRepository.update(player);
    }

    @Override
    public Messenger delete(String playerId) {
        return null;   // playerRepository.delete(playerId);
    }

    @Override
    public Messenger findById(String playerId) {
        return null;   // playerRepository.findById(playerId);
    }

    @Override
    public Messenger findAll() {
        return null;   // playerRepository.findAll();
    }

}
