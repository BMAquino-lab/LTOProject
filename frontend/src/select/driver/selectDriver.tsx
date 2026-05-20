import Select, { type MultiValue } from 'react-select';
import { useState } from 'react';
import { customSelectStyles } from '../../style/dropdownStyle';
import "./selectDriver.css";
import { DriverAddress, DriverBirthday, DriverLicenseNum, DriverLicenseStatus, DriverLicenseType, DriverName } from '../../attributes/driverAttributes';
import { QueryType, ReferenceBy } from '../select_type';

interface OptionType { value: string; label: string; }

const driverGroupBy: OptionType[] = [
    { value: "drivers", label: "Drivers" },
];

const driverOptions: OptionType[] = [
    { value: 'licenseNumber', label: 'License Number' },
    { value: 'licenseType', label: 'License Type' },
    { value: 'licenseStatus', label: 'License Status' },
    { value: 'name', label: 'Name' },
    { value: 'address', label: 'Address' },
    { value: 'bday', label: 'Birthday' },
];

function SelectDriver() {
    const renderDriverAttri = (value: string, context: 'select' | 'where') => {
        switch (value) {
            case "licenseNumber":
                return <DriverLicenseNum key="licenseNum" />;
            case "licenseType":
                return <DriverLicenseType key="licenseType" />;
            case "licenseStatus":
                return <DriverLicenseStatus key="licenseStatus" />;
            case "name":
                return <DriverName key="registration" />;
            case "address":
                return <DriverAddress key="address" />;
            case "bday":
                return <DriverBirthday key="birthday" />;
            default:
                return null;
        }
    };

    const [selectedSelect, setselectedSelect] = useState<MultiValue<OptionType>>([]);
    const [selectedWhere, setSelectedWhere] = useState<MultiValue<OptionType>>([]);

    return (
        <>
            <div className='driver-component'>
                <div className='driver'>
                    <div>
                        <div className='select-driver'>
                            <h2>Select Driver</h2>
                            <div className='select-driver-dropdown'>
                                <Select
                                    isMulti={true}
                                    options={driverOptions}
                                    value={selectedSelect}
                                    onChange={(newValue) => setselectedSelect(newValue)}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    styles={customSelectStyles<OptionType>()}
                                />
                            </div>
                        </div>
                        {/* {selectedSelect.map((option) => renderDriverAttri(option.value, "select"))} */}
                        
                    </div>

                    <div>
                        <div className='where-driver'>
                            <h2>Where</h2>
                            <div className='where-driver-dropdown'>
                                <Select
                                    isMulti={true}
                                    options={driverOptions}
                                    value={selectedWhere}
                                    onChange={(newValue) => setSelectedWhere(newValue)}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    styles={customSelectStyles<OptionType>()}
                                />
                            </div>
                        </div>
                        {selectedWhere.map((option) => renderDriverAttri(option.value, 'where'))}
                    </div>

                </div>

                <ReferenceBy groupByOptions={driverGroupBy}/>
            </div>
            <hr style={{marginTop:"20px"}}/>
        </>
    );
}

export default SelectDriver;