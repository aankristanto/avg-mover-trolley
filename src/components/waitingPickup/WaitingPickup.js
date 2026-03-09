import React from 'react';
import "./waitingPickup.css"

const WaitingPickup = () => {
    return (
        <div className="waiting-agv-container">
            <div className="waiting-agv-card">
                <div className="waiting-icon">🚚</div>
                <h4 className="waiting-title">Menunggu diangkut</h4>
                <p className="waiting-message">
                    Trolley ini sedang menunggu diangkut oleh AGV
                    <br />
                    <strong>Setelah ambil agv, trolley ini akan otomatis hilang dari daftar. terus ganti trolley di Biru kalau ada.</strong>
                </p>
            </div>
        </div>
    );
};

export default WaitingPickup;