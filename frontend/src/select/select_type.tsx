import { useState } from 'react';
import Select, { type SingleValue } from 'react-select';
import { customSelectStyles } from '../style/dropdownStyle';
import './select_type.css';

interface OptionType { value: string; label: string; }

interface QueryBuilderProps {
    groupByOptions: OptionType[]; // This changes dynamically based on the parent
}

const selectQueryType: OptionType[] = [
    { value: "join", label: "JOIN" },
    { value: "multiple", label: "MULTIPLE TABLES" },
];

const countOptions: OptionType[] = [
    { value: 'driver', label: 'Driver' },
    { value: 'vehicle', label: 'Vehicle' },
    { value: 'registration', label: 'Vehicle Registration' },
    { value: 'violation', label: 'Traffic Violation' }
];

export function QueryType(){
    const [queryType, setQueryType] = useState<SingleValue<OptionType>>(null);
    
    return (
        <div className="query-type-row">
            <div className="dropdown-wrapper">
                <Select
                    options={selectQueryType}
                    value={queryType}
                    placeholder={"Select a Type of Query"}
                    onChange={(newValue) => setQueryType(newValue as SingleValue<OptionType>)}
                    styles={customSelectStyles<OptionType>()}
                />
            </div>
        </div>
    );
}

// --- COMPONENT 2: DriverReferenceBy ---
export function ReferenceBy({ groupByOptions }: QueryBuilderProps){
    const [countSelection, setCountSelection] = useState<SingleValue<OptionType>>(null);
    const [referenceSelection, setReferenceSelection] = useState<SingleValue<OptionType>>(null);

    const [isCountChecked, setIsCountChecked] = useState<boolean>(false);
    const [isReferencedChecked, setIsReferencedChecked] = useState<boolean>(true);


    return (
        <div className="query-builder-container">
            <QueryType/>

            <div className="query-row">
                <label className={`checkbox-card ${isCountChecked ? 'active' : ''}`}>
                    <input
                        type="checkbox"
                        checked={isCountChecked}
                        onChange={(e) => setIsCountChecked(e.target.checked)}
                    />
                    <span className="checkbox-label">Count</span>
                </label>
                
                <div className="dropdown-wrapper">
                    <Select
                        options={countOptions} 
                        value={countSelection}
                        onChange={(newValue) => setCountSelection(newValue as SingleValue<OptionType>)}
                        styles={customSelectStyles<OptionType>()}
                        isDisabled={!isCountChecked}
                    />
                </div>
            </div>

            {isCountChecked && (
                <div className="query-row">
                    <label className={`checkbox-card tall ${isReferencedChecked ? 'active' : ''}`}>
                        <input
                            type="checkbox"
                            checked={isReferencedChecked}
                            onChange={(e) => setIsReferencedChecked(e.target.checked)}
                        />
                        <span className="checkbox-label">Referenced by</span>
                    </label>

                    <div className="dropdown-wrapper">
                        <Select
                            options={groupByOptions} 
                            value={referenceSelection}
                            onChange={(newValue) => setReferenceSelection(newValue as SingleValue<OptionType>)}
                            styles={customSelectStyles<OptionType>()}
                            isDisabled={!isReferencedChecked}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}