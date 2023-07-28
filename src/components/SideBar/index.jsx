import React from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css';

const SideBar = () => {
    return (
        <div className="sidebar-container">
            <h2 className="sidebar-title">My Dashboard</h2>
            <ul className="list-group">
                <li className="list-group-item">
                    <Link to="/dashboard">Dashboard</Link>
                </li>
                <li className="list-group-item">
                    <Link to="/pelanggan">Pelanggan</Link>
                </li>
                <li className="list-group-item">
                    <Link to="/penggunaan">Penggunaan</Link>
                </li>
                <li className="list-group-item">
                    <Link to="/tagihan">Tagihan</Link>
                </li>
                <li className="list-group-item">
                    <Link to="/pembayaran">Pembayaran</Link>
                </li>
            </ul>
        </div>
    );
};

export default SideBar;
