import * as React from 'react';
import * as Router from 'react-router-dom';

import { ProjectsManager } from '../classes/ProjectsManager';

interface Props {
    projectsManager: ProjectsManager
}

export function ProjectDetailsPage(props: Props) {
    //Router Parameters to get the id
    const routeParams = Router.useParams<{id: string}>();
    console.log('Project ID:', routeParams.id);
    const id = routeParams.id;
    if (!id){
        console.log('Given ID is not present in project list.');
        return;
    }
    //Defining the ID for the project
    const project = props.projectsManager.getProject(id);
    if (!project) { 
        console.log('Project not found in project list.');
        return;
    }

    return (
        <div>
            {/* Project details page*/}
            <div className="page" id="project-details">
                {/* Edit project modal*/}
                <dialog id="edit-project-modal">
                    <form id="edit-project-form">
                        <h2>Edit Project</h2>
                        <div className="input-list">
                            {/* Hidden input to store the project ID*/}
                            <div className="form-field-container">
                                <input id="edit-projectId" name="projectId" type="hidden" />
                            </div>
                            {/* Name input*/}
                            <div className="form-field-container">
                                <label htmlFor="edit-name">Name</label>
                                <input
                                id="edit-name"
                                name="name"
                                type="text"
                                placeholder="Awesome Example Project"
                                required
                                />
                            </div>
                            {/* Description input*/}
                            <div className="form-field-container">
                                <label htmlFor="edit-description">Description</label>
                                <textarea
                                id="edit-description"
                                name="description"
                                placeholder="Describe your project here"
                                required
                                defaultValue={""}
                                />
                            </div>
                            {/* Status input*/}
                            <div className="form-field-container">
                                <label htmlFor="edit-status">Status</label>
                                <select id="edit-status" name="status">
                                <option value="pending">pending</option>
                                <option value="active">active</option>
                                <option value="finished">finished</option>
                                </select>
                            </div>
                            {/* Role input*/}
                            <div className="form-field-container">
                                <label htmlFor="edit-userRole">User Role</label>
                                <select id="edit-userRole" name="userRole" required>
                                <option value="architect">Architect</option>
                                <option value="engineer">Engineer</option>
                                <option value="manager">Manager</option>
                                </select>
                            </div>
                            {/* Finish date input*/}
                            <div className="form-field-container">
                                <label htmlFor="edit-finishDate">Finish Date</label>
                                <input
                                id="edit-finishDate"
                                name="finishDate"
                                type="date"
                                required
                                />
                            </div>
                            {/* Cost input*/}
                            <div className="form-field-container">
                                <label htmlFor="edit-cost">Cost</label>
                                <input
                                id="edit-cost"
                                name="cost"
                                type="number"
                                placeholder={`${2542000}`}
                                required
                                />
                            </div>
                            {/* Progress input*/}
                            <div className="form-field-container">
                                <label htmlFor="edit-progress">Progress</label>
                                <input
                                id="edit-progress"
                                name="progress"
                                type="number"
                                min={0}
                                max={100}
                                placeholder={`%{100}`}
                                required
                                />
                            </div>
                            {/* Buttons*/}
                            <div
                                style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                padding: 20,
                                columnGap: 10
                                }}
                            >
                                <button type="button" id="cancel-edit">
                                Cancel
                                </button>
                                <button type="submit">Save Changes</button>
                            </div>
                        </div>
                    </form>
                </dialog>
                {/* To-Do create modal*/}
                <dialog id="create-todo-modal">
                    <form id="create-todo-form">
                        <h2>Create To-Do</h2>
                        <div className="input-list">
                            {/* Hidden input to store the project ID*/}
                            <div className="form-field-container">
                                <input id="create-todo-projectId" name="projectId" type="hidden" />
                                <input id="create-todo-id" name="todoId" type="hidden" />
                            </div>
                            {/* To-Do name input*/}
                            <div className="form-field-container">
                                <label>
                                <span className="material-icons-round">construction</span>To-Do
                                Name
                                </label>
                                <input
                                type="text"
                                name="name"
                                placeholder="Awesome Example To-Do"
                                />
                            </div>
                            {/* To-Do description input*/}
                            <div className="form-field-container">
                                <label>
                                <span className="material-icons-round">subject</span>Description
                                </label>
                                <textarea
                                name="description"
                                placeholder="Describe your to-do here"
                                defaultValue={""}
                                />
                            </div>
                            {/* To-Do due date input*/}
                            <div className="form-field-container">
                                <label>
                                <span className="material-icons-round">calendar_month</span>Due
                                Date
                                </label>
                                <input name="dueDate" id="create-todo-dueDate" type="date" />
                            </div>
                            {/* To-Do status input*/}
                            <div className="form-field-container">
                                <label>
                                <span className="material-icons-round">not_listed_location</span>
                                Status
                                </label>
                                <select name="status">
                                <option value="pending">pending</option>
                                <option value="active">active</option>
                                <option value="finished">finished</option>
                                </select>
                            </div>
                            {/* Buttons*/}
                            <div
                                style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                padding: 20,
                                columnGap: 10
                                }}
                            >
                                <button type="button" id="cancel-create-todo">
                                Cancel
                                </button>
                                <button type="submit">Create</button>
                            </div>
                        </div>
                    </form>
                </dialog>
                {/* Update To-Do modal*/}
                <dialog id="update-todo-modal">
                    <form id="update-todo-form">
                        <h2>Update To-Do</h2>
                        <div className="input-list">
                            {/* Hidden input to store the project ID*/}
                            <div className="form-field-container">
                                <input id="update-todo-projectId" name="projectId" type="hidden" />
                                <input id="update-todo-id" name="todoId" type="hidden" />
                            </div>
                            {/* To-Do name input*/}
                            <div className="form-field-container">
                                <label htmlFor="update-todo-name">
                                <span className="material-icons-round">construction</span>To-Do
                                Name
                                </label>
                                <input
                                id="update-todo-name"
                                name="name"
                                type="text"
                                placeholder="Awesome Example To-Do"
                                required
                                />
                            </div>
                            {/* To-Do description input*/}
                            <div className="form-field-container">
                                <label htmlFor="update-todo-description">
                                <span className="material-icons-round">subject</span>Description
                                </label>
                                <textarea
                                id="update-todo-description"
                                name="description"
                                placeholder="Describe your to-do here"
                                required
                                defaultValue={""}
                                />
                            </div>
                            {/* To-Do due date input*/}
                            <div className="form-field-container">
                                <label htmlFor="update-todo-dueDate">
                                <span className="material-icons-round">calendar_month</span>Due
                                Date
                                </label>
                                <input
                                id="update-todo-dueDate"
                                name="dueDate"
                                type="date"
                                required
                                />
                            </div>
                            {/* To-Do status input*/}
                            <div className="form-field-container">
                                <label htmlFor="update-todo-status">
                                    <span className="material-icons-round">not_listed_location</span>
                                    Status
                                </label>
                                <select id="update-todo-status" name="status" required>
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                            
                        </div>
                        {/* Buttons*/}      
                        <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            padding: 20,
                            columnGap: 10
                        }}
                        >
                            <button type="button" id="cancel-update-todo">
                                Cancel
                            </button>
                            <button type="submit">Update To-Do</button>
                        </div>
                    </form>
                </dialog>
                {/* Header of the project details page*/}
                <header>
                    {/* Title of the page*/}
                    <div>
                        <h2 data-project-info="name">{project.name}</h2>
                        <p data-project-info="description" style={{ color: "#969696" }}>
                            {project.description}
                        </p>
                    </div>
                </header>
                {/* Main content of the project details page*/}
                <div className="main-page-content">
                    {/* Dashboard of the project details page*/}
                    <div style={{ display: "flex", flexDirection: "column", rowGap: 30 }}>
                        {/* Project dashboard card*/}
                        <div className="dashboard-card" style={{ padding: "30px 0" }}>
                            <div
                                style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "0px 30px",
                                marginBottom: 30
                                }}
                            >
                                <p
                                data-project-info="cardInitials"
                                style={{
                                    fontSize: 20,
                                    backgroundColor: "#ca8134",
                                    aspectRatio: 1,
                                    borderRadius: "100%",
                                    padding: 12
                                }}
                                >
                                    {project.initials}
                                </p>
                                <button id="edit-project-btn" className="btn-secondary">
                                    <p style={{ width: "100%" }}>Edit</p>
                                </button>
                            </div>
                            <div style={{ padding: "0 30px" }}>
                                <div>
                                    <h5 data-project-info="cardName">{project.name}</h5>
                                    <p data-project-info="cardDescription">
                                        {project.description}
                                    </p>
                                </div>
                                <div
                                style={{
                                    display: "flex",
                                    columnGap: 30,
                                    padding: "30px 0px",
                                    justifyContent: "space-between"
                                }}
                                >
                                    <div>
                                        <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                                        Status
                                        </p>
                                        <p data-project-info="cardStatus">{project.status}</p>
                                    </div>
                                    <div>
                                        <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                                        Cost
                                        </p>
                                        <p data-project-info="cardCost">$ {project.cost}</p>
                                    </div>
                                    <div>
                                        <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                                        Role
                                        </p>
                                        <p data-project-info="cardUserRole">{project.userRole}</p>
                                    </div>
                                    <div>
                                        <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                                        Finish Date
                                        </p>
                                        <p data-project-info="cardFinishDate">{project.finishDate.toDateString()}</p>
                                    </div>
                                </div>
                                <div
                                style={{
                                    backgroundColor: "#404040",
                                    borderRadius: 9999,
                                    overflow: "auto"
                                }}
                                >
                                    <div
                                        data-project-info="cardProgress"
                                        style={{
                                        width: `${project.progress}%`,
                                        backgroundColor: "green",
                                        padding: "4px 0",
                                        textAlign: "center"
                                        }}
                                    >
                                        {project.progress}%
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* To-Do dashboard card*/}
                        <div className="todos-card" style={{ flexGrow: 1 }}>
                            {/* To-Do header*/}
                            <div
                                style={{
                                padding: "20px 30px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between"
                                }}
                            >
                                {/* To-Do title*/}
                                <h4>To-Do</h4>
                                {/* To-Do actions*/}
                                <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "end",
                                    columnGap: 20
                                }}
                                >
                                    {/* To-Do search bar*/}
                                    <div
                                        style={{ display: "flex", alignItems: "center", columnGap: 10 }}
                                    >
                                        <span className="material-icons-round">search</span>
                                        <input
                                        type="text"
                                        placeholder="Search To-Do's by name"
                                        style={{ width: "100%" }}
                                        />
                                    </div>
                                    {/* To-Do create button*/}
                                    <span
                                        className="material-icons-round action-icon"
                                        id="create-todo-btn"
                                        style={{ cursor: "pointer" }}
                                    >
                                        add
                                    </span>
                                </div>
                            </div>
                            {/* To-Do list*/}
                            <div
                                style={{
                                display: "flex",
                                flexDirection: "column",
                                padding: "10px 30px",
                                rowGap: 20
                                }}
                            >
                                {/* actual list of todos*/}
                                <div data-project-info="todos" className="todos-list">
                                {/* This list should be filled with JS*/}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Viewer container*/}
                <div
                    id="viewer-container"
                    className="dashboard-card"
                    style={{ minWidth: 0 }}
                >
                    {/* Viewer content will be inserted here in M3*/}
                </div>
            </div>
        </div>
    );
}