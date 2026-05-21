import Select, {type StylesConfig, type MultiValue} from 'react-select';
import { useState } from 'react';
import "./updatePage.css";
import UpdateDriver from './driver/updateDriver';
import UpdateVehicle from './vehicle/updateVehicle';
import UpdateRegistration from './registration/updateRegistration';
import UpdateViolation from './violation/updateViolation';

interface OptionType {
    value: string;
    label: string;
}

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

function UpdatePage() {
    const [selectedOptions, setSelectedOptions] = useState<MultiValue<OptionType>>([]);
    const [runKey, setRunKey] = useState(0);

    const handleRun = () => setRunKey((current) => current + 1);
    const handleRestart = () => {
        setSelectedOptions([]);
        setRunKey(0);
    };

    const renderAttri = (value: string) => {
        switch (value){
            case "driver":
                return <UpdateDriver key="driver" runKey={runKey}/>;
            case "vehicle":
                return <UpdateVehicle key="vehicle" runKey={runKey}/>;
            case "registration":
                return <UpdateRegistration key="registration" runKey={runKey}/>;
            case "violation":
                return <UpdateViolation key="violation" runKey={runKey}/>;
            default:
                return null;
        }
    };

    return (
        <div className='header-container'>
            <h1>UPDATE QUERY</h1>
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
                <button onClick={handleRun}>▶RUN</button>
                <button onClick={handleRestart}>↻RESTART</button>
            </div>

            {selectedOptions.map((option) => renderAttri(option.value))}
        </div>
    );
}

export default UpdatePage;
