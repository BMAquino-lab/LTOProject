import Select, { type MultiValue } from 'react-select';
import { useEffect, useState } from 'react';
import { customSelectStyles } from '../../style/dropdownStyle';
import { registrationApi, type VehicleRegistration } from '../../api/ltoApi';
import FormField from '../../formField';
import "./updateRegistration.css";

interface OptionType { value: string; label: string; }

interface UpdateRegistrationProps {
    runKey?: number;
}

const updateRegistrationOptions: OptionType[] = [
    { value: 'plate_number', label: 'Plate Number' },
    { value: 'license_number', label: 'License Number' },
    { value: 'registration_status', label: 'Registration Status' },
    { value: 'registration_date', label: 'Registration Date' },
    { value: 'expiration_date', label: 'Expiration Date' },
];

function UpdateRegistration({ runKey = 0 }: UpdateRegistrationProps) {
    const [selectedUpdate, setSelectedUpdate] = useState<MultiValue<OptionType>>([]);
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [values, setValues] = useState<Record<string, string>>({});
    const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
    const [loading, setLoading] = useState(false);

    const setValue = (field: string, value: string) => {
        setValues((current) => ({ ...current, [field]: value }));
    };

    const handleRun = async () => {
        setLoading(true);
        setMessage(null);

        const updates = selectedUpdate.reduce<Partial<VehicleRegistration>>((acc, option) => {
            const value = values[option.value];
            if (value) acc[option.value as keyof VehicleRegistration] = value as never;
            return acc;
        }, {});

        if (!registrationNumber || Object.keys(updates).length === 0) {
            setMessage({ text: 'Enter a registration number and at least one update field.', ok: false });
            setLoading(false);
            return;
        }

        try {
            await registrationApi.updateRegistration(Number(registrationNumber), updates);
            setMessage({ text: 'Registration updated successfully.', ok: true });
        } catch (err) {
            setMessage({ text: err instanceof Error ? err.message : 'Registration update failed', ok: false });
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

    return (
        <>
            <div className='registration'>
                <div>
                    <div className='update-registration'>
                        <h2>Update Vehicle Registration</h2>
                        <div className='update-registration-dropdown'>
                            <Select
                                isMulti
                                options={updateRegistrationOptions}
                                value={selectedUpdate}
                                onChange={(newValue) => setSelectedUpdate(newValue)}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                styles={customSelectStyles<OptionType>()}
                            />
                        </div>
                    </div>
                    {selectedUpdate.map((option) => (
                        <FormField
                            key={option.value}
                            label={option.label}
                            type={option.value.includes('date') ? 'date' : 'text'}
                            value={values[option.value] ?? ''}
                            onChange={(event) => setValue(option.value, event.target.value)}
                        />
                    ))}
                </div>

                <div>
                    <div className='where-registration'>
                        <h2>Where</h2>
                    </div>
                    <FormField
                        label="Registration Number"
                        type="number"
                        value={registrationNumber}
                        onChange={(event) => setRegistrationNumber(event.target.value)}
                    />
                </div>
            </div>
            {loading && <p style={{ padding: '1rem' }}>Updating registration...</p>}
            {message && <p style={{ padding: '1rem', color: message.ok ? 'green' : 'red' }}>{message.text}</p>}
            <hr style={{marginTop:"20px"}}/>
        </>
    );
}

export default UpdateRegistration;
