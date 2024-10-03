import * as React from 'react';

export function ProjectCard() {
    return (
        <div className="project-card">
            <div className="card-header">
                <p
                style={{
                    backgroundColor: "#FFC300",
                    padding: 10,
                    borderRadius: 8,
                    aspectRatio: 1,
                    textTransform: "uppercase"
                }}
                >
                HC
                </p>
                <div>
                <h5>
                    Project Name
                </h5>
                <p>
                    Project Description
                </p>
                </div>
            </div>
            <div className="card-content">
                <div className="card-property">
                <p style={{ color: "#969696" }}>Status</p>
                <p>
                    Project Status
                </p>
                </div>
                <div className="card-property">
                <p style={{ color: "#969696" }}>Role</p>
                <p>
                    Project User Role
                </p>
                </div>
                <div className="card-property">
                <p style={{ color: "#969696" }}>Cost</p>
                <p>
                    $10000
                </p>
                </div>
                <div className="card-property">
                <p style={{ color: "#969696" }}>Estimated Progress</p>
                <p>
                    100%
                </p>
                </div>
            </div>
        </div>

    );
}