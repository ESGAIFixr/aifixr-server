 package site.aifixr.api.soccer.team;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;
import site.aifixr.api.soccer.player.Player;
import site.aifixr.api.soccer.schedule.Schedule;
import site.aifixr.api.soccer.stadium.Stadium;

@Data
@Entity
@Table(name = "teams")
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String teamUk;
    private String regionName;
    private String teamName;
    private String eTeamName;
    private String origYyyy;
    private String zipCode1;
    private String zipCode2;
    private String address;
    private String ddd;
    private String tel;
    private String fax;
    private String homepage;
    private String owner;
    private String stadiumUk;

    @OneToMany (mappedBy = "team")
    private List<Schedule> Schedules;

    @OneToMany (mappedBy = "team")
    private List<Player> players;

    @OneToOne
    private Stadium stadium;
}
