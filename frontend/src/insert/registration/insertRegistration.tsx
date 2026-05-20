import FormField from "../../formField"
import "./insertRegistration.css"

export interface RegistrationFormData {
    plate_number: string;
    license_number: string;
}

interface InsertRegistrationProps {
    data: RegistrationFormData;
    onChange: (updated: RegistrationFormData) => void;
}

function InsertRegistration({ data, onChange }: InsertRegistrationProps){
    const set = (field: keyof RegistrationFormData) => (value: string) =>
        onChange({ ...data, [field]: value });

    return(
        <div className="registration-form" style={{marginTop:"20px"}}>
            <h3 className="registration-title">Vehicle Registration</h3>
            <div className="registration-info">
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

export default InsertRegistration;
