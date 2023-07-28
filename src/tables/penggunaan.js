import React from 'react';

const PenggunaanTable = ({ penggunaanData }) => (
    <div className="table-responsive">
        <h3>Penggunaan Daya</h3>
        <table className="table table-penggunaan">
            <thead>
                <tr>
                    <th>ID Penggunaan</th>
                    <th>Nama Pengguna</th>
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
    </div>
);

export default PenggunaanTable;
