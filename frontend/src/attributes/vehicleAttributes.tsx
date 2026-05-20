import Select, {type SingleValue} from 'react-select';
import { useState } from 'react';
import { customSelectStyles } from '../style/dropdownStyle';
import "./vehicleAttributes.css"
import FormField from '../formField';


interface OptionType { value: string; label: string; }

const vehicleTypeOptions: OptionType[] = [
    { value: "motor", label: "Motorcycle" },
    { value: "privCar", label: "Private Car" },
    { value: "puv", label: "Public Utility Vehicle" },
    // idk if may iba pang type, eto lang ung nasa proj specs
];


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

export function VehicleEngineNum(){
    return (
        <div className='vehicle-engine-num'>
            <FormField
                label="Engine Number"
                type="text"
            />
        </div>
    )
}

export function VehicleChassisNum(){
    return (
        <div className='vehicle-chassis-num'>
            <FormField
                label="Chassis Number"
                type="text"
            />
        </div>
    )
}

export function VehicleType(){
    const [currentType, setCurrentType] = useState<SingleValue<OptionType>>(null);
    
    return(
        <div className='vehicle-type'>
            <h4>Vehicle Type</h4>
            <div className='vehicle-type-content'>
                <Select
                    isMulti={false}
                    options={vehicleTypeOptions}
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

export function VehicleMake(){
    return (
        <div className='vehicle-make'>
            <FormField
                label="Make"
                type="text"
            />
        </div>
    )
}

export function VehicleModel(){
    return (
        <div className='vehicle-model'>
            <FormField
                label="Model"
                type="text"
            />
        </div>
    )
}

export function VehicleColor(){
    return (
        <div className='vehicle-color'>
            <FormField
                label="Color"
                type="text"
            />
        </div>
    )
}

export function VehicleYearManu(){
    return (
        <div className='vehicle-year-manufactured'>
            <FormField
                label="Year Manufactured"
                type="text"
            />
        </div>
    )
}

export function VehicleOwner(){
    return (
        <div className='vehicle-owner'>
            <FormField
                label="Owner"
                type="text"
            />
        </div>
    )
}