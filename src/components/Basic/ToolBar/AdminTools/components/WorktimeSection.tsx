// components/WorktimeSection.tsx
import React from 'react';
import { CompanyDataFormData } from '../types';
import { getTimeFrameHours, getTimeFrameHoursAllowDash, getHomeofficeYearlyHours } from '../utils/helpers';

interface WorktimeSectionProps {
  formData: CompanyDataFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  workTimeData: any;
}

export const WorktimeSection: React.FC<WorktimeSectionProps> = ({ formData, handleChange, workTimeData }) => {
  const {
    totalWorkTimeDisplay,
    weeklyWorkTime,
    vacationWeeks,
    setVacationWeeks,
    specialDays,
    setSpecialDays,
    yearlyWorkHours,
    maxHomeofficeDays,
    setMaxHomeofficeDays,
    coreStartTime,
    setCoreStartTime,
    coreEndTime,
    setCoreEndTime,
  } = workTimeData;

  const timeFrameHours = getTimeFrameHours(formData.earliestStartTime || '', formData.latestEndTime || '');
  const coreTimeFrameHours = getTimeFrameHoursAllowDash(coreStartTime, coreEndTime);
  const homeofficeYearlyHours = getHomeofficeYearlyHours(
    maxHomeofficeDays,
    vacationWeeks,
    formData.dailyWorkingTime,
    formData.dailyBreakTime
  );

  return (
    <div className="popup-form-section">
      <div className="section-label">Eingaben</div>
      <hr className="divider-row" />
      
      <div className="form-row">
        <div className="form-group form-group-time" style={{ position: 'relative' }}>
          <input
            type="text"
            id="earliestStartTime"
            name="earliestStartTime"
            value={formData.earliestStartTime || ''}
            onChange={handleChange}
            className={formData.earliestStartTime ? 'filled input-has-unit' : 'input-has-unit'}
            placeholder="Frühest möglicher Arbeitsbeginn"
            aria-label="Früheste Anfangszeit"
            maxLength={5}
          />
          {formData.earliestStartTime && (
            <span className="input-unit-inside">Arbeitsbeginn</span>
          )}
        </div>
        <div className="form-group form-group-time" style={{ position: 'relative' }}>
          <input
            type="text"
            id="latestEndTime"
            name="latestEndTime"
            value={formData.latestEndTime || ''}
            onChange={handleChange}
            className={formData.latestEndTime ? 'filled input-has-unit' : 'input-has-unit'}
            placeholder="Spätest mögliches Arbeitsende"
            aria-label="Späteste Endzeit"
            maxLength={5}
          />
          {formData.latestEndTime && (
            <span className="input-unit-inside">Arbeitsende</span>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group form-group-time" style={{ position: 'relative' }}>
          <input
            type="text"
            id="coreStartTime"
            name="coreStartTime"
            value={coreStartTime}
            onChange={e => setCoreStartTime(e.target.value === '' || e.target.value === '-' || /^([0-2]?[0-9])?(:[0-5]?[0-9]?)?$/.test(e.target.value) ? e.target.value : coreStartTime)}
            className={coreStartTime ? 'filled input-has-unit' : 'input-has-unit'}
            placeholder="Beginn Kernarbeitszeit"
            aria-label="Beginn Kernarbeitszeit"
            maxLength={5}
          />
          {coreStartTime && coreStartTime !== '-' && (
            <span className="input-unit-inside">Kernbeginn</span>
          )}
        </div>
        <div className="form-group form-group-time" style={{ position: 'relative' }}>
          <input
            type="text"
            id="coreEndTime"
            name="coreEndTime"
            value={coreEndTime}
            onChange={e => setCoreEndTime(e.target.value === '' || e.target.value === '-' || /^([0-2]?[0-9])?(:[0-5]?[0-9]?)?$/.test(e.target.value) ? e.target.value : coreEndTime)}
            className={coreEndTime ? 'filled input-has-unit' : 'input-has-unit'}
            placeholder="Ende Kernarbeitszeit"
            aria-label="Ende Kernarbeitszeit"
            maxLength={5}
          />
          {coreEndTime && coreEndTime !== '-' && (
            <span className="input-unit-inside">Kernende</span>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group form-group-time">
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              inputMode="decimal"
              id="dailyWorkingTime"
              name="dailyWorkingTime"
              value={formData.dailyWorkingTime}
              onChange={handleChange}
              className={formData.dailyWorkingTime ? 'filled input-has-unit' : 'input-has-unit'}
              placeholder="Tägliche Arbeitszeit (Std.)"
              aria-label="Tägliche Arbeitszeit (Std.)"
              style={{ paddingRight: formData.dailyWorkingTime ? '10.5em' : undefined }}
            />
            {formData.dailyWorkingTime && (
              <span className="input-unit-inside">Stunden tägliche Arbeitszeit</span>
            )}
          </div>
        </div>
        <div className="form-group form-group-time">
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              inputMode="decimal"
              id="dailyBreakTime"
              name="dailyBreakTime"
              value={formData.dailyBreakTime}
              onChange={handleChange}
              className={formData.dailyBreakTime ? 'filled input-has-unit' : 'input-has-unit'}
              placeholder="Tägliche Pausenzeit (Min.)"
              aria-label="Tägliche Pausenzeit (Min.)"
              style={{ paddingRight: formData.dailyBreakTime ? '8.5em' : undefined }}
            />
            {formData.dailyBreakTime && (
              <span className="input-unit-inside">Minuten Pause</span>
            )}
          </div>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group form-group-time">
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              inputMode="decimal"
              id="vacationWeeks"
              name="vacationWeeks"
              value={vacationWeeks}
              onChange={e => setVacationWeeks(e.target.value)}
              className={vacationWeeks ? 'filled input-has-unit' : 'input-has-unit'}
              placeholder="Urlaubsanspruch (Wochen)"
              aria-label="Urlaubsanspruch (Wochen)"
              style={{ paddingRight: vacationWeeks ? '9.5em' : undefined }}
            />
            {vacationWeeks && (
              <span className="input-unit-inside">Wochen Urlaub im Jahr</span>
            )}
          </div>
        </div>
        <div className="form-group form-group-time">
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              inputMode="decimal"
              id="specialDays"
              name="specialDays"
              value={specialDays}
              onChange={e => setSpecialDays(e.target.value)}
              className={specialDays ? 'filled input-has-unit' : 'input-has-unit'}
              placeholder="Sonderfreie Tage"
              aria-label="Sonderfreie Tage"
              style={{ paddingRight: specialDays ? '7.5em' : undefined }}
            />
            {specialDays && (
              <span className="input-unit-inside">{parseFloat(specialDays.replace(',', '.')) === 1 ? 'Sonderfreier Tag' : 'Sonderfreie Tage'}</span>
            )}
          </div>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group form-group-time" style={{width: '100%', position: 'relative'}}>
          <input
            type="text"
            inputMode="decimal"
            id="maxHomeofficeDays"
            name="maxHomeofficeDays"
            value={maxHomeofficeDays}
            onChange={e => {
              const val = e.target.value;
              if (val === '' || /^\d{0,2}(\.|,)?\d{0,1}$/.test(val)) setMaxHomeofficeDays(val.replace(',', '.'));
            }}
            className={maxHomeofficeDays ? 'filled input-has-unit' : 'input-has-unit'}
            placeholder="Maximale Anzahl an Tagen Homeoffice pro Woche"
            aria-label="Maximale Anzahl an Tagen Homeoffice pro Woche"
            style={{ paddingRight: maxHomeofficeDays ? '13em' : undefined }}
          />
          {maxHomeofficeDays && (
            <span className="input-unit-inside">{parseFloat(maxHomeofficeDays.replace(',', '.')) === 1 ? 'Tag' : 'Tage'} Homeoffice pro Woche</span>
          )}
        </div>
      </div>

      <div className="section-label">Ergebnisse</div>
      <hr className="divider-row" />

      <div className="form-row">
        <div className="form-group form-group-time">
          <input
            type="text"
            value={timeFrameHours !== '-' ? `${timeFrameHours} Stunden Arbeitszeitrahmen` : ''}
            readOnly
            disabled
            className={`total-work-time-display ${timeFrameHours !== '-' ? 'active' : ''}`}
          />
        </div>
        <div className="form-group form-group-time">
          <input
            type="text"
            value={coreTimeFrameHours !== '-' ? `${coreTimeFrameHours} Stunden Kernarbeitszeit` : ''}
            readOnly
            disabled
            className={`total-work-time-display ${coreTimeFrameHours !== '-' ? 'active' : ''}`}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group form-group-time">
          <input
            type="text"
            value={totalWorkTimeDisplay}
            readOnly
            disabled
            className={`total-work-time-display ${formData.dailyWorkingTime && formData.dailyBreakTime ? 'active' : ''}`}
          />
        </div>
        <div className="form-group form-group-time">
          <input
            type="text"
            value={weeklyWorkTime === '-' ? '-' : `${weeklyWorkTime} Stunden wöchentlich`}
            readOnly
            disabled
            className={`total-work-time-display ${(formData.dailyWorkingTime && formData.dailyBreakTime) ? 'active' : ''}`}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group form-group-time" style={{width: '100%'}}>
          <input
            type="text"
            value={yearlyWorkHours === '-' ? '-' : `${yearlyWorkHours} Stunden im Jahr`}
            readOnly
            disabled
            className={`total-work-time-display ${yearlyWorkHours !== '-' ? 'active' : ''}`}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group form-group-time" style={{width: '100%'}}>
          <input
            type="text"
            value={homeofficeYearlyHours === '-' ? '-' : `${homeofficeYearlyHours} Stunden Homeoffice im Jahr`}
            readOnly
            disabled
            className={`total-work-time-display ${(homeofficeYearlyHours !== '-' && maxHomeofficeDays && parseFloat(maxHomeofficeDays.replace(',', '.')) > 0) ? 'active homeoffice-sum-orange' : ''}`}
          />
        </div>
      </div>
    </div>
  );
};