package site.aifixr.api.soccer.team;

import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class TeamRepositoryImpl implements TeamRepositoryCustom{
    private final JPAQueryFactory queryFactory;
}
