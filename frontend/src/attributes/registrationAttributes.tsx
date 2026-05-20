import Select, {type SingleValue} from 'react-select';
import { useState } from 'react';
import { customSelectStyles } from '../style/dropdownStyle';
import FormField from '../formField';
import "./registrationAttributes.css"


interface OptionType { value: string; label: string; }

const registrationStatus: OptionType[] = [
    { value: "registered", label: "Registered" },
    { value: "forRenewal", label: "For Renewal" },
    { value: "expired", label: "Expired" },
    { value: "alarmed", label: "Alarmed" },
    { value: "revoked", label: "Revoked" },
    // eto daw sabi ni google whahaha
];


export function NewLicenseNumber(){
    return (
        <div className='new-license-number'>
            <FormField
                label="New License Number"
                type="text"
            />
        </div>
    )
}

export function RegistrationNumber(){
    return (
        <div className='registration-number'>
            <FormField
                label="Registration Number"
                type="text"
            />
        </div>
    )
}

export function RegistrationDate(){
    return (
        <div className='registration-date'>
            <FormField
                label="Registration Date"
                type="date"
            />
        </div>
    )
}

export function RegistrationExpDate(){
    return (
        <div className='registration-exp-date'>
            <FormField
                label="Expiration Date"
                type="date"
            />
        </div>
    )
}

export function RegistrationStatus(){
    const [currentType, setCurrentType] = useState<SingleValue<OptionType>>(null);
    
    return(
        <div className='registration-status'>
            <h4>Registration Status</h4>
            <div className='registration-status-content'>
                <Select
                    isMulti={false}
                    options={registrationStatus}
                    value={currentType}
                    onChange={(newValue) => setCurrentType(newValue)}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    styles={customSelectStyles<OptionType>()}
                />
            </div>
        </div>
    );
}

export function RegistrationHistory(){
    return (
        <div className='registration-hist'>
            <FormField
                label="Registration History"
                type="date"
            />
        </div>
    )
}

export function VehiclePlateNum(){
    return (
        <div className='vehicle-plate-num'>
            <FormField
                label="Plate Number"
                type="text"
            />
        </div>
    )
}