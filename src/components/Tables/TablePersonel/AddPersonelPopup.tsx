import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import './AddPersonelPopup.css';

interface AddPersonelPopupProps {
  isVisible: boolean;
  onClose: () => void;
  onAddPersonel: (personel: Omit<PersonelRow, 'id' | 'aktion'>) => void;
}

// Define PersonelRow structure locally or import if available globally
// For now, defining essential fields for the form
interface PersonelFormData {
  vorname: string;
  nachname: string;
  kapazitaet: string;
  abteilung: string;
  email: string;
  rolle: string;
}

// Match this with TablePersonel.tsx or a shared types file
interface PersonelRow {
  id: string;
  vorname: string;
  nachname: string;
  kapazitaet: string;
  abteilung: string;
  email: string;
  rolle: string;
  aktion: string;
}

const departmentOptions = ["Geschäftsführung", "IT", "HR", "Finanzen"];
const roleOptions = ["User", "Leader", "Management"];

const AddPersonelPopup: React.FC<AddPersonelPopupProps> = ({ isVisible, onClose, onAddPersonel }) => {
  const [isMounted, setIsMounted] = useState(isVisible);
  const [animationClassName, setAnimationClassName] = useState('');
  const [formData, setFormData] = useState<PersonelFormData>({
    vorname: '',
    nachname: '',
    kapazitaet: '',
    abteilung: departmentOptions[0], // Default to the first option
    email: '',
    rolle: roleOptions[0], // Default to the first option
  });

  useEffect(() => {
    if (isVisible) {
      setIsMounted(true);
      const timer = setTimeout(() => {
        setAnimationClassName('fade-in');
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setAnimationClassName('fade-out');
      const timer = setTimeout(() => {
        setIsMounted(false);
        // Reset form when popup is fully closed
        setFormData({
          vorname: '',
          nachname: '',
          kapazitaet: '',
          abteilung: departmentOptions[0],
          email: '',
          rolle: roleOptions[0],
        });
      }, 300); // Match CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'kapazitaet') {
      let numericValueStr = value.replace('%', '');
      if (numericValueStr === '') {
        setFormData(prev => ({ ...prev, [name]: '' }));
        return;
      }
      
      const numericValue = parseFloat(numericValueStr);
      if (!isNaN(numericValue)) {
        if (numericValue > 100) {
          setFormData(prev => ({ ...prev, [name]: '100' }));
        } else if (numericValue < 0) {
          setFormData(prev => ({ ...prev, [name]: '0' }));
        } else {
          // Allow typing numbers, but don't add '%' yet.
          // Keep the string representation if it's like "50." to allow further typing.
          setFormData(prev => ({ ...prev, [name]: numericValueStr }));
        }
      } else {
        // If not a number (e.g., "abc"), clear or keep previous valid, or allow as is if desired.
        // For now, let's prevent non-numeric input directly that's not part of a valid number.
        // This part can be tricky if we want to allow "50%" directly.
        // The current logic focuses on the numeric part.
        // If value is not a number and not empty, we might want to revert or ignore.
        // Let's stick to updating if it's a potentially valid start of a number or a capped number.
        // If `value` itself was "abc", `numericValueStr` is "abc", `numericValue` is NaN.
        // We could choose to not update formData here, or clear it.
        // For simplicity, if it's not a number, we don't change kapazitaet from what it was.
        // Or, allow typing, and validation happens at submit / blur.
        // The current approach: if it becomes NaN after stripping '%', we set it to the stripped string.
        // This allows typing "abc" which will then fail validation or be handled at submit.
        // A better way for kapazitaet might be to only allow digits.
        setFormData(prev => ({ ...prev, [name]: numericValueStr }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.vorname.trim() || !formData.nachname.trim()) {
      alert('Vorname and Nachname are required.');
      return;
    }

    let kapazitaetToSave = formData.kapazitaet;
    // Remove any existing '%' for parsing, then re-evaluate
    let numericKapazitaetStr = kapazitaetToSave.replace('%', '');
    
    if (numericKapazitaetStr.trim() === '') {
      kapazitaetToSave = ''; // Or a default like '0%' or handle as invalid
    } else {
      let numericKapazitaet = parseFloat(numericKapazitaetStr);
      if (!isNaN(numericKapazitaet)) {
        if (numericKapazitaet > 100) {
          numericKapazitaet = 100;
        } else if (numericKapazitaet < 0) {
          numericKapazitaet = 0;
        }
        kapazitaetToSave = String(numericKapazitaet) + '%';
      } else {
        // Handle cases where kapazitaet might be non-numeric after all, e.g. "abc"
        // Depending on requirements, this could be an error, or saved as is (e.g. "abc%")
        // For now, if it's not a number, we'll save it as is and append '%' if not present.
        // This matches the previous behavior for non-numeric strings.
        if (!kapazitaetToSave.endsWith('%')) {
            kapazitaetToSave += '%';
        }
      }
    }
    

    onAddPersonel({ ...formData, kapazitaet: kapazitaetToSave });
    onClose();
  };

  if (!isMounted && !animationClassName.includes('fade-out')) {
    return null;
  }
   if (!isMounted && animationClassName === '' && !isVisible) {
      return null;
  }

  return (
    <div className={`add-personel-popup-overlay ${animationClassName}`}>
      <div className="add-personel-popup-container">
        <div className="add-personel-popup-header">
          <h2>Personal hinzufügen</h2>
          <button onClick={onClose} className="add-personel-close-button" aria-label="Schließen">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="add-personel-popup-form">
          <div className="form-group">
            <label htmlFor="vorname">Vorname</label>
            <input type="text" id="vorname" name="vorname" value={formData.vorname} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="nachname">Nachname</label>
            <input type="text" id="nachname" name="nachname" value={formData.nachname} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="kapazitaet">Kapazität</label>
            <input 
              type="text" // Keep as text to allow '%' and intermediate states
              id="kapazitaet" 
              name="kapazitaet" 
              value={formData.kapazitaet} 
              onChange={handleChange} 
              placeholder="z.B. 80%"
              // Consider adding onBlur to format with '%' if not present
            />
          </div>
          <div className="form-group">
            <label htmlFor="abteilung">Abteilung</label>
            <select id="abteilung" name="abteilung" value={formData.abteilung} onChange={handleChange}>
              {departmentOptions.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="rolle">Rolle</label>
            <select id="rolle" name="rolle" value={formData.rolle} onChange={handleChange}>
              {roleOptions.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          <div className="add-personel-popup-buttons">
            <button type="submit" className="popup-button save">Speichern</button>
            <button type="button" className="popup-button cancel" onClick={onClose}>Abbrechen</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPersonelPopup;
