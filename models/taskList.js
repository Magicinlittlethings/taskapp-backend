class TaskList {
    constructor(id, name, tasks = []) {
      this.id = id;
      this.name = name;
      this.tasks = tasks;
    }
  }
  
  module.exports = TaskList;
  