import Select, { type StylesConfig, type MultiValue } from 'react-select';
import { useState } from 'react';
import "./insertPage.css";
import InsertDriver, { type DriverFormData } from './driver/insertDriver';
import InsertVehicle, { type VehicleFormData } from './vehicle/insertVehicle';
import InsertViolation, { type ViolationFormData } from './violations/insertViolation';
import InsertRegistration, { type RegistrationFormData } from './registration/insertRegistration';
import { driverApi, registrationApi, vehicleApi, violationApi } from '../api/ltoApi';

interface OptionType { value: string; label: string; }

const options: OptionType[] = [
    { value: 'driver', label: 'Driver' },
    { value: 'vehicle', label: 'Vehicle' },
    { value: 'registration', label: 'Vehicle Registration' },
    { value: 'violation', label: 'Traffic Violation' }
];

const customStyles: StylesConfig<OptionType, true> = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: '#d9dce7',
        borderColor: state.isFocused ? '#0e1e42' : '#cbd5e1',
        borderRadius: '8px',
        minHeight: "50px",
        fontFamily: "Garet"
    }),
    option: (provided) => ({
        ...provided,
        fontFamily: "Garet"
    }),
    multiValue: (provided) => ({
        ...provided,
        backgroundColor: '#0e1e42',
        borderRadius: '20px',
        padding: '2px 6px',
        fontFamily: "Garet"
    }),
    multiValueLabel: (provided) => ({
        ...provided,
        color: '#ffffff',
    }),
    multiValueRemove: (provided) => ({
        ...provided,
        color: '#ffffff',
        '&:hover': {
            backgroundColor: '#bd031a',
            color: '#ffffff',
            borderRadius: '50%',
        },
    }),
};

const emptyDriver: DriverFormData = {
    full_name: '',
    sex: null,
    date_of_birth: '',
    address: '',
    license_number: '',
    license_type: null,
};

const emptyVehicle: VehicleFormData = {
    plate_number: '',
    engine_number: '',
    chassis_number: '',
    vehicle_type: null,
    color: '',
    make: '',
    model: '',
    year_manufactured: '',
};

const emptyRegistration: RegistrationFormData = {
    plate_number: '',
    license_number: '',
};

const emptyViolation: ViolationFormData = {
    violation_type: '',
    location: '',
    apprehending_officer: '',
    fine_amount: '',
    plate_number: '',
    license_number: '',
};

function InsertPage() {
    const [selectedOptions, setSelectedOptions] = useState<MultiValue<OptionType>>([]);
    const [driverData, setDriverData] = useState<DriverFormData>(emptyDriver);
    const [vehicleData, setVehicleData] = useState<VehicleFormData>(emptyVehicle);
    const [registrationData, setRegistrationData] = useState<RegistrationFormData>(emptyRegistration);
    const [violationData, setViolationData] = useState<ViolationFormData>(emptyViolation);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

    const handleRun = async () => {
        setLoading(true);
        setMessage(null);
        const errors: string[] = [];
        const inserted: string[] = [];

        try {
            for (const option of selectedOptions) {
                if (option.value === 'driver') {
                    if (!driverData.full_name) errors.push('Driver: Full Name is required');
                    if (!driverData.sex) errors.push('Driver: Sex is required');
                    if (!driverData.date_of_birth) errors.push('Driver: Birthdate is required');
                    if (!driverData.address) errors.push('Driver: Address is required');
                    if (!driverData.license_number) errors.push('Driver: License Number is required');
                    if (!driverData.license_type) errors.push('Driver: License Type is required');
                    if (errors.length > 0) break;

                    await driverApi.insert({
                        full_name: driverData.full_name,
                        sex: driverData.sex!.value,
                        date_of_birth: driverData.date_of_birth,
                        address: driverData.address,
                        license_number: driverData.license_number,
                        license_type: driverData.license_type!.value,
                    });
                    inserted.push('driver');
                }

                if (option.value === 'vehicle') {
                    if (!vehicleData.plate_number) errors.push('Vehicle: Plate Number is required');
                    if (!vehicleData.engine_number) errors.push('Vehicle: Engine Number is required');
                    if (!vehicleData.chassis_number) errors.push('Vehicle: Chassis Number is required');
                    if (!vehicleData.vehicle_type) errors.push('Vehicle: Vehicle Type is required');
                    if (!vehicleData.color) errors.push('Vehicle: Color is required');
                    if (!vehicleData.make) errors.push('Vehicle: Make is required');
                    if (!vehicleData.model) errors.push('Vehicle: Model is required');
                    if (!vehicleData.year_manufactured) errors.push('Vehicle: Year Manufactured is required');
                    if (errors.length > 0) break;

                    await vehicleApi.insert({
                        plate_number: vehicleData.plate_number,
                        engine_number: vehicleData.engine_number,
                        chassis_number: vehicleData.chassis_number,
                        vehicle_type: vehicleData.vehicle_type!.value,
                        color: vehicleData.color,
                        make: vehicleData.make,
                        model: vehicleData.model,
                        year_manufactured: Number(vehicleData.year_manufactured),
                    });
                    inserted.push('vehicle');
                }

                if (option.value === 'registration') {
                    if (!registrationData.plate_number) errors.push('Registration: Plate Number is required');
                    if (!registrationData.license_number) errors.push('Registration: License Number is required');
                    if (errors.length > 0) break;

                    await registrationApi.insert(registrationData);
                    inserted.push('registration');
                }

                if (option.value === 'violation') {
                    if (!violationData.violation_type) errors.push('Violation: Violation Type is required');
                    if (!violationData.location) errors.push('Violation: Location is required');
                    if (!violationData.apprehending_officer) errors.push('Violation: Apprehending Officer is required');
                    if (!violationData.fine_amount) errors.push('Violation: Fine Amount is required');
                    if (!violationData.license_number) errors.push('Violation: License Number is required');
                    if (!violationData.plate_number) errors.push('Violation: Plate Number is required');
                    if (errors.length > 0) break;

                    await violationApi.insert({
                        violation_type: violationData.violation_type,
                        location: violationData.location,
                        apprehending_officer: violationData.apprehending_officer,
                        fine_amount: Number(violationData.fine_amount),
                        license_number: violationData.license_number,
                        plate_number: violationData.plate_number,
                    });
                    inserted.push('violation');
                }
            }

            if (errors.length > 0) {
                setMessage({ text: errors.join('\n'), ok: false });
            } else if (inserted.length === 0) {
                setMessage({ text: 'Select at least one record type to insert.', ok: false });
            } else {
                setMessage({ text: `Inserted ${inserted.join(', ')} successfully!`, ok: true });
            }
        } catch (err) {
            setMessage({ text: err instanceof Error ? err.message : 'Insert failed', ok: false });
        } finally {
            setLoading(false);
        }
    };

    const handleRestart = () => {
        setSelectedOptions([]);
        setDriverData(emptyDriver);
        setVehicleData(emptyVehicle);
        setRegistrationData(emptyRegistration);
        setViolationData(emptyViolation);
        setMessage(null);
    };

    const renderForm = (value: string) => {
        switch (value) {
            case "driver":
                return <InsertDriver key="driver" data={driverData} onChange={setDriverData} />;
            case "vehicle":
                return <InsertVehicle key="vehicle" data={vehicleData} onChange={setVehicleData} />;
            case "registration":
                return <InsertRegistration key="registration" data={registrationData} onChange={setRegistrationData} />;
            case "violation":
                return <InsertViolation key="violation" data={violationData} onChange={setViolationData} />;
            default:
                return null;
        }
    };

    return (
        <div className='header-container'>
            <h1>INSERTION QUERY</h1>
            <div className='header-row'>
                <div className='dropdown'>
                    <Select
                        isMulti
                        options={options}
                        value={selectedOptions}
                        onChange={(newValue) => setSelectedOptions(newValue)}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        styles={customStyles}
                    />
                </div>
                <button onClick={handleRun} disabled={loading}>
                    {loading ? 'Running...' : '▶RUN'}
                </button>
                <button onClick={handleRestart}>↻RESTART</button>
            </div>

            {message && (
                <p style={{
                    marginTop: '1rem',
                    color: message.ok ? 'green' : 'red',
                    whiteSpace: 'pre-line'
                }}>
                    {message.text}
                </p>
            )}

            {selectedOptions.map((option) => renderForm(option.value))}
        </div>
    );
}

export default InsertPage;
