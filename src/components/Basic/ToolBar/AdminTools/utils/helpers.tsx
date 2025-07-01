// utils/helpers.tsx
import React from 'react';

export function isValidHexColor(val: string) {
  return /^#[0-9a-fA-F]{6}$/.test(val);
}

export function getColorBoxClass(val: string) {
  if (!val) return 'design-color-box';
  if (/^#$|^#[0-9a-fA-F]{1,5}$/.test(val)) return 'design-color-box color-incomplete';
  if (!/^#[0-9a-fA-F]{6}$/.test(val)) return 'design-color-box color-error';
  return 'design-color-box color-valid';
}

export function getColorBoxContent(val: string, type: 'blue' | 'lightblue' | 'green' | 'lightgreen' | 'yellow' | 'lightyellow' | 'orange' | 'lightorange' | 'red' | 'lightred') {
  let checkColor = '#ececec';
  if (type === 'yellow' || type.startsWith('light') || type === 'orange' || type === 'lightorange') {
    checkColor = '#404040';
  }
  const isValid = isValidHexColor(val);
  const isIncomplete = /^#$|^#[0-9a-fA-F]{1,5}$/.test(val);
  const isError = val && !isValid && !isIncomplete;

  if (isError) {
    return (
      <span className="colorbox-svg-wrapper">
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" style={{ display: 'block', margin: '0 auto', position: 'absolute', left: 0, top: 0, opacity: 1, transition: 'opacity 0.25s' }}>
          <line x1="7" y1="7" x2="19" y2="19" stroke="#6d1a1a" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="19" y1="7" x2="7" y2="19" stroke="#6d1a1a" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </span>
    );
  }
  if (isIncomplete) {
    return (
      <span className="colorbox-svg-wrapper">
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" style={{ display: 'block', margin: '0 auto', position: 'absolute', left: 0, top: 0, opacity: isIncomplete ? 1 : 0, transition: 'opacity 0.25s' }}>
          <circle className="colorbox-dot" cx="8" cy="13" r="1.0" fill="#ececec" style={{ opacity: isIncomplete ? 1 : 0, transition: 'opacity 0.25s' }} />
          <circle className="colorbox-dot" cx="13" cy="13" r="1.0" fill="#ececec" style={{ opacity: isIncomplete ? 1 : 0, transition: 'opacity 0.25s' }} />
          <circle className="colorbox-dot" cx="18" cy="13" r="1.0" fill="#ececec" style={{ opacity: isIncomplete ? 1 : 0, transition: 'opacity 0.25s' }} />
        </svg>
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" style={{ display: 'block', margin: '0 auto', position: 'absolute', left: 0, top: 0, opacity: isIncomplete ? 0 : 1, transition: 'opacity 0.25s' }}>
          <line x1="5" y1="13" x2="21" y2="13" stroke="#ececec" strokeWidth="2.0" strokeLinecap="round" />
        </svg>
      </span>
    );
  }
  return (
    <span className="colorbox-svg-wrapper">
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" style={{ display: 'block', margin: '0 auto', position: 'absolute', left: 0, top: 0, opacity: isValid ? 0 : 1, transition: 'opacity 0.25s' }}>
        <line x1="5" y1="13" x2="21" y2="13" stroke="#ececec" strokeWidth="2.0" strokeLinecap="round" />
      </svg>
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" style={{ display: 'block', margin: '0 auto', position: 'absolute', left: 0, top: 0, opacity: isValid ? 1 : 0, transition: 'opacity 0.25s' }}>
        <path d="M6 14l5 5 9-11" stroke={checkColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );
}

export function getTimeFrameHours(start: string, end: string): string {
  if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(start) || !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(end)) {
    return '-';
  }
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let diff = (eh + em / 60) - (sh + sm / 60);
  if (diff < 0) diff += 24;
  return diff.toFixed(1);
}

export function getTimeFrameHoursAllowDash(start: string, end: string): string {
  if (start === '-' && end === '-') return '0.0';
  if (start === '-' || end === '-') return '-';
  if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(start) || !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(end)) {
    return '-';
  }
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let diff = (eh + em / 60) - (sh + sm / 60);
  if (diff < 0) diff += 24;
  return diff.toFixed(1);
}

export function getHomeofficeYearlyHours(maxHomeofficeDays: string, vacationWeeks: string, dailyWorkingTime: string, dailyBreakTime: string): string {
  const homeofficeDays = parseFloat(maxHomeofficeDays.replace(',', '.'));
  const vacation = parseFloat(vacationWeeks.replace(',', '.'));
  const workHours = parseFloat(dailyWorkingTime);
  const breakMinutes = parseFloat(dailyBreakTime);
  
  if (
    isNaN(homeofficeDays) || homeofficeDays <= 0 ||
    isNaN(vacation) || vacationWeeks.trim() === '' || vacation < 0 ||
    isNaN(workHours) || dailyWorkingTime.trim() === '' || workHours < 0 ||
    isNaN(breakMinutes) || dailyBreakTime.trim() === '' || breakMinutes < 0
  ) {
    return '-';
  }
  const totalHours = workHours + breakMinutes / 60;
  const weeks = 52 - vacation;
  const sum = weeks * homeofficeDays * totalHours;
  return sum > 0 ? sum.toFixed(1) : '-';
}