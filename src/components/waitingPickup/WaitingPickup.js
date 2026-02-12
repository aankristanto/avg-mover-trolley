import React from 'react';
import "./waitingPickup.css"

const WaitingPickup = () => {
    return (
        <div className="waiting-agv-container">
            <div className="waiting-agv-card">
                <div className="waiting-icon">🚚</div>
                <h4 className="waiting-title">Menunggu AGV</h4>
                <p className="waiting-message">
                    Trolley ini sedang menunggu diangkut oleh AGV.
                    <br />
                    <strong>Setelah diangkut, trolley ini akan otomatis hilang dari daftar dan ganti trolley di Finished Goods kalau ada.</strong>
                </p>
            </div>
        </div>
    );
};

export default WaitingPickup;