import { FilterDateType } from 'src/constants/emum';

export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}
export function findDateRangeForFilter(dateFilter: FilterDateType): {
  startDate: Date;
  endDate: Date;
} {
  let startDate: Date;
  let endDate: Date;
  const currentDate = new Date();
  switch (dateFilter) {
    case FilterDateType.TODAY:
      startDate = new Date(currentDate.setHours(0, 0, 0, 0));
      endDate = new Date(currentDate.setHours(23, 59, 59, 999));
      return { startDate, endDate };
    case FilterDateType.YESTERDAY:
      const msInOneDay = 1000 * 60 * 60 * 24;
      startDate = new Date(currentDate.setHours(0, 0, 0, 0) - msInOneDay);
      endDate = new Date(currentDate.setHours(23, 59, 59, 999) - msInOneDay);
      return { startDate, endDate };
    case FilterDateType.LAST_7_DAYS:
      const msInOneWeek = 1000 * 60 * 60 * 24 * 7;
      startDate = new Date(currentDate.setHours(0, 0, 0, 0) - msInOneWeek);
      endDate = new Date(currentDate.setHours(23, 59, 59, 999) - msInOneWeek);
      return { startDate, endDate };
    case FilterDateType.LAST_30_DAYS:
      const msIn30Days = 1000 * 60 * 60 * 24 * 30;
      startDate = new Date(currentDate.setHours(0, 0, 0, 0) - msIn30Days);
      endDate = new Date(currentDate.setHours(23, 59, 59, 999) - msIn30Days);
      return { startDate, endDate };
    case FilterDateType.LAST_3_MONTHS:
      currentDate.setMonth(currentDate.getMonth() - 3); // Go back 3 months
      if (currentDate.getMonth() > endDate.getMonth()) {
        currentDate.setFullYear(currentDate.getFullYear() - 1);
      }
      startDate.setDate(1);
      endDate.setDate(0);
      return {
        startDate: currentDate,
        endDate: endDate,
      };
  }
}
