import FormField from "../../formField"
import "./insertViolation.css"

export interface ViolationFormData {
    violation_type: string;
    location: string;
    apprehending_officer: string;
    fine_amount: string;
    plate_number: string;
    license_number: string;
}

interface InsertViolationProps {
    data: ViolationFormData;
    onChange: (updated: ViolationFormData) => void;
}

function InsertViolation({ data, onChange }: InsertViolationProps){
    const set = (field: keyof ViolationFormData) => (value: string) =>
        onChange({ ...data, [field]: value });

    return(
        <div className="violation-form" style={{marginTop:"20px"}}>
            <h3 className="violation-title">Traffic Violations</h3>
            <div className="violation-info">
                <FormField
                    label="Violation Type"
                    type="text"
                    value={data.violation_type}
                    onChange={(event) => set('violation_type')(event.target.value)}
                />

                <FormField
                    label="Location"
                    type="text"
                    placeholder="Barangay, Municipality, Province"
                    value={data.location}
                    onChange={(event) => set('location')(event.target.value)}
                />

                <FormField
                    label="Apprehending Officer"
                    type="text"
                    placeholder="Last Name, First Name, MI., Suffix (if applicable)"
                    value={data.apprehending_officer}
                    onChange={(event) => set('apprehending_officer')(event.target.value)}
                />
            </div>

            <div className="violation-deets">
                <FormField
                    label="Fine Amount"
                    type="number"
                    value={data.fine_amount}
                    onChange={(event) => set('fine_amount')(event.target.value)}
                />

                <FormField
                    label="Plate Number"
                    type="text"
                    value={data.plate_number}
                    onChange={(event) => set('plate_number')(event.target.value)}
                />
                
                <FormField
                    label="License Number"
                    type="text"
                    value={data.license_number}
                    onChange={(event) => set('license_number')(event.target.value)}
                />
            </div>

            <hr style={{marginTop:"30px"}}/>
        </div>
    )
}

export default InsertViolation;
