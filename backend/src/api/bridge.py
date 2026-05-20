import os
import sys
import site

BACKEND_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
VENDORED_PACKAGES = os.path.join(BACKEND_ROOT, ".python_packages")
if os.path.isfile(os.path.join(VENDORED_PACKAGES, "flask", "__init__.py")):
    sys.path.insert(0, VENDORED_PACKAGES)
sys.path.append(site.getusersitepackages())

from flask import Flask, request, jsonify
from flask_cors import CORS  # <-- ADD THIS

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.sql_linker import SQLLinker
from models.vehicle_model import VehicleModel
from models.driver_model import DriverModel
from models.traffic_violation_model import TrafficViolationModel
from models.vehicle_registration_model import VehicleRegistrationModel
from models.report_model import ReportModel

app = Flask(__name__)
CORS(app)  # <-- ADD THIS (allows React on port 5173 to call Flask on port 5000)

linker = SQLLinker()
vehicle_model = VehicleModel(linker)
driver_model = DriverModel(linker)
violation_model = TrafficViolationModel(linker)
registration_model = VehicleRegistrationModel(linker)
report_model = ReportModel(linker)

# helper function to auto commit or rollback database changes safely
def commit_or_rollback(success):
    if success:
        linker.commit()
    else:
        linker.rollback()

# Vehicle ===========================================================================================

@app.route('/api/vehicles/find', methods=['POST'])
def find_vehicles():
    req_data = request.get_json() or {}
    try:
        results = vehicle_model.find(req_data.get('selected_columns', []), req_data.get('filters', {}))
        return jsonify({"success": True, "data": results}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/vehicles/insert', methods=['POST'])
def insert_vehicle():
    req_data = request.get_json() or {}
    try:
        res = vehicle_model.insert(req_data.get('data', {}))
        linker.commit()
        return jsonify({"success": True, "data": res}), 201
    except Exception as e:
        linker.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/vehicles/update', methods=['POST'])
def update_vehicle():
    req_data = request.get_json() or {}
    try:
        updated = vehicle_model.update(req_data.get('updates', {}), req_data.get('filters', {}))
        commit_or_rollback(updated)
        return jsonify({"success": True, "updated": updated}), 200
    except Exception as e:
        linker.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/vehicles/delete', methods=['POST'])
def delete_vehicle():
    req_data = request.get_json() or {}
    try:
        deleted = vehicle_model.delete(req_data.get('plate_number'))
        commit_or_rollback(deleted)
        return jsonify({"success": True, "deleted": deleted}), 200
    except Exception as e:
        linker.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

# Vehicle Registration ===============================================================================

@app.route('/api/registrations/find', methods=['POST'])
def find_registrations():
    req_data = request.get_json() or {}
    try:
        results = registration_model.find(req_data.get('selected_columns', []), req_data.get('filters', {}))
        return jsonify({"success": True, "data": results}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/registrations/insert', methods=['POST'])
def insert_registration():
    req_data = request.get_json() or {}
    try:
        res = registration_model.insert(req_data.get('data', {}))
        linker.commit()
        return jsonify({"success": True, "data": res}), 201
    except Exception as e:
        linker.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/registrations/update-registration', methods=['POST'])
def update_registration_details():
    req_data = request.get_json() or {}
    try:
        res = registration_model.update_registration(req_data.get('registration_number'), req_data.get('data', {}))
        linker.commit()
        return jsonify({"success": True, "data": res}), 200
    except Exception as e:
        linker.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/registrations/expire', methods=['POST'])
def expire_registrations():
    try:
        res = registration_model.expire_registrations()
        linker.commit()
        return jsonify({"success": True, "affected_rows": res}), 200
    except Exception as e:
        linker.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/registrations/update-owner', methods=['POST'])
def update_registration_owner():
    req_data = request.get_json() or {}
    try:
        res = registration_model.update_owner(req_data.get('plate_number'), req_data.get('new_license_number'))
        linker.commit()
        return jsonify({"success": True, "data": res}), 200
    except Exception as e:
        linker.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/registrations/find-owner', methods=['POST'])
def find_registration_owner():
    req_data = request.get_json() or {}
    try:
        res = registration_model.find_owner(req_data.get('plate_number'))
        return jsonify({"success": True, "data": res}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/registrations/delete', methods=['POST'])
def delete_registration():
    req_data = request.get_json() or {}
    try:
        deleted = registration_model.delete(req_data.get('registration_number'))
        commit_or_rollback(deleted)
        return jsonify({"success": True, "deleted": deleted}), 200
    except Exception as e:
        linker.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

# Driver =============================================================================================

@app.route('/api/drivers/find', methods=['POST'])
def find_drivers():
    req_data = request.get_json() or {}
    try:
        results = driver_model.find(req_data.get('selected_columns', []), req_data.get('filters', {}))
        return jsonify({"success": True, "data": results}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/drivers/insert', methods=['POST'])
def insert_driver():
    req_data = request.get_json() or {}
    try:
        res = driver_model.insert(req_data.get('data', {}))
        linker.commit()
        return jsonify({"success": True, "data": res}), 201
    except Exception as e:
        linker.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/drivers/update', methods=['POST'])
def update_driver():
    req_data = request.get_json() or {}
    try:
        updated = driver_model.update(req_data.get('updates', {}), req_data.get('filters', {}))
        commit_or_rollback(updated)
        return jsonify({"success": True, "updated": updated}), 200
    except Exception as e:
        linker.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/drivers/expire-licenses', methods=['POST'])
def expire_licenses():
    try:
        res = driver_model.expire_licenses()
        linker.commit()
        return jsonify({"success": True, "affected_rows": res}), 200
    except Exception as e:
        linker.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/drivers/find-vehicles', methods=['POST'])
def find_driver_vehicles():
    req_data = request.get_json() or {}
    try:
        results = driver_model.find_vehicles(req_data.get('license_number'))
        return jsonify({"success": True, "data": results}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/drivers/delete', methods=['POST'])
def delete_driver():
    req_data = request.get_json() or {}
    try:
        deleted = driver_model.delete(req_data.get('license_number'))
        commit_or_rollback(deleted)
        return jsonify({"success": True, "deleted": deleted}), 200
    except Exception as e:
        linker.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/drivers/non-owners', methods=['GET', 'POST'])
def find_non_owners():
    try:
        results = driver_model.find_non_owners()
        return jsonify({"success": True, "data": results}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# Traffic Violation ==================================================================================

@app.route('/api/violations/find', methods=['POST'])
def find_violations():
    req_data = request.get_json() or {}
    try:
        results = violation_model.find(req_data.get('selected_columns', []), req_data.get('filters', {}))
        return jsonify({"success": True, "data": results}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/violations/insert', methods=['POST'])
def insert_violation():
    req_data = request.get_json() or {}
    try:
        res = violation_model.insert(req_data.get('data', {}))
        linker.commit()
        return jsonify({"success": True, "data": res}), 201
    except Exception as e:
        linker.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/violations/update-status', methods=['POST'])
def update_violation_status():
    req_data = request.get_json() or {}
    try:
        res = violation_model.update_violation_status(req_data.get('violation_ticket_num'), req_data.get('new_status'))
        linker.commit()
        return jsonify({"success": True, "data": res}), 200
    except Exception as e:
        linker.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/violations/count-by-driver', methods=['POST'])
def count_violations_by_driver():
    req_data = request.get_json() or {}
    try:
        results = violation_model.count_violations_by_driver(req_data.get('license_number'))
        return jsonify({"success": True, "data": results}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/violations/count-by-vehicle', methods=['POST'])
def count_violations_by_vehicle():
    req_data = request.get_json() or {}
    try:
        results = violation_model.count_violations_by_vehicle(req_data.get('plate_number'))
        return jsonify({"success": True, "data": results}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/violations/delete', methods=['POST'])
def delete_violation():
    req_data = request.get_json() or {}
    try:
        deleted = violation_model.delete(req_data.get('violation_ticket_num'))
        commit_or_rollback(deleted)
        return jsonify({"success": True, "deleted": deleted}), 200
    except Exception as e:
        linker.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

# Reports ============================================================================================

@app.route('/api/reports/registered-drivers', methods=['POST'])
def report_registered_drivers():
    req_data = request.get_json() or {}
    try:
        results = report_model.registered_drivers(req_data.get('filters', {}))
        return jsonify({"success": True, "data": results}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/reports/vehicles-by-driver', methods=['POST'])
def report_vehicles_by_driver():
    req_data = request.get_json() or {}
    try:
        results = report_model.vehicles_by_driver(req_data.get('license_number'))
        return jsonify({"success": True, "data": results}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/reports/expired-registrations', methods=['POST'])
def report_expired_registrations():
    req_data = request.get_json() or {}
    try:
        results = report_model.expired_registrations(req_data.get('as_of_date'))
        return jsonify({"success": True, "data": results}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/reports/problem-licenses', methods=['POST'])
def report_problem_licenses():
    try:
        results = report_model.problem_licenses()
        return jsonify({"success": True, "data": results}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/reports/violations-by-driver-range', methods=['POST'])
def report_violations_by_driver_range():
    req_data = request.get_json() or {}
    try:
        results = report_model.violations_by_driver_range(
            req_data.get('license_number'),
            req_data.get('start_date'),
            req_data.get('end_date')
        )
        return jsonify({"success": True, "data": results}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/reports/violation-type-totals', methods=['POST'])
def report_violation_type_totals():
    req_data = request.get_json() or {}
    try:
        results = report_model.violation_type_totals(req_data.get('year'))
        return jsonify({"success": True, "data": results}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/reports/vehicles-in-violations-by-area', methods=['POST'])
def report_vehicles_in_violations_by_area():
    req_data = request.get_json() or {}
    try:
        results = report_model.vehicles_in_violations_by_area(req_data.get('area'))
        return jsonify({"success": True, "data": results}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


if __name__ == '__main__':
    app.run(port=int(os.environ.get('PORT', 5001)), debug=True, use_reloader=False)
