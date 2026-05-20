class TrafficViolationModel:
    def __init__(self, linker):
        self.linker = linker
    
    def find(self, selected_columns, filters):
        cursor = self.linker.cur()

        cols = ", ".join(selected_columns) if selected_columns else "*"
        query = f"SELECT {cols} FROM traffic_violation"

        conditions = []
        params = []

        if filters.get('violation_date'):
            conditions.append("violation_date = %s")
            params.append(filters['violation_date'])
        if filters.get('violation_ticket_num'):
            conditions.append("violation_ticket_num = %s")
            params.append(filters['violation_ticket_num'])
        if filters.get('violation_type'):
            conditions.append("violation_type = %s")
            params.append(filters['violation_type'])
        if filters.get('location'):
            conditions.append("location = %s")
            params.append(filters['location'])
        if filters.get('violation_status'):
            conditions.append("violation_status = %s")
            params.append(filters['violation_status'])
        if filters.get('apprehending_officer'):
            conditions.append("apprehending_officer = %s")
            params.append(filters['apprehending_officer'])
        if filters.get('fine_amount'):
            conditions.append("fine_amount = %s")
            params.append(filters['fine_amount'])
        if filters.get('license_number'):
            conditions.append("license_number = %s")
            params.append(filters['license_number'])
        if filters.get('plate_number'):
            conditions.append("plate_number = %s")
            params.append(filters['plate_number'])

        if conditions:
            query += " WHERE " + " AND ".join(conditions)
        cursor.execute(query, tuple(params))
        return cursor.fetchall()
    
    #inserting new violation records
    def insert(self, data):
        cursor = self.linker.cur()

        query = """
            INSERT INTO traffic_violation 
            (violation_type, location, apprehending_officer, fine_amount, license_number, plate_number)
            VALUES (%s, %s, %s, %s, %s, %s)
            """
        params = (
            data['violation_type'],
            data['location'],
            data['apprehending_officer'],
            data['fine_amount'],
            data['license_number'],
            data['plate_number']
        )
        return cursor.execute(query, params)
    
    def update_violation_status(self, violation_ticket_num, new_status):
        cursor = self.linker.cur()

        query = """
            UPDATE traffic_violation SET
                violation_status = %s
            WHERE violation_ticket_num = %s
        """
        params = (new_status, violation_ticket_num)
        return cursor.execute(query, params)

    def delete(self, violation_ticket_num):
        if not violation_ticket_num:
            return False

        cursor = self.linker.cur()
        query = "DELETE FROM traffic_violation WHERE violation_ticket_num = %s"
        return cursor.execute(query, (violation_ticket_num,))
    
    #counting violations for reports
    def count_violations_by_driver(self, license_number):
        cursor = self.linker.cur()

        query = """
           SELECT d.full_name, COUNT(*) AS violation_count
           FROM traffic_violation tv
           JOIN driver d ON tv.license_number = d.license_number
           WHERE tv.license_number = %s
           GROUP BY d.full_name
        """
        params = (license_number,)
        cursor.execute(query, params)
        return cursor.fetchone()
    
    #counting number of violations for a specific vehicle for reports
    #vehicles might not have an owner hence this is separate from counting by driver
    #also useful for finding out if a vehicle has a history of violations when registering or renewing
    #also useful for finding out if a vehicle was stolen when registering or renewing by checking 
    #if there are violations with the plate number but no associated driver
    def count_violations_by_vehicle(self, plate_number):
        cursor = self.linker.cur()

        query = """
           SELECT COALESCE(d.full_name, 'No Owner') AS owner_name, v.plate_number, COUNT(*) AS violation_count
           FROM traffic_violation tv
           JOIN vehicle v ON tv.plate_number = v.plate_number
           LEFT JOIN driver d ON tv.license_number = d.license_number
           WHERE tv.plate_number = %s
           GROUP BY owner_name, v.plate_number
        """
        params = (plate_number,)
        cursor.execute(query, params)
        return cursor.fetchone()
