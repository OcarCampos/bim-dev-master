//Imports from other js libraries.
import { IProject, ProjectStatus, UserRole, Statuses, userRoles, ITodo } from "./classes/Project";
import { ProjectsManager } from "./classes/ProjectsManager";
import { v4 as uuidv4 } from 'uuid';

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
 * Event Listeners for buttons: sidebar and others
 */
function btnClick(buttonId: string, showPageId: string, hidePageId: string[]) {
  const button = document.getElementById(buttonId);
  if (button) {
    button.addEventListener("click", () => {
      const showPage = document.getElementById(showPageId);
      if (showPage) {
        showPage.style.display = "flex";
      }

      hidePageId.forEach(hidePageId => {
        const hidePage = document.getElementById(hidePageId);
        if (hidePage) {
          hidePage.style.display = "none";
        }
      });
    });
  } else {
    console.warn(`The button ${buttonId} was not found. Check the ID!`);
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
 * Gets the projects list container from index.html and creates 
 * a new projects manager element to handle the projects list
 */
const projectsListUI = document.getElementById("projects-list") as HTMLElement;
const projectsManager = new ProjectsManager(projectsListUI);

/*
 * Event Listeners for showing the new project modal
 */
const newProjectBtn = document.getElementById("new-project-btn");
if (newProjectBtn) {
  newProjectBtn.addEventListener("click", () => {
    //Setting a default date
    const finishDateInput = document.getElementById('finishDateInput') as HTMLInputElement;
    if (finishDateInput) {
      finishDateInput.valueAsDate = defaultDate();
    }
    //Opening the modal
    toggleModal("new-project-modal", 'open'); 
  });
} else {
  console.warn("New projects button was not found");
}

/*
 * Event Listeners handling the submit of the new project modal
 */
const projectForm = document.getElementById("new-project-form");
if (projectForm && projectForm instanceof HTMLFormElement) { 
  projectForm.addEventListener("submit", (e) => {  
    e.preventDefault(); 
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
      projectsManager.newProject(projectData); //Creates a new project.
      projectForm.reset();
      toggleModal("new-project-modal", 'close');
    } catch (err) {
      toggleModal("error-modal", 'open', err instanceof Error ? err.message : String(err));
    }
  });
}

/*
 * Event Listeners for canceling the new project modal
 */
const cancelNewProjectBtn = document.getElementById("cancel-new-project-btn");
if (cancelNewProjectBtn) {
  cancelNewProjectBtn.addEventListener("click", () => { 
    toggleModal("new-project-modal", 'close');
    const projectForm = document.getElementById("new-project-form") as HTMLFormElement;
    if (projectForm) {
      projectForm.reset(); //resets the form
    }
  });
} else {
  console.warn("The cancel new project button was not found. Check the ID!");
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
} else {
  console.warn("Cancel create todo button was not found");
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
} else {
  console.warn("The close error modal button was not found. Check the ID!");
}

/*
 * Event Listeners for export projects
 */
const exportProjectsBtn = document.getElementById("export-projects-btn");
if (exportProjectsBtn) {
  exportProjectsBtn.addEventListener("click", () => {
    projectsManager.exportToJSON();
  });
}

/*
 * Event Listeners for import projects
 */
const importProjectsBtn = document.getElementById("import-projects-btn");
if (importProjectsBtn) {
  importProjectsBtn.addEventListener("click", () => {
    projectsManager.importFromJSON();
  });
}

/*
 * Sidebar buttons
 */
btnClick("users-btn", "project-users", ["projects-page", "project-details"]);
btnClick("projects-btn", "projects-page", ["project-users", "project-details"]);

