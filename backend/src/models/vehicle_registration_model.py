class VehicleRegistrationModel:
    def __init__(self, linker):
        self.linker = linker
    
    def find(self, selected_columns, filters):
        self.expire_registrations() #auto expire registrations before fetching data
        cursor = self.linker.cur()

        cols = ", ".join(selected_columns) if selected_columns else "*"
        query = f"SELECT {cols} FROM vehicle_registration"

        conditions = []
        params = []

        if filters.get('plate_number'):
            conditions.append("plate_number = %s")
            params.append(filters['plate_number'])
        if filters.get('registration_number'):
            conditions.append("registration_number = %s")
            params.append(filters['registration_number'])
        if filters.get('registration_status'):
            conditions.append("registration_status = %s")
            params.append(filters['registration_status'])
        if filters.get('registration_date'):
            conditions.append("registration_date = %s")
            params.append(filters['registration_date'])
        if filters.get('expiration_date'):
            conditions.append("expiration_date = %s")
            params.append(filters['expiration_date'])
        if filters.get('license_number'):
            conditions.append("license_number = %s")
            params.append(filters['license_number'])
        if filters.get('history'):
            conditions.append("history LIKE %s")
            params.append(f"%{filters['history']}%")

        if conditions:
            query += " WHERE " + " AND ".join(conditions)
        cursor.execute(query, tuple(params))
        return cursor.fetchall()
    
    #newly registered vehicles
    def insert(self, data):
        cursor = self.linker.cur()

        query = """
            INSERT INTO vehicle_registration 
            (plate_number, license_number, history) VALUES(%s, %s, CURDATE())
            """
        params = (
            data['plate_number'],
            data['license_number']
        )
        inserted = cursor.execute(query,params)
        cursor.execute(
            "UPDATE vehicle SET owner = %s WHERE plate_number = %s",
            (data['license_number'], data['plate_number'])
        )
        return inserted
    

    #update registration details like renewal or status changes
    def update_registration(self, registration_number,data):
        cursor = self.linker.cur()

        allowed_columns = {'plate_number', 'license_number', 'registration_status', 'registration_date', 'expiration_date'}
        set_clauses = []
        params = []

        for column, value in data.items():
            if column in allowed_columns and value not in (None, ''):
                set_clauses.append(f"{column} = %s")
                params.append(value)

        if not set_clauses or not registration_number:
            return False

        set_clauses.append("history = CONCAT(COALESCE(history, ''), '; Updated at ', CURDATE())")
        query = f"UPDATE vehicle_registration SET {', '.join(set_clauses)} WHERE registration_number = %s"
        params.append(registration_number)
        return cursor.execute(query,params)

    def expire_registrations(self):
        cursor = self.linker.cur()
        query = "UPDATE vehicle_registration SET registration_status = 'Expired' WHERE expiration_date < CURDATE()"
        return cursor.execute(query)
    
    #incase 
    def update_owner(self, plate_number, new_license_number):
        cursor = self.linker.cur()

        registration_query = """
            UPDATE vehicle_registration SET
                license_number = %s,
                history = CONCAT("New Owner: ", %s, " Changed at: ", history, '; ', CURDATE())
            WHERE plate_number = %s
            """
        params = (
            new_license_number,
            new_license_number,
            plate_number
        )
        updated = cursor.execute(registration_query,params)
        cursor.execute(
            "UPDATE vehicle SET owner = %s WHERE plate_number = %s",
            (new_license_number, plate_number)
        )
        return updated
    
    def find_owner(self, plate_number):
        cursor = self.linker.cur()
        query = """
            SELECT d.full_name, d.license_number, vr.plate_number FROM driver d
            JOIN vehicle_registration vr ON d.license_number = vr.license_number
            WHERE vr.plate_number = %s
        """
        cursor.execute(query, (plate_number,))
        result = cursor.fetchone()
        return result if result else "No data found for the given plate number"

    def delete(self, registration_number):
        if not registration_number:
            return False

        cursor = self.linker.cur()
        query = "DELETE FROM vehicle_registration WHERE registration_number = %s"
        return cursor.execute(query, (registration_number,))
