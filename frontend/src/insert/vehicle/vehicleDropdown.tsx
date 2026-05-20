import Select, {type StylesConfig} from 'react-select';

interface OptionType {
    value: string;
    label: string;
}

const vehicleTypeOptions: OptionType[] = [
    { value: "Motorcycle", label: "Motorcycle" },
    { value: "Private Car", label: "Private Car" },
    { value: "Public Utility Vehicle", label: "Public Utility Vehicle" },
];

const customStyles: StylesConfig<OptionType, false> = {
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
};

interface VehicleTypeProps {
    value: OptionType | null;
    onChange: (val: OptionType | null) => void;
}

export function VehicleType({ value, onChange }: VehicleTypeProps){
    return (
    <div className="vehicle-dropdown-container">
        <Select
            options={vehicleTypeOptions}
            value={value}
            onChange={onChange}
            styles={customStyles} 
            placeholder="Select Vehicle Type..."
        />
    </div>
    );
}


