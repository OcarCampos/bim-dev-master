//Imports from React
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { Sidebar } from "./react-components/Sidebar";
import { ProjectsPage } from "./react-components/ProjectsPage";

//Imports from other js libraries.
import { v4 as uuidv4 } from 'uuid';
//Three JS Imports
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

//Render the sidebar component into the sidebar div
const rootElement = document.getElementById("app") as HTMLDivElement;
const appRoot = ReactDOM.createRoot(rootElement);
appRoot.render(
  //the following empty div is to fool react to render the components into the same hierachy as the html elements.
  <> 
    <Sidebar />
    <ProjectsPage />
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
 * Sidebar buttons
 */
btnClick("users-btn", "project-users", ["projects-page", "project-details"]);
btnClick("projects-btn", "projects-page", ["project-users", "project-details"]);

/*
 * Three.js Setup
*/
// Create a new scene
const scene = new THREE.Scene();
// Get the viewer container element
const viewerContainer = document.getElementById("viewer-container") as HTMLElement;

// Define the camera
let camera: THREE.PerspectiveCamera;
// Define the renderer
let renderer: THREE.WebGLRenderer;
// Define the camera controls
let cameraControls: OrbitControls;


/*
 * Sets up the viewer
 * This function is called when the viewer container is resized or when the viewer is initialized
 * for the first time.
 */
function setupViewer() {
  const containerDimensions = viewerContainer.getBoundingClientRect();
  const aspectRatio = containerDimensions.width / containerDimensions.height;
  //Creates a new perspective camera
  camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
  //move camera to a better position
  camera.position.z = 20; 
  camera.position.y = 10;
  // Creates a new WebGL renderer with transparent background
  renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
  viewerContainer.innerHTML = '';
  viewerContainer.append(renderer.domElement); // Append the renderer's DOM element to the container
  renderer.setSize(containerDimensions.width, containerDimensions.height); // Set the size of the renderer to match the container dimensions
  cameraControls = new OrbitControls(camera, viewerContainer); // Create new orbit controls for the camera
}
/*
 * Mesh to test the GUI
*/
const boxGeometry = new THREE.BoxGeometry(1, 1, 1); // Create a new box geometry with a size of 1x1x1
const material = new THREE.MeshStandardMaterial(); // Create a new standard material
const cube = new THREE.Mesh(boxGeometry, material); // Create a new mesh with the box geometry and material

/*
 * Lights for the scene
*/
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);  
directionalLight.position.set(0, 20, 0);


/*
 * 4 Spot lights for the scene.
 * Position of spotlights are
 * 1. x: 15, y: 15, z: 0
 * 2. x: -15, y: 15, z: 0
 * 3. x: 0, y: 15, z: 15
 * 4. x: 0, y: 15, z: -15
*/
const spotLight1 = new THREE.SpotLight(0xffffff, 1, 20, Math.PI * 0.1, 0.01);
const spotLight2 = new THREE.SpotLight(0xffffff, 1, 20, Math.PI * 0.1, 0.01);
const spotLight3 = new THREE.SpotLight(0xffffff, 1, 20, Math.PI * 0.1, 0.01);
const spotLight4 = new THREE.SpotLight(0xffffff, 1, 20, Math.PI * 0.1, 0.01);

//set position of spotlights
spotLight1.position.set(15, 20, 0);
spotLight2.position.set(-15, 20, 0);
spotLight3.position.set(0, 20, 15);
spotLight4.position.set(0, 20, -15);

//Add elements to the scene
scene.add(directionalLight, ambientLight, spotLight1, spotLight2, spotLight3, spotLight4); //we removed the test mesh, only lights now. 

// Call the setupViewer() function for the first time to initialize the viewer 
setupViewer(); 

/*
 * Renders the scene
 * This function is called repeatedly (recursively) using requestAnimationFrame
 * to create a smooth animation effect.
 * Function doesn't crash the browser, because it's optimized by the browser itself.
 * Function is called after a first call when the window is resized.
 */
function renderScene() {
  renderer.render(scene, camera); // Render the scene using the camera
  requestAnimationFrame(renderScene); // Call renderScene() again on the next animation frame to create a smooth animation effect
}

/*  
 * Event listener for when the window is resized.
 * Calls the setupViewer() function to make the container of the viewer responsive
 */
window.addEventListener("resize", () => {
  setupViewer();
});

//Calls the renderScene() function to start the animation loop
renderScene(); 

/*
 * Adding helpers to the scene
*/
const axesHelper = new THREE.AxesHelper(5); // Create a new axes helper with a length of 10
scene.add(axesHelper); // Add the axes helper to the scene

const gridHelper = new THREE.GridHelper(100, 100); // Create a new grid helper with a size of 100 and a division of 100
gridHelper.material.transparent = true; // Make the grid helper transparent
gridHelper.material.opacity = 0.5; // Set the opacity of the grid helper to 0.5
gridHelper.material.color.set(0x00ff00); // Set the color of the grid helper to green

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight); // Create a new directional light helper
scene.add(directionalLightHelper); // Add the directional light helper to the scene
//scene.add(gridHelper); // Add the grid helper to the scene

/*
const spotLightHelper1 = new THREE.SpotLightHelper(spotLight1); // Create a new spot light helper
scene.add(spotLightHelper1); // Add the spot light helper to the scene
const spotLightHelper2 = new THREE.SpotLightHelper(spotLight2); // Create a new spot light helper
scene.add(spotLightHelper2); // Add the spot light helper to the scene
const spotLightHelper3 = new THREE.SpotLightHelper(spotLight3); // Create a new spot light helper
scene.add(spotLightHelper3); // Add the spot light helper to the scene
const spotLightHelper4 = new THREE.SpotLightHelper(spotLight4); // Create a new spot light helper
scene.add(spotLightHelper4); // Add the spot light helper to the scene
*/
/*
 * Adding GUI to the scene
 * GUI is used to add controls to the meshes and other
 * elements of the scene.
*/
const gui = new GUI();

/*
 * Cube controls. In M3-C2-L7 we got rid of the cube.
*/
/*
const cubeControls = gui.addFolder("Cube"); // Create a new folder in the GUI for the cube
//controls for the cube's position
cubeControls.add(cube.position, "x").min(-10).max(10).step(0.01); // Add a GUI control for the cube's x position
cubeControls.add(cube.position, "y").min(-10).max(10).step(0.01); // Add a GUI control for the cube's y position
cubeControls.add(cube.position, "z").min(-10).max(10).step(0.01); // Add a GUI control for the cube's z position
//controls for the cube's rotation
cubeControls.add(cube.rotation, "x").min(-Math.PI).max(Math.PI).step(0.01); // Add a GUI control for the cube's x rotation
cubeControls.add(cube.rotation, "y").min(-Math.PI).max(Math.PI).step(0.01); // Add a GUI control for the cube's y rotation
cubeControls.add(cube.rotation, "z").min(-Math.PI).max(Math.PI).step(0.01); // Add a GUI control for the cube's z rotation
//controls for cube visibility
cubeControls.add(cube, "visible"); // Add a GUI control for the cube's visibility
cubeControls.addColor(cube.material, "color"); // Add a GUI control for the cube's color
*/

/*
 * Directional light controls
*/
const dirLightControls = gui.addFolder("Directional Light"); // Create a new folder in the GUI for the directional light
//controls for the directional light's position
dirLightControls.add(directionalLight.position, "x").min(-100).max(100).step(1); // Add a GUI control for the directional light's x position
dirLightControls.add(directionalLight.position, "y").min(-100).max(100).step(1); // Add a GUI control for the directional light's y position
dirLightControls.add(directionalLight.position, "z").min(-100).max(100).step(1); // Add a GUI control for the directional light's z position
//controls for the directional light's rotation
dirLightControls.add(directionalLight.rotation, "x").min(-Math.PI).max(Math.PI).step(0.01); // Add a GUI control for the directional light's x rotation
dirLightControls.add(directionalLight.rotation, "y").min(-Math.PI).max(Math.PI).step(0.01); // Add a GUI control for the directional light's y rotation
dirLightControls.add(directionalLight.rotation, "z").min(-Math.PI).max(Math.PI).step(0.01); // Add a GUI control for the directional light's z rotation
//controls for the directional light's intensity
dirLightControls.add(directionalLight, "intensity").min(0).max(1).step(0.01); // Add a GUI control for the directional light's intensity
//control for the directional light's color
dirLightControls.addColor(directionalLight, "color"); // Add a GUI control for the directional light's color

/*
 * Importing OBJ model that comes with MTL file
*/
/*
const objLoader = new OBJLoader();
const mtlLoader = new MTLLoader();

//First we have to load the MTL file if there is one.
mtlLoader.load("assets/Gear/Gear1.mtl", (materials) => {
  materials.preload(); //creates the three materials needed
  objLoader.setMaterials(materials);  //sets the materials to the objLoader.
  console.log("MTL file loaded");
}, undefined, (error) => {
  console.error(error);
});

//Second we have to load the OBJ file. It will load with the materials from before.
objLoader.load("assets/Gear/Gear1.obj", (object) => {
  scene.add(object);
  //set the spotlights to target the gear
  spotLight1.target = object;
  spotLight2.target = object;
  spotLight3.target = object;
  spotLight4.target = object;
  console.log("OBJ model loaded");
}, undefined, (error) => {
  console.error(error);
});
*/

/*
 * Importing a gltf model
*/
const gltfLoader = new GLTFLoader();
gltfLoader.load("assets/Explorer/scene.gltf", (object) => {
  scene.add(object.scene);
  console.log("GLTF model loaded");
}, undefined, (error) => {
  console.error(error);
});

