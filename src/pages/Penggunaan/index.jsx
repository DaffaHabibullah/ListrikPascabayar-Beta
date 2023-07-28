import React, { useState, useEffect } from 'react';
import TopBar from '../../components/TopBar';
import SideBar from '../../components/SideBar';
import axios from 'axios';
import './penggunaan.css';

const LoadingIndicator = () => <div>Loading...</div>;

const PenggunaanPage = ({ user }) => {
    const [penggunaanData, setPenggunaanData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formError, setFormError] = useState(null);
    const [formData, setFormData] = useState({
        bulan: '',
        tahun: '',
        meter_awal: '',
        meter_akhir: '',
    });
    const customerId = localStorage.getItem('customerId');

    useEffect(() => {
        if (customerId) {
            fetchPenggunaanData(customerId);
        }
    }, [customerId]);

    const fetchPenggunaanData = (customerId) => {
        axios
            .get(`http://localhost:9000/penggunaan/pelanggan/${customerId}`)
            .then((response) => {
                setPenggunaanData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching penggunaan data:', error);
                setLoading(false); // Make sure to set loading to false in case of an error
            });
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (loading) {
            return; // Prevent form submission when the form is in a loading state
        }

        // Client-side form validation
        if (!formData.bulan || !formData.tahun || !formData.meter_awal || !formData.meter_akhir) {
            setFormError('All fields are required.');
            return;
        }

        setFormError(null);
        setLoading(true);

        axios
            .post(`http://localhost:9000/penggunaan/pelanggan/${customerId}`, formData)
            .then((response) => {
                console.log(response.data);
                alert('Data penggunaan berhasil ditambahkan!');
                setFormData({
                    bulan: '',
                    tahun: '',
                    meter_awal: '',
                    meter_akhir: '',
                });
                fetchPenggunaanData(customerId);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error adding penggunaan:', error);
                alert('Gagal menambahkan data penggunaan');
                setLoading(false);
            });
    };

    // Daftar pilihan bulan dan tahun
    const bulanOptions = [
        { value: 'January', label: 'January' },
        { value: 'February', label: 'February' },
        { value: 'March', label: 'March' },
        { value: 'April', label: 'April' },
        { value: 'May', label: 'May' },
        { value: 'June', label: 'June' },
        { value: 'July', label: 'July' },
        { value: 'August', label: 'August' },
        { value: 'September', label: 'September' },
        { value: 'October', label: 'October' },
        { value: 'November', label: 'November' },
        { value: 'December', label: 'December' },
        // Tambahkan bulan-bulan lainnya sesuai kebutuhan
    ];

    const tahunOptions = [
        { value: '2023', label: '2023' },
        { value: '2024', label: '2024' },
        // Tambahkan tahun-tahun lainnya sesuai kebutuhan
    ];

    return (
        <>
            <TopBar pageTitle="Penggunaan" user={user} />
            <SideBar />
            <div className="penggunaan-container">
                <h2>Penggunaan Daya Anda</h2>
                {loading ? (
                    <LoadingIndicator />
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID Penggunaan</th>
                                <th>Nama Pelanggan</th>
                                <th>Bulan</th>
                                <th>Tahun</th>
                                <th>Meter Awal</th>
                                <th>Meter Akhir</th>
                            </tr>
                        </thead>
                        <tbody>
                            {penggunaanData.map((penggunaan) => (
                                <tr key={penggunaan.id_penggunaan}>
                                    <td>{penggunaan.id_penggunaan}</td>
                                    <td>{penggunaan.nama_pelanggan}</td>
                                    <td>{penggunaan.bulan}</td>
                                    <td>{penggunaan.tahun}</td>
                                    <td>{penggunaan.meter_awal}</td>
                                    <td>{penggunaan.meter_akhir}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <h2>Add New Penggunaan Daya</h2>
                <form onSubmit={handleSubmit}>
                    <label>Bulan</label>
                    <select
                        name="bulan"
                        value={formData.bulan}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Pilih Bulan</option>
                        {bulanOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <label>Tahun</label>
                    <select
                        name="tahun"
                        value={formData.tahun}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Pilih Tahun</option>
                        {tahunOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <label>Meter Awal</label>
                    <input
                        type="number"
                        name="meter_awal"
                        value={formData.meter_awal}
                        onChange={handleChange}
                        required
                    />

                    <label>Meter Akhir</label>
                    <input
                        type="number"
                        name="meter_akhir"
                        value={formData.meter_akhir}
                        onChange={handleChange}
                        required
                    />

                    {formError && <p style={{ color: 'red' }}>{formError}</p>}

                    <button type="submit">Submit</button>
                </form>
            </div>
        </>
    );
};

export default PenggunaanPage;
