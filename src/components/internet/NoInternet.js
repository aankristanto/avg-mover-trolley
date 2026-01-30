import React from 'react';
import './noInternet.css';

const NoInternet = () => {
  return (
    <div className="no-internet-container">
      <img src="https://t90181568181.p.clickup-attachments.com/t90181568181/21f8283a-6a22-4fd3-a0a4-c2927e4c4652/no-internet-connection-illustration-svg-download-png-5875082.webp?view=open" className='no-internet-img' alt="No internet" />
      <h1 className="no-internet-title">Connection lost...</h1>
      <p className="no-internet-subtitle">Kayaknya koneksinya lagi putus nih <br /> Coba dicek dulu Wi-Fi atau internetnya ya. Kalau sudah lancar, datanya bakal muncul sendiri kok</p>
    </div>
  );
};

export default NoInternet;