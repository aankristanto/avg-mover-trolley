import React from 'react';
import './noInternet.css';
import Ilustration from './Ilustration';

const NoInternet = () => {
  return (
    <div className="no-internet-container">
      <Ilustration />
      <h1 className="no-internet-title" style={{marginTop: 20}}>Connection lost...</h1>
      <p className="no-internet-subtitle">Kayaknya koneksinya lagi putus nih <br /> Coba dicek dulu Wi-Fi atau internetnya ya. Kalau sudah lancar, datanya bakal muncul sendiri kok</p>
    </div>
  );
};

export default NoInternet;