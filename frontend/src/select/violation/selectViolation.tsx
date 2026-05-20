import Select, { type MultiValue } from 'react-select';
import { useState } from 'react';
import { customSelectStyles } from '../../style/dropdownStyle';
import { DriverLicenseNum, ViolationDate, ViolationFine, ViolationLoc, ViolationOfficer, ViolationStatus, ViolationTicketNum, ViolationType } from '../../attributes/violationAttributes';
import { VehiclePlateNum } from '../../attributes/registrationAttributes';
import "./selectViolation.css";
import { ReferenceBy } from '../select_type';

interface OptionType { value: string; label: string; }

const violationGroupBy: OptionType[] = [
    { value: "violationType", label: "Violation Type" },
];

const violationOptions: OptionType[] = [
    { value: 'violationTicketNum', label: 'Violation Ticket Number' },
    { value: 'violationDate', label: 'Violation Date' },
    { value: 'violationType', label: 'Violation Type' },
    { value: 'violationLoc', label: 'Location' },
    { value: 'violationStatus', label: 'Violation Status' },
    { value: 'apprehendingOfficer', label: 'Apprehending Officer' },
    { value: 'fineAmount', label: 'Fine Amount' },
    { value: 'licenseNum', label: 'License Number' },
    { value: 'plateNumber', label: 'Plate Number' },
];

function SelectViolation() {
    const renderViolationAttri = (value: string, context: 'select' | 'where') => {
        switch (value) {
            case "violationTicketNum":
                return <ViolationTicketNum key="violationTicketNum" />;
            case "violationDate":
                return <ViolationDate key="violationDate" />;
            case "violationType":
                return <ViolationType key="violationType" />;
            case "violationLoc":
                return <ViolationLoc key="violationLoc" />;
            case "violationStatus":
                return <ViolationStatus key="violationStatus" />;
            case "apprehendingOfficer":
                return <ViolationOfficer key="ViolationOfficer" />;
            case "fineAmount":
                return <ViolationFine key="ViolationFine" />;
            case "licenseNum":
                return <DriverLicenseNum key="DriverLicenseNumFK" />;
            case "plateNumber":
                return <VehiclePlateNum key="VehiclePlateNumFK" />;
            default:
                return null;
        }
    };

    const [selectedSelect, setselectedSelect] = useState<MultiValue<OptionType>>([]);
    const [selectedWhere, setSelectedWhere] = useState<MultiValue<OptionType>>([]);

    return (
        <>
            <div className='violation-component'>
                <div className='violation'>
                    <div>
                        <div className='select-violation'>
                            <h2>Select Traffic Violation</h2>
                            <div className='select-violation-dropdown'>
                                <Select
                                    isMulti={true}
                                    options={violationOptions}
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
                        <div className='where-violation'>
                            <h2>Where</h2>
                            <div className='where-violation-dropdown'>
                                <Select
                                    isMulti={true}
                                    options={violationOptions}
                                    value={selectedWhere}
                                    onChange={(newValue) => setSelectedWhere(newValue)}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    styles={customSelectStyles<OptionType>()}
                                />
                            </div>
                        </div>
                        {selectedWhere.map((option) => renderViolationAttri(option.value, 'where'))}
                    </div>
                </div>
                <ReferenceBy groupByOptions={violationGroupBy}/>
            </div>
            <hr style={{marginTop:"20px"}}/>
        </>
    );
}

export default SelectViolation;