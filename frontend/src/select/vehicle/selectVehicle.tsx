import Select, { type MultiValue } from 'react-select';
import { useEffect, useState } from 'react';
import { customSelectStyles } from '../../style/dropdownStyle';
import { vehicleApi, type Vehicle, type VehicleFilters } from '../../api/ltoApi';
import FormField from '../../formField';
import "./selectVehicle.css";

interface OptionType { value: string; label: string; }

interface SelectVehicleProps {
    runKey?: number;
}

const vehicleOptions: OptionType[] = [
    { value: 'plate_number', label: 'Plate Number' },
    { value: 'engine_number', label: 'Engine Number' },
    { value: 'chassis_number', label: 'Chassis Number' },
    { value: 'vehicle_type', label: 'Vehicle Type' },
    { value: 'make', label: 'Make' },
    { value: 'model', label: 'Model' },
    { value: 'color', label: 'Color' },
    { value: 'owner', label: 'Owner' },
    { value: 'year_manufactured', label: 'Year Manufactured' },
];

const defaultHeaders = vehicleOptions.map(({ value, label }) => ({ key: value, label }));

function SelectVehicle({ runKey = 0 }: SelectVehicleProps) {
    const [selectedSelect, setSelectedSelect] = useState<MultiValue<OptionType>>([]);
    const [selectedWhere, setSelectedWhere] = useState<MultiValue<OptionType>>([]);
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [results, setResults] = useState<Vehicle[]>([]);
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
        const activeFilters = selectedWhere.reduce<VehicleFilters>((acc, opt) => {
            const value = filters[opt.value];
            if (!value) return acc;
            if (opt.value === 'year_manufactured') {
                acc.year_manufactured = Number(value);
            } else {
                acc[opt.value as keyof Omit<VehicleFilters, 'year_manufactured'>] = value;
            }
            return acc;
        }, {});

        try {
            const result = await vehicleApi.find(selected_columns, activeFilters);
            setResults(result.data ?? []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Vehicle query failed');
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
            <div className='vehicle'>
                <div>
                    <div className='select-vehicle'>
                        <h2>Select Vehicle</h2>
                        <div className='select-vehicle-dropdown'>
                            <Select
                                isMulti
                                options={vehicleOptions}
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
                    <div className='where-vehicle'>
                        <h2>Where</h2>
                        <div className='where-vehicle-dropdown'>
                            <Select
                                isMulti
                                options={vehicleOptions}
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
                            type={option.value === 'year_manufactured' ? 'number' : 'text'}
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
                                                    {String(row[header.key as keyof Vehicle] ?? '')}
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

export default SelectVehicle;
