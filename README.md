# LTOProject

LTO Information Management System for CMSC 127. The project has three running parts:

- MariaDB database using `docs/lto.sql`
- Flask Python API bridge on `http://127.0.0.1:5001`
- Express proxy on `http://localhost:3001` plus React/Vite frontend

## Completed Scope

- Driver, vehicle, vehicle registration, and traffic violation search/insert/update/delete flows.
- SQL-based report screen covering all required project reports:
  - registered drivers filtered by license type, license status, age range, and sex
  - vehicles owned by a given driver
  - vehicles with expired registrations as of a given date
  - expired or suspended driver licenses
  - violations by driver within a date range
  - violation totals per violation type for a selected year
  - vehicles involved in violations within a city or region
- Normalized MariaDB schema, seed data, reporting views, and stored procedures in `docs/lto.sql`.

## Setup

1. Install Node.js, Python, and MariaDB.
2. Create and seed the database:

```sql
SOURCE docs/lto.sql;
```

If you do not have a local MariaDB service installed, you can run the project database with Docker:

```bash
docker run --name lto-mariadb -e MARIADB_ALLOW_EMPTY_ROOT_PASSWORD=1 -e MARIADB_DATABASE=LTO -p 3306:3306 -d mariadb:11.4
docker cp docs/lto.sql lto-mariadb:/tmp/lto.sql
docker exec lto-mariadb mariadb -uroot -e "source /tmp/lto.sql"
```

On later runs, restart the same database container with:

```bash
docker start lto-mariadb
```

3. Install backend proxy dependencies from the project root:

```bash
npm install
```

4. Install Python API dependencies:

```bash
pip install -r backend/requirements.txt
```

5. Install frontend dependencies:

```bash
cd frontend
npm install
```

6. Create `backend/src/database/sql_linker.py` from `backend/src/database/sql_linker_sample.py`, then set your MariaDB username and password. A local copy may already exist on this machine, but it is intentionally ignored by git.

## Run

Open three terminals:

```bash
python backend/src/api/bridge.py
```

```bash
npm run backend
```

```bash
cd frontend
npm run dev
```

Then open the Vite URL, usually `http://localhost:5173`.

Use the navbar to open `SELECT`, `INSERT`, `UPDATE`, `DELETE`, and `REPORTS`.

## Verify

```bash
cd frontend
npm run build
```

Python syntax check:

```bash
python -m py_compile backend/src/api/bridge.py backend/src/models/*.py
```
