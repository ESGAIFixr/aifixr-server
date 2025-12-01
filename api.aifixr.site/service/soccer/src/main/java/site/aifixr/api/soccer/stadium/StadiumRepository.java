package site.aifixr.api.soccer.stadium;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StadiumRepository extends JpaRepository<Stadium, Long>, StadiumRepositoryCustom {
}
