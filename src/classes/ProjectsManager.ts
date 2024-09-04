import { IProject, Project, ProjectStatus, UserRole } from "./Project"; // Importing project class and interface

// Class for managing projects
export class ProjectsManager {
  list: Project[] = []; //list of projects
  ui: HTMLElement; //UI element for the project cards

  // Constructor for project cards
  constructor(container: HTMLElement) {
    this.ui = container;  //Creating the container for the project cards
    this.newProject({    //Creating a default project card
      name: "Example Project",
      description: "Example App Project created through JS",
      status: "pending",
      userRole: "architect",
      finishDate: new Date(),
      cost: 0,
      progress: 0
    });
  }

  // Method to create a new project
  newProject(data: IProject) {
    //Maps the names of the projects in the list to projectNames
    const projectNames = this.list.map((project) => {
      return project.name;
    });
    //Checks if the name of the new project is less than 5 characters
    if (data.name.length < 5) {
      throw new Error("The name of the project must be at least 5 characters long.");
    }
    //Checks if the name of the new project is already in use
    const nameInUse = projectNames.includes(data.name);
    if (nameInUse) {
      throw new Error(`A project with the name "${data.name}" already exists. Try a different name.`);
    }
    //Creates a new project with the data provided
    const project = new Project(data);
    //Adds an event listener to the project card to display the project details page
    project.ui.addEventListener("click", () => {
      //Gets the projects page and the project details page
      const projectsPage = document.getElementById("projects-page");
      const detailsPage = document.getElementById("project-details");
      //If the projects page or the project details page do not exist, return
      if (!(projectsPage && detailsPage)) { return; }
      //Hides the projects page and displays the project details page
      projectsPage.style.display = "none";
      detailsPage.style.display = "flex";
      //Sets the details page with the project's data
      this.setDetailsPage(project);
    });
    this.ui.append(project.ui); //Adds the project card to the UI
    this.list.push(project); //Adds the project to the list
    return project; //Returns the project
  }

  // Method to set the details page according to each project stored in the list
  private setDetailsPage(project: Project) {
    const detailsPage = document.getElementById("project-details"); //We call the project details page which contains the variables we want to change
    //If the project details page does not exist, return
    if (!detailsPage) { 
      return; 
    }
    
    //We call the variables we want to change
    const name = detailsPage.querySelector("[data-project-info='name']"); //We call the name of the project
    const description = detailsPage.querySelector("[data-project-info='description']"); //We call the description of the project
    const cardName = detailsPage.querySelector("[data-project-info='cardName']"); //We call the name of the project card
    const cardDescription = detailsPage.querySelector("[data-project-info='cardDescription']"); //We call the description of the project card
    const cardStatus = detailsPage.querySelector("[data-project-info='cardStatus']"); //We call the status of the project card
    const cardCost = detailsPage.querySelector("[data-project-info='cardCost']"); //We call the cost of the project card
    const cardUserRole = detailsPage.querySelector("[data-project-info='cardUserRole']"); //We call the user role of the project card
    const cardFinishDate = detailsPage.querySelector("[data-project-info='cardFinishDate']"); //We call the finish date of the project card
    const cardProgress = detailsPage.querySelector("[data-project-info='cardProgress']") as HTMLElement;
    const cardInitials = detailsPage.querySelector("[data-project-info='cardInitials']") as HTMLElement;

    //Renaming our variables in the html
    //We set the name of the project
    if (name) { 
      name.textContent = project.name; 
    }
    //We set the description of the project
    if (description) { 
      description.textContent = project.description; 
    } 
    //We set the name of the project card
    if (cardName) { 
      cardName.textContent = project.name; 
    }
    //We set the description of the project card
    if (cardDescription) { 
      cardDescription.textContent = project.description; 
    }
    //We set the status of the project card
    if (cardStatus) { 
      cardStatus.textContent = project.status; 
    } 
    //We set the cost of the project card
    if (cardCost) { 
      cardCost.textContent = project.cost.toString(); 
    } 
    //We set the user role of the project card
    if (cardUserRole) { 
      cardUserRole.textContent = project.userRole; 
    } 
    //We set the finish date of the project card
    if (cardFinishDate) { 
      cardFinishDate.textContent = project.finishDate.toString(); 
    } 
    //We set the progress of the project card
    if (cardProgress) { 
      cardProgress.textContent = project.progress.toString() + '%';
      cardProgress.style.width = `${project.progress}%`;
    } 
    //We set the initials of the project card
    if (cardInitials) { 
      cardInitials.textContent = project.initials; 
    }

    //We add an event listener to the edit button to open the edit modal
    const editButton = detailsPage.querySelector("#edit-project-btn");
    if (editButton) {
      editButton.addEventListener("click", () => {
        console.log("Edit button clicked");
        this.openEditModal(project);
      });
    }
  }

  // Method to open the edit modal and populate it with the project's data
  private openEditModal(project: Project) {
    console.log("Inside openEditModal");
    const modal = document.getElementById("edit-project-modal") as HTMLDialogElement;
    if (!modal) return;
  
    const form = document.getElementById("edit-project-form") as HTMLFormElement;
    if (form) {
      console.log("Form found, populating it");
      (form.elements.namedItem("name") as HTMLInputElement).value = project.name;
      (form.elements.namedItem("description") as HTMLTextAreaElement).value = project.description;
      (form.elements.namedItem("status") as HTMLSelectElement).value = project.status;
      (form.elements.namedItem("userRole") as HTMLSelectElement).value = project.userRole;
      const finishDate = project.finishDate instanceof Date ? project.finishDate : new Date(project.finishDate);
      (form.elements.namedItem("finishDate") as HTMLInputElement).value = finishDate.toISOString().split('T')[0];
      (form.elements.namedItem("cost") as HTMLInputElement).value = project.cost.toString();
      (form.elements.namedItem("progress") as HTMLInputElement).value = project.progress.toString();
      console.log("Form populated with project data");
  
      // Remove any existing submit event listeners
      form.removeEventListener('submit', this.handleEditFormSubmit.bind(this, project));
  
      // Add a new submit event listener
      const submitHandler = (e: Event) => {
        console.log("Form submit event triggered");
        e.preventDefault();
        this.handleEditFormSubmit(e, project);
        modal.close();
        console.log("Modal closed");
      };
  
      form.addEventListener('submit', submitHandler);
      console.log("New submit event listener added");
    }
  
    console.log("Showing modal");
    modal.showModal();
    console.log("Modal shown");
  }

  // Method to handle the edit form submission
  private handleEditFormSubmit(e: Event, project: Project) {
    console.log("Inside handleEditFormSubmit");
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
  
    const updatedData: IProject = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as ProjectStatus,
      userRole: formData.get("userRole") as UserRole,
      finishDate: new Date(formData.get("finishDate") as string),
      cost: Number(formData.get("cost")),
      progress: Number(formData.get("progress"))
    };
  
    console.log("Updated data:", updatedData);
    this.updateProject(project, updatedData);
    console.log("Project updated");
  }
  
  // Method to update the project at the details page
  updateProject(project: Project, updatedData: IProject) {
    Object.assign(project, updatedData);
    this.setDetailsPage(project);
  }

  // Method to get a project by id
  getProject(id: string) {
    // Find a project in the list with a matching id
    const project = this.list.find((project) => {
      return project.id === id;
    });
    // Return the found project (or undefined if not found)
    return project;
  }
  
  // Method to delete a project by id
  deleteProject(id: string) {
    const project = this.getProject(id); // Get the project with the given id
    if (!project) { return; } // If the project doesn't exist, exit the function
    project.ui.remove(); // Remove the project's UI element from the DOM
    // Filter out the project with the given id from the list
    const remaining = this.list.filter((project) => { 
      return project.id !== id;
    });
    // Update the list with the remaining projects
    this.list = remaining;
  }

  // Method to calculate the total cost of all projects
  calculateTotalCost() {
    // Array method to calculate the total cost of all projects
    return this.list.reduce((total, project) => {
      return total + project.cost;
    }, 0);
  }

  // Method to get a project by name
  getProjectByName(name: string) {
    // Array method to find a project with a matching name
    return this.list.find((project) => {
      return project.name === name;
    });
  }
  
  // Method to export projects to JSON
  exportToJSON(fileName: string = "projects.json") {
    // Create a new array with projects, excluding the 'ui' property for JSON exporting
    const projectsToExport = this.list.map(project => {
      const { ui, ...projectWithoutUI } = project;
      return projectWithoutUI;
    });
    // Convert the projects array to a JSON string with indentation
    const json = JSON.stringify(projectsToExport, null, 2);  // project list to JSON format
    const blob = new Blob([json], { type: 'application/json' });  // blob to store the JSON data
    const url = URL.createObjectURL(blob);  // URL to download the JSON data
    const a = document.createElement('a');  // create a link element
    a.href = url;  // set the href attribute to the URL
    a.download = fileName;  // set the download attribute to the file name
    a.click();  // click the link to download the file
    URL.revokeObjectURL(url);  // revoke the URL to free up memory
  }
  
  // Method to import projects from JSON
  importFromJSON() {
    const input = document.createElement('input'); //create an input element
    input.type = 'file';  //set the type attribute to file
    input.accept = 'application/json';  //set the accept attribute to JSON
    const reader = new FileReader();  //create a FileReader object
    // when the file is read, parse the JSON and create new projects
    reader.addEventListener("load", () => {
      const json = reader.result;   //get the JSON data from the FileReader object
      if (!json) { return; }  //if the JSON data is not found, return
      const projects: IProject[] = JSON.parse(json as string);  //parse the JSON data according to the IProject interface
      for (const project of projects) {  //for each project in the JSON data
        try {
          this.newProject(project);  //create a new project with the data from the JSON
        } catch (error) {
          console.log("Error creating project from JSON:", error);
        }
      }
    });
    // when the user selects a file, read the file as text
    input.addEventListener('change', () => {
      const filesList = input.files;
      if (!filesList) { return; }
      reader.readAsText(filesList[0]); //we read the first file in the list
    });
    input.click(); //we click the input element to open the file dialog
  }
}