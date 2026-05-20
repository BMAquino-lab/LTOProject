import Select, { type MultiValue } from 'react-select';
import { useEffect, useState } from 'react';
import { customSelectStyles } from '../../style/dropdownStyle';
import { vehicleApi, type Vehicle, type VehicleFilters } from '../../api/ltoApi';
import FormField from '../../formField';
import "./updateVehicle.css";

interface OptionType { value: string; label: string; }

interface UpdateVehicleProps {
    runKey?: number;
}

const updateVehicleOptions: OptionType[] = [
    { value: 'owner', label: 'Owner License Number' },
    { value: 'color', label: 'Color' },
    { value: 'vehicle_type', label: 'Vehicle Type' },
    { value: 'make', label: 'Make' },
    { value: 'model', label: 'Model' },
];

const whereVehicleOptions: OptionType[] = [
    { value: 'plate_number', label: 'Plate Number' },
    { value: 'engine_number', label: 'Engine Number' },
    { value: 'chassis_number', label: 'Chassis Number' },
    { value: 'vehicle_type', label: 'Vehicle Type' },
    { value: 'make', label: 'Make' },
    { value: 'color', label: 'Color' },
    { value: 'owner', label: 'Owner' },
    { value: 'year_manufactured', label: 'Year Manufactured' },
];

function UpdateVehicle({ runKey = 0 }: UpdateVehicleProps) {
    const [selectedUpdate, setSelectedUpdate] = useState<MultiValue<OptionType>>([]);
    const [selectedWhere, setSelectedWhere] = useState<MultiValue<OptionType>>([]);
    const [values, setValues] = useState<Record<string, string>>({});
    const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
    const [loading, setLoading] = useState(false);

    const setValue = (field: string, value: string) => {
        setValues((current) => ({ ...current, [field]: value }));
    };

    const handleRun = async () => {
        setLoading(true);
        setMessage(null);

        const updates = selectedUpdate.reduce<Partial<Vehicle>>((acc, option) => {
            const value = values[`update_${option.value}`];
            if (value) acc[option.value as keyof Vehicle] = value as never;
            return acc;
        }, {});

        const filters = selectedWhere.reduce<VehicleFilters>((acc, option) => {
            const value = values[`where_${option.value}`];
            if (!value) return acc;
            if (option.value === 'year_manufactured') {
                acc.year_manufactured = Number(value);
            } else {
                acc[option.value as keyof Omit<VehicleFilters, 'year_manufactured'>] = value;
            }
            return acc;
        }, {});

        if (Object.keys(updates).length === 0 || Object.keys(filters).length === 0) {
            setMessage({ text: 'Choose at least one update field and one where filter.', ok: false });
            setLoading(false);
            return;
        }

        try {
            await vehicleApi.update(updates, filters);
            setMessage({ text: 'Vehicle updated successfully.', ok: true });
        } catch (err) {
            setMessage({ text: err instanceof Error ? err.message : 'Vehicle update failed', ok: false });
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

    const renderField = (prefix: 'update' | 'where') => (option: OptionType) => (
        <FormField
            key={`${prefix}_${option.value}`}
            label={option.label}
            type={option.value === 'year_manufactured' ? 'number' : 'text'}
            value={values[`${prefix}_${option.value}`] ?? ''}
            onChange={(event) => setValue(`${prefix}_${option.value}`, event.target.value)}
        />
    );

    return (
        <>
            <div className='vehicle'>
                <div>
                    <div className='update-vehicle'>
                        <h2>Update Vehicle</h2>
                        <div className='update-vehicle-dropdown'>
                            <Select
                                isMulti
                                options={updateVehicleOptions}
                                value={selectedUpdate}
                                onChange={(newValue) => setSelectedUpdate(newValue)}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                styles={customSelectStyles<OptionType>()}
                            />
                        </div>
                    </div>
                    {selectedUpdate.map(renderField('update'))}
                </div>

                <div>
                    <div className='where-vehicle'>
                        <h2>Where</h2>
                        <div className='where-vehicle-dropdown'>
                            <Select
                                isMulti
                                options={whereVehicleOptions}
                                value={selectedWhere}
                                onChange={(newValue) => setSelectedWhere(newValue)}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                styles={customSelectStyles<OptionType>()}
                            />
                        </div>
                    </div>
                    {selectedWhere.map(renderField('where'))}
                </div>
            </div>
            {loading && <p style={{ padding: '1rem' }}>Updating vehicle...</p>}
            {message && <p style={{ padding: '1rem', color: message.ok ? 'green' : 'red' }}>{message.text}</p>}
            <hr style={{marginTop:"20px"}}/>
        </>
    );
}

export default UpdateVehicle;
