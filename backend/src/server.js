import express from 'express';
import cors from 'cors';
import axios from 'axios'

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all incoming requests
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const PYTHON_API_BASE = process.env.PYTHON_API_BASE || 'http://127.0.0.1:5001/api';


// Helper function to handle the repetitive axios forwarding logic cleanly
const forwardToBridge = async (res, method, endpoint, payload = {}) => {
    try {
        const config = {
            method: method.toLowerCase(),
            url: `${PYTHON_API_BASE}${endpoint}`,
            ...(method.toUpperCase() === 'POST' ? { data: payload } : {})
        };
        
        const response = await axios(config);
        return res.status(response.status).json(response.data);
    } catch (error) {
        const statusCode = error.response ? error.response.status : 500;
        const errorData = error.response ? error.response.data : { error: error.message };
        
        return res.status(statusCode).json({
            success: false,
            message: `Failed to communicate with Python LTO bridge at ${endpoint}`,
            details: errorData
        });
    }
};

// Vehicle ==============================================================================================

//Search vehicles with dynamic filters and selected columns
app.post('/api/vehicles/search', (req, res) => {
    const { selected_columns, filters } = req.body;
    forwardToBridge(res, 'POST', '/vehicles/find', { selected_columns, filters });
});

//Insert a newly registered vehicle record
app.post('/api/vehicles/add', (req, res) => {
    const { data } = req.body;
    forwardToBridge(res, 'POST', '/vehicles/insert', { data });
});

//Update an existing vehicle's record (typos, change of specs)
app.post('/api/vehicles/edit', (req, res) => {
    const { updates, filters } = req.body;
    forwardToBridge(res, 'POST', '/vehicles/update', { updates, filters });
});

app.post('/api/vehicles/delete', (req, res) => {
    const { plate_number } = req.body;
    forwardToBridge(res, 'POST', '/vehicles/delete', { plate_number });
});

// Vehicle Registration==================================================================================

//Search vehicle registration data
app.post('/api/registrations/search', (req, res) => {
    const { selected_columns, filters } = req.body;
    forwardToBridge(res, 'POST', '/registrations/find', { selected_columns, filters });
});

//Register a new vehicle registration record
app.post('/api/registrations/add', (req, res) => {
    const { data } = req.body;
    forwardToBridge(res, 'POST', '/registrations/insert', { data });
});

//Renew or update active status of a registration
app.post('/api/registrations/renew', (req, res) => {
    const { registration_number, data } = req.body;
    forwardToBridge(res, 'POST', '/registrations/update-registration', { registration_number, data });
});

//Manually trigger dynamic expiration update script loop
app.post('/api/registrations/check-expiration', (req, res) => {
    forwardToBridge(res, 'POST', '/registrations/expire');
});

//Handle change of vehicle ownership details
app.post('/api/registrations/change-owner', (req, res) => {
    const { plate_number, new_license_number } = req.body;
    forwardToBridge(res, 'POST', '/registrations/update-owner', { plate_number, new_license_number });
});

//Find owner details using plate number
app.post('/api/registrations/owner-lookup', (req, res) => {
    const { plate_number } = req.body;
    forwardToBridge(res, 'POST', '/registrations/find-owner', { plate_number });
});

app.post('/api/registrations/delete', (req, res) => {
    const { registration_number } = req.body;
    forwardToBridge(res, 'POST', '/registrations/delete', { registration_number });
});

// Driver ===============================================================================================

//Search driver database
app.post('/api/drivers/search', (req, res) => {
    const { selected_columns, filters } = req.body;
    forwardToBridge(res, 'POST', '/drivers/find', { selected_columns, filters });
});

//Insert a completely new driver profile
app.post('/api/drivers/add', (req, res) => {
    const { data } = req.body;
    forwardToBridge(res, 'POST', '/drivers/insert', { data });
});

//Update an existing driver's attributes
app.post('/api/drivers/edit', (req, res) => {
    const { updates, filters } = req.body;
    forwardToBridge(res, 'POST', '/drivers/update', { updates, filters });
});

app.post('/api/drivers/delete', (req, res) => {
    const { license_number } = req.body;
    forwardToBridge(res, 'POST', '/drivers/delete', { license_number });
});

//Explicit endpoint to check and flag expired driver licenses
app.post('/api/drivers/check-expired-licenses', (req, res) => {
    forwardToBridge(res, 'POST', '/drivers/expire-licenses');
});

// etch all vehicles associated with a specific driver's plate query
app.post('/api/drivers/owned-vehicles', (req, res) => {
    const { license_number } = req.body;
    forwardToBridge(res, 'POST', '/drivers/find-vehicles', { license_number });
});

//Get list of drivers who do not own any vehicles currently
app.get('/api/drivers/non-owners', (req, res) => {
    forwardToBridge(res, 'POST', '/drivers/non-owners');
});

// Traffic Violation ====================================================================================

//Filter and search active traffic violations
app.post('/api/violations/search', (req, res) => {
    const { selected_columns, filters } = req.body;
    forwardToBridge(res, 'POST', '/violations/find', { selected_columns, filters });
});

//File a new traffic ticket/violation
app.post('/api/violations/file-ticket', (req, res) => {
    const { data } = req.body;
    forwardToBridge(res, 'POST', '/violations/insert', { data });
});

//Update payment or resolution status of a ticket
app.post('/api/violations/update-status', (req, res) => {
    const { violation_ticket_num, new_status } = req.body;
    forwardToBridge(res, 'POST', '/violations/update-status', { violation_ticket_num, new_status });
});

app.post('/api/violations/delete', (req, res) => {
    const { violation_ticket_num } = req.body;
    forwardToBridge(res, 'POST', '/violations/delete', { violation_ticket_num });
});

//Report tracking: Count total incidents against a single driver's license
app.post('/api/violations/report-by-driver', (req, res) => {
    const { license_number } = req.body;
    forwardToBridge(res, 'POST', '/violations/count-by-driver', { license_number });
});

//Report tracking: Count active offenses tied to a specific plate number
app.post('/api/violations/report-by-vehicle', (req, res) => {
    const { plate_number } = req.body;
    forwardToBridge(res, 'POST', '/violations/count-by-vehicle', { plate_number });
});

// Reports ============================================================================================

app.post('/api/reports/registered-drivers', (req, res) => {
    const { filters } = req.body;
    forwardToBridge(res, 'POST', '/reports/registered-drivers', { filters });
});

app.post('/api/reports/vehicles-by-driver', (req, res) => {
    const { license_number } = req.body;
    forwardToBridge(res, 'POST', '/reports/vehicles-by-driver', { license_number });
});

app.post('/api/reports/expired-registrations', (req, res) => {
    const { as_of_date } = req.body;
    forwardToBridge(res, 'POST', '/reports/expired-registrations', { as_of_date });
});

app.post('/api/reports/problem-licenses', (req, res) => {
    forwardToBridge(res, 'POST', '/reports/problem-licenses');
});

app.post('/api/reports/violations-by-driver-range', (req, res) => {
    const { license_number, start_date, end_date } = req.body;
    forwardToBridge(res, 'POST', '/reports/violations-by-driver-range', { license_number, start_date, end_date });
});

app.post('/api/reports/violation-type-totals', (req, res) => {
    const { year } = req.body;
    forwardToBridge(res, 'POST', '/reports/violation-type-totals', { year });
});

app.post('/api/reports/vehicles-in-violations-by-area', (req, res) => {
    const { area } = req.body;
    forwardToBridge(res, 'POST', '/reports/vehicles-in-violations-by-area', { area });
});

//Dynamic Join =======================================================================================
app.post('/api/query/dynamic', (res,req)=>{
    const{
        tables, 
        selected_columns, 
        filters, 
        is_count, 
        count_alias, 
        group_by_field, 
        count_field
    } = req.body;

    forwardToBridge(res, 'POST', '/query/dynamic', { 
        tables, 
        selected_columns, 
        filters, 
        is_count, 
        count_alias, 
        group_by_field, 
        count_field 
    });
});

app.listen(PORT, () => {
    console.log(`LTO proxy server running on http://localhost:${PORT}`);
});
