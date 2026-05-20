# LTOProject
A Land Transportation Office (LTO) Information Management System handling drivers, vehicle registrations, and traffic violations. It simulates real-world operations with a strict focus on normalized database design, data integrity, and efficient query processing.

# LTO Information Management System

[cite_start]This project is a Land Transportation Office (LTO) Information Management System designed to support the recording and management of drivers, motor vehicles, registrations, and traffic violations in the Philippines. 

[cite_start]Developed as a core project for CMSC 127 (File Processing and Database Systems) at the University of the Philippines Los Baños [cite: 1, 4][cite_start], the system simulates a simplified version of real-world LTO operations. [cite_start]The primary objective is to implement a highly robust and normalized database, emphasizing data integrity and efficient query processing.

### Core Features
* [cite_start]**Driver & Vehicle Management:** Complete CRUD operations for driver records (including license types and statuses) and vehicle details, associating each vehicle with its registered owner[cite: 24, 25, 29, 31].
* [cite_start]**Registration Tracking:** Monitors vehicle registrations, renewals, and expiration statuses, maintaining a full registration history per vehicle[cite: 33, 34].
* [cite_start]**Violation Management:** Records traffic violations, tracking fine amounts, dates, locations, and payment statuses across multiple drivers and vehicles[cite: 36, 37].
* [cite_start]**Custom Reporting:** Features advanced SQL-based reporting to filter drivers by license status, identify expired vehicle registrations, and track violation trends by city or year[cite: 39, 40, 43, 44].

### Technical Stack & Constraints
* [cite_start]**Database:** MySQL, MariaDB, or PostgreSQL[cite: 19].
* [cite_start]**Architecture Constraints:** Built entirely using raw SQL and core programming languages, strictly without the use of external database management frameworks or libraries[cite: 19, 20].
