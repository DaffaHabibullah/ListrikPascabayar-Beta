// PembayaranPage.js
import React, { useState, useEffect } from 'react';
import TopBar from '../../components/TopBar';
import SideBar from '../../components/SideBar';
import axios from 'axios';
import './pembayaran.css'; // Create a new CSS file for PembayaranPage styles

const LoadingIndicator = () => <div>Loading...</div>;

const PembayaranPage = ({ user }) => {
    const [pembayaranData, setPembayaranData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Get 'customerId' from localStorage
    const customerId = localStorage.getItem('customerId');

    useEffect(() => {
        if (customerId) {
            fetchPembayaranData(customerId);
        }
    }, [customerId]);

    const fetchPembayaranData = (customerId) => {
        axios
            .get(`http://localhost:9000/pembayaran/pelanggan/${customerId}`)
            .then((response) => {
                setPembayaranData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching pembayaran data:', error);
                setLoading(false);
            });
    };

    return (
        <>
            <TopBar pageTitle="Pembayaran" user={user} />
            <SideBar />
            <div className="pembayaran-container">
                <h2>History Pembayaran Listrik Anda</h2>
                {loading ? (
                    <LoadingIndicator />
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID Pembayaran</th>
                                <th>ID Tagihan</th>
                                <th>Nama Pelanggan</th>
                                <th>Tanggal Pembayaran</th>
                                <th>Bulan Bayar</th>
                                <th>Biaya Admin</th>
                                <th>Total Bayar</th>
                                {/* <th>ID User</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {pembayaranData.map((pembayaran) => (
                                <tr key={pembayaran.id_pembayaran}>
                                    <td>{pembayaran.id_pembayaran}</td>
                                    <td>{pembayaran.id_tagihan}</td>
                                    <td>{pembayaran.nama_pelanggan}</td>
                                    <td>{pembayaran.tanggal_pembayaran}</td>
                                    <td>{pembayaran.bulan_bayar}</td>
                                    <td>{pembayaran.biaya_admin}</td>
                                    <td>{pembayaran.total_bayar}</td>
                                    {/* <td>{pembayaran.id_user}</td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
};

export default PembayaranPage;
