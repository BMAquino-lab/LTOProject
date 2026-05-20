import Select, { type MultiValue } from 'react-select';
import { useEffect, useState } from 'react';
import { customSelectStyles } from '../../style/dropdownStyle';
import { registrationApi, type RegistrationFilters, type VehicleRegistration } from '../../api/ltoApi';
import FormField from '../../formField';
import "./selectRegistration.css";

interface OptionType { value: string; label: string; }

interface SelectRegistrationProps {
    runKey?: number;
}

const registrationOptions: OptionType[] = [
    { value: 'registration_number', label: 'Registration Number' },
    { value: 'registration_date', label: 'Registration Date' },
    { value: 'expiration_date', label: 'Expiration Date' },
    { value: 'registration_status', label: 'Registration Status' },
    { value: 'history', label: 'History' },
    { value: 'plate_number', label: 'Plate Number' },
    { value: 'license_number', label: 'License Number' },
];

const defaultHeaders = registrationOptions.map(({ value, label }) => ({ key: value, label }));

function SelectRegistration({ runKey = 0 }: SelectRegistrationProps) {
    const [selectedSelect, setSelectedSelect] = useState<MultiValue<OptionType>>([]);
    const [selectedWhere, setSelectedWhere] = useState<MultiValue<OptionType>>([]);
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [results, setResults] = useState<VehicleRegistration[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasQueried, setHasQueried] = useState(false);

    const setFilter = (field: string, value: string) => {
        setFilters((current) => ({ ...current, [field]: value }));
    };

    const handleRun = async () => {
        setLoading(true);
        setError(null);
        setHasQueried(true);

        const selected_columns = selectedSelect.map((opt) => opt.value);
        const activeFilters = selectedWhere.reduce<RegistrationFilters>((acc, opt) => {
            const value = filters[opt.value];
            if (!value) return acc;
            if (opt.value === 'registration_number') {
                acc.registration_number = Number(value);
            } else {
                acc[opt.value as keyof Omit<RegistrationFilters, 'registration_number'>] = value;
            }
            return acc;
        }, {});

        try {
            const result = await registrationApi.find(selected_columns, activeFilters);
            setResults(result.data ?? []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration query failed');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (runKey > 0) {
            queueMicrotask(() => {
                void handleRun();
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [runKey]);

    const tableHeaders = selectedSelect.length > 0
        ? selectedSelect.map((opt) => ({ key: opt.value, label: opt.label }))
        : defaultHeaders;

    return (
        <>
            <div className='registration'>
                <div>
                    <div className='select-registration'>
                        <h2>Select Vehicle Registration</h2>
                        <div className='select-registration-dropdown'>
                            <Select
                                isMulti
                                options={registrationOptions}
                                value={selectedSelect}
                                onChange={(newValue) => setSelectedSelect(newValue)}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                styles={customSelectStyles<OptionType>()}
                                placeholder="All columns"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <div className='where-registration'>
                        <h2>Where</h2>
                        <div className='where-registration-dropdown'>
                            <Select
                                isMulti
                                options={registrationOptions}
                                value={selectedWhere}
                                onChange={(newValue) => setSelectedWhere(newValue)}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                styles={customSelectStyles<OptionType>()}
                                placeholder="Add filters..."
                            />
                        </div>
                    </div>
                    {selectedWhere.map((option) => (
                        <FormField
                            key={option.value}
                            label={option.label}
                            type={option.value.includes('date') ? 'date' : 'text'}
                            value={filters[option.value] ?? ''}
                            onChange={(event) => setFilter(option.value, event.target.value)}
                        />
                    ))}
                </div>
            </div>
            <hr style={{ marginTop: "20px" }} />

            {loading && <p style={{ padding: '1rem' }}>Loading...</p>}
            {error && <p style={{ padding: '1rem', color: 'red' }}>Error: {error}</p>}
            {!loading && hasQueried && !error && (
                results.length === 0
                    ? <p style={{ padding: '1rem' }}>No results found.</p>
                    : (
                        <div style={{ overflowX: 'auto', padding: '1rem' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        {tableHeaders.map((header) => (
                                            <th key={header.key} style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left', background: '#f5f5f5' }}>
                                                {header.label}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.map((row, index) => (
                                        <tr key={index}>
                                            {tableHeaders.map((header) => (
                                                <td key={header.key} style={{ border: '1px solid #ccc', padding: '8px' }}>
                                                    {String(row[header.key as keyof VehicleRegistration] ?? '')}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
            )}
        </>
    );
}

export default SelectRegistration;
