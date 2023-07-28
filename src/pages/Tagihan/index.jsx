import React, { useState, useEffect } from 'react';
import TopBar from '../../components/TopBar';
import SideBar from '../../components/SideBar';
import axios from 'axios';
import './tagihan.css'; // Create a new CSS file for TagihanPage styles

const LoadingIndicator = () => <div>Loading...</div>;

const TagihanPage = ({ user }) => {
    const [tagihanData, setTagihanData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState(0);
    const [selectedTagihanId, setSelectedTagihanId] = useState(null); // Add state to store the selected tagihan ID

    // Get 'customerId' from localStorage
    const customerId = localStorage.getItem('customerId');

    useEffect(() => {
        if (customerId) {
            fetchTagihanData(customerId);
        }
    }, [customerId]);

    const fetchTagihanData = (customerId) => {
        axios
            .get(`http://localhost:9000/tagihan/pelanggan/${customerId}`)
            .then((response) => {
                setTagihanData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching tagihan data:', error);
                setLoading(false);
            });
    };

    // Helper function to render the status field with appropriate styling
    const renderStatus = (status) => {
        if (status === 'Sudah Bayar') {
            return <span className="status-paid">{status}</span>;
        } else {
            return <span className="status-unpaid">{status}</span>;
        }
    };

    // Handle the action when "Bayar" button is clicked
    const handleBayarClick = (tagihanId) => {
        if (showPaymentForm && selectedTagihanId === tagihanId) {
            // Jika tampilan formulir pembayaran aktif dan tombol "Bayar" pada baris tagihan tersebut diklik, tombol akan menjadi "Cancel" dan akan menutup formulir
            setShowPaymentForm(false);
            setPaymentAmount(0);
            setSelectedTagihanId(null);
        } else {
            // Jika tampilan formulir pembayaran tidak aktif atau tombol "Bayar" pada baris tagihan yang berbeda diklik, tombol akan menjadi "Bayar" dan akan menampilkan formulir
            setShowPaymentForm(true);
            setPaymentAmount(0);
            setSelectedTagihanId(tagihanId);
        }
    };

    // Handle the payment amount input change
    const handlePaymentAmountChange = (event) => {
        setPaymentAmount(Number(event.target.value));
    };

    // Handle the payment submission
    const handlePaymentSubmit = () => {
        if (selectedTagihanId === null) {
            console.error('Error: No tagihan selected.');
            return;
        }

        console.log('Payment amount:', paymentAmount);

        const paymentData = {
            total_bayar: paymentAmount,
        };

        axios
            .post(`http://localhost:9000/pembayaran/tagihan/${selectedTagihanId}`, paymentData)
            .then((response) => {
                alert('Payment tagihan successful:', response.data);
                setShowPaymentForm(false);
                fetchTagihanData(customerId);
            })
            .catch((error) => {
                alert('Error submitting payment:', error);
            });
    };

    return (
        <>
            <TopBar pageTitle="Tagihan" user={user} />
            <SideBar />
            <div className="tagihan-container">
                <h2>Tagihan Listrik Anda</h2>
                {loading ? (
                    <LoadingIndicator />
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID Tagihan</th>
                                <th>Nama Pelanggan</th>
                                <th>Bulan</th>
                                <th>Tahun</th>
                                <th>Total Pembayaran</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tagihanData.map((tagihan) => (
                                <tr key={tagihan.id_tagihan}>
                                    <td>{tagihan.id_tagihan}</td>
                                    <td>{tagihan.nama_pelanggan}</td>
                                    <td>{tagihan.bulan}</td>
                                    <td>{tagihan.tahun}</td>
                                    <td>{tagihan.jumlah_meter}</td>
                                    <td>{renderStatus(tagihan.status)}</td>
                                    <td>
                                        {showPaymentForm && selectedTagihanId === tagihan.id_tagihan ? (
                                            // Jika tampilan formulir pembayaran aktif dan tombol "Bayar" pada baris tagihan tersebut diklik, tombol akan menjadi "Cancel"
                                            <button onClick={() => handleBayarClick(tagihan.id_tagihan)}>Cancel</button>
                                        ) : tagihan.status === 'Belum Bayar' ? (
                                            // Jika tampilan formulir pembayaran tidak aktif dan tagihan belum dibayar, tombol akan menjadi "Bayar"
                                            <button onClick={() => handleBayarClick(tagihan.id_tagihan)}>Bayar</button>
                                        ) : (
                                            // Jika tagihan sudah dibayar, tidak ada tombol yang ditampilkan
                                            null
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {showPaymentForm && (
                    <div className="payment-form">
                        <h3>Payment Form</h3>
                        <form>
                            <div className="form-group">
                                <label>Masukkan pembayaran:</label>
                                <input
                                    type="number"
                                    value={paymentAmount}
                                    onChange={handlePaymentAmountChange}
                                />
                            </div>
                            <button type="button" onClick={handlePaymentSubmit}>
                                Submit Payment
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
};

export default TagihanPage;
