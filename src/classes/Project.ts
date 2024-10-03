import { v4 as uuidv4 } from 'uuid'; // Importing uuid library to create unique ids for each project

// Types for project status and user role which can be exported to other files
export type ProjectStatus = "pending" | "active" | "finished";
export type UserRole = "architect" | "engineer" | "manager";

//For dropdown selectors
export enum Statuses {
  pending = "pending",
  active = "active",
  finished = "finished"
}
export enum userRoles {
  architect = "architect",
  engineer = "engineer",
  manager = "manager"
}
/*
 * Interface for project data. Describes the structure of the project object
 */
export interface IProject {
  name: string;
  description: string;
  status: ProjectStatus;
  userRole: UserRole;
  finishDate: Date;
  cost: number;
  progress: number;
  todos: ITodo[];
}

/*
 * Interface for todo data. Describes the structure of the todo object
 */
export interface ITodo {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  dueDate: Date;
}

/*
 * Class for project data
 */
export class Project implements IProject {
  // Object template properties
  name: string;
  description: string;
  status: Statuses;
  userRole: userRoles;
  finishDate: Date;
  todos: ITodo[] = [];
  
  // Class internals
  cost: number = 0; //Cost of the project
  progress: number = 0; //Progress of the project
  id: string; //Unique identifier for the project
  initials: string = "hc"; //Initials of the project HC are default.

  // Constructor for the project class
  constructor(data: IProject) {
    // Iterating over the data object and assigning each property to the class instance
    for (const key in data) {
      this[key] = data[key];
    }
    this.id = uuidv4(); //Generating a unique identifier for the project
    this.initials = this.name.split(' ').slice(0, 2).map(word => word[0]).join(''); // Generating the initials of the project using first two words
  }

  // Method to get a random color to use as icon for project cards
  getRandomColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
  }
}