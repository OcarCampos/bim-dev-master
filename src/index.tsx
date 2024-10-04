//Imports from React libraries
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import * as Router from 'react-router-dom';

//Imports from react components
import { Sidebar } from "./react-components/Sidebar";
import { ProjectsPage } from "./react-components/ProjectsPage";
import { ProjectDetailsPage } from "./react-components/ProjectDetailsPage";
import { ProjectsManager } from './classes/ProjectsManager';

//Imports from other js libraries.
import { v4 as uuidv4 } from 'uuid';

//Create an instance of the ProjectsManager
const projectsManager = new ProjectsManager();

//Render the sidebar component into the sidebar div
const rootElement = document.getElementById("app") as HTMLDivElement;
const appRoot = ReactDOM.createRoot(rootElement);
appRoot.render(
  //the following empty div is to fool react to render the components into the same hierachy as the html elements.
  <>
    <Router.BrowserRouter> 
      <Sidebar />
      <Router.Routes>
        <Router.Route path="/" element={<ProjectsPage projectsManager={projectsManager} />} />
        <Router.Route path="/project/:id" element={<ProjectDetailsPage projectsManager={projectsManager} />} />
      </Router.Routes>  
    </Router.BrowserRouter>
  </>
);


/*
 * Function to toggle the visibility of a modal
 */
function toggleModal(id: string, action: 'open' | 'close', errorMessage?: string) {
  const modal = document.getElementById(id);
  if (modal && modal instanceof HTMLDialogElement) {
    if (action === 'open') {
      if (id === 'error-modal' && errorMessage) {
        const errorMessageElement = document.getElementById('error-message');
        if (errorMessageElement) {
          errorMessageElement.textContent = errorMessage;
        }
      }
      modal.showModal();
    } else {
      modal.close();
    }
  } else {
    console.warn("The provided modal wasn't found. ID: ", id);
  }
}

/*
 * Function to set the default date for the finish date input in the new project modal
 */
function defaultDate() {
  const defaultDate = new Date();
  defaultDate.setMonth(defaultDate.getMonth() + 1); // Set default to one month from now
  return defaultDate;
}

/*
 * Event Listeners for handling the submit of the edit project modal
 */
const editProjectForm = document.getElementById("edit-project-form") as HTMLFormElement;
if (editProjectForm) {
  editProjectForm.addEventListener("submit", (e) => {
    e.preventDefault();
    //creates a temporary FormData object with the form's data
    const editData = new FormData(editProjectForm);
    //creates a temporary IProject object with the form's data
    const editProjectData: IProject = {
      name: editData.get("name") as string,
      description: editData.get("description") as string,
      status: editData.get("status") as ProjectStatus,
      userRole: editData.get("userRole") as UserRole,
      finishDate: new Date(editData.get("finishDate") as string),
      cost: Number(editData.get("cost")) || 0,
      progress: Number(editData.get("progress")) || 0,
      todos: []
    };
    //get's project id from the hidden input field to get original data and compare with new data
    const originalProjectId = editData.get("projectId") as string;
    const originalProject = projectsManager.getProject(originalProjectId);
    if (originalProject) {
      if (originalProject.name === editProjectData.name &&
        originalProject.description === editProjectData.description &&
        originalProject.status === editProjectData.status &&
        originalProject.userRole === editProjectData.userRole &&
        (originalProject.finishDate instanceof Date ? originalProject.finishDate.getTime() : new Date(originalProject.finishDate).getTime()) === editProjectData.finishDate.getTime() &&
        originalProject.cost === editProjectData.cost &&
        originalProject.progress === editProjectData.progress
        ) {
        toggleModal("error-modal", 'open', "There is no information to update in the project.");
        return;
      }
      else {
        try {
          //Update project data with new data
          projectsManager.updateProject(originalProject, editProjectData);
          toggleModal("edit-project-modal", 'close'); //close modal. No need to reset form.
        } catch (err) {
          toggleModal("error-modal", 'open', err instanceof Error ? err.message : String(err));
        }
      }
    }
  });
}

/*
 * Event Listeners for canceling the edit project modal
 */
const cancelEditBtn = document.getElementById("cancel-edit");
if (cancelEditBtn) {
  cancelEditBtn.addEventListener("click", () => {
    const modal = document.getElementById("edit-project-modal") as HTMLDialogElement;
    if (modal) modal.close(); //no need to reset form.
  });
}

/*
 * Event Listener for handling the submit of the create todo modal
 */
const createTodoForm = document.getElementById("create-todo-form") as HTMLFormElement;
if (createTodoForm) {
  createTodoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    //Get data from form and create object with the data.
    const formData = new FormData(createTodoForm);
    const todoData: ITodo = {
      id: uuidv4(),
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as Statuses,
      dueDate: new Date(formData.get("dueDate") as string),
    };
    //Get project id from the hidden input field.
    const projectId = formData.get("projectId") as string;
    try {
      projectsManager.addTodo(projectId, todoData);
      toggleModal("create-todo-modal", 'close');
      createTodoForm.reset();
    } catch (err) {
      toggleModal("error-modal", 'open', err instanceof Error ? err.message : String(err));
    }
  });
}

/*
 * Event Listeners for canceling the submit of the create todo modal
 */
const cancelCreateTodoBtn = document.getElementById("cancel-create-todo");
if (cancelCreateTodoBtn) {
  cancelCreateTodoBtn.addEventListener("click", () => {
    toggleModal("create-todo-modal", 'close');
    const todoForm = document.getElementById("create-todo-form") as HTMLFormElement;
    if (todoForm) {
      todoForm.reset();
    }
  });
}


/*
 * Event Listener for handling the submit of the update todo modal
 */
const updateTodoForm = document.getElementById("update-todo-form") as HTMLFormElement;
if (updateTodoForm) {
  updateTodoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    //Get data from form and create object with the data.
    const formData = new FormData(updateTodoForm);
    const updateTodoData: ITodo = {
      id: formData.get("todoId") as string,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as Statuses,
      dueDate: new Date(formData.get("dueDate") as string),
    };
    //Get project id and todo id from the hidden input fields.
    const projectId = formData.get("projectId") as string;
    const todoId = formData.get("todoId") as string;
    try {
      //Update the todo with the new data.
      projectsManager.updateTodo(projectId, todoId, updateTodoData);
      toggleModal("update-todo-modal", 'close');
    } catch (err) {
      toggleModal("error-modal", 'open', err instanceof Error ? err.message : String(err));
    }
  });
}

/*
 * Event Listener for canceling the update todo modal
 */
const cancelUpdateTodoBtn = document.getElementById("cancel-update-todo");
if (cancelUpdateTodoBtn) {
  cancelUpdateTodoBtn.addEventListener("click", () => {
    toggleModal("update-todo-modal", 'close');
  });
}

/*
 * Event Listeners for closing the error modal
 */
const closeErrorModalBtn = document.getElementById("close-error-modal");
if (closeErrorModalBtn) {
  closeErrorModalBtn.addEventListener("click", () => {
    toggleModal("error-modal", 'close');
  });
} 


