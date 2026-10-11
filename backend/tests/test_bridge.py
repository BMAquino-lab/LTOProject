"""Exercise the API with a fake database connection and the real model classes."""

import importlib.util
from pathlib import Path
import sys
import types
import unittest
from unittest.mock import Mock, patch


BRIDGE_PATH = Path(__file__).resolve().parents[1] / "src" / "api" / "bridge.py"


class BridgeTests(unittest.TestCase):
    def setUp(self):
        self.linker = Mock()
        self.cursor = self.linker.cur.return_value
        self.cursor.fetchall.return_value = []
        self.cursor.execute.return_value = 1

        # sql_linker.py contains local credentials and is deliberately untracked.
        # Replacing only this module lets a fresh checkout test real API imports.
        database_module = types.ModuleType("database.sql_linker")
        database_module.SQLLinker = Mock(return_value=self.linker)
        spec = importlib.util.spec_from_file_location("lto_test_bridge", BRIDGE_PATH)
        self.bridge = importlib.util.module_from_spec(spec)
        with patch.dict(sys.modules, {"database.sql_linker": database_module}):
            spec.loader.exec_module(self.bridge)

        self.bridge.app.config["TESTING"] = True
        self.client = self.bridge.app.test_client()

    def vehicle_data(self):
        return {
            "plate_number": "TEST-001",
            "engine_number": "ENGINE-001",
            "chassis_number": "CHASSIS-001",
            "vehicle_type": "Car",
            "make": "Test",
            "color": "Blue",
            "model": "Example",
            "year_manufactured": 2026,
        }

    def test_startup_does_not_require_a_database_connection(self):
        self.assertIs(self.bridge.linker, self.linker)
        self.linker.cur.assert_not_called()

    def test_vehicle_search_returns_rows_and_binds_filter_values(self):
        rows = [{"plate_number": "TEST-001"}]
        self.cursor.fetchall.return_value = rows
        response = self.client.post(
            "/api/vehicles/find",
            json={"selected_columns": ["plate_number"], "filters": {"plate_number": "TEST-001"}},
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"success": True, "data": rows})
        self.cursor.execute.assert_called_once_with(
            "SELECT plate_number FROM vehicle WHERE plate_number = %s", ("TEST-001",)
        )

    def test_problem_license_report_returns_rows(self):
        rows = [{"license_number": "TEST-LICENSE", "license_status": "Expired"}]
        self.cursor.fetchall.return_value = rows
        response = self.client.post("/api/reports/problem-licenses", json={})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"success": True, "data": rows})

    def test_vehicle_insert_commits_on_success(self):
        response = self.client.post("/api/vehicles/insert", json={"data": self.vehicle_data()})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.get_json(), {"success": True, "data": 1})
        self.linker.commit.assert_called_once_with()
        self.linker.rollback.assert_not_called()

    def test_vehicle_insert_rolls_back_on_database_error(self):
        self.cursor.execute.side_effect = RuntimeError("Database unavailable")
        response = self.client.post("/api/vehicles/insert", json={"data": self.vehicle_data()})
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.get_json(), {"success": False, "error": "Database unavailable"})
        self.linker.rollback.assert_called_once_with()
        self.linker.commit.assert_not_called()


if __name__ == "__main__":
    unittest.main()
