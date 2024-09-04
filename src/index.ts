import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js"
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

//ThreeJS setup
const scene = new THREE.Scene() // Create a new scene
//scene.background = new THREE.Color("#000000") // Set the background color of the scene to black
const viewerContainer = document.getElementById("viewer-container") as HTMLElement // Get the viewer container element
let camera: THREE.PerspectiveCamera // Define the camera
let renderer: THREE.WebGLRenderer // Define the renderer
let cameraControls: OrbitControls // Define the camera controls

/*
 * Sets up the viewer
 * This function is called when the viewer container is resized or when the viewer is initialized
 * for the first time.
 */
function setupViewer() {
  const containerDimensions = viewerContainer.getBoundingClientRect() // Get the dimensions of the container
  const aspectRatio = containerDimensions.width / containerDimensions.height // Calculate the aspect ratio of the container
  camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000) // Create a new perspective camera with the calculated aspect ratio
  camera.position.z = 5 // Set the initial position of the camera
  renderer = new THREE.WebGLRenderer({alpha: true, antialias: true}) // Create a new WebGL renderer with transparent background
  viewerContainer.innerHTML = '' // Clear the container
  viewerContainer.append(renderer.domElement) // Append the renderer's DOM element to the container
  renderer.setSize(containerDimensions.width, containerDimensions.height) // Set the size of the renderer to match the container dimensions
  cameraControls = new OrbitControls(camera, viewerContainer) // Create new orbit controls for the camera
}

//This is the mesh we will use to test the GUI
const boxGeometry = new THREE.BoxGeometry(1, 1, 1) // Create a new box geometry with a size of 1x1x1
const material = new THREE.MeshStandardMaterial() // Create a new standard material
const cube = new THREE.Mesh(boxGeometry, material) // Create a new mesh with the box geometry and material
const directionalLight = new THREE.DirectionalLight(0xffffff, 1) // Create a new directional light with a white color and intensity of 1  
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4) // Create a new ambient light with a white color and intensity of 0.4
scene.add(cube, directionalLight, ambientLight) // Add the cube, directional light, and ambient light to the scene

setupViewer() // Call the setupViewer() function to initialize the viewer for the first time

/*
 * Renders the scene
 * This function is called repeatedly (recursively) using requestAnimationFrame
 * to create a smooth animation effect.
 * Function doesn't crash the browser, because it's optimized by the browser.
 * Function is called after a first call when the window is resized.
 */
function renderScene() {
  renderer.render(scene, camera) // Render the scene using the camera
  requestAnimationFrame(renderScene) // Call renderScene() again on the next animation frame to create a smooth animation effect
}

// we will make the container of the viewer responsive
window.addEventListener("resize", () => {
  setupViewer()
})

//This when load the page for the first time
renderScene() // Call the renderScene() function to start the animation loop

//adding helpers to the scene
const axesHelper = new THREE.AxesHelper(10) // Create a new axes helper with a length of 10
scene.add(axesHelper) // Add the axes helper to the scene
const gridHelper = new THREE.GridHelper(100, 100) // Create a new grid helper with a size of 100 and a division of 100
gridHelper.material.transparent = true // Make the grid helper transparent
gridHelper.material.opacity = 0.5 // Set the opacity of the grid helper to 0.5
gridHelper.material.color.set(0x00ff00) // Set the color of the grid helper to green
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight) // Create a new directional light helper
scene.add(directionalLightHelper) // Add the directional light helper to the scene
scene.add(gridHelper) // Add the grid helper to the scene

const gui = new GUI() // Create a new GUI instance

const cubeControls = gui.addFolder("Cube") // Create a new folder in the GUI for the cube
//controls for the cube's position
cubeControls.add(cube.position, "x").min(-10).max(10).step(0.01) // Add a GUI control for the cube's x position
cubeControls.add(cube.position, "y").min(-10).max(10).step(0.01) // Add a GUI control for the cube's y position
cubeControls.add(cube.position, "z").min(-10).max(10).step(0.01) // Add a GUI control for the cube's z position
//controls for the cube's rotation
cubeControls.add(cube.rotation, "x").min(-Math.PI).max(Math.PI).step(0.01) // Add a GUI control for the cube's x rotation
cubeControls.add(cube.rotation, "y").min(-Math.PI).max(Math.PI).step(0.01) // Add a GUI control for the cube's y rotation
cubeControls.add(cube.rotation, "z").min(-Math.PI).max(Math.PI).step(0.01) // Add a GUI control for the cube's z rotation
//controls for cube visibility
cubeControls.add(cube, "visible") // Add a GUI control for the cube's visibility
cubeControls.addColor(cube.material, "color") // Add a GUI control for the cube's color

//controls for the directional light
const dirLightControls = gui.addFolder("Directional Light") // Create a new folder in the GUI for the directional light
//controls for the directional light's position
dirLightControls.add(directionalLight.position, "x").min(-10).max(10).step(0.01) // Add a GUI control for the directional light's x position
dirLightControls.add(directionalLight.position, "y").min(-10).max(10).step(0.01) // Add a GUI control for the directional light's y position
dirLightControls.add(directionalLight.position, "z").min(-10).max(10).step(0.01) // Add a GUI control for the directional light's z position
//controls for the directional light's rotation
dirLightControls.add(directionalLight.rotation, "x").min(-Math.PI).max(Math.PI).step(0.01) // Add a GUI control for the directional light's x rotation
dirLightControls.add(directionalLight.rotation, "y").min(-Math.PI).max(Math.PI).step(0.01) // Add a GUI control for the directional light's y rotation
dirLightControls.add(directionalLight.rotation, "z").min(-Math.PI).max(Math.PI).step(0.01) // Add a GUI control for the directional light's z rotation
//controls for the directional light's intensity
dirLightControls.add(directionalLight, "intensity").min(0).max(1).step(0.01) // Add a GUI control for the directional light's intensity

