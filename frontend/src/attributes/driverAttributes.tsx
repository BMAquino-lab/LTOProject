import Select, { type SingleValue } from 'react-select';
import { customSelectStyles } from '../style/dropdownStyle';
import "./driverAttributes.css"
import FormField from '../formField';

interface OptionType { value: string; label: string; }

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

// All components now accept value + onChange so SelectDriver can read them

interface SelectProps {
    value?: SingleValue<OptionType>;
    onChange?: (val: SingleValue<OptionType>) => void;
}

interface InputProps {
    value?: string;
    onChange?: (val: string) => void;
}

export function DriverLicenseType({ value, onChange }: SelectProps) {
    return (
        <div className='driver-license-type'>
            <h4>License Type</h4>
            <div className='driver-license-type-content'>
                <Select
                    isMulti={false}
                    options={licenseTypeOptions}
                    value={value}
                    onChange={(newValue) => onChange?.(newValue)}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    styles={customSelectStyles<OptionType>()}
                />
            </div>
        </div>
    );
}

export function DriverLicenseStatus({ value, onChange }: SelectProps) {
    return (
        <div className='driver-license-status'>
            <h4>License Status</h4>
            <div className='driver-license-status-content'>
                <Select
                    isMulti={false}
                    options={licenseStatusOptions}
                    value={value}
                    onChange={(newValue) => onChange?.(newValue)}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    styles={customSelectStyles<OptionType>()}
                />
            </div>
        </div>
    );
}

export function DriverLicenseNum({ value, onChange }: InputProps) {
    return (
        <div className='driver-license-num'>
            <FormField
                label="License Number"
                type="text"
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
            />
        </div>
    )
}

export function DriverName({ value, onChange }: InputProps) {
    return (
        <div className='driver-name'>
            <FormField
                label="Name"
                placeholder="Last Name, First Name, MI., Suffix (if applicable)"
                type="text"
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
            />
        </div>
    )
}

export function DriverAddress({ value, onChange }: InputProps) {
    return (
        <div className='driver-address'>
            <FormField
                label="Address"
                placeholder="Barangay, Municipality, Province"
                type="text"
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
            />
        </div>
    )
}

export function DriverBirthday({ value, onChange }: InputProps) {
    return (
        <div className='driver-bday'>
            <FormField
                label="Birthdate"
                type="date"
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
            />
        </div>
    )
}
