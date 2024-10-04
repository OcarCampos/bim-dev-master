import * as React from 'react';
import * as Router from 'react-router-dom';

export function Sidebar() {
    return (
        // Sidebar of the page
        <aside id="sidebar">
            {/* Company logo */}
            <img id="company-logo" src="./assets/company-logo.svg" alt="Construction Company" />
            {/* Sidebar buttons */}
            <ul id="nav-buttons">
                <Router.Link to='/'>
                    <li id="projects-btn"><span className="material-icons-round">apartment</span>Project List</li>
                </Router.Link>
                <Router.Link to='/users'>
                    <li id="users-btn"><span className="material-icons-round">people</span>Users List</li>
                </Router.Link>               
            </ul>
        </aside>
    );
}


