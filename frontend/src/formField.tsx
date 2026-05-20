// form field layout
import React from 'react';
import "./formField.css"

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    subtext?: string;
    className?: string;
}

    function FormField({ label, subtext, className = '', ...rest }: FormFieldProps) {
    return (
        <div className={`form-group ${className}`}>
        <label>
            {label} {subtext && <span>({subtext})</span>}
        </label>
        <input {...rest} />
        </div>
    );
}

export default FormField;