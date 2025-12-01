package site.aifixr.api.soccer.stadium;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import site.aifixr.api.soccer.common.Messenger;

@Service
@RequiredArgsConstructor
public class StadiumServiceImpl implements StadiumService {
    private final StadiumRepository stadiumRepository;

    @Override
    public Messenger save(StadiumModel stadium) {
        return null;   // stadiumRepository.save(stadium);
    }

    @Override
    public Messenger saveAll(List<StadiumModel> stadiums) {
        return null;   // stadiumRepository.saveAll(stadiums);
    }

    @Override
    public Messenger update(StadiumModel stadium) {
        return null;   // stadiumRepository.update(stadium);
    }

    @Override
    public Messenger delete(String stadiumId) {
        return null;   // stadiumRepository.delete(stadiumId);
    }

    @Override
    public Messenger findById(String stadiumId) {
        return null;   // stadiumRepository.findById(stadiumId);
    }

    @Override
    public Messenger findAll() {
        return null;   // stadiumRepository.findAll();
    }

}
