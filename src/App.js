import './App.css';
import { useState, useEffect } from "react"
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Header from './components/Header'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import Footer from './components/Footer'
import About from './components/About'

//components can be function or class
function App() {
  const [showAddTask, setShowAddTask] = useState(false)




  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const data = await fetchTasks()
      setTasks(data)
    }
    getTasks()
  }, [])

  //GET Request
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = res.json()
    return data
  }

  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = res.json()
    return data
  }

  //Add Task - POST Request
  const addTask = async (task) => {
    const res = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(task)
    })

    const newTask = await res.json()
    //Append new task in tasks list and update tasks
    setTasks([...tasks, newTask])
  }


  //Delete Task on server and client side - DELETE Request
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {method: 'DELETE'})
    
    setTasks(tasks.filter((task) => 
      task.id !== id
    ))
  }

  //Toggle Reiminder - PUT Request
  const toggleReminder = async (id) => {
    const target = await fetchTask(id)
    const updatedTask = {...target, reminder: !target.reminder}
    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(updatedTask)
    })

    const data = await res.json()


    setTasks(tasks.map((task) => task.id === id ? {...task, reminder: data.reminder} : task))
  }


  return (
    <Router>
      <div className="container">
        <Header title='Task Tracker' onAdd={() => setShowAddTask(!showAddTask)} showAdd = {showAddTask}/>
        <Routes>
          <Route path='/' 
          element={
            <>
            {showAddTask && <AddTask onAdd = {addTask}/>}
            {
              tasks.length > 0 ? 
              <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/> 
              : ("No tasks to show!")
            }
            </>
          } />
          
          <Route path='/about' element={<About />} />
        </Routes> 
        <Footer />
      </div>
    </Router>
  );
}


export default App;
