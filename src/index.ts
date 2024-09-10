//Imports from other js libraries.
import { IProject, ProjectStatus, UserRole, Statuses, userRoles, ITodo } from "./classes/Project";
import { ProjectsManager } from "./classes/ProjectsManager";
import { v4 as uuidv4 } from 'uuid';
//Three JS Imports
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js"


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

/*
 * Three.js Setup
*/

const scene = new THREE.Scene() // Create a new scene
//scene.background = new THREE.Color("#000000") // Set the background color of the scene to black
const viewerContainer = document.getElementById("viewer-container") as HTMLElement // Get the viewer container element

//just for debugging
if (viewerContainer) {
  console.log("Viewer container found");
}

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