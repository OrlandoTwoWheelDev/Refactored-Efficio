const express = require('express');
const router = express.Router();

const{ fetchAllTasksByProducts, getMyTasks, 
  getMyTasksPercentage, deleteExistingTask, 
  updateExistingTask, createTasks, getAllTasks} = require('../db/tasks.cjs');


router.get('/' , async(req, res) => {
  try{
    const tasks = await getAllTasks();
    res.json(tasks);
  }catch(err){
    throw err
  }
});

router.get('/tasks', (req, res) => {
  db.query('SELECT * FROM tasks WHERE owner = ?', [req.user.username], (err, tasks) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching tasks' });
    }
    return res.json(tasks);
  });
});


router.get('/new-task', (req, res) => {
  res.render('new-task-form');
});


router.get('/byproject/:project_id', async(req, res, next) => {
  const {project_id} = req.params;
  try{
    const allTasksByProject = await fetchAllTasksByProducts(project_id);

    res.send(allTasksByProject);
  } catch(err) {
    next(err);
  }
});

router.get('/byowner/:username', async(req, res, next) => {
  const {username} = req.params;
console.log(username);
  try{
    const allTasksByOwner = await getMyTasks(username);

    res.send(allTasksByOwner);

  } catch(err) {
    next(err);
  }
});

router.get('/percentagebyowner/:username', async(req, res, next) => {
  const {username} = req.params;

  try{
    const tasksPercentageByOwner = await getMyTasksPercentage(username);

    res.send(tasksPercentageByOwner);

  } catch(err) {
    next(err);
  }
});

router.post('/create-new-tasks', async(req, res, next) => {
  
  try{
    const{owner, subject, description, project_id, priority, start_date, end_date, status, parent_task_id, sub_task_id} = req.body;
    console.log(req.body);
    if (!owner || !subject || !description || !project_id || !start_date || !end_date || !status) {
      return res.status(400).json({error: "All fields are required!"});
    }

    const newTask = await createTasks(owner, subject, description, project_id, priority, start_date, end_date, status, parent_task_id, sub_task_id);

    res.status(201).json({message: "Task created successfullt!!!", newTask});
  }catch(err) {
    next(err);
    res.status(500).json({error: "Server error"});
  }
});

router.delete('/deletetasks/:taskId', async(req, res, next) => {
  const {taskId} = req.params;
  console.log("Deleting TaskID:",taskId);
  try{

    const deletedTask = await deleteExistingTask(taskId);

    if (!deletedTask) {
      return res.status(404).json({error: "Task not found!"});
    }

    res.status(204).send();
  } catch(err) {
    next(err);
  }
});

router.patch('/update/:taskId', async(req, res, next) => {
  try {
    const {taskId} = req.params;
    const updates = req.body;

    if (!Object.keys(updates).length) {
      return res.status(400).json({ error: "No fields provided for update." });
    }

    const updatedTask = await updateExistingTask(taskId, updates);
    
    res.status(200).json({ message: "Task updated successfully!", task: updatedTask });
  } catch (err) {
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

module.exports  = router;