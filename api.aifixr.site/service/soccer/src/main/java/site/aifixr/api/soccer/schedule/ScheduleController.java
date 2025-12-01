package site.aifixr.api.soccer.schedule;

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
@RequestMapping("/schedules")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;

    @PostMapping("")
    public Messenger save(ScheduleModel schedule) {
        return scheduleService.save(schedule);
    }

    @PostMapping("/all")
    public Messenger saveAll(List<ScheduleModel> schedules) {
        return scheduleService.saveAll(schedules);
    }

    @PutMapping("/{scheDate}")
    public Messenger update(ScheduleModel schedule) {
        return scheduleService.update(schedule);
    }

    @DeleteMapping("/{scheDate}")
    public Messenger delete(String scheDate) {
        return scheduleService.delete(scheDate);
    }

    @GetMapping("scheDate/{scheDate}")
    public Messenger findById(String scheDate) {
        return scheduleService.findById(scheDate);
    }

    @GetMapping("/all")
    public Messenger findAll() {
        return scheduleService.findAll();
    }
}
