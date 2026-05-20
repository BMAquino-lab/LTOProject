import Select, { type MultiValue } from 'react-select';
import { useEffect, useState } from 'react';
import { customSelectStyles } from '../../style/dropdownStyle';
import { violationApi, type TrafficViolation, type ViolationFilters } from '../../api/ltoApi';
import FormField from '../../formField';
import "./selectViolation.css";

interface OptionType { value: string; label: string; }

interface SelectViolationProps {
    runKey?: number;
}

const violationOptions: OptionType[] = [
    { value: 'violation_ticket_num', label: 'Violation Ticket Number' },
    { value: 'violation_date', label: 'Violation Date' },
    { value: 'violation_type', label: 'Violation Type' },
    { value: 'location', label: 'Location' },
    { value: 'violation_status', label: 'Violation Status' },
    { value: 'apprehending_officer', label: 'Apprehending Officer' },
    { value: 'fine_amount', label: 'Fine Amount' },
    { value: 'license_number', label: 'License Number' },
    { value: 'plate_number', label: 'Plate Number' },
];

const defaultHeaders = violationOptions.map(({ value, label }) => ({ key: value, label }));

function SelectViolation({ runKey = 0 }: SelectViolationProps) {
    const [selectedSelect, setSelectedSelect] = useState<MultiValue<OptionType>>([]);
    const [selectedWhere, setSelectedWhere] = useState<MultiValue<OptionType>>([]);
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [results, setResults] = useState<TrafficViolation[]>([]);
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
        const activeFilters = selectedWhere.reduce<ViolationFilters>((acc, opt) => {
            const value = filters[opt.value];
            if (!value) return acc;
            if (opt.value === 'violation_ticket_num') acc.violation_ticket_num = Number(value);
            else if (opt.value === 'fine_amount') acc.fine_amount = Number(value);
            else acc[opt.value as keyof Omit<ViolationFilters, 'violation_ticket_num' | 'fine_amount'>] = value;
            return acc;
        }, {});

        try {
            const result = await violationApi.find(selected_columns, activeFilters);
            setResults(result.data ?? []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Violation query failed');
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
            <div className='violation'>
                <div>
                    <div className='select-violation'>
                        <h2>Select Traffic Violation</h2>
                        <div className='select-violation-dropdown'>
                            <Select
                                isMulti
                                options={violationOptions}
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
                    <div className='where-violation'>
                        <h2>Where</h2>
                        <div className='where-violation-dropdown'>
                            <Select
                                isMulti
                                options={violationOptions}
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
                            type={option.value.includes('date') ? 'date' : option.value === 'fine_amount' ? 'number' : 'text'}
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
                                                    {String(row[header.key as keyof TrafficViolation] ?? '')}
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

export default SelectViolation;
