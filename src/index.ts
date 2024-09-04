//Imports from other js libraries.
import { IProject, ProjectStatus, UserRole } from "./classes/Project"
import { ProjectsManager } from "./classes/ProjectsManager"

// Function to toggle the modal
function toggleModal(id: string, action: 'open' | 'close') {
  const modal = document.getElementById(id)
  if (modal && modal instanceof HTMLDialogElement) {
    action === 'open' ? modal.showModal() : modal.close()
  } else {
    console.warn("The provided modal wasn't found. ID: ", id)
  }
}

// Gets the projects list container and creates a new projects manager
const projectsListUI = document.getElementById("projects-list") as HTMLElement
const projectsManager = new ProjectsManager(projectsListUI)

// This document object is provided by the browser, and its main purpose is to help us interact with the DOM.
const newProjectBtn = document.getElementById("new-project-btn")
if (newProjectBtn) {
  newProjectBtn.addEventListener("click", () => { toggleModal("new-project-modal", 'open') })
} else {
  console.warn("New projects button was not found")
}

// Gets the new project form and adds an event listener to it
const projectForm = document.getElementById("new-project-form")
if (projectForm && projectForm instanceof HTMLFormElement) {
  projectForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const formData = new FormData(projectForm)
    const projectData: IProject = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as ProjectStatus,
      userRole: formData.get("userRole") as UserRole,
      finishDate: new Date(formData.get("finishDate") as string)
    }
    try {
      const project = projectsManager.newProject(projectData)
      console.log(project)
      projectForm.reset()
      toggleModal("new-project-modal", 'close')
    } catch (err) {
      alert(err)
    }
  })
} else {
  console.warn("The project form was not found. Check the ID!")
}

// Gets the export projects button and adds an event listener to it
const exportProjectsBtn = document.getElementById("export-projects-btn")
if (exportProjectsBtn) {
  exportProjectsBtn.addEventListener("click", () => {
    projectsManager.exportToJSON()
  })
}

// Gets the import projects button and adds an event listener to it
const importProjectsBtn = document.getElementById("import-projects-btn")
if (importProjectsBtn) {
  importProjectsBtn.addEventListener("click", () => {
    projectsManager.importFromJSON()
  })
}