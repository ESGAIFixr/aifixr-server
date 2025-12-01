package site.aifixr.api.soccer.player;

import java.util.List;

import site.aifixr.api.soccer.common.Messenger;

public interface PlayerService {
    
    Messenger save(PlayerModel player);

    Messenger saveAll(List<PlayerModel> players);

    Messenger update(PlayerModel player);

    Messenger delete(String playerId);

    Messenger findById(String playerId);

    Messenger findAll();
}
