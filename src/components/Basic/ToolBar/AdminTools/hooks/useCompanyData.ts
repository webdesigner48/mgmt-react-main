// hooks/useCompanyData.ts
import { useState, useEffect, ChangeEvent } from 'react';
import { CompanyDataFormData } from '../types';

export const useCompanyData = () => {
  const [formData, setFormData] = useState<CompanyDataFormData>({
    companyName: '',
    street: '',
    houseNumber: '',
    postalCode: '',
    province: '',
    region: '',
    country: '',
    taxid: '',
    industry: '',
    businessField: '',
    earliestStartTime: '',
    latestEndTime: '',
    dailyWorkingTime: '',
    dailyBreakTime: '',
  });

  // Logo states
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoActive, setLogoActive] = useState(false);

  // Work time states
  const [totalWorkTimeDisplay, setTotalWorkTimeDisplay] = useState('0.0 Stunden');
  const [weeklyWorkTime, setWeeklyWorkTime] = useState('0.0');
  const [vacationWeeks, setVacationWeeks] = useState('');
  const [specialDays, setSpecialDays] = useState('');
  const [yearlyWorkHours, setYearlyWorkHours] = useState('-');
  const [maxHomeofficeDays, setMaxHomeofficeDays] = useState('');
  const [coreStartTime, setCoreStartTime] = useState('');
  const [coreEndTime, setCoreEndTime] = useState('');

  // Color states
  const [colorBlue, setColorBlue] = useState('');
  const [colorLightBlue, setColorLightBlue] = useState('');
  const [colorGreen, setColorGreen] = useState('');
  const [colorLightGreen, setColorLightGreen] = useState('');
  const [colorYellow, setColorYellow] = useState('');
  const [colorLightYellow, setColorLightYellow] = useState('');
  const [colorRed, setColorRed] = useState('');
  const [colorLightRed, setColorLightRed] = useState('');
  const [colorOrange, setColorOrange] = useState('');
  const [colorLightOrange, setColorLightOrange] = useState('');

  // Font states
  const [fontWhite, setFontWhite] = useState('');
  const [fontBlack, setFontBlack] = useState('');
  const [fontHeadline, setFontHeadline] = useState('');
  const [fontText, setFontText] = useState('');

  // Department states
  const [departmentGreenInput, setDepartmentGreenInput] = useState('');
  const [departmentOrangeSelect, setDepartmentOrangeSelect] = useState('');
  const [departmentRedInput, setDepartmentRedInput] = useState('');

  // Calculate total work time
  useEffect(() => {
    const hasWork = formData.dailyWorkingTime.trim() !== '';
    const hasBreak = formData.dailyBreakTime.trim() !== '';
    if (hasWork && hasBreak) {
      const workHours = parseFloat(formData.dailyWorkingTime) || 0;
      const breakMinutes = parseFloat(formData.dailyBreakTime) || 0;
      const breakHours = breakMinutes / 60;
      const totalHours = workHours + breakHours;
      setTotalWorkTimeDisplay(`${totalHours.toFixed(1)} Stunden täglich`);
      setWeeklyWorkTime(`${(totalHours * 5).toFixed(1)}`);
    } else {
      setTotalWorkTimeDisplay('-');
      setWeeklyWorkTime('-');
    }
  }, [formData.dailyWorkingTime, formData.dailyBreakTime]);

  // Calculate yearly work hours
  useEffect(() => {
    const hasWork = formData.dailyWorkingTime.trim() !== '' && formData.dailyBreakTime.trim() !== '';
    const hasVacation = vacationWeeks.trim() !== '';
    if (hasWork && hasVacation) {
      const workHours = parseFloat(formData.dailyWorkingTime) || 0;
      const breakMinutes = parseFloat(formData.dailyBreakTime) || 0;
      const breakHours = breakMinutes / 60;
      const totalHours = workHours + breakHours;
      const weekHours = totalHours * 5;
      const vacation = parseFloat(vacationWeeks) || 0;
      const special = parseFloat(specialDays) || 0;
      const yearly = (weekHours * (52 - vacation)) - (special * totalHours);
      setYearlyWorkHours(yearly > 0 ? Math.round(yearly).toString() : '0');
    } else {
      setYearlyWorkHours('-');
    }
  }, [formData.dailyWorkingTime, formData.dailyBreakTime, vacationWeeks, specialDays]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'dailyWorkingTime' || name === 'dailyBreakTime') {
      if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else if (name === 'earliestStartTime' || name === 'latestEndTime') {
      if (value === '' || /^([0-2]?[0-9])?(:[0-5]?[0-9]?)?$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => {
        const newState = { ...prev, [name]: value };
        if (name === 'industry' && prev.industry !== value) {
          newState.businessField = '';
        }
        return newState;
      });
    }
  };

  const handleLogoFile = (file: File) => {
    if (file.type !== 'image/svg+xml') {
      const msg = document.createElement('div');
      msg.textContent = 'Nur SVG-Dateien erlaubt!';
      msg.className = 'svg-popup-message';
      document.body.appendChild(msg);
      setTimeout(() => {
        msg.classList.add('hide');
        setTimeout(() => msg.remove(), 400);
      }, 2000);
      setLogoPreview(null);
      setLogoActive(false);
      return;
    }
    setLogoActive(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setLogoPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setFormData({
      companyName: '',
      street: '',
      houseNumber: '',
      postalCode: '',
      province: '',
      region: '',
      country: '',
      taxid: '',
      industry: '',
      businessField: '',
      earliestStartTime: '',
      latestEndTime: '',
      dailyWorkingTime: '',
      dailyBreakTime: '',
    });
    setTotalWorkTimeDisplay('0.0 Stunden');
    setLogoPreview(null);
    setLogoActive(false);
    setVacationWeeks('');
    setSpecialDays('');
    setMaxHomeofficeDays('');
    setCoreStartTime('');
    setCoreEndTime('');
  };

  return {
    formData,
    setFormData,
    logoPreview,
    setLogoPreview,
    logoActive,
    setLogoActive,
    colorStates: {
      colorBlue, setColorBlue,
      colorLightBlue, setColorLightBlue,
      colorGreen, setColorGreen,
      colorLightGreen, setColorLightGreen,
      colorYellow, setColorYellow,
      colorLightYellow, setColorLightYellow,
      colorRed, setColorRed,
      colorLightRed, setColorLightRed,
      colorOrange, setColorOrange,
      colorLightOrange, setColorLightOrange,
    },
    fontStates: {
      fontWhite, setFontWhite,
      fontBlack, setFontBlack,
      fontHeadline, setFontHeadline,
      fontText, setFontText,
    },
    departmentStates: {
      departmentGreenInput, setDepartmentGreenInput,
      departmentOrangeSelect, setDepartmentOrangeSelect,
      departmentRedInput, setDepartmentRedInput,
    },
    workTimeData: {
      totalWorkTimeDisplay,
      weeklyWorkTime,
      vacationWeeks, setVacationWeeks,
      specialDays, setSpecialDays,
      yearlyWorkHours,
      maxHomeofficeDays, setMaxHomeofficeDays,
      coreStartTime, setCoreStartTime,
      coreEndTime, setCoreEndTime,
    },
    handleChange,
    handleLogoFile,
    resetForm,
  };
};