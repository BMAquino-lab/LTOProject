#FOR DYNAMIC ALLOCATION SA JOIN

TABLE_COLUMNS = {
    "driver": {
        "license_number": "d.license_number",
        "full_name": "d.full_name",
        "sex": "d.sex",
        "date_of_birth": "d.date_of_birth",
        "address": "d.address",
        "license_type": "d.license_type",
        "license_status": "d.license_status"
    },
    "vehicle": {
        "plate_number": "v.plate_number",
        "engine_number": "v.engine_number",
        "chassis_number": "v.chassis_number",
        "vehicle_type": "v.vehicle_type",
        "make": "v.make",
        "color": "v.color",
        "year_manufactured": "v.year_manufactured",
        "owner": "v.owner"
    },
    "traffic_violation": {
        "ticket_no": "tv.ticket_no",
        "license_number": "tv.license_number",
        "plate_number": "tv.plate_number",
        "violation_date": "tv.violation_date",
        "violation_type": "tv.violation_type",
        "fine_amount": "tv.fine_amount",
        "violation_status": "tv.violation_status"
    },
    "vehicle_registration": {
        "registration_no": "vr.registration_no",
        "plate_number": "vr.plate_number",
        "license_number": "vr.license_number",
        "registration_date": "vr.registration_date",
        "expiration_date": "vr.expiration_date",
        "registration_status": "vr.registration_status"
    }
}

TABLE_ALIASES = {
    "driver": "driver d",
    "vehicle": "vehicle v",
    "traffic_violation": "traffic_violation tv",
    "vehicle_registration": "vehicle_registration vr"
}

JOIN_RELATIONS = {
    ("driver", "vehicle"): "d.license_number = v.owner",
    ("driver", "traffic_violation"): "d.license_number = tv.license_number",
    ("driver", "vehicle_registration"): "d.license_number = vr.license_number",
    ("vehicle", "traffic_violation"): "v.plate_number = tv.plate_number",
    ("vehicle", "vehicle_registration"): "v.plate_number = vr.plate_number"
}

def determine_join_path(table_a, table_b):
    if (table_a, table_b) in JOIN_RELATIONS: return JOIN_RELATIONS[(table_a, table_b)]
    if (table_b, table_a) in JOIN_RELATIONS: return JOIN_RELATIONS[(table_b, table_a)]
    return None