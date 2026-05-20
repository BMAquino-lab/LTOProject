import Select, {type SingleValue} from 'react-select';
import { useState } from 'react';
import { customSelectStyles } from '../style/dropdownStyle';
import FormField from '../formField';
import "./violationAttributes.css"


interface OptionType { value: string; label: string; }

const violationStatusOptions: OptionType[] = [
    { value: "pending", label: "Pending" },
    { value: "settled", label: "Settled" },
    { value: "underAdjudication", label: "Under Adjudication" },
    // eto sabi ni google, will double check pa
];


export function ViolationTicketNum(){
    return (
        <div className='violation-ticket-num'>
            <FormField
                label="Violation Ticket Number"
                type="text"
            />
        </div>
    )
}

export function ViolationDate(){
    return (
        <div className='violation-date'>
            <FormField
                label="Violation Date"
                type="date"
            />
        </div>
    )
}

export function ViolationType(){
    return (
        <div className='violation-type'>
            <FormField
                label="Violation Type"
                type="text"
            />
        </div>
    )
}

export function ViolationLoc(){
    return (
        <div className='violation-loc'>
            <FormField
                label="Violation Location"
                type="text"
            />
        </div>
    )
}

export function ViolationStatus(){
    const [currentType, setCurrentType] = useState<SingleValue<OptionType>>(null);
    
    return(
        <div className='violation-status'>
            <h4>Violation Status</h4>
            <div className='violation-status-content'>
                <Select
                    isMulti={false}
                    options={violationStatusOptions}
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

export function ViolationOfficer(){
    return (
        <div className='violation-officer'>
            <FormField
                label="Apprehending Officer"
                type="text"
            />
        </div>
    )
}

export function ViolationFine(){
    return (
        <div className='violation-fine'>
            <FormField
                label="Fine Amount"
                type="number"
            />
        </div>
    )
}

export function DriverLicenseNum(){
    return (
        <div className='driver-license-num-fk'>
            <FormField
                label="License Number"
                type="text"
            />
        </div>
    )
}

export function VehiclePlateNumFK(){
    return (
        <div className='vehicle-plate-num-fk'>
            <FormField
                label="Plate Number"
                type="text"
            />
        </div>
    )
}