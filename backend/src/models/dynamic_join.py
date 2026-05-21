import re
from .schema_map import TABLE_COLUMNS, TABLE_ALIASES, determine_join_path 

# THIS IS ONLY USED FOR PAG MAY COUNT JOIN AND GROUP BY
def dynamic_query(linker, tables, selected_columns, filters, is_count=False, count_alias="Total Count", group_by_field=None, count_field=None):
    #linker
    cursor = linker.cur()

    #if empty tables tas nag run ka bigla
    if not tables:
        # Raise an explicit value error to prevent generating a broken, empty SQL statement string
        raise ValueError("At least one base table must be provided")
    
    #GENERATE FROM AND MULTI TABLE JOINS

    #extract the first table string from the array to act as the base root of the query
    primary_table = tables[0] #first table
    #initialize the FROM text clause using the true database table shorthand code alias layout map
    from_clause = f"FROM {TABLE_ALIASES[primary_table]}" #the first table with an aliad (e.g. driver d)

    #track which tables have been successfully merged so far to establish future join steps
    joined_tables = {primary_table}

    #if there are any extra tables found like more than 2 tables joining
    for extra_table in tables[1:]:
        #set a Boolean flag to verify if a valid connecting foreign key link exists
        join_found = False

        #if it is able to join
        for existing_table in joined_tables:
            #check the schema configuration path mapping to find the ON matching column criteria
            join_condition = determine_join_path(existing_table, extra_table)

            #if there is a way to link it
            if join_condition:
                #chain a join
                from_clause += f" JOIN {TABLE_ALIASES[extra_table]} ON {join_condition}"
                # adding the extra table to the joining tables
                joined_tables.add(extra_table)
                
                #set tracker to true
                join_found = True
                break
        #if no connection
        if not join_found:
            #raise an explicit value error detailing the unresolvable structural data break
            raise ValueError(f"Could not connect '{extra_table} automatically to existing query pool")
        
    #GENERATING DYNAMIC SELECT 

    #initializing select fields and group clause
    select_fields = []
    #initialize an empty string container to store the trailing GROUP BY layout block
    group_by_clause = ""

    #checks if it is count cuz hindi naman ma checheck ang group if no count
    if is_count:
        #resolve the specific database path for the target column the user manually wishes to count
        db_count_target = "*"
        
        #if the frontend specified a manual column to evaluate from their dropdown selection
        if count_field:
            #search through the active data tables to locate where that column tracking key lives
            for table in tables:
                #if the key provided matches an entry inside this specific table's schema dictionary
                if count_field in TABLE_COLUMNS[table]:
                    #extract the true database tracking path name string (e.g., 'v.plate_number')
                    db_count_target = TABLE_COLUMNS[table][count_field]
                    break

        #check if the user selected a grouping pivot categorization parameter from the dropdown
        if group_by_field:
            #create a localized empty variable tracking the actual structural database column track
            db_group_field = None
            #search through the active data tables selected for this execution query block
            for table in tables:
                #if the key matches the table's specific schema
                if group_by_field in TABLE_COLUMNS[table]:
                    #extract the database alias path string like d.full_name
                    db_group_field = TABLE_COLUMNS[table][group_by_field]
                    break
            #if the keyword safely matches a valid operational database destination path
            if db_group_field:
                #add the grouping column header name wrapped in backticks to prevent space crashes
                select_fields.append(f"{db_group_field} AS `{group_by_field}`")
                #group by the raw database path column, and order it by the manual count metric chosen
                group_by_clause = f" GROUP BY {db_group_field} ORDER BY COUNT({db_count_target}) DESC"
        
        #inject the manual user-selected column inside the COUNT function, using the custom dropdown alias label wrapped in backticks
        select_fields.append(f"COUNT({db_count_target}) AS `{count_alias}`")
           
    #ff the counting switch is false, process standard raw row individual data retrieval selection fields
    else:
        #loop through every generic column name requested by the custom column list
        for col in selected_columns:
            #cross-reference the key against the active query table pools
            for table in tables:

                #if the chosen column string exists within the current table's tracking configuration dictionary:
                if col in TABLE_COLUMNS[table]:
                    #format the selection projection string mapping the true column to its frontend header key using backticks
                    select_fields.append(f"{TABLE_COLUMNS[table][col]} AS `{col}`")
                    break
        #if the columns list input is empty and no custom column preferences were defined:
        if not select_fields:
            #default to pulling a universal multi-table raw fallback wildcard layout array
            select_fields = ["*"]

    #combine all items tracked inside the array layout, splitting them with clean comma separators
    select_clause = "SELECT " + ", ".join(select_fields)

    #GENERATE WHERE CLAUSE FILTERS 
    where_clause = ""
    query_params = []
    if filters:
        where_segments = []
        for key, value in filters.items():
            if value is None or value == "":
                continue
            db_column_path = None
            for table in tables:
                if key in TABLE_COLUMNS[table]:
                    db_column_path = TABLE_COLUMNS[table][key]
                    break
            if db_column_path:
                where_segments.append(f"{db_column_path} = %s")
                query_params.append(value)
        if where_segments:
            where_clause = " WHERE " + " AND ".join(where_segments)
    
    #weld the completed SELECT fields clause and the structural FROM join segments into a base query string
    query = f"{select_clause} {from_clause}{where_clause}"

    #attach grouping and custom count ordering rules (remains completely empty if is_count was False)
    query += group_by_clause

    cursor.execute(query, tuple(query_params))
    return cursor.fetchall()