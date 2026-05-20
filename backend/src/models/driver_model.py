class DriverModel:
    def __init__(self, linker):
        self.linker = linker
    
    #finding drivers
    def find(self,selected_columns,filters):
        self.expire_licenses() #auto expire licenses before fetching data
        cursor = self.linker.cur()

        #getting the columns
        #format: SELECT col1, col2,.... FROM driver
        cols = ", ".join(selected_columns) if selected_columns else "*"
        query = f"SELECT {cols} FROM driver"

        #the dynamic params/conditions
        #on the WHERE clause
        conditions = []
        params = []

        if filters.get('license_type'):
            conditions.append("license_type = %s")
            params.append(filters['license_type'])
        if filters.get('license_number'):
            conditions.append("license_number = %s")
            params.append(filters['license_number'])
        if filters.get('license_status'):
            conditions.append("license_status = %s")
            params.append(filters['license_status'])
        if filters.get('sex'):
            conditions.append("sex = %s")
            params.append(filters['sex'])
        if filters.get('full_name'):
            conditions.append("full_name LIKE %s")
            params.append(f"%{filters['full_name']}%")
        if filters.get('address'):
            conditions.append("address LIKE %s")
            params.append(f"%{filters['address']}%")
        if filters.get('date_of_birth'):
            conditions.append("date_of_birth = %s")
            params.append(filters['date_of_birth'])
        
        #may age kasi nakalagay so this will be computed na lang
        if filters.get('age_value'):
            operator = filters.get('age_op', '=') #defaults to "=" if not chosen
            
            #Using TIMESTAMPDIFF here for more accurate age computation since
            #DATEDIFF(curdate(), date_of_birth)/365 does not account for leap years
            conditions.append(f"TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) {operator} %s")
            params.append(filters['age_value'])
        
        #finalizing string
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
        
        #executing
        cursor.execute(query, tuple(params))
        return cursor.fetchall()
    
    #inserting drivers
    def insert(self,data):
        cursor = self.linker.cur()
        query = """
                INSERT INTO driver (
                    full_name, sex, date_of_birth, address, license_number, license_type
                ) VALUES (%s, %s, %s, %s, %s, %s)
            """
        params = (
            data['full_name'],
            data['sex'],
            data['date_of_birth'],
            data['address'],
            data['license_number'],
            data['license_type']
        )
        return cursor.execute(query,params)
    
    #update driver
    def update(self, updates, filters):
        cursor = self.linker.cur()
        
        #placeholders
        set_clauses = []
        params = []
        where_conditions = []

        #building the set clauses with values
        for col, val in updates.items():
            set_clauses.append(f"{col} = %s")
            params.append(val)
        query = f"UPDATE driver SET {', '.join(set_clauses)}"

        #where conditions
        if filters.get('license_number'):
            where_conditions.append('license_number = %s')
            params.append(filters['license_number'])
        if filters.get('full_name'):
            where_conditions.append('full_name = %s')
            params.append(filters['full_name'])
        if filters.get('date_expired'):
            where_conditions.append('date_expired = %s')
            params.append(filters['date_expired'])
        
        if where_conditions:
            query += " WHERE " + " AND ".join(where_conditions)
            cursor.execute(query,tuple(params))
            return True #Returns true if successful update
        #Returns false if not
        return False #Prevents updating the whole table

    def delete(self, license_number):
        if not license_number:
            return False

        cursor = self.linker.cur()
        query = "DELETE FROM driver WHERE license_number = %s"
        return cursor.execute(query, (license_number,))
    
    #calls this for auto updating expired licenses
    #pls call this during sign in as well to ensure data is updated
    def expire_licenses(self):
        cursor = self.linker.cur()
        query = "UPDATE driver SET license_status = 'Expired' WHERE date_expired < CURDATE()"
        return cursor.execute(query)
    
    #finds the owner of a vehicle given the plate number
    def find_vehicles(self, license_number):
        cursor = self.linker.cur()
        query = """
                SELECT d.full_name, d.license_number, v.plate_number, v.make, v.model, v.color, v.vehicle_type
                FROM driver d
                join vehicle v ON d.license_number = v.owner
                WHERE d.license_number = %s"""
        cursor.execute(query, (license_number,))
        return cursor.fetchall() #fetch all since an owner can have multiple vehicles
    
    #finds drivers that do not own any vehicles
    def find_non_owners(self):
        cursor = self.linker.cur()
        query = """
                SELECT full_name, license_number
                FROM driver
                WHERE NOT EXISTS (
                    SELECT 1
                    FROM vehicle
                    WHERE vehicle.owner = driver.license_number
                )"""
        cursor.execute(query)
        return cursor.fetchall()
