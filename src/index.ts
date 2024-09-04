//Imports from other js libraries.
import { IProject, ProjectStatus, UserRole } from "./classes/Project";
import { ProjectsManager } from "./classes/ProjectsManager";

// Function to toggle open/close any modal by its id
function toggleModal(id: string, action: 'open' | 'close', errorMessage?: string) {
  console.log(`Attempting to ${action} modal with id: ${id}`);
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

// Gets the projects list container from index.html and creates a new projects manager element to handle the projects list
const projectsListUI = document.getElementById("projects-list") as HTMLElement;
const projectsManager = new ProjectsManager(projectsListUI);

// Gets the new project button and adds an event listener to it to open the new project modal
const newProjectBtn = document.getElementById("new-project-btn");
if (newProjectBtn) {
  newProjectBtn.addEventListener("click", () => { toggleModal("new-project-modal", 'open'); });
} else {
  console.warn("New projects button was not found");
}

// Defines the project form and adds an event listener to it to allow populating the project manager with a new project
const projectForm = document.getElementById("new-project-form");
if (projectForm && projectForm instanceof HTMLFormElement) { //If form exists and is of type HTMLFormElement
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
      progress: Number(formData.get("progress")) || 0 // Add progress
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

// Gets the cancel button from the new project modal and adds an event listener to it to close the modal
const cancelNewProjectBtn = document.getElementById("cancel-new-project-btn");
if (cancelNewProjectBtn) {
  cancelNewProjectBtn.addEventListener("click", () => { 
    toggleModal("new-project-modal", 'close');
    // Reset the form if needed
    const projectForm = document.getElementById("new-project-form") as HTMLFormElement;
    if (projectForm) {
      projectForm.reset();
    }
  });
} else {
  console.warn("The cancel new project button was not found. Check the ID!");
}

// Gets the close error modal button and adds an event listener to it to close the modal
const closeErrorModalBtn = document.getElementById("close-error-modal");
if (closeErrorModalBtn) {
  closeErrorModalBtn.addEventListener("click", () => {
    toggleModal("error-modal", 'close');
  });
} else {
  console.warn("The close error modal button was not found. Check the ID!");
}


// Gets the export projects button and adds an event listener to it to 
// call the exportToJSON method from the projects manager class.
const exportProjectsBtn = document.getElementById("export-projects-btn");
if (exportProjectsBtn) {
  exportProjectsBtn.addEventListener("click", () => {
    projectsManager.exportToJSON();
  });
}

// Gets the import projects button and adds an event listener to it to
// call the importFromJSON method from the projects manager class.
const importProjectsBtn = document.getElementById("import-projects-btn");
if (importProjectsBtn) {
  importProjectsBtn.addEventListener("click", () => {
    projectsManager.importFromJSON();
  });
}

// When the user clicks on the projects sidebar button, the projects page is displayed
const projectsSidebarBtn = document.getElementById("projects-btn");
if (projectsSidebarBtn) {
  projectsSidebarBtn.addEventListener("click", () => {
      //Gets the projects page and the project details page
      const projectsPage = document.getElementById("projects-page");
      const detailsPage = document.getElementById("project-details");
      //If the projects page or the project details page do not exist, return
      if (!(projectsPage && detailsPage)) { return; }
      //Hides the details page and displays the project list page
      detailsPage.style.display = "none";
      projectsPage.style.display = "flex";
  });
}

// Set default date for finish date input
const finishDateInput = document.getElementById('finishDateInput') as HTMLInputElement;
if (finishDateInput) {
  const defaultDate = new Date();
  defaultDate.setMonth(defaultDate.getMonth() + 1); // Set default to one month from now
  finishDateInput.valueAsDate = defaultDate;
}

const editProjectForm = document.getElementById("edit-project-form") as HTMLFormElement;
if (editProjectForm) {
  editProjectForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // The form submission is handled in the ProjectsManager class
  });
}

const cancelEditBtn = document.getElementById("cancel-edit");
if (cancelEditBtn) {
  cancelEditBtn.addEventListener("click", () => {
    const modal = document.getElementById("edit-project-modal") as HTMLDialogElement;
    if (modal) modal.close();
  });
}