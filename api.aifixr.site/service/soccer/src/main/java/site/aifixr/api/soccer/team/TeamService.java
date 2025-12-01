package site.aifixr.api.soccer.team;

import java.util.List;

import site.aifixr.api.soccer.common.Messenger;

public interface TeamService {
    Messenger save(TeamModel team);

    Messenger saveAll(List<TeamModel> teams);

    Messenger update(TeamModel team);

    Messenger delete(String teamId);

    Messenger findById(String teamId);

    Messenger findAll();
}
