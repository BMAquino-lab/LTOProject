class ReportModel:
    def __init__(self, linker):
        self.linker = linker

    def registered_drivers(self, filters):
        cursor = self.linker.cur()
        query = """
            SELECT
                license_number,
                full_name,
                sex,
                license_type,
                license_status,
                date_of_birth,
                TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) AS age,
                date_issued,
                date_expired,
                address
            FROM driver
        """
        conditions = []
        params = []

        if filters.get('license_type'):
            conditions.append("license_type = %s")
            params.append(filters['license_type'])
        if filters.get('license_status'):
            conditions.append("license_status = %s")
            params.append(filters['license_status'])
        if filters.get('sex'):
            conditions.append("sex = %s")
            params.append(filters['sex'])
        if filters.get('min_age'):
            conditions.append("TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) >= %s")
            params.append(filters['min_age'])
        if filters.get('max_age'):
            conditions.append("TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) <= %s")
            params.append(filters['max_age'])

        if conditions:
            query += " WHERE " + " AND ".join(conditions)

        query += " ORDER BY full_name"
        cursor.execute(query, tuple(params))
        return cursor.fetchall()

    def vehicles_by_driver(self, license_number):
        cursor = self.linker.cur()
        query = """
            SELECT
                d.license_number,
                d.full_name,
                v.plate_number,
                v.engine_number,
                v.chassis_number,
                v.vehicle_type,
                v.make,
                v.model,
                v.year_manufactured,
                v.color
            FROM driver d
            JOIN vehicle v ON v.owner = d.license_number
            WHERE d.license_number = %s
            ORDER BY v.plate_number
        """
        cursor.execute(query, (license_number,))
        return cursor.fetchall()

    def expired_registrations(self, as_of_date):
        cursor = self.linker.cur()
        query = """
            SELECT
                vr.registration_number,
                vr.plate_number,
                vr.license_number,
                d.full_name AS owner_name,
                vr.registration_date,
                vr.expiration_date,
                vr.registration_status
            FROM vehicle_registration vr
            JOIN driver d ON d.license_number = vr.license_number
            WHERE vr.expiration_date < %s
            ORDER BY vr.expiration_date ASC
        """
        cursor.execute(query, (as_of_date,))
        return cursor.fetchall()

    def problem_licenses(self):
        cursor = self.linker.cur()
        query = """
            SELECT
                license_number,
                full_name,
                license_type,
                license_status,
                date_issued,
                date_expired
            FROM driver
            WHERE license_status IN ('Expired', 'Suspended')
               OR date_expired < CURDATE()
            ORDER BY license_status, date_expired
        """
        cursor.execute(query)
        return cursor.fetchall()

    def violations_by_driver_range(self, license_number, start_date, end_date):
        cursor = self.linker.cur()
        query = """
            SELECT
                tv.violation_ticket_num,
                d.full_name,
                tv.license_number,
                tv.plate_number,
                tv.violation_type,
                tv.violation_date,
                tv.location,
                tv.fine_amount,
                tv.violation_status,
                tv.apprehending_officer
            FROM traffic_violation tv
            JOIN driver d ON d.license_number = tv.license_number
            WHERE tv.license_number = %s
              AND tv.violation_date BETWEEN %s AND %s
            ORDER BY tv.violation_date DESC
        """
        cursor.execute(query, (license_number, start_date, end_date))
        return cursor.fetchall()

    def violation_type_totals(self, year):
        cursor = self.linker.cur()
        query = """
            SELECT
                violation_type,
                COUNT(*) AS violation_count,
                SUM(fine_amount) AS total_fines
            FROM traffic_violation
            WHERE YEAR(violation_date) = %s
            GROUP BY violation_type
            ORDER BY violation_count DESC, violation_type
        """
        cursor.execute(query, (year,))
        return cursor.fetchall()

    def vehicles_in_violations_by_area(self, area):
        cursor = self.linker.cur()
        query = """
            SELECT DISTINCT
                v.plate_number,
                v.vehicle_type,
                v.make,
                v.model,
                v.color,
                d.license_number,
                d.full_name AS owner_name,
                tv.violation_type,
                tv.violation_date,
                tv.location
            FROM traffic_violation tv
            JOIN vehicle v ON v.plate_number = tv.plate_number
            LEFT JOIN driver d ON d.license_number = v.owner
            WHERE tv.location LIKE %s
            ORDER BY tv.violation_date DESC, v.plate_number
        """
        cursor.execute(query, (f"%{area}%",))
        return cursor.fetchall()
