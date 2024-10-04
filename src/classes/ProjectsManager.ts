import { IProject, Project, ProjectStatus, UserRole, Statuses, userRoles, ITodo } from "./Project"; // Importing project class and interface

/*
 * Class for managing projects
 */
export class ProjectsManager {
  list: Project[] = []; //list of projects
  //these functions are called any time projects created/deleted/edited.
  //The code of the function is modified in the React component.
  onProjectCreated = (project: Project) => {};
  onProjectDeleted = () => {};

  /*
   * Constructor for project cards
   */
  constructor() {
    this.newProject({    //Should be this.newProject()
      name: "Example Project",
      description: "Example App Project created through JS",
      status: "finished",
      userRole: "architect",
      finishDate: new Date("2023-12-31"),
      cost: 252000,
      progress: 75,
      todos: [
        {
          id: "todo-0",
          name: "Default Example To Do 0",
          description: "Example To Do 0 created through JS",
          status: "active",
          dueDate: new Date("2023-07-15")
        }
      ]
    });
    //this.list.push(project);
  }

  filterProjects(searchTerm: string) {
    const filteredProjects = this.list.filter((project) => {
      return project.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
    return filteredProjects;
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
    this.list.push(project); //Adds the project to the list
    this.onProjectCreated(project); //Calls the onProjectCreated function
    return project; //Returns the project
  }

  /*
   * Method to set the status color of the To Do icon according to the status of the To Do  
   */
  setStatusColor(status: ProjectStatus) {
    switch (status) {
      case "active":
        return "#007bff"; //blue
      case "pending":
        return "#ffc107"; //yellow
      case "finished":
        return "#28a745"; //green
      default:
        return "#6c757d"; //gray
    }
  }
  
  /*
   * Method to set the edit modal according to current project details.
   * Method is private because it is only used internally by the class.
   */
  setEditModal(project: Project) {
     //Variables to change in edit modal for project
     const editProjectId = document.getElementById("edit-projectId") as HTMLInputElement;
     const editName = document.getElementById("edit-name") as HTMLInputElement;
     const editDescription = document.getElementById("edit-description") as HTMLTextAreaElement;
     const editStatus = document.getElementById("edit-status") as HTMLSelectElement;
     const editUserRole = document.getElementById("edit-userRole") as HTMLSelectElement;
     const editFinishDate = document.getElementById("edit-finishDate") as HTMLInputElement;
     const editCost = document.getElementById("edit-cost") as HTMLInputElement;
     const editProgress = document.getElementById("edit-progress") as HTMLInputElement;

     // Renaming edit modal html
    if (editProjectId) { 
      editProjectId.value = project.id; 
    }
    if (editName) { 
      editName.value = project.name; 
    }
    if (editDescription) { 
      editDescription.value = project.description; 
    }
    if (editStatus) { 
      // Clear existing options
      editStatus.innerHTML = '';
      // Fill select with options from Statuses enum
      Object.values(Statuses).forEach((status) => {
        const option = document.createElement("option");
        option.value = status;
        option.textContent = status;
        if (status === project.status) {
          option.setAttribute('selected', 'selected');
        }
        editStatus.appendChild(option);
      });
    }
    if (editUserRole) { 
      // Clear existing options
      editUserRole.innerHTML = '';
      // Fill select with options from UserRole enum
      Object.values(userRoles).forEach((role) => {
        const option = document.createElement("option");
        option.value = role;
        option.textContent = role;
        if (role === project.userRole) {
          option.setAttribute('selected', 'selected');
        }
        editUserRole.appendChild(option);
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

  /*
   * Method to set the update todo modal according to todo details.
   * Method is private because it is only used internally by the class.
   */
  setToDoModal(todo: ITodo, projectId: string) {
    //variables to change in update-todo-modal for todos
    const updateTodoProjectId = document.getElementById("update-todo-projectId") as HTMLInputElement;
    const updateTodoId = document.getElementById("update-todo-id") as HTMLInputElement;
    const updateTodoName = document.getElementById("update-todo-name") as HTMLInputElement;
    const updateTodoDescription = document.getElementById("update-todo-description") as HTMLTextAreaElement;
    const updateTodoDueDate = document.getElementById("update-todo-dueDate") as HTMLInputElement;
    const updateTodoStatus = document.getElementById("update-todo-status") as HTMLSelectElement;

    //Renaming update-todo-modal html
    if (updateTodoProjectId) { 
      updateTodoProjectId.value = projectId; 
    }
    if (updateTodoId) { 
      updateTodoId.value = todo.id; 
    }
    if (updateTodoName) { 
      updateTodoName.value = todo.name; 
    }
    if (updateTodoDescription) { 
      updateTodoDescription.value = todo.description; 
    }
    if (updateTodoDueDate) { 
      const dueDate = todo.dueDate instanceof Date ? todo.dueDate : new Date(todo.dueDate);
      updateTodoDueDate.value = dueDate.toISOString().split('T')[0];
    }
    if (updateTodoStatus) { 
      // Clear existing options
      updateTodoStatus.innerHTML = '';
      // Fill select with options from Statuses enum
      Object.values(Statuses).forEach((status) => {
        const option = document.createElement("option");
        option.value = status;
        option.textContent = status;
        if (status === todo.status) {
          option.setAttribute('selected', 'selected');
        }
        updateTodoStatus.appendChild(option);
      });
    }
  }

  /*
   * Method to add a todo to a project
   */
  addTodo(projectId: string, todo: ITodo) {
    const project = this.getProject(projectId);
    if (project) {
      project.todos.push(todo);
    }
  }

  /*
   * Method to update a todo in a project
   */
  updateTodo(projectId: string, todoId: string, updatedTodo: ITodo) {
    const project = this.getProject(projectId);
    if (project) {
      const todo = project.todos.find(t => t.id === todoId);
      if (todo) {
        Object.assign(todo, updatedTodo);
      }
    }
  }

  /*
   * Method to get all the todos of a project
   */
  getTodos(projectId: string) {
    const project = this.getProject(projectId);
    if (project) {
      return project.todos;
    }
    return [];
  } 

  /*
   * Method to update the project information
   */
  updateProject(project: Project, updatedData: IProject) {
    const todos = this.getTodos(project.id); //get all the todos of the project
    Object.assign(project, updatedData);    // Updates the project with the new data
    project.todos = todos;                  // Updates the todos of the project
    this.setEditModal(project);            // Updates the edit modal
  }

  /*
   * Method to get a project by id
   */
  getProject(id: string) {
    // Find a project in the list with a matching id
    const project = this.list.find((project) => {
      return project.id === id;
    });
    // Return the found project (or undefined if not found)
    return project;
  }
  
  /*
   * Method to delete a project by id
   */
  deleteProject(id: string) {
    const project = this.getProject(id); 
    if (!project) { return; } 
    // Filter out the project with the given id from the list
    const remaining = this.list.filter((project) => { 
      return project.id !== id;
    });
    // Update the list with the remaining projects
    this.list = remaining;
    this.onProjectDeleted();
  }

  /*
   * Method to calculate the total cost of all projects
   */
  calculateTotalCost() {
    // Array method to calculate the total cost of all projects
    return this.list.reduce((total, project) => {
      return total + project.cost;
    }, 0);
  }

  /*
   * Method to get a project by name
   */
  getProjectByName(name: string) {
    // Array method to find a project with a matching name
    return this.list.find((project) => {
      return project.name === name;
    });
  }
  
  /*
   * Method to export projects to JSON
   */
  exportToJSON(fileName: string = "projects.json") {
    const projectsToExport = this.list;
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
  
  /*
   * Method to import projects from JSON
   */
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
          //search for current project name in the current list of projects
          const existantProject = this.getProjectByName(project.name);
          //update existing project with the data from the JSON  or create a new one.
          if (existantProject) {
            this.updateProject(existantProject, project);
          } else {
            this.newProject(project);  
          }
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