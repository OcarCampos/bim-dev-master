import * as React from 'react';

export function Sidebar() {
    return (
        // Sidebar of the page
        <aside id="sidebar">
            {/* Company logo */}
            <img id="company-logo" src="./assets/company-logo.svg" alt="Construction Company" />
            {/* Sidebar buttons */}
            <ul id="nav-buttons">
                <li id="projects-btn"><span className="material-icons-round">apartment</span>Project List</li>
                <li id="users-btn"><span className="material-icons-round">people</span>Users List</li>
            </ul>
        </aside>
    );
}


