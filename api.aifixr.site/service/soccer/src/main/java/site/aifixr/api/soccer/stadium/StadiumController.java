package site.aifixr.api.soccer.stadium;

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
@RequestMapping("/stadiums")
@RequiredArgsConstructor
public class StadiumController {

    private final StadiumService stadiumService;

    @PostMapping("")
    public Messenger save(StadiumModel stadium) {
        return stadiumService.save(stadium);
    }

    @PostMapping("/all")
    public Messenger saveAll(List<StadiumModel> stadiums) {
        return stadiumService.saveAll(stadiums);
    }

    @PutMapping("/{stadiumId}")
    public Messenger update(StadiumModel stadium) {
        return stadiumService.update(stadium);
    }

    @DeleteMapping("/{stadiumId}")
    public Messenger delete(String stadiumId) {
        return stadiumService.delete(stadiumId);
    }

    @GetMapping("stadiumId/{stadiumId}")
    public Messenger findById(String stadiumId) {
        return stadiumService.findById(stadiumId);
    }

    @GetMapping("/all")
    public Messenger findAll() {
        return stadiumService.findAll();
    }
}
