import Select, { type MultiValue, type SingleValue } from 'react-select';
import { useEffect, useState } from 'react';
import { customSelectStyles } from '../../style/dropdownStyle';
import { driverApi, type Driver } from '../../api/ltoApi';
import FormField from '../../formField';
import "./updateDriver.css";

interface OptionType { value: string; label: string; }

interface UpdateDriverProps {
    runKey?: number;
}

const updateDriverOptions: OptionType[] = [
    { value: 'license_type', label: 'License Type' },
    { value: 'license_status', label: 'License Status' },
    { value: 'full_name', label: 'Name' },
    { value: 'address', label: 'Address' },
];

const whereDriverOptions: OptionType[] = [
    { value: 'license_number', label: 'License Number' },
    { value: 'full_name', label: 'Name' },
    { value: 'date_expired', label: 'Expiration Date' },
];

const licenseTypeOptions: OptionType[] = [
    { value: "Student Permit", label: "Student Permit" },
    { value: "Non-Professional", label: "Non-Professional" },
    { value: "Professional", label: "Professional" }
];

const licenseStatusOptions: OptionType[] = [
    { value: "Valid", label: "Valid" },
    { value: "Expired", label: "Expired" },
    { value: "Suspended", label: "Suspended" }
];

function UpdateDriver({ runKey = 0 }: UpdateDriverProps) {
    const [selectedUpdate, setSelectedUpdate] = useState<MultiValue<OptionType>>([]);
    const [selectedWhere, setSelectedWhere] = useState<MultiValue<OptionType>>([]);
    const [textValues, setTextValues] = useState<Record<string, string>>({});
    const [licenseType, setLicenseType] = useState<SingleValue<OptionType>>(null);
    const [licenseStatus, setLicenseStatus] = useState<SingleValue<OptionType>>(null);
    const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
    const [loading, setLoading] = useState(false);

    const setText = (field: string, value: string) => {
        setTextValues((current) => ({ ...current, [field]: value }));
    };

    const handleRun = async () => {
        setLoading(true);
        setMessage(null);

        const updates: Partial<Driver> = {};
        const filters: { license_number?: string; full_name?: string; date_expired?: string } = {};

        selectedUpdate.forEach((option) => {
            if (option.value === 'license_type' && licenseType) updates.license_type = licenseType.value;
            if (option.value === 'license_status' && licenseStatus) updates.license_status = licenseStatus.value;
            if (option.value === 'full_name' && textValues.full_name) updates.full_name = textValues.full_name;
            if (option.value === 'address' && textValues.address) updates.address = textValues.address;
        });

        selectedWhere.forEach((option) => {
            const value = textValues[`where_${option.value}`];
            if (!value) return;
            if (option.value === 'license_number') filters.license_number = value;
            if (option.value === 'full_name') filters.full_name = value;
            if (option.value === 'date_expired') filters.date_expired = value;
        });

        if (Object.keys(updates).length === 0 || Object.keys(filters).length === 0) {
            setMessage({ text: 'Choose at least one update field and one where filter.', ok: false });
            setLoading(false);
            return;
        }

        try {
            await driverApi.update(updates, filters);
            setMessage({ text: 'Driver updated successfully.', ok: true });
        } catch (err) {
            setMessage({ text: err instanceof Error ? err.message : 'Driver update failed', ok: false });
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

    const renderUpdateField = (option: OptionType) => {
        if (option.value === 'license_type') {
            return (
                <div key={option.value}>
                    <h4>License Type</h4>
                    <Select
                        options={licenseTypeOptions}
                        value={licenseType}
                        onChange={(newValue) => setLicenseType(newValue as SingleValue<OptionType>)}
                        styles={customSelectStyles<OptionType>()}
                    />
                </div>
            );
        }
        if (option.value === 'license_status') {
            return (
                <div key={option.value}>
                    <h4>License Status</h4>
                    <Select
                        options={licenseStatusOptions}
                        value={licenseStatus}
                        onChange={(newValue) => setLicenseStatus(newValue as SingleValue<OptionType>)}
                        styles={customSelectStyles<OptionType>()}
                    />
                </div>
            );
        }
        return (
            <FormField
                key={option.value}
                label={option.label}
                type="text"
                value={textValues[option.value] ?? ''}
                onChange={(event) => setText(option.value, event.target.value)}
            />
        );
    };

    const renderWhereField = (option: OptionType) => (
        <FormField
            key={option.value}
            label={option.label}
            type={option.value === 'date_expired' ? 'date' : 'text'}
            value={textValues[`where_${option.value}`] ?? ''}
            onChange={(event) => setText(`where_${option.value}`, event.target.value)}
        />
    );

    return (
        <>
            <div className='driver'>
                <div>
                    <div className='update-driver'>
                        <h2>Update Driver</h2>
                        <div className='update-driver-dropdown'>
                            <Select
                                isMulti
                                options={updateDriverOptions}
                                value={selectedUpdate}
                                onChange={(newValue) => setSelectedUpdate(newValue)}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                styles={customSelectStyles<OptionType>()}
                            />
                        </div>
                    </div>
                    {selectedUpdate.map(renderUpdateField)}
                </div>

                <div>
                    <div className='where-driver'>
                        <h2>Where</h2>
                        <div className='where-driver-dropdown'>
                            <Select
                                isMulti
                                options={whereDriverOptions}
                                value={selectedWhere}
                                onChange={(newValue) => setSelectedWhere(newValue)}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                styles={customSelectStyles<OptionType>()}
                            />
                        </div>
                    </div>
                    {selectedWhere.map(renderWhereField)}
                </div>
            </div>
            {loading && <p style={{ padding: '1rem' }}>Updating driver...</p>}
            {message && <p style={{ padding: '1rem', color: message.ok ? 'green' : 'red' }}>{message.text}</p>}
            <hr style={{marginTop:"20px"}}/>
        </>
    );
}

export default UpdateDriver;
