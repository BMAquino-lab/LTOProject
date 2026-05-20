# LTOProject
A Land Transportation Office (LTO) Information Management System handling drivers, vehicle registrations, and traffic violations. It simulates real-world operations with a strict focus on normalized database design, data integrity, and efficient query processing.

# LTO Information Management System

This project is a Land Transportation Office (LTO) Information Management System designed to support the recording and management of drivers, motor vehicles, registrations, and traffic violations in the Philippines.

Developed as a core project for CMSC 127 (File Processing and Database Systems) at the University of the Philippines Los Baños, the system simulates a simplified version of real-world LTO operations. The primary objective is to implement a highly robust and normalized database, emphasizing data integrity and efficient query processing.

### Core Features
* **Driver Management:** Complete CRUD operations for driver records.
* **Vehicle Management:** Complete CRUD operations for vehicle details and associating each vehicle with its registered owner.
* **Vehicle Registration Management:** Tracks registration numbers, renewal dates, and status histories per vehicle.
* **Traffic Violation Management:** Records traffic violations committed by drivers, tracking fine amounts, dates, locations, and payment statuses across multiple drivers and vehicles.
* **Custom Reporting:** Features advanced SQL-based reporting to filter drivers by license status or demographic information, identify expired vehicle registrations, and track violation trends by city or year.

### Technical Stack & Constraints
* **Database:** MySQL, MariaDB, or PostgreSQL.
* **Programming Languages:** Any language taught in CMSC 12, 21, 22, or 100.
* **Architecture Constraints:** Built entirely using raw SQL and core programming languages, strictly without the use of external database management frameworks or libraries.
