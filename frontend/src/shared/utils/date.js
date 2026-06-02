const WEEKDAYS_PT_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

function cloneDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function capitalize(text) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatDatePtBR(date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function formatMonthNamePtBR(date) {
  return capitalize(
    new Intl.DateTimeFormat('pt-BR', {
      month: 'long',
    }).format(date)
  );
}

export function getUpcomingWeek(baseDate = new Date(), days = 7) {
  const initialDate = cloneDate(baseDate);

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(initialDate);
    date.setDate(initialDate.getDate() + index);

    return {
      id: date.toISOString(),
      date,
      weekdayLabel: WEEKDAYS_PT_SHORT[date.getDay()],
      dayNumber: String(date.getDate()).padStart(2, '0'),
      monthName: formatMonthNamePtBR(date),
      fullDate: formatDatePtBR(date),
    };
  });
}

export function formatWeekRangePtBR(weekDays) {
  if (!weekDays?.length) return '';

  const start = weekDays[0].date;
  const end = weekDays[weekDays.length - 1].date;

  return `${formatDatePtBR(start)} a ${formatDatePtBR(end)}`;
}

export function formatDayMonthPtBR(date) {
  const day = String(date.getDate()).padStart(2, '0');
  return `${day} de ${formatMonthNamePtBR(date)}`;
}
