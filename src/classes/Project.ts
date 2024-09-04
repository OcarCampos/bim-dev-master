import { v4 as uuidv4 } from 'uuid' // Importing uuid library to create unique ids for each project

// Types for project status and user role which can be exported to other files
export type ProjectStatus = "pending" | "active" | "finished"
export type UserRole = "architect" | "engineer" | "manager"

// Interface for project data. Describes the structure of the project object
export interface IProject {
  name: string
  description: string
  status: ProjectStatus
  userRole: UserRole
  finishDate: Date
}

// Class for project data
export class Project implements IProject {
  // Object template properties
  name: string
  description: string
  status: "pending" | "active" | "finished"
  userRole: "architect" | "engineer" | "manager"
  finishDate: Date
  
  // Class internals
  ui: HTMLDivElement //UI element for the project card
  cost: number = 0 //Cost of the project
  progress: number = 0 //Progress of the project
  id: string //Unique identifier for the project

  // Constructor for the project class
  constructor(data: IProject) {
    // Iterating over the data object and assigning each property to the class instance
    for (const key in data) {
      this[key] = data[key]
    }
    this.id = uuidv4() //Generating a unique identifier for the project
    this.setUI() // Calling the method to create the project card UI
  }

  // Method that creates the project card UI to display in the projects list
  setUI() {
    if (this.ui) { return } //If the UI element already exists, return
    this.ui = document.createElement("div")
    this.ui.className = "project-card"
    this.ui.innerHTML = `
      <div class="card-header">
        <p style="background-color: #ca8134; padding: 10px; border-radius: 8px; aspect-ratio: 1;">HC</p>
        <div>
          <h5>${this.name}</h5>
          <p>${this.description}</p>
        </div>
      </div>
      <div class="card-content">
        <div class="card-property">
          <p style="color: #969696;">Status</p>
          <p>${this.status}</p>
        </div>
        <div class="card-property">
          <p style="color: #969696;">Role</p>
          <p>${this.userRole}</p>
        </div>
        <div class="card-property">
          <p style="color: #969696;">Cost</p>
          <p>$${this.cost}</p>
        </div>
        <div class="card-property">
          <p style="color: #969696;">Estimated Progress</p>
          <p>${this.progress}%</p>
        </div>
      </div>`
  }
}