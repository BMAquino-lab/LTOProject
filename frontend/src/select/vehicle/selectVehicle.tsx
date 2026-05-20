import Select, { type MultiValue } from 'react-select';
import { useState } from 'react';
import { customSelectStyles } from '../../style/dropdownStyle';
import "./selectVehicle.css";
import { VehicleChassisNum, VehicleColor, VehicleEngineNum, VehicleMake, VehicleModel, VehicleOwner, VehiclePlateNum, VehicleType, VehicleYearManu } from '../../attributes/vehicleAttributes';
import { ReferenceBy } from '../select_type';

interface OptionType { value: string; label: string; }

const vehicleGroupBy: OptionType[] = [
    { value: "vehicles", label: "Vehicles" }, //??????
    { value: "model", label: "Model" },
    { value: "color", label: "Color" },
    { value: "year_manufactured", label: "Year Manufactured" },
];

const vehicleOptions: OptionType[] = [
    { value: 'plateNum', label: 'Plate Number' },
    { value: 'engineNum', label: 'Engine Number' },
    { value: 'chassisNum', label: 'Chassis Number' },
    { value: 'vehicleType', label: 'Vehicle Type' },
    { value: 'make', label: 'Make' },
    { value: 'model', label: 'Model' },
    { value: 'color', label: 'Color' },
    { value: 'owner', label: 'Owner' },
    { value: 'yearManufactured', label: 'Year Manufactured' },
];

function SelectVehicle() {
    const renderVehicleAttri = (value: string, context: 'select' | 'where') => {
        switch (value) {
            case "plateNum":
                return <VehiclePlateNum key="plateNum" />;
            case "engineNum":
                return <VehicleEngineNum key="engineNum" />;
            case "chassisNum":
                return <VehicleChassisNum key="chassisNum" />;
            case "vehicleType":
                return <VehicleType key="type" />;
            case "make":
                return <VehicleMake key="make" />;
            case "model":
                return <VehicleModel key="model" />;
            case "color":
                return <VehicleColor key="color" />;
            case "yearManufactured":
                return <VehicleYearManu key="yearManu" />;
            case "owner":
                return <VehicleOwner key="owner" />;
            default:
                return null;
        }
    };

    const [selectedSelect, setselectedSelect] = useState<MultiValue<OptionType>>([]);
    const [selectedWhere, setSelectedWhere] = useState<MultiValue<OptionType>>([]);

    return (
        <>
            <div className='vehicle-component'>
                <div className='vehicle'>
                    <div>
                        <div className='select-vehicle'>
                            <h2>Select Vehicle</h2>
                            <div className='select-vehicle-dropdown'>
                                <Select
                                    isMulti={true}
                                    options={vehicleOptions}
                                    value={selectedSelect}
                                    onChange={(newValue) => setselectedSelect(newValue)}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    styles={customSelectStyles<OptionType>()}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className='where-vehicle'>
                            <h2>Where</h2>
                            <div className='where-vehicle-dropdown'>
                                <Select
                                    isMulti={true}
                                    options={vehicleOptions}
                                    value={selectedWhere}
                                    onChange={(newValue) => setSelectedWhere(newValue)}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    styles={customSelectStyles<OptionType>()}
                                />
                            </div>
                        </div>
                        {selectedWhere.map((option) => renderVehicleAttri(option.value, 'where'))}
                    </div>
                </div>
                <ReferenceBy groupByOptions={vehicleGroupBy}/>
            </div>
            <hr style={{marginTop:"20px"}}/>
        </>
    );
}

export default SelectVehicle;