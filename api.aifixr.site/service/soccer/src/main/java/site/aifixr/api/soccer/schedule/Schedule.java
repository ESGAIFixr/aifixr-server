package site.aifixr.api.soccer.schedule;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import site.aifixr.api.soccer.stadium.Stadium;
import site.aifixr.api.soccer.team.Team;

@Data
@Entity
@Table(name = "schedules")
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sche_date;

    private String stadiumUk;

    private String gubun;

    private String hometeamUk;

    private String awayteamUk;

    private Integer homeScore;

    private Integer awayScore;

    @ManyToOne
    @JoinColumn(name = "stadium_id")
    private Stadium stadium;

    @ManyToOne
    @JoinColumn(name = "awayteam_id")
    private Team team;

}
