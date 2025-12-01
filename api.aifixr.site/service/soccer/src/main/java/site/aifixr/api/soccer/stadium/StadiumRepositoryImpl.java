package site.aifixr.api.soccer.stadium;

import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class StadiumRepositoryImpl implements StadiumRepositoryCustom{
    private final JPAQueryFactory queryFactory;
}
