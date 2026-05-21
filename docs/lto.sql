-- INITIALIZATION OF DATABASE LTO
CREATE DATABASE IF NOT EXISTS LTO;
USE LTO;

-- CREATING TABLES

CREATE TABLE driver(
    license_number CHAR(13) PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    address TEXT NOT NULL,
    license_type VARCHAR(20) NOT NULL,
    sex CHAR(1) NOT NULL,
    date_of_birth DATE NOT NULL,
    date_issued DATE NOT NULL DEFAULT (CURDATE()),
    date_expired DATE AS (DATE_ADD(date_issued, INTERVAL 10 YEAR)) PERSISTENT,
    license_status VARCHAR(20) NOT NULL DEFAULT 'Valid'
);

CREATE TABLE vehicle(
    plate_number VARCHAR(20) PRIMARY KEY,
    engine_number VARCHAR(30) UNIQUE NOT NULL,
    chassis_number VARCHAR(30) UNIQUE NOT NULL,
    vehicle_type VARCHAR(30),
    make VARCHAR(30) NOT NULL,
    model VARCHAR(30) NOT NULL,
    color VARCHAR(20) NOT NULL,
    year_manufactured YEAR NOT NULL,
    owner VARCHAR(13) DEFAULT NULL,
    CONSTRAINT owner_fk
        FOREIGN KEY(owner) REFERENCES driver(license_number)
        ON UPDATE CASCADE
);

CREATE TABLE vehicle_registration(
    registration_number INT AUTO_INCREMENT PRIMARY KEY,
    registration_date DATE NOT NULL DEFAULT curdate(),
    expiration_date DATE NOT NULL DEFAULT (DATE_ADD(registration_date, INTERVAL 5 YEAR)),
    registration_status VARCHAR(20) DEFAULT 'Active',
    history TEXT,
    plate_number VARCHAR(20) NOT NULL,
    license_number CHAR(13) NOT NULL,
    CONSTRAINT vehiclereg_license_fk
        FOREIGN KEY (license_number) REFERENCES driver(license_number)
        ON UPDATE CASCADE,
    CONSTRAINT vehiclereg_platenum_fk
        FOREIGN KEY (plate_number) REFERENCES vehicle(plate_number)
        ON UPDATE CASCADE
);

CREATE TABLE traffic_violation(
    violation_ticket_num INT(10) AUTO_INCREMENT PRIMARY KEY,
    violation_date DATE NOT NULL DEFAULT CURDATE(),
    violation_type VARCHAR(50) NOT NULL,
    location TEXT NOT NULL,
    violation_status VARCHAR(20) NOT NULL DEFAULT 'Unpaid',
    apprehending_officer VARCHAR(150) NOT NULL,
    fine_amount DECIMAL(10,2) NOT NULL,
    license_number CHAR(13),
    plate_number VARCHAR(20),
    CONSTRAINT license_number_fk
        FOREIGN KEY (license_number) REFERENCES driver(license_number),
    CONSTRAINT plate_number_fk
        FOREIGN KEY (plate_number) REFERENCES vehicle(plate_number)
);

-- INITIALIZING VALUES

INSERT INTO driver (
    license_number, full_name, address, license_type, sex, date_of_birth, date_issued, license_status
) VALUES
('N01-10-111111', 'Juan Q. Publico', 'Brgy. San Jose, Dasmarinas, Cavite', 'Non-Professional', 'M', '1992-05-14', '2022-05-14', 'Valid'),
('N02-20-222222', 'Maria Clara Santos', 'Poblacion, Los Banos, Laguna', 'Professional', 'F', '1988-11-20', '2020-11-20', 'Valid'),
('N03-30-333333', 'Ricardo D. Dalisay', 'San Antonio, Makati City', 'Non-Professional', 'M', '2000-01-10', '2023-02-15', 'Valid'),
('N04-40-444444', 'Elena G. Moretti', 'Batong Malake, Los Banos, Laguna', 'Student Permit', 'F', '2006-09-30', '2024-03-01', 'Valid'),
('N05-50-555555', 'Antonio P. Luna', 'Salitran II, Dasmarinas, Cavite', 'Professional', 'M', '1975-06-12', '2014-06-12', 'Suspended'),
('N06-60-666666', 'Mary D. Padilla', 'Paliparan II, Dasmarinas, Cavite', 'Student', 'F', '1975-06-12', '2014-06-12', 'Expired');

INSERT INTO vehicle VALUES
('ABC 1234', 'ENG-101010', 'CHAS-A1B2C3D4E5', 'Private Car', 'Toyota', 'Vios', 'Silver', 2021, 'N01-10-111111'),
('XYZ 5678', 'ENG-202020', 'CHAS-F6G7H8I9J0', 'Private Car', 'Mitsubishi', 'Montero', 'Black', 2023, 'N02-20-222222'),
('LTO 9999', 'ENG-303030', 'CHAS-K1L2M3N4O5', 'Private Car', 'Honda', 'Brio', 'Red', 2022, 'N01-10-111111'),
('PH 2024', 'ENG-404040', 'CHAS-P6Q7R8S9T0', 'Motorcycle', 'Yamaha', 'Mio', 'Blue', 2024, 'N04-40-444444'),
('MC 0001', 'ENG-505050', 'CHAS-U1V2W3X4Y5', 'Public Utility Vehicle', 'Ford', 'Transit', 'White', 2020, 'N05-50-555555');

INSERT INTO vehicle_registration (
    registration_date, expiration_date, registration_status, history, plate_number, license_number
) VALUES
('2021-06-01', '2026-06-01', 'Active', '2021-06-01', 'ABC 1234', 'N01-10-111111'),
('2023-12-15', '2028-12-15', 'Active', '2023-12-15', 'XYZ 5678', 'N02-20-222222'),
('2022-03-20', '2023-03-20', 'Expired', '2022-03-20; 2017-03-20', 'LTO 9999', 'N01-10-111111'),
('2024-04-10', '2029-04-10', 'Active', '2024-04-10', 'PH 2024', 'N04-40-444444'),
('2020-07-01', '2021-07-01', 'Expired', '2020-07-01; 2015-07-01', 'MC 0001', 'N05-50-555555');

INSERT INTO traffic_violation (
    violation_date, violation_type, location, violation_status, apprehending_officer, fine_amount, license_number, plate_number
) VALUES
('2026-01-15', 'Overspeeding', 'SLEX Southbound, Binan', 'Paid', 'Bautista, Ryan', 1500.00, 'N01-10-111111', 'ABC 1234'),
('2026-02-10', 'Illegal Parking', 'Aguinaldo Hwy, Dasmarinas', 'Unpaid', 'Garcia, Juan', 500.00, 'N05-50-555555', 'MC 0001'),
('2026-03-05', 'No Helmet', 'Grove, Los Banos', 'Unpaid', 'Serrano, Mark', 1000.00, 'N04-40-444444', 'PH 2024'),
('2026-04-12', 'Reckless Driving', 'Ayala Ave, Makati', 'Paid', 'Lopez, Chris', 2000.00, 'N03-30-333333', 'LTO 9999'),
('2026-04-20', 'Disregarding Traffic Sign', 'Governor''s Drive, Dasmarinas', 'Unpaid', 'Garcia, Juan', 1000.00, 'N01-10-111111', 'LTO 9999');

-- REPORTING OBJECTS

CREATE OR REPLACE VIEW registered_driver_report AS
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
FROM driver;

CREATE OR REPLACE VIEW expired_or_suspended_license_report AS
SELECT
    license_number,
    full_name,
    license_type,
    license_status,
    date_issued,
    date_expired
FROM driver
WHERE license_status IN ('Expired', 'Suspended')
   OR date_expired < CURDATE();

CREATE OR REPLACE VIEW violation_vehicle_report AS
SELECT
    tv.violation_ticket_num,
    tv.violation_date,
    tv.violation_type,
    tv.location,
    tv.violation_status,
    tv.fine_amount,
    v.plate_number,
    v.vehicle_type,
    v.make,
    v.model,
    v.color,
    d.license_number,
    d.full_name AS owner_name
FROM traffic_violation tv
JOIN vehicle v ON v.plate_number = tv.plate_number
LEFT JOIN driver d ON d.license_number = v.owner;

DELIMITER //

DROP PROCEDURE IF EXISTS report_vehicles_by_driver//
CREATE PROCEDURE report_vehicles_by_driver(IN p_license_number CHAR(13))
BEGIN
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
    WHERE d.license_number = p_license_number
    ORDER BY v.plate_number;
END//

DROP PROCEDURE IF EXISTS report_expired_registrations//
CREATE PROCEDURE report_expired_registrations(IN p_as_of_date DATE)
BEGIN
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
    WHERE vr.expiration_date < p_as_of_date
    ORDER BY vr.expiration_date ASC;
END//

DROP PROCEDURE IF EXISTS report_driver_violations_by_range//
CREATE PROCEDURE report_driver_violations_by_range(
    IN p_license_number CHAR(13),
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
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
    WHERE tv.license_number = p_license_number
      AND tv.violation_date BETWEEN p_start_date AND p_end_date
    ORDER BY tv.violation_date DESC;
END//

DROP PROCEDURE IF EXISTS report_violation_type_totals//
CREATE PROCEDURE report_violation_type_totals(IN p_year INT)
BEGIN
    SELECT
        violation_type,
        COUNT(*) AS violation_count,
        SUM(fine_amount) AS total_fines
    FROM traffic_violation
    WHERE YEAR(violation_date) = p_year
    GROUP BY violation_type
    ORDER BY violation_count DESC, violation_type;
END//

DROP PROCEDURE IF EXISTS report_vehicles_in_violations_by_area//
CREATE PROCEDURE report_vehicles_in_violations_by_area(IN p_area VARCHAR(150))
BEGIN
    SELECT DISTINCT
        plate_number,
        vehicle_type,
        make,
        model,
        color,
        license_number,
        owner_name,
        violation_type,
        violation_date,
        location
    FROM violation_vehicle_report
    WHERE location LIKE CONCAT('%', p_area, '%')
    ORDER BY violation_date DESC, plate_number;
END//

DELIMITER ;
