import Task from '../models/Task'
import { getPagination } from '../libs/getPagination'

export const getTasks = async (req, res) => {
  try {
    const { size, page, title } = req.query

    const condition = title
      ? {
          title: { $regex: new RegExp(title), $options: 'i' }
        }
      : {}
    const { limit, offset } = getPagination(page, size)
    const tasks = await Task.paginate(condition, { offset, limit })
    res.send(tasks)
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Something was wrong while retrieving tasks.'
    })
  }
}

export const getTask = async (req, res) => {
  const { id } = req.params

  try {
    const task = await Task.findById(id)
    if (!task) return res.status(404).json({ message: `Task ${id} not found.` })
    res.send(task)
  } catch (error) {
    res.status(500).json({
      message:
        error.message || `Something was wrong while retrieving tasks ${id}.`
    })
  }
}

export const getDoneTasks = async (req, res) => {
  const tasks = await Task.find({ done: true })
  res.send(tasks)
}

export const addTask = async (req, res) => {
  if (!req.body.title) {
    return res.status(400).send({ message: 'Title cannot be empty.' })
  }

  try {
    const newTask = new Task({
      title: req.body.title,
      description: req.body.description,
      done: req.body.done ? req.body.done : false
    })
    const taskSaved = await newTask.save()
    res.send(taskSaved)
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Something was wrong while adding tasks.'
    })
  }
}

export const updateTask = async (req, res) => {
  const { id } = req.params

  try {
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, {
      new: true
    })
    res.send(updatedTask)
  } catch (error) {
    res.status(500).json({
      message: error.message || `Something was wrong while updating task ${id}.`
    })
  }
}

export const deleteTask = async (req, res) => {
  const { id } = req.params

  try {
    const deletedItem = await Task.findByIdAndDelete(id)
    res.json({
      message: deletedItem
        ? `Task: ${deletedItem.title}, has been successfully deleted.`
        : 'Task not found.'
    })
  } catch (error) {
    res.status(500).json({
      message: error.message || `Something was wrong while deleting task ${id}.`
    })
  }
}
