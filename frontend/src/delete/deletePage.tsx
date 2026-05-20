import { useState } from 'react';
import { driverApi, registrationApi, vehicleApi, violationApi } from '../api/ltoApi';
import './deletePage.css';

type Entity = 'driver' | 'vehicle' | 'registration' | 'violation';

const entityLabels: Record<Entity, string> = {
    driver: 'Driver',
    vehicle: 'Vehicle',
    registration: 'Vehicle Registration',
    violation: 'Traffic Violation',
};

const keyLabels: Record<Entity, string> = {
    driver: 'License Number',
    vehicle: 'Plate Number',
    registration: 'Registration Number',
    violation: 'Violation Ticket Number',
};

function DeletePage() {
    const [entity, setEntity] = useState<Entity>('driver');
    const [keyValue, setKeyValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            if (!keyValue.trim()) {
                throw new Error(`${keyLabels[entity]} is required.`);
            }

            switch (entity) {
                case 'driver':
                    await driverApi.delete(keyValue.trim());
                    break;
                case 'vehicle':
                    await vehicleApi.delete(keyValue.trim());
                    break;
                case 'registration':
                    await registrationApi.delete(Number(keyValue));
                    break;
                case 'violation':
                    await violationApi.delete(Number(keyValue));
                    break;
            }

            setMessage(`${entityLabels[entity]} delete request completed.`);
            setKeyValue('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Delete failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="delete-page">
            <h1>DELETE QUERY</h1>
            <div className="delete-panel">
                <label>
                    Record Type
                    <select value={entity} onChange={(event) => setEntity(event.target.value as Entity)}>
                        <option value="driver">Driver</option>
                        <option value="vehicle">Vehicle</option>
                        <option value="registration">Vehicle Registration</option>
                        <option value="violation">Traffic Violation</option>
                    </select>
                </label>

                <label>
                    {keyLabels[entity]}
                    <input
                        value={keyValue}
                        onChange={(event) => setKeyValue(event.target.value)}
                        placeholder={keyLabels[entity]}
                    />
                </label>

                <button onClick={handleDelete} disabled={loading}>
                    {loading ? 'DELETING...' : 'DELETE'}
                </button>
            </div>

            {message && <p className="delete-success">{message}</p>}
            {error && <p className="delete-error">Error: {error}</p>}
        </div>
    );
}

export default DeletePage;
