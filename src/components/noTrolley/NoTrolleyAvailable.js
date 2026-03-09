import React from 'react';
import './noTrolleyAvailable.css';

const NoTrolleyAvailable = () => {
    return (
        <div className="no-trolley-container">
            <div className="no-trolley-card">
                <div className="no-trolley-icon">📭</div>
                <h3 className="no-trolley-title">Trolley Tidak Tersedia</h3>
                <p className="no-trolley-message">
                    Saat ini tidak ada trolley aktif di station ini
                </p>
                <div className="no-trolley-hint">
                    <small>Trolley akan muncul otomatis setelah proses staging selesai.</small>
                </div>
            </div>
        </div>
    );
};

export default NoTrolleyAvailable;