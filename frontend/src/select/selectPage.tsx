import Select, {type StylesConfig, type MultiValue} from 'react-select';
import { useState } from 'react';
import "./selectPage.css";
import SelectDriver from './driver/selectDriver';
import SelectVehicle from './vehicle/selectVehicle';
import SelectRegistration from './registration/selectRegistration';
import SelectViolation from './violation/selectViolation';


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

//dropdown button styling from react-select package
//WAG KAU MAOVERWHELM PANG STYLING LANG TOH
const customStyles: StylesConfig<OptionType, true> = {
    //outer box border and bg
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

    //selected tags
    multiValue: (provided) => ({
        ...provided,
        backgroundColor: '#0e1e42',
        borderRadius: '20px',
        padding: '2px 6px',
        fontFamily: "Garet"
    }),

    //text in the selected tag
    multiValueLabel: (provided) => ({
        ...provided,
        color: '#ffffff',
        // fontWeight: 'bold',
    }),

    //x button in selected tag
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

    const renderAttri = (value: string) => {
        switch (value){
            case "driver":
                return <SelectDriver key="driver"/>;
            case "vehicle":
                return <SelectVehicle key="vehicle"/>;
            case "registration":
                return <SelectRegistration key="registration"/>;
            case "violation":
                return <SelectViolation key="violation"/>;
            default:
                return null;
        }
    }

function SelectPage() {
    const [selectedOptions, setSelectedOptions] = useState<MultiValue<OptionType>>([]);

    return (
        <div className='header-container'>
            <h1>SELECT QUERY</h1>
            <div className='header-row'>
                {/* dropdown menu */}
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
                <button>▶ RUN</button>
                <button>↻ RESTART</button>
            </div>
            
            {selectedOptions.map((option) => renderAttri(option.value))}
        </div>
    );
}

export default SelectPage;