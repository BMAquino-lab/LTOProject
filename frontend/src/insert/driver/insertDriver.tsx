import FormField from "../../formField"
import "./insertDriver.css"
import { LicenseType, DriverSex } from "./driverDropdown";

interface OptionType { value: string; label: string; }

// All form values are owned by insertPage and passed down as props
export interface DriverFormData {
    full_name: string;
    sex: OptionType | null;
    date_of_birth: string;
    address: string;
    license_number: string;
    license_type: OptionType | null;
}

interface InsertDriverProps {
    data: DriverFormData;
    onChange: (updated: DriverFormData) => void;
}

function InsertDriver({ data, onChange }: InsertDriverProps) {
    const set = (field: keyof DriverFormData) => (val: string | OptionType | null) =>
        onChange({ ...data, [field]: val });

    return (
        <div className="driver-form" style={{ marginTop: "20px" }}>
            <h3 className="driver-title">Driver</h3>
            <div className="personal-info">
                <FormField
                    label="Full Name"
                    type="text"
                    placeholder="Last Name, First Name, MI., Suffix (if applicable)"
                    value={data.full_name}
                    onChange={(e) => set('full_name')(e.target.value)}
                />

                <div>
                    <label>Sex</label>
                    <DriverSex
                        value={data.sex}
                        onChange={set('sex')}
                    />
                </div>

                <FormField
                    label="Birthdate"
                    placeholder="YYYY-MM-DD"
                    type="date"
                    value={data.date_of_birth}
                    onChange={(e) => set('date_of_birth')(e.target.value)}
                />
            </div>

            <div className="address">
                <FormField
                    label="Address"
                    type="text"
                    placeholder="Barangay, Municipality, Province"
                    value={data.address}
                    onChange={(e) => set('address')(e.target.value)}
                />
            </div>

            <div className="license-info">
                <FormField
                    label="License Number"
                    type="text"
                    value={data.license_number}
                    onChange={(e) => set('license_number')(e.target.value)}
                />

                <div>
                    <label>License Type</label>
                    <LicenseType
                        value={data.license_type}
                        onChange={set('license_type')}
                    />
                </div>
            </div>
            <hr style={{ marginTop: "30px" }} />
        </div>
    )
}

export default InsertDriver;