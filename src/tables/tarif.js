import React from 'react';

const TarifTable = ({ tarifData }) => (
    <div className="table-responsive">
        <h3>Tarif Listrik</h3>
        <table className="table table-tarif">
            <thead>
                <tr>
                    <th>ID Tarif</th>
                    <th>Daya</th>
                    <th>Tarif per kWh</th>
                </tr>
            </thead>
            <tbody>
                {tarifData.map((tarif) => (
                    <tr key={tarif.id_tarif}>
                        <td>{tarif.id_tarif}</td>
                        <td>{tarif.daya} VA</td>
                        <td>Rp. {tarif.tarifperkwh}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default TarifTable;
