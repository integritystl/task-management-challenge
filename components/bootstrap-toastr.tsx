import React, { useState } from 'react';

export default function BootstrapToast({ title, message }: { title: string; message: string }) {
    const [show, setShow] = useState(true);

    return (
        <div
            className={`toast position-fixed top-0 end-0 m-3 ${show ? 'show' : ''}`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            style={{
                zIndex: 1055,
                backgroundColor: '#f8f9fa',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                border: '1px solid #dee2e6',
            }}
        >
            <div
                className="toast-header"
                style={{
                    backgroundColor: 'green',
                    color: 'white',
                    borderTopLeftRadius: '8px',
                    borderTopRightRadius: '8px',
                }}
            >
                <strong className="me-auto">{title}</strong>
                <button
                    type="button"
                    className="btn-close btn-close-white"
                    data-bs-dismiss="toast"
                    aria-label="Close"
                    onClick={() => setShow(false)}
                ></button>
            </div>
            <div
                className="toast-body"
                style={{
                    fontSize: '14px', 
                    color: '#343a40', 
                }}
            >
                {message}
            </div>
        </div>
    );
}
