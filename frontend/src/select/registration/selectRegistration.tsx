import Select, { type MultiValue } from 'react-select';
import { useState } from 'react';
import { customSelectStyles } from '../../style/dropdownStyle';
import { RegistrationDate, RegistrationExpDate, RegistrationHistory, RegistrationNumber, RegistrationStatus, VehiclePlateNum } from '../../attributes/registrationAttributes';
import "./selectRegistration.css";
import { ReferenceBy } from '../select_type';

interface OptionType { value: string; label: string; }

const registrationGroupBy: OptionType[] = [
    { value: "vehicles", label: "Vehicles" }, //??????
];

const registrationOptions: OptionType[] = [
    { value: 'regNum', label: 'Registration Number' },
    { value: 'regDate', label: 'Registration Date' },
    { value: 'expDate', label: 'Expiration Date' },
    { value: 'regStatus', label: 'Registration Status' },
    { value: 'history', label: 'History' },
    { value: 'plateNum', label: 'Plate Number' },
];

function SelectRegistration() {
    const renderRegistrationAttri = (value: string, context: 'select' | 'where') => {
        switch (value) {
            case "regNum":
                return <RegistrationNumber key="regNum" />;
            case "regDate":
                return <RegistrationDate key="regDate" />;
            case "expDate":
                return <RegistrationExpDate key="expDate" />;
            case "regStatus":
                return <RegistrationStatus key="regStatus" />;
            case "history":
                return <RegistrationHistory key="history" />;
            case "plateNum":
                return <VehiclePlateNum key="vehiclePlateNum" />;
            default:
                return null;
        }
    };

    const [selectedSelect, setselectedSelect] = useState<MultiValue<OptionType>>([]);
    const [selectedWhere, setSelectedWhere] = useState<MultiValue<OptionType>>([]);

    return (
        <>
            <div className='registration-component'>
                <div className='registration'>
                    <div>
                        <div className='select-registration'>
                            <h2>Select Vehicle Registration</h2>
                            <div className='select-registration-dropdown'>
                                <Select
                                    isMulti={true}
                                    options={registrationOptions}
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
                        <div className='where-registration'>
                            <h2>Where</h2>
                            <div className='where-registration-dropdown'>
                                <Select
                                    isMulti={true}
                                    options={registrationOptions}
                                    value={selectedWhere}
                                    onChange={(newValue) => setSelectedWhere(newValue)}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    styles={customSelectStyles<OptionType>()}
                                />
                            </div>
                        </div>
                        {selectedWhere.map((option) => renderRegistrationAttri(option.value, 'where'))}
                    </div>
                </div>
                <ReferenceBy groupByOptions={registrationGroupBy}/>
            </div>
            <hr style={{marginTop:"20px"}}/>
        </>
    );
}

export default SelectRegistration;