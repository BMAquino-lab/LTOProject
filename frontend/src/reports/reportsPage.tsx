import { useMemo, useState } from 'react';
import { reportApi, type ReportRow } from '../api/ltoApi';
import './reportsPage.css';

type ReportKey =
    | 'registeredDrivers'
    | 'vehiclesByDriver'
    | 'expiredRegistrations'
    | 'problemLicenses'
    | 'violationsByDriverRange'
    | 'violationTypeTotals'
    | 'vehiclesInViolationsByArea';

const reportLabels: Record<ReportKey, string> = {
    registeredDrivers: 'Registered drivers by filters',
    vehiclesByDriver: 'Vehicles owned by driver',
    expiredRegistrations: 'Expired registrations as of date',
    problemLicenses: 'Expired or suspended licenses',
    violationsByDriverRange: 'Driver violations by date range',
    violationTypeTotals: 'Violation totals by type and year',
    vehiclesInViolationsByArea: 'Vehicles in violations by city or region',
};

function ReportsPage() {
    const [report, setReport] = useState<ReportKey>('registeredDrivers');
    const [licenseType, setLicenseType] = useState('');
    const [licenseStatus, setLicenseStatus] = useState('');
    const [sex, setSex] = useState('');
    const [minAge, setMinAge] = useState('');
    const [maxAge, setMaxAge] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');
    const [asOfDate, setAsOfDate] = useState(new Date().toISOString().slice(0, 10));
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [year, setYear] = useState(String(new Date().getFullYear()));
    const [area, setArea] = useState('');
    const [rows, setRows] = useState<ReportRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasRun, setHasRun] = useState(false);

    const columns = useMemo(() => {
        const firstRow = rows[0];
        return firstRow ? Object.keys(firstRow) : [];
    }, [rows]);

    const runReport = async () => {
        setLoading(true);
        setError(null);
        setHasRun(true);

        try {
            let result: { data?: ReportRow[] };

            switch (report) {
                case 'registeredDrivers':
                    result = await reportApi.registeredDrivers({
                        license_type: licenseType || undefined,
                        license_status: licenseStatus || undefined,
                        sex: sex || undefined,
                        min_age: minAge ? Number(minAge) : undefined,
                        max_age: maxAge ? Number(maxAge) : undefined,
                    });
                    break;
                case 'vehiclesByDriver':
                    result = await reportApi.vehiclesByDriver(licenseNumber);
                    break;
                case 'expiredRegistrations':
                    result = await reportApi.expiredRegistrations(asOfDate);
                    break;
                case 'problemLicenses':
                    result = await reportApi.problemLicenses();
                    break;
                case 'violationsByDriverRange':
                    result = await reportApi.violationsByDriverRange(licenseNumber, startDate, endDate);
                    break;
                case 'violationTypeTotals':
                    result = await reportApi.violationTypeTotals(Number(year));
                    break;
                case 'vehiclesInViolationsByArea':
                    result = await reportApi.vehiclesInViolationsByArea(area);
                    break;
            }

            setRows(result.data ?? []);
        } catch (err) {
            setRows([]);
            setError(err instanceof Error ? err.message : 'Report failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reports-page">
            <h1>REPORTS</h1>
            <div className="reports-toolbar">
                <label>
                    Report
                    <select value={report} onChange={(event) => setReport(event.target.value as ReportKey)}>
                        {Object.entries(reportLabels).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </label>

                {report === 'registeredDrivers' && (
                    <div className="report-fields">
                        <select value={licenseType} onChange={(event) => setLicenseType(event.target.value)}>
                            <option value="">Any license type</option>
                            <option value="Student Permit">Student Permit</option>
                            <option value="Non-Professional">Non-Professional</option>
                            <option value="Professional">Professional</option>
                        </select>
                        <select value={licenseStatus} onChange={(event) => setLicenseStatus(event.target.value)}>
                            <option value="">Any status</option>
                            <option value="Valid">Valid</option>
                            <option value="Expired">Expired</option>
                            <option value="Suspended">Suspended</option>
                            <option value="Revoked">Revoked</option>
                        </select>
                        <select value={sex} onChange={(event) => setSex(event.target.value)}>
                            <option value="">Any sex</option>
                            <option value="M">M</option>
                            <option value="F">F</option>
                        </select>
                        <input value={minAge} onChange={(event) => setMinAge(event.target.value)} placeholder="Min age" type="number" />
                        <input value={maxAge} onChange={(event) => setMaxAge(event.target.value)} placeholder="Max age" type="number" />
                    </div>
                )}

                {['vehiclesByDriver', 'violationsByDriverRange'].includes(report) && (
                    <input value={licenseNumber} onChange={(event) => setLicenseNumber(event.target.value)} placeholder="License number" />
                )}

                {report === 'expiredRegistrations' && (
                    <input value={asOfDate} onChange={(event) => setAsOfDate(event.target.value)} type="date" />
                )}

                {report === 'violationsByDriverRange' && (
                    <div className="report-fields">
                        <input value={startDate} onChange={(event) => setStartDate(event.target.value)} type="date" />
                        <input value={endDate} onChange={(event) => setEndDate(event.target.value)} type="date" />
                    </div>
                )}

                {report === 'violationTypeTotals' && (
                    <input value={year} onChange={(event) => setYear(event.target.value)} placeholder="Year" type="number" />
                )}

                {report === 'vehiclesInViolationsByArea' && (
                    <input value={area} onChange={(event) => setArea(event.target.value)} placeholder="City or region" />
                )}

                <button onClick={runReport} disabled={loading}>
                    {loading ? 'RUNNING...' : '▶RUN REPORT'}
                </button>
            </div>

            {error && <p className="reports-error">Error: {error}</p>}
            {!loading && hasRun && !error && rows.length === 0 && <p className="reports-empty">No results found.</p>}
            {columns.length > 0 && (
                <div className="reports-table-wrap">
                    <table>
                        <thead>
                            <tr>
                                {columns.map((column) => <th key={column}>{column.replaceAll('_', ' ')}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, index) => (
                                <tr key={index}>
                                    {columns.map((column) => <td key={column}>{String(row[column] ?? '')}</td>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default ReportsPage;
