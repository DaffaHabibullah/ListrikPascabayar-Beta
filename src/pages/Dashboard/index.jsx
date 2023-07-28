import React, { useState, useEffect } from 'react';
import TopBar from '../../components/TopBar';
import SideBar from '../../components/SideBar';
import axios from 'axios';
import './dashboard.css';
import TarifTable from '../../tables/tarif'; // Import the TarifTable component
import PenggunaanTable from '../../tables/penggunaan'; // Import the PenggunaanTable component

const LoadingIndicator = () => <div>Loading...</div>;

const DashboardPage = ({ user }) => {
    const [tarifData, setTarifData] = useState([]);
    const [penggunaanData, setPenggunaanData] = useState([]);
    const [loadingTarif, setLoadingTarif] = useState(true);
    const [loadingPenggunaan, setLoadingPenggunaan] = useState(true);

    // Ambil 'customerId' dari localStorage
    const customerId = localStorage.getItem('customerId');

    useEffect(() => {
        fetchTarifData();
        fetchPenggunaanData(customerId);
    }, [customerId]);

    const fetchTarifData = () => {
        axios
            .get('http://localhost:9000/tarif')
            .then((response) => {
                setTarifData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching tarif data:', error);
            })
            .finally(() => {
                setLoadingTarif(false);
            });
    };

    const fetchPenggunaanData = (customerId) => {
        axios
            .get(`http://localhost:9000/penggunaan/pelanggan/${customerId}`)
            .then((response) => {
                setPenggunaanData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching penggunaan data:', error);
            })
            .finally(() => {
                setLoadingPenggunaan(false);
            });
    };

    // Log the customerId to console
    console.log('customerId:', customerId);

    return (
        <>
            <TopBar pageTitle="Dashboard" user={user} />
            <SideBar />
            <div className="dashboard-container">
                <h2>Welcome {user}</h2>

                <div className="table-container">
                    {loadingTarif && loadingPenggunaan && <LoadingIndicator />}

                    {!loadingTarif && tarifData.length > 0 && (
                        <div className="table-tarif">
                            <TarifTable tarifData={tarifData} />
                        </div>
                    )}

                    {!loadingPenggunaan && penggunaanData.length > 0 && (
                        <div className="table-user">
                            <PenggunaanTable penggunaanData={penggunaanData} />
                        </div>
                    )}

                    {!loadingTarif && !loadingPenggunaan && customerId === null && (
                        <p>No customer ID available.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default DashboardPage;
