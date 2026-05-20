import Select, { type SingleValue } from 'react-select';
import { useEffect, useState } from 'react';
import { customSelectStyles } from '../../style/dropdownStyle';
import { violationApi } from '../../api/ltoApi';
import FormField from '../../formField';
import "./updateViolation.css";

interface OptionType { value: string; label: string; }

interface UpdateViolationProps {
    runKey?: number;
}

const violationStatusOptions: OptionType[] = [
    { value: "Unpaid", label: "Unpaid" },
    { value: "Paid", label: "Paid" },
    { value: "Contested", label: "Contested" },
];

function UpdateViolation({ runKey = 0 }: UpdateViolationProps) {
    const [ticketNumber, setTicketNumber] = useState('');
    const [status, setStatus] = useState<SingleValue<OptionType>>(null);
    const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleRun = async () => {
        setLoading(true);
        setMessage(null);

        if (!ticketNumber || !status) {
            setMessage({ text: 'Enter a ticket number and choose a new violation status.', ok: false });
            setLoading(false);
            return;
        }

        try {
            await violationApi.updateStatus(Number(ticketNumber), status.value);
            setMessage({ text: 'Violation status updated successfully.', ok: true });
        } catch (err) {
            setMessage({ text: err instanceof Error ? err.message : 'Violation update failed', ok: false });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (runKey > 0) {
            queueMicrotask(() => {
                void handleRun();
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [runKey]);

    return (
        <>
            <div className='violation'>
                <div>
                    <div className='update-violation'>
                        <h2>Update Traffic Violation</h2>
                    </div>
                    <h4>Violation Status</h4>
                    <Select
                        options={violationStatusOptions}
                        value={status}
                        onChange={(newValue) => setStatus(newValue as SingleValue<OptionType>)}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        styles={customSelectStyles<OptionType>()}
                    />
                </div>

                <div>
                    <div className='where-violation'>
                        <h2>Where</h2>
                    </div>
                    <FormField
                        label="Violation Ticket Number"
                        type="number"
                        value={ticketNumber}
                        onChange={(event) => setTicketNumber(event.target.value)}
                    />
                </div>
            </div>
            {loading && <p style={{ padding: '1rem' }}>Updating violation...</p>}
            {message && <p style={{ padding: '1rem', color: message.ok ? 'green' : 'red' }}>{message.text}</p>}
            <hr style={{marginTop:"20px"}}/>
        </>
    );
}

export default UpdateViolation;
