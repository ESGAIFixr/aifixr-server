"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, Filter, RotateCcw, Calendar as CalendarIcon, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card } from './ui/card';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { format, getYear, getMonth, setMonth, setYear } from 'date-fns';
import { ko } from 'date-fns/locale';

export interface FilterValues {
  searchQuery: string;
  industryFilter: string;
  gradeFilter: string;
  riskFilter: string;
  completionFilter?: string;
  sortBy?: 'name' | 'date';
  sortOrder?: 'asc' | 'desc';
}

interface SearchAndFilterProps {
  onFilterChange: (filters: FilterValues) => void;
  onReset?: () => void;
  showCompletionFilter?: boolean;
}

export function SearchAndFilter({
  onFilterChange,
  onReset,
  showCompletionFilter = false
}: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [completionFilter, setCompletionFilter] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [sortBy, setSortBy] = useState<'name' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const [isStartDatePickerOpen, setIsStartDatePickerOpen] = useState(false);
  const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);
  const [startCalendarMonth, setStartCalendarMonth] = useState<Date>(new Date());
  const [endCalendarMonth, setEndCalendarMonth] = useState<Date>(new Date());
  const [isStartYearMonthOpen, setIsStartYearMonthOpen] = useState(false);
  const [isEndYearMonthOpen, setIsEndYearMonthOpen] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  const years = Array.from({ length: 10 }, (_, i) => getYear(new Date()) - 5 + i);
  const months = Array.from({ length: 12 }, (_, i) => i);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!filterDropdownRef.current) return;

      const target = event.target as HTMLElement;

      // Select 컴포넌트의 드롭다운(Portal로 렌더링됨)이 열려있는지 확인
      const selectContent = document.querySelector('[data-slot="select-content"]');
      if (selectContent) {
        return;
      }

      // 필터 드롭다운 내부나 Select Trigger를 클릭한 경우 닫지 않음
      if (filterDropdownRef.current.contains(target) || target.closest('[data-slot="select-trigger"]')) {
        return;
      }

      setIsFilterOpen(false);
    };

    if (isFilterOpen) {
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside, true);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside, true);
      };
    }
  }, [isFilterOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!sortDropdownRef.current) return;

      const target = event.target as HTMLElement;

      // Select 컴포넌트의 드롭다운(Portal로 렌더링됨)이 열려있는지 확인
      const selectContent = document.querySelector('[data-slot="select-content"]');
      if (selectContent) {
        return;
      }

      // 정렬 드롭다운 내부나 Select Trigger를 클릭한 경우 닫지 않음
      if (sortDropdownRef.current.contains(target) || target.closest('[data-slot="select-trigger"]')) {
        return;
      }

      setIsSortOpen(false);
    };

    if (isSortOpen) {
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside, true);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside, true);
      };
    }
  }, [isSortOpen]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setGradeFilter('all');
    setIndustryFilter('all');
    setRiskFilter('all');
    setCompletionFilter('all');
    setStartDate(undefined);
    setEndDate(undefined);
    setSortBy('date');
    setSortOrder('desc');
    if (onReset) {
      onReset();
    }
  };

  const handleApplyFilters = () => {
    const filters: FilterValues = {
      searchQuery,
      industryFilter,
      gradeFilter,
      riskFilter,
      sortBy,
      sortOrder,
    };
    if (showCompletionFilter) {
      filters.completionFilter = completionFilter;
    }
    onFilterChange(filters);
    setIsFilterOpen(false);
  };

  const handleSortByChange = (value: 'name' | 'date') => {
    setSortBy(value);
    const filters: FilterValues = {
      searchQuery,
      industryFilter,
      gradeFilter,
      riskFilter,
      sortBy: value,
      sortOrder,
    };
    if (showCompletionFilter) {
      filters.completionFilter = completionFilter;
    }
    onFilterChange(filters);
  };

  const handleSortOrderChange = (value: 'asc' | 'desc') => {
    setSortOrder(value);
    const filters: FilterValues = {
      searchQuery,
      industryFilter,
      gradeFilter,
      riskFilter,
      sortBy,
      sortOrder: value,
    };
    if (showCompletionFilter) {
      filters.completionFilter = completionFilter;
    }
    onFilterChange(filters);
  };

  return (
    <Card className="p-6 rounded-[20px] shadow-[0_4px_20px_rgba(91,59,250,0.1)] mb-6">
      <div className="flex gap-3">
        {/* Sort Dropdown - 좌측에 배치 */}
        <div className="relative" ref={sortDropdownRef}>
          <Button
            variant="outline"
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="h-12 rounded-xl border-2 px-6"
          >
            <ArrowUpDown className="w-4 h-4 mr-2" />
            정렬
          </Button>

          {/* Sort Dropdown */}
          {isSortOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50">
              <div className="space-y-4">
                {/* 정렬 순서 토글 (위) */}
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">정렬 순서</label>
                  <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => handleSortOrderChange(value)}>
                    <SelectTrigger className="h-12 rounded-xl border-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">오름차순</SelectItem>
                      <SelectItem value="desc">내림차순</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 정렬 기준 토글 (아래) */}
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">정렬 기준</label>
                  <Select value={sortBy} onValueChange={(value: 'name' | 'date') => handleSortByChange(value)}>
                    <SelectTrigger className="h-12 rounded-xl border-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">날짜</SelectItem>
                      <SelectItem value="name">회사명</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8C8C8C]" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="기업명 검색..."
            className="pl-10 h-12 rounded-xl border-gray-200"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleApplyFilters();
              }
            }}
          />
        </div>

        {/* Date Range Picker */}
        <div className="flex items-center gap-2">
          {/* Start Date */}
          <Popover open={isStartDatePickerOpen} onOpenChange={setIsStartDatePickerOpen}>
            <PopoverTrigger asChild>
              <div className="relative">
                <Input
                  type="text"
                  readOnly
                  value={startDate ? format(startDate, 'yy.MM.dd', { locale: ko }) : ''}
                  placeholder="시작일"
                  className="h-12 rounded-xl border-2 px-4 w-32 cursor-pointer"
                  onClick={() => setIsStartDatePickerOpen(true)}
                />
                <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8C8C] pointer-events-none" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white border border-gray-200 shadow-lg" align="start" side="bottom">
              <div className="p-3 w-[280px]">
                {/* Year and Month Selector */}
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Select
                    value={getYear(startCalendarMonth).toString()}
                    onValueChange={(value) => {
                      setStartCalendarMonth(setYear(startCalendarMonth, parseInt(value)));
                    }}
                  >
                    <SelectTrigger className="w-24 h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}년
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={getMonth(startCalendarMonth).toString()}
                    onValueChange={(value) => {
                      setStartCalendarMonth(setMonth(startCalendarMonth, parseInt(value)));
                    }}
                  >
                    <SelectTrigger className="w-20 h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month} value={month.toString()}>
                          {month + 1}월
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="calendar-wrapper">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    month={startCalendarMonth}
                    onMonthChange={setStartCalendarMonth}
                    onSelect={(date) => {
                      setStartDate(date);
                      setIsStartDatePickerOpen(false);
                    }}
                    locale={ko}
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <span className="text-[#8C8C8C]">~</span>

          {/* End Date */}
          <Popover open={isEndDatePickerOpen} onOpenChange={setIsEndDatePickerOpen}>
            <PopoverTrigger asChild>
              <div className="relative">
                <Input
                  type="text"
                  readOnly
                  value={endDate ? format(endDate, 'yy.MM.dd', { locale: ko }) : ''}
                  placeholder="종료일"
                  className="h-12 rounded-xl border-2 px-4 w-32 cursor-pointer"
                  onClick={() => setIsEndDatePickerOpen(true)}
                />
                <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8C8C] pointer-events-none" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white border border-gray-200 shadow-lg" align="start" side="bottom">
              <div className="p-3 w-[280px]">
                {/* Year and Month Selector */}
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Select
                    value={getYear(endCalendarMonth).toString()}
                    onValueChange={(value) => {
                      setEndCalendarMonth(setYear(endCalendarMonth, parseInt(value)));
                    }}
                  >
                    <SelectTrigger className="w-24 h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}년
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={getMonth(endCalendarMonth).toString()}
                    onValueChange={(value) => {
                      setEndCalendarMonth(setMonth(endCalendarMonth, parseInt(value)));
                    }}
                  >
                    <SelectTrigger className="w-20 h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month} value={month.toString()}>
                          {month + 1}월
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="calendar-wrapper">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    month={endCalendarMonth}
                    onMonthChange={setEndCalendarMonth}
                    onSelect={(date) => {
                      setEndDate(date);
                      setIsEndDatePickerOpen(false);
                    }}
                    locale={ko}
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Filter Button with Dropdown */}
        <div className="relative" ref={filterDropdownRef}>
          <Button
            variant="outline"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="h-12 rounded-xl border-2 px-6"
          >
            <Filter className="w-4 h-4 mr-2" />
            필터
          </Button>

          {/* Filter Dropdown */}
          {isFilterOpen && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50">
              <div className="space-y-4">
                {/* Industry Filter */}
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">업종</label>
                  <Select value={industryFilter} onValueChange={setIndustryFilter}>
                    <SelectTrigger className="h-12 rounded-xl border-2">
                      <SelectValue placeholder="업종" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체 업종</SelectItem>
                      <SelectItem value="IT/소프트웨어">IT/소프트웨어</SelectItem>
                      <SelectItem value="제조">제조</SelectItem>
                      <SelectItem value="에너지">에너지</SelectItem>
                      <SelectItem value="환경">환경</SelectItem>
                      <SelectItem value="물류">물류</SelectItem>
                      <SelectItem value="바이오/헬스케어">바이오/헬스케어</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Grade Filter */}
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">ESG 등급</label>
                  <Select value={gradeFilter} onValueChange={setGradeFilter}>
                    <SelectTrigger className="h-12 rounded-xl border-2">
                      <SelectValue placeholder="ESG 등급" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체 등급</SelectItem>
                      <SelectItem value="A">A등급</SelectItem>
                      <SelectItem value="B">B등급</SelectItem>
                      <SelectItem value="C">C등급</SelectItem>
                      <SelectItem value="D">D등급</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Risk Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">위험도</label>
                  <Select value={riskFilter} onValueChange={setRiskFilter}>
                    <SelectTrigger className="h-12 rounded-xl border-2">
                      <SelectValue placeholder="위험도" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체 위험도</SelectItem>
                      <SelectItem value="low">낮음</SelectItem>
                      <SelectItem value="medium">중간</SelectItem>
                      <SelectItem value="high">높음</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Completion Filter (optional) */}
                {showCompletionFilter && (
                  <div>
                    <label className="block text-sm font-medium text-[#0F172A] mb-2">데이터 완료율</label>
                    <Select value={completionFilter} onValueChange={setCompletionFilter}>
                      <SelectTrigger className="h-12 rounded-xl border-2">
                        <SelectValue placeholder="데이터 완료율" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        <SelectItem value="complete">100%</SelectItem>
                        <SelectItem value="high">80-99%</SelectItem>
                        <SelectItem value="medium">50-79%</SelectItem>
                        <SelectItem value="low">0-49%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-4">
                <Button
                  variant="outline"
                  onClick={handleResetFilters}
                  className="flex-1 h-10 rounded-xl border-2"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  초기화
                </Button>
                <Button
                  onClick={handleApplyFilters}
                  className="flex-1 h-10 rounded-xl bg-gradient-to-r from-[#5B3BFA] to-[#00B4FF] text-white hover:opacity-90"
                >
                  적용
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Search Button */}
        <Button
          onClick={handleApplyFilters}
          className="h-12 rounded-xl px-6 bg-gradient-to-r from-[#5B3BFA] to-[#00B4FF] text-white hover:opacity-90"
        >
          <Search className="w-4 h-4 mr-2" />
          검색
        </Button>
      </div>
    </Card>
  );
}


