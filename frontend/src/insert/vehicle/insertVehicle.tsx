import FormField from "../../formField"
import "./insertVehicle.css"
import { VehicleType } from "./vehicleDropdown";

interface OptionType { value: string; label: string; }

export interface VehicleFormData {
    plate_number: string;
    engine_number: string;
    chassis_number: string;
    vehicle_type: OptionType | null;
    color: string;
    make: string;
    model: string;
    year_manufactured: string;
}

interface InsertVehicleProps {
    data: VehicleFormData;
    onChange: (updated: VehicleFormData) => void;
}

function InsertVehicle({ data, onChange }: InsertVehicleProps){
    const set = (field: keyof VehicleFormData) => (value: string | OptionType | null) =>
        onChange({ ...data, [field]: value });

    return(
        <div className="vehicle-form" style={{marginTop:"20px"}}>
            <h3 className="vehicle-title">Vehicle</h3>
            <div className="vehicle-info">
                <FormField
                    label="Plate Number"
                    type="text"
                    value={data.plate_number}
                    onChange={(event) => set('plate_number')(event.target.value)}
                />
                
                <FormField
                    label="Engine Number"
                    type="text"
                    value={data.engine_number}
                    onChange={(event) => set('engine_number')(event.target.value)}
                />

                <FormField
                    label="Chassis Number"
                    type="text"
                    value={data.chassis_number}
                    onChange={(event) => set('chassis_number')(event.target.value)}
                />

                <div>
                    <label>Vehicle Type</label>
                    <VehicleType value={data.vehicle_type} onChange={set('vehicle_type')} />
                </div>
            </div>

            <div className="vehicle-style">
                <FormField
                    label="Color"
                    type="text"
                    value={data.color}
                    onChange={(event) => set('color')(event.target.value)}
                />

                <FormField
                    label="Make"
                    type="text"
                    value={data.make}
                    onChange={(event) => set('make')(event.target.value)}
                />

                <FormField
                    label="Model"
                    type="text"
                    value={data.model}
                    onChange={(event) => set('model')(event.target.value)}
                />

                <FormField
                    label="Year Manufactured"
                    type="number"
                    value={data.year_manufactured}
                    onChange={(event) => set('year_manufactured')(event.target.value)}
                />
            </div>
            
            <hr style={{marginTop:"30px"}}/>
        </div>
    )
}

export default InsertVehicle;
