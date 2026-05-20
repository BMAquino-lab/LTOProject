import Select, { type MultiValue, type SingleValue } from 'react-select';
import { useEffect, useState } from 'react';
import { customSelectStyles } from '../../style/dropdownStyle';
import "./selectDriver.css";
import {
    DriverAddress,
    DriverBirthday,
    DriverLicenseNum,
    DriverLicenseStatus,
    DriverLicenseType,
    DriverName
} from '../../attributes/driverAttributes';
import { driverApi, type Driver } from '../../api/ltoApi';

interface OptionType { value: string; label: string; }

const driverOptions: OptionType[] = [
    { value: 'licenseNumber', label: 'License Number' },
    { value: 'licenseType', label: 'License Type' },
    { value: 'licenseStatus', label: 'License Status' },
    { value: 'name', label: 'Name' },
    { value: 'address', label: 'Address' },
    { value: 'bday', label: 'Birthday' },
];

// Maps our dropdown option values to the actual DB column names
const fieldToColumn: Record<string, string> = {
    licenseNumber: 'license_number',
    licenseType: 'license_type',
    licenseStatus: 'license_status',
    name: 'full_name',
    address: 'address',
    bday: 'date_of_birth',
};

interface SelectDriverProps {
    runKey?: number;
}

function SelectDriver({ runKey = 0 }: SelectDriverProps) {
    // Which columns to SELECT
    const [selectedSelect, setSelectedSelect] = useState<MultiValue<OptionType>>([]);
    // Which fields to filter by (WHERE)
    const [selectedWhere, setSelectedWhere] = useState<MultiValue<OptionType>>([]);

    // State for each possible WHERE field value
    const [licenseNumber, setLicenseNumber] = useState('');
    const [licenseType, setLicenseType] = useState<SingleValue<OptionType>>(null);
    const [licenseStatus, setLicenseStatus] = useState<SingleValue<OptionType>>(null);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [bday, setBday] = useState('');

    // Query results and status
    const [results, setResults] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasQueried, setHasQueried] = useState(false);

    const handleRun = async () => {
        setLoading(true);
        setError(null);
        setHasQueried(true);

        // Build selected_columns from the SELECT dropdown
        const selected_columns = selectedSelect.map(opt => fieldToColumn[opt.value]);

        // Build filters from the WHERE dropdown + filled-in values
        const filters: Record<string, string> = {};
        selectedWhere.forEach(opt => {
            switch (opt.value) {
                case 'licenseNumber':
                    if (licenseNumber) filters['license_number'] = licenseNumber;
                    break;
                case 'licenseType':
                    if (licenseType) filters['license_type'] = licenseType.value;
                    break;
                case 'licenseStatus':
                    if (licenseStatus) filters['license_status'] = licenseStatus.value;
                    break;
                case 'name':
                    if (name) filters['full_name'] = name;
                    break;
                case 'address':
                    if (address) filters['address'] = address;
                    break;
                case 'bday':
                    if (bday) filters['date_of_birth'] = bday;
                    break;
            }
        });

        try {
            const result = await driverApi.find(selected_columns, filters);
            setResults(result.data ?? []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
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

    const renderWhereField = (value: string) => {
        switch (value) {
            case 'licenseNumber':
                return <DriverLicenseNum key="licenseNum" value={licenseNumber} onChange={setLicenseNumber} />;
            case 'licenseType':
                return <DriverLicenseType key="licenseType" value={licenseType} onChange={setLicenseType} />;
            case 'licenseStatus':
                return <DriverLicenseStatus key="licenseStatus" value={licenseStatus} onChange={setLicenseStatus} />;
            case 'name':
                return <DriverName key="name" value={name} onChange={setName} />;
            case 'address':
                return <DriverAddress key="address" value={address} onChange={setAddress} />;
            case 'bday':
                return <DriverBirthday key="bday" value={bday} onChange={setBday} />;
            default:
                return null;
        }
    };

    // Build table headers from selected columns (or all columns if none selected)
    const tableHeaders = selectedSelect.length > 0
        ? selectedSelect.map(opt => ({ key: fieldToColumn[opt.value], label: opt.label }))
        : [
            { key: 'license_number', label: 'License Number' },
            { key: 'full_name', label: 'Name' },
            { key: 'license_type', label: 'License Type' },
            { key: 'license_status', label: 'License Status' },
            { key: 'sex', label: 'Sex' },
            { key: 'date_of_birth', label: 'Birthday' },
            { key: 'address', label: 'Address' },
          ];

    return (
        <>
            <div className='driver'>
                <div>
                    <div className='select-driver'>
                        <h2>Select Driver</h2>
                        <div className='select-driver-dropdown'>
                            <Select
                                isMulti={true}
                                options={driverOptions}
                                value={selectedSelect}
                                onChange={(newValue) => setSelectedSelect(newValue)}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                styles={customSelectStyles<OptionType>()}
                                placeholder="All columns (or choose specific ones)"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <div className='where-driver'>
                        <h2>Where</h2>
                        <div className='where-driver-dropdown'>
                            <Select
                                isMulti={true}
                                options={driverOptions}
                                value={selectedWhere}
                                onChange={(newValue) => setSelectedWhere(newValue)}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                styles={customSelectStyles<OptionType>()}
                                placeholder="Add filters..."
                            />
                        </div>
                    </div>
                    {selectedWhere.map((option) => renderWhereField(option.value))}
                </div>
            </div>

            <hr style={{ marginTop: "20px" }} />

            {/* Results Table */}
            {loading && <p style={{ padding: '1rem' }}>Loading...</p>}

            {error && (
                <p style={{ padding: '1rem', color: 'red' }}>Error: {error}</p>
            )}

            {!loading && hasQueried && !error && (
                results.length === 0
                    ? <p style={{ padding: '1rem' }}>No results found.</p>
                    : (
                        <div style={{ overflowX: 'auto', padding: '1rem' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        {tableHeaders.map(h => (
                                            <th key={h.key} style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left', background: '#f5f5f5' }}>
                                                {h.label}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.map((row, i) => (
                                        <tr key={i}>
                                            {tableHeaders.map(h => (
                                                <td key={h.key} style={{ border: '1px solid #ccc', padding: '8px' }}>
                                                    {String(row[h.key as keyof Driver] ?? '')}
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

export default SelectDriver;
