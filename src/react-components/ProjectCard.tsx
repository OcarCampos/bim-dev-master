import * as React from 'react';
import { Project } from '../classes/Project';

//Prop interface with the data we will pass to the component
interface Props {
    project: Project;
}

//Component to render a project card
//It receives the prop interface with the project to display data.
export function ProjectCard(props: Props) {
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
                { props.project.initials }
                </p>
                <div>
                <h5>
                    { props.project.name }
                </h5>
                <p>
                    { props.project.description }
                </p>
                </div>
            </div>
            <div className="card-content">
                <div className="card-property">
                <p style={{ color: "#969696" }}>Status</p>
                <p>
                    { props.project.status }
                </p>
                </div>
                <div className="card-property">
                <p style={{ color: "#969696" }}>Role</p>
                <p>
                    { props.project.userRole } 
                </p>
                </div>
                <div className="card-property">
                <p style={{ color: "#969696" }}>Cost</p>
                <p>
                    ${ props.project.cost } 
                </p>
                </div>
                <div className="card-property">
                <p style={{ color: "#969696" }}>Estimated Progress</p>
                <p>
                    { props.project.progress }%
                </p>
                </div>
            </div>
        </div>

    );
}