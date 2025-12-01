package site.aifixr.api.soccer.schedule;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import site.aifixr.api.soccer.common.Messenger;

@Service
@RequiredArgsConstructor
public class ScheduleServiceImpl implements ScheduleService {
    private final ScheduleRepository scheduleRepository;

    @Override
    public Messenger save(ScheduleModel schedule) {
        return null;   // scheduleRepository.save(schedule);
    }

    @Override
    public Messenger saveAll(List<ScheduleModel> schedules) {
        return null;   // scheduleRepository.saveAll(schedules);
    }

    @Override
    public Messenger update(ScheduleModel schedule) {
        return null;   // scheduleRepository.update(schedule);
    }

    @Override
    public Messenger delete(String scheDate) {
        return null;   // scheduleRepository.delete(scheDate);
    }

    @Override
    public Messenger findById(String scheDate) {
        return null;   // scheduleRepository.findById(scheDate);
    }

    @Override
    public Messenger findAll() {
        return null;   // scheduleRepository.findAll();
    }

}
