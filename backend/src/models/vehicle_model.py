class VehicleModel:
    def __init__(self,linker):
        self.linker = linker

    def find(self, selected_columns, filters):
        cursor = self.linker.cur()

        cols = ", ".join(selected_columns) if selected_columns else "*"
        query = f"SELECT {cols} FROM vehicle"

        conditions = []
        params = []

        if filters.get('plate_number'):
            conditions.append("plate_number = %s")
            params.append(filters["plate_number"])
        if filters.get('engine_number'):
            conditions.append("engine_number = %s")
            params.append(filters["engine_number"])
        if filters.get('chassis_number'):
            conditions.append("chassis_number = %s")
            params.append(filters["chassis_number"])
        if filters.get('vehicle_type'):
            conditions.append("vehicle_type = %s")
            params.append(filters["vehicle_type"])
        if filters.get('make'):
            conditions.append("make = %s")
            params.append(filters["make"])
        if filters.get('model'):
            conditions.append("model = %s")
            params.append(filters["model"])
        if filters.get('color'):
            conditions.append("color = %s")
            params.append(filters["color"])
        if filters.get('year_manufactured'):
            conditions.append("year_manufactured = %s")
            params.append(filters["year_manufactured"])
        if filters.get('owner'):
            conditions.append("owner = %s")
            params.append(filters["owner"])
        
        if conditions:
            query += " WHERE " + " AND ".join(conditions)

        
        cursor.execute(query, tuple(params))
        return cursor.fetchall()
    
    def insert(self, data):
        cursor = self.linker.cur()

        query = """INSERT INTO vehicle (plate_number, engine_number, chassis_number, vehicle_type, make, color, 
                model, year_manufactured
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """

        params = [
            data['plate_number'],
            data['engine_number'],
            data['chassis_number'],
            data['vehicle_type'],
            data['make'],
            data['color'],
            data['model'],
            data['year_manufactured']
        ]

        return cursor.execute(query,params)
    
    #for editing vehicle details in case of typos or change of ownership
    def update(self, updates, filters):
        cursor = self.linker.cur()

        set_clauses = []
        params = []
        where_conditions = []

        for col, val in updates.items():
            set_clauses.append(f"{col} = %s")
            params.append(val)
        query = f"UPDATE vehicle SET {', '.join(set_clauses)}"

        if filters.get('plate_number'):
            where_conditions.append('plate_number = %s')
            params.append(filters['plate_number'])
        if filters.get('engine_number'):
            where_conditions.append('engine_number = %s')
            params.append(filters['engine_number'])
        if filters.get('chassis_number'):
            where_conditions.append('chassis_number = %s')
            params.append(filters['chassis_number'])
        if filters.get('vehicle_type'):
            where_conditions.append('vehicle_type = %s')
            params.append(filters['vehicle_type'])
        if filters.get('make'):
            where_conditions.append('make = %s')
            params.append(filters['make'])
        if filters.get('model'):
            where_conditions.append('model = %s')
            params.append(filters['model'])
        if filters.get('color'):
            where_conditions.append('color = %s')
            params.append(filters['color'])
        if filters.get('year_manufactured'):
            where_conditions.append('year_manufactured = %s')
            params.append(filters['year_manufactured'])
        if filters.get('owner'):
            where_conditions.append('owner = %s')
            params.append(filters['owner'])
        
        if where_conditions:
            query += " WHERE " + " AND ".join(where_conditions)
            cursor.execute(query,tuple(params))
            return True
        return False

