package site.aifixr.api.soccer.team;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import site.aifixr.api.soccer.common.Messenger;

@Service
@RequiredArgsConstructor
public class TeamServiceImpl implements TeamService {
    private final TeamRepository teamRepository;

    @Override
    public Messenger save(TeamModel team) {
        return null;   // teamRepository.save(team);
    }

    @Override
    public Messenger saveAll(List<TeamModel> teams) {
        return null;   // teamRepository.saveAll(teams);
    }

    @Override
    public Messenger update(TeamModel team) {
        return null;   // teamRepository.update(team);
    }

    @Override
    public Messenger delete(String teamId) {
        return null;   // teamRepository.delete(teamId);
    }

    @Override
    public Messenger findById(String teamId) {
        return null;   // teamRepository.findById(teamId);
    }

    @Override
    public Messenger findAll() {
        return null;   // teamRepository.findAll();
    }

}
