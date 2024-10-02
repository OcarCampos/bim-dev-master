import * as React from 'react';
import { ProjectStatus, UserRole, IProject } from '../classes/Project';
import { ProjectsManager } from '../classes/ProjectsManager';

export function ProjectsPage() {
    //Projects manager
    const projectsManager = new ProjectsManager();
    
    //Function to handle the click on the new project button
    const onNewProjectClick = () => {
        const modal = document.getElementById('new-project-modal');
        if (modal && modal instanceof HTMLDialogElement) {
            modal.showModal();
        } else {
            console.warn("The provided modal wasn't found.");
        }   
    }

    //Function to handle the submit of the new project form
    const onNewProjectSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        const projectForm = document.getElementById('new-project-form');
        if (projectForm && projectForm instanceof HTMLFormElement) {
            event.preventDefault();
            const formData = new FormData(projectForm);
            //Object with the project data from the form
            const projectData: IProject = {
                name: formData.get("name") as string, 
                description: formData.get("description") as string, 
                status: formData.get("status") as ProjectStatus, 
                userRole: formData.get("userRole") as UserRole,
                finishDate: new Date(formData.get("finishDate") as string),
                cost: Number(formData.get("cost")) || 0, 
                progress: Number(formData.get("progress")) || 0, 
                todos: []
            };
            try {
                const project = projectsManager.newProject(projectData); //Creates a new project.
                console.log(project);
                projectForm.reset();
                const modal = document.getElementById('new-project-modal');
                if (modal && modal instanceof HTMLDialogElement) {
                    modal.close();
                } else {
                    console.warn("The provided modal wasn't found.");
                }   
            } catch (err) {
                console.error(err);
            }
        }
    }

    //Function to handle the cancel button click when creating a new project
    const onCancelClick = (id: string) => {
        const modal = document.getElementById(id);
        if (modal && modal instanceof HTMLDialogElement) {
            modal.close();
        } else {
            console.warn("The provided modal wasn't found.");
        }   
    }

    //Function to handle the click on the import projects button
    //use projectsManager.importFromJSON(); to upload projects from a JSON file
    const onImportProjectsClick = () => {
        projectsManager.importFromJSON();
    }

    //Function to handle the click on the export projects button
    //use projectsManager.exportToJSON(); to export the projects to a JSON file
    const onExportProjectsClick = () => {
        projectsManager.exportToJSON();
    }
    

    return (
        //Project's page
        <div className="page" id="projects-page" style={{display: 'flex'}}>
                {/* New project modal */}
                <dialog id="new-project-modal">
                    {/* New project form */}
                    <form onSubmit={(e) => onNewProjectSubmit(e)} id="new-project-form">
                        {/* Title of the form */}
                        <h2>Add a new project</h2>
                        {/* Input list */}
                        <div className="input-list">
                        {/* Name input */}
                        <div className="form-field-container">
                            <label><span className="material-icons-round">apartment</span>Project Name</label>
                            <input name="name" type="text" placeholder="Awesome Example Project" />
                            <p style={{color: 'gray', fontSize: 'var(--font-sm)', marginTop: '5px', fontStyle: 'italic'}}>Name must be short and unique</p>
                        </div>
                        {/* Description input */}
                        <div className="form-field-container">
                            <label><span className="material-icons-round">subject</span>Description</label>
                            <textarea name="description" cols={30} rows={5} placeholder="Describe your project here"></textarea>
                        </div>
                        {/* Role input */}
                        <div className="form-field-container">
                            <label><span className="material-icons-round">person</span>Role</label>
                            <select name="userRole">
                            <option>Architect</option>
                            <option>Engineer</option>
                            <option>Manager</option>
                            </select>
                        </div>
                        {/* Status input */}
                        <div className="form-field-container">
                            <label><span className="material-icons-round">not_listed_location</span>Status</label>
                            <select name="status">
                            <option>Pending</option>
                            <option>Active</option>
                            <option>Finished</option>
                            </select>
                        </div>
                        {/* Finish date input */}
                        <div className="form-field-container">
                            <label htmlFor="finishDate">
                            <span className="material-icons-round">calendar_month</span>
                            Finish Date
                            </label>
                            <input name="finishDate" type="date" id="finishDateInput"></input>
                        </div>
                        {/* Buttons */}
                        <div style={{display: 'flex', margin: '10px 0px 10px auto', columnGap: '10px'}}>
                            <button onClick={() => onCancelClick('new-project-modal')} type="button" id="cancel-new-project-btn" style={{background: 'transparent'}}>Cancel</button>
                            <button type="submit" style={{background: 'rgb(18, 145, 18)'}}>Accept</button>
                        </div>
                        </div>
                    </form>
                </dialog>
                {/* Header of the projects page */}
                <header>
                    {/* Title of the page */}
                    <h2>Projects List</h2>
                    {/* Actions of the page */}
                    <div style={{display: 'flex', alignItems: 'center', columnGap: '15px'}}>
                        <span onClick={onImportProjectsClick} id="import-projects-btn" className="material-icons-round action-icon">file_upload</span>
                        <span onClick={onExportProjectsClick} id="export-projects-btn" className="material-icons-round action-icon">file_download</span>
                        <button onClick={onNewProjectClick} id="new-project-btn"><span className="material-icons-round">add</span>New Project</button>
                    </div>
                </header>
                {/* Projects list */}
                <div id="projects-list">
                    {/* Projects are filled in dynamically here using JS */}
                </div>
        </div>
    );
}

