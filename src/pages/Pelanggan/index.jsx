import React, { useState, useEffect } from 'react';
import TopBar from '../../components/TopBar';
import SideBar from '../../components/SideBar';
import axios from 'axios';
import './pelanggan.css';

const PelangganPage = () => {
    const [pelangganData, setPelangganData] = useState(null);
    const [tarifOptions, setTarifOptions] = useState([]);
    const [editingPelanggan, setEditingPelanggan] = useState(null);
    const [message, setMessage] = useState('');
    const customerId = localStorage.getItem('customerId');

    useEffect(() => {
        if (customerId) {
            fetchPelangganData(customerId);
            fetchTarifOptions();
        }
    }, [customerId]);

    const fetchPelangganData = (id) => {
        axios
            .get(`http://localhost:9000/pelanggan/${id}`)
            .then((response) => {
                setPelangganData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching pelanggan data:', error);
            });
    };

    const fetchTarifOptions = () => {
        axios
            .get('http://localhost:9000/tarif')
            .then((response) => {
                setTarifOptions(response.data);
            })
            .catch((error) => {
                console.error('Error fetching tarif options:', error);
            });
    };

    const handleEditPelanggan = (pelanggan) => {
        setEditingPelanggan(pelanggan);
        setMessage('');
    };

    const handleCancelEdit = () => {
        setEditingPelanggan(null);
        setMessage('');
    };

    const handleUpdatePelanggan = () => {
        if (!editingPelanggan.nomor_kwh || !editingPelanggan.nama_pelanggan || !editingPelanggan.alamat || !editingPelanggan.id_tarif) {
            alert('Semua bagian harus diisi');
            return;
        }

        // if (editingPelanggan.nomor_kwh.length !== 10) {
        //     alert('Nomor KWH harus memiliki panjang 10 karakter');
        //     return;
        // }

        axios
            .put(`http://localhost:9000/pelanggan/${editingPelanggan.id_pelanggan}`, editingPelanggan)
            .then(() => {
                fetchPelangganData(customerId);
                alert('Update data pelanggan berhasil');
                setEditingPelanggan(null);
            })
            .catch((error) => {
                console.error('Error updating pelanggan:', error);
                alert('Gagal mengupdate data pelanggan');
            });
    };

    return (
        <>
            <TopBar pageTitle="Pelanggan" user={customerId} />
            <SideBar />

            <div className="pelanggan-container">
                {pelangganData ? (
                    <>
                        <div className="table-responsive">
                            <h3>Informasi Pelanggan</h3>
                            <table className="table table-pelanggan">
                                <thead>
                                    <tr>
                                        <th>ID Pelanggan</th>
                                        <th>Nomor KWH</th>
                                        <th>Nama Pelanggan</th>
                                        <th>Alamat</th>
                                        <th>Daya</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr key={pelangganData.id_pelanggan}>
                                        <td>{pelangganData.id_pelanggan}</td>
                                        <td>{pelangganData.nomor_kwh}</td>
                                        <td>{pelangganData.nama_pelanggan}</td>
                                        <td>{pelangganData.alamat}</td>
                                        <td>{pelangganData.id_tarif} VA</td>
                                        <td>
                                            {editingPelanggan ? (
                                                <button onClick={handleCancelEdit}>Cancel</button>
                                            ) : (
                                                <button onClick={() => handleEditPelanggan(pelangganData)}>Edit</button>
                                            )}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Form Edit Pelanggan */}
                        {editingPelanggan && (
                            <div className="edit-pelanggan-form">
                                <h3>Edit Pelanggan</h3>
                                <p>{message}</p>
                                <form>
                                    <div className="form-group">
                                        <label>Nomor KWH:</label>
                                        <input type="number" value={editingPelanggan.nomor_kwh} onChange={(e) => setEditingPelanggan({ ...editingPelanggan, nomor_kwh: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label>Nama Pelanggan:</label>
                                        <input type="text" value={editingPelanggan.nama_pelanggan} onChange={(e) => setEditingPelanggan({ ...editingPelanggan, nama_pelanggan: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label>Alamat:</label>
                                        <input type="text" value={editingPelanggan.alamat} onChange={(e) => setEditingPelanggan({ ...editingPelanggan, alamat: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label>Daya:</label>
                                        <select value={editingPelanggan.id_tarif} onChange={(e) => setEditingPelanggan({ ...editingPelanggan, id_tarif: parseInt(e.target.value) })}>
                                            <option value="">Pilih Tarif</option>
                                            {tarifOptions.map((tarif) => (
                                                <option key={tarif.id_tarif} value={tarif.id_tarif}>
                                                    {tarif.daya} VA
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <button type="button" onClick={handleUpdatePelanggan}>Update</button>
                                </form>
                            </div>
                        )}
                    </>
                ) : (
                    <div>Loading...</div>
                )}
            </div>
        </>
    );
};

export default PelangganPage;
