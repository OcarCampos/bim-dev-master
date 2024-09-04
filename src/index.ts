import * as THREE from "three"
import { IProject, ProjectStatus, UserRole } from "./classes/Project"
import { ProjectsManager } from "./classes/ProjectsManager"

function showModal(id: string) {
  const modal = document.getElementById(id)
  if (modal && modal instanceof HTMLDialogElement) {
    modal.showModal()
  } else {
    console.warn("The provided modal wasn't found. ID: ", id)
  }
}

function closeModal(id: string) {
  const modal = document.getElementById(id)
  if (modal && modal instanceof HTMLDialogElement) {
    modal.close()
  } else {
    console.warn("The provided modal wasn't found. ID: ", id)
  }
}

const projectsListUI = document.getElementById("projects-list") as HTMLElement
const projectsManager = new ProjectsManager(projectsListUI)

// This document object is provided by the browser, and its main purpose is to help us interact with the DOM.
const newProjectBtn = document.getElementById("new-project-btn")
if (newProjectBtn) {
  newProjectBtn.addEventListener("click", () => {showModal("new-project-modal")})
} else {
  console.warn("New projects button was not found")
}

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
      closeModal("new-project-modal")
    } catch (err) {
      alert(err)
    }
  })
} else {
	console.warn("The project form was not found. Check the ID!")
}

const exportProjectsBtn= document.getElementById("export-projects-btn")
if (exportProjectsBtn) {
  exportProjectsBtn.addEventListener("click", () => {
    projectsManager.exportToJSON()
  })
}

const importProjectsBtn = document.getElementById("import-projects-btn")
if (importProjectsBtn) {
  importProjectsBtn.addEventListener("click", () => {
    projectsManager.importFromJSON()
  })
}

//ThreeJS viewer setup
// Create a new Three.js scene
const scene = new THREE.Scene()
// Get the container element for the 3D viewer
const viewerContainer = document.getElementById("viewer-container") as HTMLElement
// Get the dimensions of the container
const containerDimensions = viewerContainer.getBoundingClientRect()
// Calculate the aspect ratio of the container
const aspectRatio = containerDimensions.width / containerDimensions.height
// Create a perspective camera
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000)
// Position the camera 5 units away from the center along the z-axis
camera.position.z = 5
// Create a WebGL renderer
const renderer = new THREE.WebGLRenderer()
// Add the renderer's canvas to the viewer container
viewerContainer.append(renderer.domElement)
// Set the size of the renderer to match the container dimensions
renderer.setSize(containerDimensions.width, containerDimensions.height)
// Create a box geometry (cube)
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
// Create a standard material for the cube
const material = new THREE.MeshStandardMaterial()
// Create a mesh using the box geometry and material
const cube = new THREE.Mesh(boxGeometry, material)
// Create a directional light (simulates sunlight)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
// Create an ambient light (provides overall illumination)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
// Add the cube and lights to the scene
scene.add(cube, directionalLight, ambientLight)
// Render the scene using the camera
renderer.render(scene, camera)

