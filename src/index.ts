//Imports from other js libraries.
import { IProject, ProjectStatus, UserRole, Statuses, userRoles } from "./classes/Project";
import { ProjectsManager } from "./classes/ProjectsManager";

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
  newProjectBtn.addEventListener("click", () => { toggleModal("new-project-modal", 'open'); });
} else {
  console.warn("New projects button was not found");
}

/*
 * Set default date for finish date input in new project modal
 */
const finishDateInput = document.getElementById('finishDateInput') as HTMLInputElement;
if (finishDateInput) {
  const defaultDate = new Date();
  defaultDate.setMonth(defaultDate.getMonth() + 1); // Set default to one month from now
  finishDateInput.valueAsDate = defaultDate;
}

/*
 * Event Listeners handling the submit of the new project modal
 */
const projectForm = document.getElementById("new-project-form");
if (projectForm && projectForm instanceof HTMLFormElement) { 
  projectForm.addEventListener("submit", (e) => {  //event listener for when the form is submitted
    e.preventDefault(); //Prevents the default behavior of the form (page reload)
    const formData = new FormData(projectForm); //Creates a new FormData object with the form's data
    const projectData: IProject = {
      name: formData.get("name") as string, //Gets the project name from the form
      description: formData.get("description") as string, //Gets the project description from the form
      status: formData.get("status") as ProjectStatus, //Gets the project status from the form
      userRole: formData.get("userRole") as UserRole, //Gets the project user role from the form
      finishDate: new Date(formData.get("finishDate") as string), //Gets the project finish date from the form
      cost: Number(formData.get("cost")) || 0, // Add cost
      progress: Number(formData.get("progress")) || 0, // Add progress
      todos: []
    };
    try {
      const project = projectsManager.newProject(projectData); //Creates a new project with the form's data using the projects manager class
      //console.log(project) //Logs the new project to the console
      projectForm.reset(); //Resets the form
      toggleModal("new-project-modal", 'close'); //close the modal on success
    } catch (err) {
      toggleModal("error-modal", 'open', err instanceof Error ? err.message : String(err));
    }
  });
} else {
  console.warn("The project form was not found. Check the ID!");
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
 * Event Listeners for showing the edit project modal
 */
const editProjectBtn = document.getElementById("edit-project-btn");
if (editProjectBtn) {
  editProjectBtn.addEventListener("click", () => { toggleModal("edit-project-modal", 'open'); });
} else {
  console.warn("Edit project button was not found");
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
          toggleModal("edit-project-modal", 'close'); //close modal and go back to details page. No need to reset form, as the data is already updated.
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
    if (modal) modal.close();
  });
}



/*
 * Event Listener for handling the submit of the create todo modal
 */
const createTodoForm = document.getElementById("create-todo-form");
if (createTodoForm) {
  createTodoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    /*
    const formData = new FormData(createTodoForm);
    const todoData: Omit<ITodo, 'id'> = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as "pending" | "in_progress" | "completed",
      dueDate: new Date(formData.get("dueDate") as string),
    };
    const projectId = formData.get("projectId") as string;
    try {
      projectsManager.addTodo(projectId, todoData);
      toggleModal("create-todo-modal", 'close');
      createTodoForm.reset();
    } catch (err) {
      toggleModal("error-modal", 'open', err instanceof Error ? err.message : String(err));
    }
    */
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

// Buttons
btnClick("users-btn", "project-users", ["projects-page", "project-details"]);
btnClick("projects-btn", "projects-page", ["project-users", "project-details"]);





