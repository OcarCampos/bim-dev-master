import { IProject, Project } from "./Project" // Importing project class and interface

// Class for managing projects
export class ProjectsManager {
  list: Project[] = [] //list of projects
  ui: HTMLElement //UI element for the project cards

  // Constructor for project cards
  constructor(container: HTMLElement) {
    this.ui = container  //Creating the container for the project cards
    this.newProject({    //Creating a default project card
      name: "Example Project",
      description: "Example App Project created through JS",
      status: "pending",
      userRole: "architect",
      finishDate: new Date()
    })
  }

  // Method to create a new project
  newProject(data: IProject) {
    //Maps the names of the projects in the list to projectNames
    const projectNames = this.list.map((project) => {
      return project.name
    })
    //Checks if the name of the new project is already in use
    const nameInUse = projectNames.includes(data.name)
    if (nameInUse) {
      throw new Error(`A project with the name "${data.name}" already exists. Try a different name.`)
    }
    //Creates a new project with the data provided
    const project = new Project(data)
    //Adds an event listener to the project card to display the project details page
    project.ui.addEventListener("click", () => {
      //Gets the projects page and the project details page
      const projectsPage = document.getElementById("projects-page")
      const detailsPage = document.getElementById("project-details")
      //If the projects page or the project details page do not exist, return
      if (!(projectsPage && detailsPage)) { return }
      //Hides the projects page and displays the project details page
      projectsPage.style.display = "none"
      detailsPage.style.display = "flex"
      //Sets the details page with the project's data
      this.setDetailsPage(project)
    })
    this.ui.append(project.ui) //Adds the project card to the UI
    this.list.push(project) //Adds the project to the list
    return project //Returns the project
  }

  // Method to set the details page
  private setDetailsPage(project: Project) {
    const detailsPage = document.getElementById("project-details")
    if (!detailsPage) { return }
    const name = detailsPage.querySelector("[data-project-info='name']")
    if (name) { name.textContent = project.name }
    const description = detailsPage.querySelector("[data-project-info='description']")
    if (description) { description.textContent = project.description }
    const cardName = detailsPage.querySelector("[data-project-info='cardName']")
    if (cardName) { cardName.textContent = project.name }
    const cardDescription = detailsPage.querySelector("[data-project-info='cardDescription']")
  }

  // Method to get a project by id
  getProject(id: string) {
    // Find a project in the list with a matching id
    const project = this.list.find((project) => {
      return project.id === id
    })
    // Return the found project (or undefined if not found)
    return project
  }
  
  // Method to delete a project by id
  deleteProject(id: string) {
    const project = this.getProject(id) // Get the project with the given id
    if (!project) { return } // If the project doesn't exist, exit the function
    project.ui.remove() // Remove the project's UI element from the DOM
    // Filter out the project with the given id from the list
    const remaining = this.list.filter((project) => { 
      return project.id !== id
    })
    // Update the list with the remaining projects
    this.list = remaining
  }

  // Method to calculate the total cost of all projects
  calculateTotalCost() {
    // Array method to calculate the total cost of all projects
    return this.list.reduce((total, project) => {
      return total + project.cost
    }, 0)
  }

  // Method to get a project by name
  getProjectByName(name: string) {
    // Array method to find a project with a matching name
    return this.list.find((project) => {
      return project.name === name
    })
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
    const input = document.createElement('input') //create an input element
    input.type = 'file'  //set the type attribute to file
    input.accept = 'application/json'  //set the accept attribute to JSON
    const reader = new FileReader()  //create a FileReader object
    // when the file is read, parse the JSON and create new projects
    reader.addEventListener("load", () => {
      const json = reader.result   //get the JSON data from the FileReader object
      if (!json) { return }  //if the JSON data is not found, return
      const projects: IProject[] = JSON.parse(json as string)  //parse the JSON data according to the IProject interface
      for (const project of projects) {  //for each project in the JSON data
        try {
          this.newProject(project)  //create a new project with the data from the JSON
        } catch (error) {
          console.log("Error creating project from JSON:", error)
        }
      }
    })
    // when the user selects a file, read the file as text
    input.addEventListener('change', () => {
      const filesList = input.files
      if (!filesList) { return }
      reader.readAsText(filesList[0]) //we read the first file in the list
    })
    input.click() //we click the input element to open the file dialog
  }
}