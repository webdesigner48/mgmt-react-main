import React, { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';

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

interface SortConfig {
    key: keyof PersonelRow | null;
    direction: 'ascending' | 'descending';
}

interface TableSectionProps {
    personelData: PersonelRow[];
    showConfirmationPopup: (message: string, onConfirm: () => void) => void;
    showAddPersonelPopup: () => void;
    onUpdatePersonelEntry: (rowIndex: number, columnKey: keyof PersonelRow, value: string) => void;
    onDeletePersonelEntry: (rowId: string) => void;
}

const columnsConfig: Array<{ key: keyof PersonelRow; header: string; editable: boolean }> = [
    { key: 'vorname', header: 'Vorname', editable: true },
    { key: 'nachname', header: 'Nachname', editable: true },
    { key: 'kapazitaet', header: 'Kapazität', editable: true },
    { key: 'abteilung', header: 'Abteilung', editable: true },
    { key: 'email', header: 'Email', editable: true },
    { key: 'rolle', header: 'Rolle', editable: true },
    { key: 'aktion', header: 'Aktion', editable: false },
];

const departmentOptions = ["Geschäftsführung", "IT", "HR", "Finanzen"];
const roleOptions = ["User", "Leader", "Management"];

const TableSection: React.FC<TableSectionProps> = ({
    personelData,
    showConfirmationPopup,
    showAddPersonelPopup,
    onUpdatePersonelEntry,
    onDeletePersonelEntry
}) => {
    const [editingCell, setEditingCell] = useState<{ rowIndex: number; columnKey: keyof PersonelRow } | null>(null);
    const [currentEditValue, setCurrentEditValue] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'ascending' });

    const selectRef = useRef<HTMLSelectElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const isProgrammaticFocusRef = useRef(false);

    useEffect(() => {
        if (editingCell) {
            isProgrammaticFocusRef.current = true;

            if ((editingCell.columnKey === 'abteilung' || editingCell.columnKey === 'rolle') && selectRef.current) {
                selectRef.current.focus();
                const mousedownEvent = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                });
                selectRef.current.dispatchEvent(mousedownEvent);
            } else if (inputRef.current) {
                inputRef.current.focus();
                inputRef.current.select();
            }

            queueMicrotask(() => {
                isProgrammaticFocusRef.current = false;
            });
        }
    }, [editingCell]);

    const handleCellClick = (rowIndex: number, columnKey: keyof PersonelRow, currentValue: string) => {
        if (columnsConfig.find(c => c.key === columnKey)?.editable) {
            setEditingCell({ rowIndex, columnKey });
            if (columnKey === 'kapazitaet' && currentValue.endsWith('%')) {
                setCurrentEditValue(currentValue.slice(0, -1));
            } else {
                setCurrentEditValue(currentValue);
            }
        }
    };

    const handleEditInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setCurrentEditValue(event.target.value);
    };

    const handleSaveEdit = () => {
        if (isProgrammaticFocusRef.current) {
            return;
        }
        if (!editingCell) return;
        const { rowIndex, columnKey } = editingCell;
        let valueToSave = currentEditValue;

        if (columnKey === 'kapazitaet') {
            if (valueToSave.trim() !== '' && !valueToSave.endsWith('%')) {
                valueToSave += '%';
            }
        }
        onUpdatePersonelEntry(rowIndex, columnKey, valueToSave);
        setEditingCell(null);
    };

    const handleEditKeyDown = (event: KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (event.key === 'Enter') {
            handleSaveEdit();
        } else if (event.key === 'Escape') {
            setEditingCell(null);
        }
    };

    const handleDeleteRow = (rowId: string) => {
        showConfirmationPopup('Möchten sie diese Person entfernen?', () => {
            onDeletePersonelEntry(rowId);
        });
    };

    const handleSort = (columnKey: keyof PersonelRow) => {
        if (columnKey === 'aktion') return;

        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === columnKey && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key: columnKey, direction });
    };

    // Filter data based on search term
    const filteredData = personelData.filter(person => {
        if (!searchTerm) return true;
        const lowerSearchTerm = searchTerm.toLowerCase();
        return (
            person.vorname.toLowerCase().includes(lowerSearchTerm) ||
            person.nachname.toLowerCase().includes(lowerSearchTerm) ||
            person.email.toLowerCase().includes(lowerSearchTerm) ||
            person.abteilung.toLowerCase().includes(lowerSearchTerm) ||
            person.rolle.toLowerCase().includes(lowerSearchTerm)
        );
    });

    return (
        <div className="popup-form-section">


            <div className="table-personel-header-controls">
                <h2>Personal</h2>
                <input
                    type="text"
                    placeholder="Suche"
                    className="table-personel-search-input user_side"
                    value={searchTerm}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                />
                <div className="table-personel-actions-container">
                    {/* Hinzufügen Icon */}
                    <div className="table-personel-action-item">
                        <button
                            className="table-personel-action-button"
                            onClick={showAddPersonelPopup}
                            aria-label="Hinzufügen"
                            style={{ marginRight: '10px' }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512" xmlSpace="preserve" width="18" height="18" fill="currentColor">
                                <g>
                                    <path d="M490.667,234.667H277.333V21.333C277.333,9.551,267.782,0,256,0c-11.782,0-21.333,9.551-21.333,21.333v213.333H21.333   C9.551,234.667,0,244.218,0,256c0,11.782,9.551,21.333,21.333,21.333h213.333v213.333c0,11.782,9.551,21.333,21.333,21.333   c11.782,0,21.333-9.551,21.333-21.333V277.333h213.333c11.782,0,21.333-9.551,21.333-21.333   C512,244.218,502.449,234.667,490.667,234.667z" />
                                </g>
                            </svg>
                        </button>
                        <div className="table-personel-action-tooltip">Hinzufügen</div>
                    </div>

                    {/* Excel-Vorlage Icon */}
                    <div className="table-personel-action-item">
                        <button
                            className="table-personel-action-button"
                            onClick={() => console.log("Excel-Vorlage clicked. Implement actual functionality.")}
                            aria-label="Excel-Vorlage"
                            style={{ marginRight: '10px' }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                <path d="M19.95,5.54l-3.48-3.48c-1.32-1.32-3.08-2.05-4.95-2.05H7C4.24,0,2,2.24,2,5v14c0,2.76,2.24,5,5,5h10c2.76,0,5-2.24,5-5V10.49c0-1.87-.73-3.63-2.05-4.95Zm-1.41,1.41c.32,.32,.59,.67,.81,1.05h-4.34c-.55,0-1-.45-1-1V2.66c.38,.22,.73,.49,1.05,.81l3.48,3.48Zm1.46,12.05c0,1.65-1.35,3-3,3H7c-1.65,0-3-1.35-3-3V5c0-1.65,1.35-3,3-3h4.51c.16,0,.33,0,.49,.02V7c0,1.65,1.35,3,3,3h4.98c.02,.16,.02,.32,.02,.49v8.51Zm-4.5-7h-7c-1.38,0-2.5,1.12-2.5,2.5v3c0,1.38,1.12,2.5,2.5,2.5h7c1.38,0,2.5-1.12,2.5-2.5v-3c0-1.38-1.12-2.5-2.5-2.5Zm.5,5.5c0,.28-.22,.5-.5,.5h-7c-.28,0-.5-.22-.5-.5v-3c0-.28,.22-.5,.5-.5h7c.28,0,.5,.22,.5,.5v3ZM6,9c0-.55,.45-1,1-1h2c.55,0,1,.45,1,1s-.45,1-1,1h-2c-.55,0-1-.45-1-1Z" />
                            </svg>
                        </button>
                        <div className="table-personel-action-tooltip">Excel-Vorlage</div>
                    </div>

                    {/* Import von Excel Icon */}
                    <div className="table-personel-action-item">
                        <button
                            className="table-personel-action-button"
                            onClick={() => console.log("Import von Excel clicked. Implement actual functionality.")}
                            aria-label="Import von Excel"
                            style={{ marginRight: '10px' }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                <path d="M11.007,2.578,11,18.016a1,1,0,0,0,1,1h0a1,1,0,0,0,1-1l.007-15.421,2.912,2.913a1,1,0,0,0,1.414,0h0a1,1,0,0,0,0-1.414L14.122.879a3,3,0,0,0-4.244,0L6.667,4.091a1,1,0,0,0,0,1.414h0a1,1,0,0,0,1.414,0Z" />
                                <path d="M22,17v4a1,1,0,0,1-1,1H3a1,1,0,0,1-1-1V17a1,1,0,0,0-1-1H1a1,1,0,0,0-1,1v4a3,3,0,0,0,3,3H21a3,3,0,0,0,3-3V17a1,1,0,0,0-1-1h0A1,1,0,0,0,22,17Z" />
                            </svg>
                        </button>
                        <div className="table-personel-action-tooltip">Import von Excel</div>
                    </div>

                    {/* Export nach Excel Icon */}
                    <div className="table-personel-action-item">
                        <button
                            className="table-personel-action-button"
                            onClick={() => console.log("Export nach Excel clicked. Implement actual functionality.")}
                            aria-label="Export nach Excel"
                            style={{ marginRight: '10px' }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="18" height="18">
                                <path d="M9.878,18.122a3,3,0,0,0,4.244,0l3.211-3.211A1,1,0,0,0,15.919,13.5l-2.926,2.927L13,1a1,1,0,0,0-1-1h0a1,1,0,0,0-1,1l-.009,15.408L8.081,13.5a1,1,0,0,0-1.414,1.415Z" />
                                <path d="M23,16h0a1,1,0,0,0-1,1v4a1,1,0,0,1-1,1H3a1,1,0,0,1-1-1V17a1,1,0,0,0-1-1H1a1,1,0,0,0-1,1v4a3,3,0,0,0,3,3H21a3,3,0,0,0,3-3V17A1,1,0,0,0,23,16Z" />
                            </svg>
                        </button>
                        <div className="table-personel-action-tooltip">Export nach Excel</div>
                    </div>
                </div>
            </div>

            <div className="table-personel-table-wrapper">
                <table>
                    <thead>
                        <tr>
                            {columnsConfig.map(col => (
                                <th
                                    key={col.key}
                                    onClick={() => handleSort(col.key)}
                                    className={col.key !== 'aktion' ? 'sortable-header' : ''}
                                >
                                    {col.header}
                                    {col.key !== 'aktion' && (
                                        <span
                                            className={`sort-arrow ${(sortConfig.key === col.key && sortConfig.direction === 'ascending') ? 'ascending' : 'descending'}`}
                                        ></span>
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((row, rowIndex) => (
                            <tr key={row.id}>
                                {columnsConfig.map(col => {
                                    const originalRowIndex = personelData.findIndex(p => p.id === row.id);
                                    const isEditing = editingCell?.rowIndex === originalRowIndex && editingCell?.columnKey === col.key;
                                    return (
                                        <td
                                            key={col.key}
                                            onClick={() => !isEditing && col.key !== 'aktion' && handleCellClick(originalRowIndex, col.key, String(row[col.key]))}
                                            className={`${isEditing ? 'editing' : ''}${col.key === 'aktion' ? ' table-personel-aktion-cell' : ''}`}
                                        >
                                            {col.key === 'aktion' ? (
                                                <div className="table-personel-action-item" style={{ display: 'inline-flex', verticalAlign: 'middle' }}>
                                                    <button
                                                        className="table-personel-action-button"
                                                        onClick={() => handleDeleteRow(row.id)}
                                                        aria-label="Löschen"
                                                        style={{ padding: '5px', borderRadius: '5px' }}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                                            <path d="M21,4H17.9A5.009,5.009,0,0,0,13,0H11A5.009,5.009,0,0,0,6.1,4H3A1,1,0,0,0,3,6H4V19a5.006,5.006,0,0,0,5,5h6a5.006,5.006,0,0,0,5-5V6h1a1,1,0,0,0,0-2ZM11,2h2a3.006,3.006,0,0,1,2.829,2H8.171A3.006,3.006,0,0,1,11,2Zm7,17a3,3,0,0,1-3,3H9a3,3,0,0,1-3-3V6H18Z" />
                                                            <path d="M10,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,10,18Z" />
                                                            <path d="M14,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,14,18Z" />
                                                        </svg>
                                                    </button>
                                                    <div className="table-personel-action-tooltip">Löschen</div>
                                                </div>
                                            ) : isEditing ? (
                                                (col.key === 'abteilung' || col.key === 'rolle') ? (
                                                    <select
                                                        ref={selectRef}
                                                        className="editable-input"
                                                        value={currentEditValue}
                                                        onChange={handleEditInputChange}
                                                        onBlur={handleSaveEdit}
                                                        onKeyDown={handleEditKeyDown}
                                                    >
                                                        {(col.key === 'abteilung' ? departmentOptions : roleOptions).map(option => (
                                                            <option key={option} value={option}>
                                                                {option}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <input
                                                        ref={inputRef}
                                                        type="text"
                                                        className="editable-input"
                                                        value={currentEditValue}
                                                        onChange={handleEditInputChange}
                                                        onBlur={handleSaveEdit}
                                                        onKeyDown={handleEditKeyDown}
                                                    />
                                                )
                                            ) : (
                                                String(row[col.key])
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TableSection;