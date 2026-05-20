import Select, { type StylesConfig } from 'react-select';

interface OptionType {
    value: string;
    label: string;
}

const driverSexOptions: OptionType[] = [
    { value: "M", label: "Male" },
    { value: "F", label: "Female" },
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

const customStyles: StylesConfig<OptionType, false> = {
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

// All dropdowns now accept value + onChange as props

interface DropdownProps {
    value: OptionType | null;
    onChange: (val: OptionType | null) => void;
}

export function DriverSex({ value, onChange }: DropdownProps) {
    return (
        <div className="sex-dropdown-container">
            <Select
                options={driverSexOptions}
                value={value}
                onChange={onChange}
                styles={customStyles}
            />
        </div>
    );
}

export function LicenseType({ value, onChange }: DropdownProps) {
    return (
        <div className="license-dropdown-container">
            <Select
                options={licenseTypeOptions}
                value={value}
                onChange={onChange}
                styles={customStyles}
                placeholder="Select License Type..."
            />
        </div>
    );
}

export function LicenseStatus({ value, onChange }: DropdownProps) {
    return (
        <div className="license-dropdown-container">
            <Select
                options={licenseStatusOptions}
                value={value}
                onChange={onChange}
                styles={customStyles}
                placeholder="Select License Status..."
            />
        </div>
    );
}