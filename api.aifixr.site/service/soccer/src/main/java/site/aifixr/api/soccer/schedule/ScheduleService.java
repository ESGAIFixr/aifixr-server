package site.aifixr.api.soccer.schedule;

import java.util.List;

import site.aifixr.api.soccer.common.Messenger;

public interface ScheduleService {

    Messenger save(ScheduleModel schedule);

    Messenger saveAll(List<ScheduleModel> schedules);

    Messenger update(ScheduleModel schedule);

    Messenger delete(String scheDate);

    Messenger findById(String scheDate);

    Messenger findAll();
}
