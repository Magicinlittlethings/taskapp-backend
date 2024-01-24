const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3001;
const cors = require('cors'); // Import the cors middleware


app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


const Task = require('./models/task');
const TaskList = require('./models/taskList');

const taskLists = [
  new TaskList(1, 'Personal', [
    new Task(1, 'Buy groceries', 'Milk, eggs, bread', '2023-01-31'),
    new Task(2, 'Exercise', 'Go for a run', '2023-02-05'),
  ]),
  new TaskList(2, 'Work', [
    new Task(3, 'Finish report', 'Complete and submit by Friday', '2023-02-10'),
  ]),
];

app.get('/task-lists', (req, res) => {
  res.json(taskLists);
});


// Get all task lists
app.get('/task-lists', (req, res) => {
    res.json(taskLists);
  });
  
  // Get a specific task list by ID
  app.get('/task-lists/:id', (req, res) => {
    const taskListId = parseInt(req.params.id);
    const taskList = taskLists.find((list) => list.id === taskListId);
  
    if (taskList) {
      res.json(taskList);
    } else {
      res.status(404).json({ message: 'Task list not found' });
    }
  });
  
  // Create a new task list
  app.post('/task-lists', (req, res) => {
    const { name } = req.body;
    const newTaskList = new TaskList(taskLists.length + 1, name);
    taskLists.push(newTaskList);
    res.status(201).json(newTaskList);
  });
  
  // Update a task list by ID
  app.put('/task-lists/:id', (req, res) => {
    const taskListId = parseInt(req.params.id);
    const updatedList = req.body;
    const index = taskLists.findIndex((list) => list.id === taskListId);
  
    if (index !== -1) {
      taskLists[index] = { ...taskLists[index], ...updatedList };
      res.json(taskLists[index]);
    } else {
      res.status(404).json({ message: 'Task list not found' });
    }
  });
  
  // Delete a task list by ID
  app.delete('/task-lists/:id', (req, res) => {
    const taskListId = parseInt(req.params.id);
    const index = taskLists.findIndex((list) => list.id === taskListId);
  
    if (index !== -1) {
      const deletedList = taskLists.splice(index, 1)[0];
      res.json(deletedList);
    } else {
      res.status(404).json({ message: 'Task list not found' });
    }
  });



// Create a new task in a specific task list
app.post('/task-lists/:listId/tasks', (req, res) => {
    const taskListId = parseInt(req.params.listId);
    const { title, description, dueDate } = req.body;
  
    const taskList = taskLists.find((list) => list.id === taskListId);
  
    if (taskList) {
      const newTask = new Task(taskList.tasks.length + 1, title, description, dueDate);
      taskList.tasks.push(newTask);
      res.status(201).json(newTask);
    } else {
      res.status(404).json({ message: 'Task list not found' });
    }
  });
  
  // Delete a task from a specific task list by ID
  app.delete('/task-lists/:listId/tasks/:taskId', (req, res) => {
    const taskListId = parseInt(req.params.listId);
    const taskId = parseInt(req.params.taskId);
  
    const taskList = taskLists.find((list) => list.id === taskListId);
  
    if (taskList) {
      const taskIndex = taskList.tasks.findIndex((task) => task.id === taskId);
  
      if (taskIndex !== -1) {
        const deletedTask = taskList.tasks.splice(taskIndex, 1)[0];
        res.json(deletedTask);
      } else {
        res.status(404).json({ message: 'Task not found in the specified list' });
      }
    } else {
      res.status(404).json({ message: 'Task list not found' });
    }
  });
  
   // Handle other routes
   app.use((req, res) => {
    res.status(404).json({ message: 'Not Found' });
  });
  
  