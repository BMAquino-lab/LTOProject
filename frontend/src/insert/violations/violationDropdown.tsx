import Select, {type StylesConfig} from 'react-select';
import { useState } from 'react';

interface OptionType {
    value: string;
    label: string;
}

const violationStatusOptions: OptionType[] = [
    { value: "pending", label: "Pending" },
    { value: "settled", label: "Settled" },
    { value: "underAdjudication", label: "Under Adjudication" },
    // eto sabi ni google, will double check pa
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

export function ViolationStatus(){
    const [violationStatus, setViolationStatus] = useState<OptionType | null>(null);

    return (
    <div className="vehicle-dropdown-container">
        <Select
            options={violationStatusOptions}
            value={violationStatus}
            onChange={(newValue) => setViolationStatus(newValue)}
            styles={customStyles} 
            placeholder="Select Violation Status..."
        />
    </div>
    );
}


