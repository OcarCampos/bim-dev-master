import * as React from 'react';

//Three JS Imports
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function ThreeViewer() {
    let scene: THREE.Scene | null;
    let mesh: THREE.Object3D | null;
    let camera: THREE.PerspectiveCamera | null;
    let renderer: THREE.WebGLRenderer | null;
    let cameraControls: OrbitControls | null;
    let gui: GUI | null;
    let gltfLoader: GLTFLoader | null;
    let loader: THREE.ObjectLoader | null;
    let obj: THREE.Object3D | null;
    let mtl: any | null;
    let gltf: any | null;
    let guiControls: any | null;
    let ambientLight: THREE.AmbientLight | null;
    let directionalLight: THREE.DirectionalLight | null;
    let spotLight1: THREE.SpotLight | null;
    let spotLight2: THREE.SpotLight | null;
    let spotLight3: THREE.SpotLight | null;
    let spotLight4: THREE.SpotLight | null;
    let axesHelper: THREE.AxesHelper | null;
    let gridHelper: THREE.GridHelper | null;
    let directionalLightHelper: THREE.DirectionalLightHelper | null;
    
    const setViewer = () => {
        /*
        * Three.js Setup
        */
        
        // Create a new scene
        scene = new THREE.Scene();
        // Get the viewer container element
        const viewerContainer = document.getElementById("viewer-container") as HTMLElement;

        // Define the camera
        camera: THREE.PerspectiveCamera;
        // Define the renderer
        renderer: THREE.WebGLRenderer;
        // Define the camera controls
        cameraControls: OrbitControls;
        

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
        /*
        const boxGeometry = new THREE.BoxGeometry(1, 1, 1); // Create a new box geometry with a size of 1x1x1
        const material = new THREE.MeshStandardMaterial(); // Create a new standard material
        const cube = new THREE.Mesh(boxGeometry, material); // Create a new mesh with the box geometry and material
        */
        /*
        * Lights for the scene
        */
        
        ambientLight = new THREE.AmbientLight(0xffffff, 0.4);

        directionalLight = new THREE.DirectionalLight(0xffffff, 1);  
        directionalLight.position.set(0, 20, 0);
        

        /*
        * 4 Spot lights for the scene.
        * Position of spotlights are
        * 1. x: 15, y: 15, z: 0
        * 2. x: -15, y: 15, z: 0
        * 3. x: 0, y: 15, z: 15
        * 4. x: 0, y: 15, z: -15
        */
        
        spotLight1 = new THREE.SpotLight(0xffffff, 1, 20, Math.PI * 0.1, 0.01);
        spotLight2 = new THREE.SpotLight(0xffffff, 1, 20, Math.PI * 0.1, 0.01);
        spotLight3 = new THREE.SpotLight(0xffffff, 1, 20, Math.PI * 0.1, 0.01);
        spotLight4 = new THREE.SpotLight(0xffffff, 1, 20, Math.PI * 0.1, 0.01);

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
            if (!renderer || !scene || !camera) return;
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
        
        axesHelper = new THREE.AxesHelper(5); // Create a new axes helper with a length of 10
        scene.add(axesHelper); // Add the axes helper to the scene

        gridHelper = new THREE.GridHelper(100, 100); // Create a new grid helper with a size of 100 and a division of 100
        gridHelper.material.transparent = true; // Make the grid helper transparent
        gridHelper.material.opacity = 0.5; // Set the opacity of the grid helper to 0.5
        gridHelper.material.color.set(0x00ff00); // Set the color of the grid helper to green

        directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight); // Create a new directional light helper
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
        
        gui = new GUI();
        
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
        /*
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
        */
        
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
        
        gltfLoader = new GLTFLoader();
        gltfLoader.load("../../assets/Explorer/scene.gltf", (object) => {
            if (!scene) return ;
            scene.add(object.scene);
            mesh = object.scene;
            console.log("GLTF model loaded");
            }, 
        undefined, (error) => {
            console.error(error);
        });         
    } //End of setViewer
    
    React.useEffect(() => {
        setViewer();
        return () => {
            if (!mesh) return;
            mesh.removeFromParent();
            mesh.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.geometry.dispose();
                    child.material.dispose();
                }
            });
            if (!scene) return;
            scene.remove(mesh);
            scene.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.geometry.dispose();
                    child.material.dispose();
                }
            })
        }
        
    }, []);

    return (
        <div
            id="viewer-container"
            className="dashboard-card"
            style={{ minWidth: 0 }}
        >
            {/* Viewer content will be inserted here in M3*/}
        </div>
    );
}