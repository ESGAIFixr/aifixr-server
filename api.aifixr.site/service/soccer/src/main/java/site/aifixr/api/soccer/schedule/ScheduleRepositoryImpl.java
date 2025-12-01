package site.aifixr.api.soccer.schedule;

import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class ScheduleRepositoryImpl implements ScheduleRepositoryCustom{
    private final JPAQueryFactory queryFactory;
}
