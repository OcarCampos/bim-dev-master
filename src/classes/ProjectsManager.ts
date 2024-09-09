import { IProject, Project, ProjectStatus, UserRole, Statuses, userRoles } from "./Project"; // Importing project class and interface

/*
 * Class for managing projects
 */
export class ProjectsManager {
  list: Project[] = []; //list of projects
  ui: HTMLElement; //UI element for the project cards

  /*
   * Constructor for project cards
   */
  constructor(container: HTMLElement) {
    this.ui = container;  //Creating the container for the project cards
    this.newProject({    //Creating a default project card
      name: "Example Project",
      description: "Example App Project created through JS",
      status: "finished",
      userRole: "architect",
      finishDate: new Date(),
      cost: 0,
      progress: 0
    });
  }

  /*
   * Method to create a new project
   */
  newProject(data: IProject) {
    //List of the names of the projects in the list
    const projectNames = this.list.map((project) => {
      return project.name;
    });
    //Checks if the name of the new project is less than 5 characters
    if (data.name.length < 5) {
      throw new Error("The name of the project must be at least 5 characters long.");
    }
    //Checks if the name of the new project is already in use
    if (projectNames.includes(data.name)) {
      throw new Error(`A project with the name "${data.name}" already exists. Try a different name.`);
    }
    //Creates a new project with the data provided
    const project = new Project(data);
    //Adds an event listener to the project card html element to display the project details page
    project.ui.addEventListener("click", () => {
      const projectsPage = document.getElementById("projects-page");
      const detailsPage = document.getElementById("project-details");
      if (!(projectsPage && detailsPage)) { return; }
      projectsPage.style.display = "none";
      detailsPage.style.display = "flex";
      //Updates the details page with the current project's data
      this.setDetailsPage(project);
      this.setEditModal(project);
    });
    this.ui.append(project.ui); //Adds the project card to the UI
    this.list.push(project); //Adds the project to the list
    return project; //Returns the project
  }

  /*
   * Method to set the details page according to project details.
   * Method is private because it is only used internally by the class.
   */
  private setDetailsPage(project: Project) {
    const detailsPage = document.getElementById("project-details");
    if (!detailsPage) { 
      return; 
    }
    
    //Variables to change in details page
    const name = detailsPage.querySelector("[data-project-info='name']"); 
    const description = detailsPage.querySelector("[data-project-info='description']"); 
    const cardName = detailsPage.querySelector("[data-project-info='cardName']"); 
    const cardDescription = detailsPage.querySelector("[data-project-info='cardDescription']"); 
    const cardStatus = detailsPage.querySelector("[data-project-info='cardStatus']"); 
    const cardCost = detailsPage.querySelector("[data-project-info='cardCost']"); 
    const cardUserRole = detailsPage.querySelector("[data-project-info='cardUserRole']"); 
    const cardFinishDate = detailsPage.querySelector("[data-project-info='cardFinishDate']"); 
    const cardProgress = detailsPage.querySelector("[data-project-info='cardProgress']") as HTMLElement;
    const cardInitials = detailsPage.querySelector("[data-project-info='cardInitials']") as HTMLElement;

    //Renaming details page html
    if (name) { 
      name.textContent = project.name; 
    }
    if (description) { 
      description.textContent = project.description; 
    } 
    if (cardName) { 
      cardName.textContent = project.name; 
    }
    if (cardDescription) { 
      cardDescription.textContent = project.description; 
    }
    if (cardStatus) { 
      cardStatus.textContent = project.status; 
    } 
    if (cardCost) { 
      cardCost.textContent = project.cost.toString(); 
    } 
    if (cardUserRole) { 
      cardUserRole.textContent = project.userRole; 
    } 
    if (cardFinishDate) { 
      cardFinishDate.textContent = project.finishDate.toString(); 
    } 
    if (cardProgress) { 
      cardProgress.textContent = project.progress.toString() + '%';
      cardProgress.style.width = `${project.progress}%`;
    } 
    if (cardInitials) { 
      cardInitials.textContent = project.initials; 
    }
  }

  /*
   * Method to set the edit modal according to project details.
   * Method is private because it is only used internally by the class.
   */
  private setEditModal(project: Project) {
     //Variables to change in edit modal
     const editName = document.getElementById("edit-name") as HTMLInputElement;
     const editDescription = document.getElementById("edit-description") as HTMLTextAreaElement;
     const editStatus = document.getElementById("edit-status") as HTMLSelectElement;
     const editUserRole = document.getElementById("edit-userRole") as HTMLSelectElement;
     const editFinishDate = document.getElementById("edit-finishDate") as HTMLInputElement;
     const editCost = document.getElementById("edit-cost") as HTMLInputElement;
     const editProgress = document.getElementById("edit-progress") as HTMLInputElement;

     // Renaming edit modal html
    if (editName) { 
      editName.value = project.name; 
    }
    if (editDescription) { 
      editDescription.value = project.description; 
    }
    if (editStatus) { 
      // Clear current options and replace with project information
      editStatus.innerHTML = "";
      const defaultOption = document.createElement("option");
      defaultOption.value = project.status;
      defaultOption.textContent = project.status;
      defaultOption.selected = true;
      editStatus.appendChild(defaultOption);
      // Create and add other options
      Object.values(Statuses).forEach((status) => {
        if (status !== project.status) {
          const option = document.createElement("option");
          option.value = status;
          option.textContent = status;
          editStatus.appendChild(option);
        }
      });
    }
    if (editUserRole) { 
      // Clear current options and replace with project information
      editUserRole.innerHTML = "";
      const defaultOption = document.createElement("option");
      defaultOption.value = project.userRole;
      defaultOption.textContent = project.userRole;
      defaultOption.selected = true;
      editUserRole.appendChild(defaultOption);
      // Create and add other options
      Object.values(userRoles).forEach((role) => {
        if (role !== project.userRole) {
          const option = document.createElement("option");
          option.value = role;
          option.textContent = role;
          editUserRole.appendChild(option);
        }
      });
    }
    if (editFinishDate) { 
      const finishDate = project.finishDate instanceof Date ? project.finishDate : new Date(project.finishDate);
      editFinishDate.value = finishDate.toISOString().split('T')[0];
    }
    if (editCost) { 
      editCost.value = project.cost.toString(); 
    }
    if (editProgress) { 
      editProgress.value = project.progress.toString(); 
    }
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