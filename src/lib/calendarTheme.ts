/**
 * Calendar theme matching the Paws & Prognosis design system.
 * Use: <Calendar theme={calendarTheme} />
 */
export const calendarTheme = {
  backgroundColor: '#FEF9F4',
  calendarBackground: '#FEF9F4',

  // Month/year header
  monthTextColor: '#544864',
  textMonthFontWeight: '600' as const,
  textMonthFontSize: 18,

  // Day names (Mon, Tue, etc.)
  textSectionTitleColor: '#808080',
  textDayHeaderFontSize: 13,
  textDayHeaderFontWeight: '500' as const,

  // Day numbers
  dayTextColor: '#343434',
  textDayFontSize: 15,
  textDayFontWeight: '400' as const,

  // Today
  todayTextColor: '#71924F',
  todayBackgroundColor: 'rgba(113, 146, 79, 0.1)',

  // Selected day
  selectedDayBackgroundColor: '#71924F',
  selectedDayTextColor: '#FFFFFF',

  // Disabled days
  textDisabledColor: '#D1D5DB',

  // Dots
  dotColor: '#71924F',
  selectedDotColor: '#FFFFFF',

  // Arrows
  arrowColor: '#71924F',

  // Indicator
  indicatorColor: '#71924F',

  // Others
  textDayStyle: { marginTop: 2 },
};
