import React, { useContext } from 'react'; // Import useContext
import './topbar.css';
import { AppContext } from '../../AppContext';

const TopBar = ({ pageTitle }) => {
    const { user } = useContext(AppContext);
    return (
        <nav className="navbar navbar-dark bg-dark">
            <span className="navbar-brand">{pageTitle}</span>
            {user && <span className="navbar-text">User: {user}</span>}
            <button className='button-logout'>
                <a href="/login">Logout</a>
            </button>
        </nav>
    );
};

export default TopBar;
