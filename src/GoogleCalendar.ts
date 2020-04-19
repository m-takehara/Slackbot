const HOLIDAY_CALENDAR_ID = "ja.japanese#holiday@group.v.calendar.google.com";

export class GoogleCalendar {
    public static isBusinessDay(today: Date): boolean {
        return !(this.isHoliday(today) || this.isPublicHoliday(today));
    }

    private static isHoliday(today: Date): boolean {
        const eventsForDay = CalendarApp
            .getCalendarById(HOLIDAY_CALENDAR_ID)
            .getEventsForDay(today);
        // 0より大きければその日は祝日(何かイベントがある)
        return 0 < eventsForDay.length;
    }

    private static isPublicHoliday(today: Date): boolean {
        const day: number = today.getDay();
        // 日曜日(0)か土曜日(6)であればその日は休日
        return day === 0 || day === 6;
    }
}
