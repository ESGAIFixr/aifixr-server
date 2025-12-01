package site.aifixr.api.soccer.stadium;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;
import site.aifixr.api.soccer.schedule.Schedule;
import site.aifixr.api.soccer.team.Team;

@Data
@Entity
@Table(name = "stadiums")
public class Stadium {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String stadium_uk;

    private String stadiumName;

    private String hometeamUk;

    private Integer seatCount;

    private String address;

    private String ddd;

    private String tel;

    @OneToOne(mappedBy = "stadium")
    private Team team;

    @OneToMany(mappedBy = "stadium")
    private List<Schedule> schedules;
}
