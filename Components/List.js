import { useState, useContext, useEffect } from "react"
import axios from 'axios'
import TasksContext from "../Context/Tasks"
import { Button, Modal, ModalHeader, ModalFooter, ModalBody } from "reactstrap"

export default function List(){
    const {tasks, dispatch} = useContext(TasksContext)
    const [modal, setModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [task, setTask] = useState(undefined)

    useEffect(()=>{
        if(tasks.data.length > 0){
            setTask(tasks.data.find(ele=>ele._id === tasks.selectedTask))
        }
    }, [tasks.selectedTask])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3099/api/tasks');
                dispatch({ type: 'SET_TASKS', payload: response.data });
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };
        fetchData(); // Fetch tasks when the component mounts
    }, [dispatch, tasks.selectedTask]);

    

    const chooseColor = (status)=>{
        if(status === 'To Do'){
            return "badge text-bg-warning"
        }else if(status === 'In Progress'){
            return "badge text-bg-primary "
        }else if(status === 'Done'){
            return "badge text-bg-success "
        }
    }

    const handleRemove = async (id) => {
        const confirm = window.confirm('Are you sure?');
    
        if (confirm) {
            try {
                await axios.delete(`http://localhost:3099/api/tasks/${id}`);
                dispatch({ type: 'REMOVE_TASK', payload: id });
            } catch (e) {
                console.log(e);
            }
        }
    };
    

    const handleSelect = async (id)=>{
        try{
            const response = await axios.get(`http://localhost:3099/api/tasks/${id}`)
            dispatch({type: "SET_TASK", payload: id})
            setTask(response.data)
            setModal(true)
        }catch(e){
            console.log(e)
        }
        
    }
    

    const toggle = ()=>{
        setModal(!modal)
        setIsEdit(false)
        setTask(undefined)
        dispatch({type: "CLEAR_SELECTED_TASK"})
    }

    const handleEdit = ()=>{
        setIsEdit(true)
    }

    const handleSubmit = (e)=>{
        e.preventDefault()
    }

    const handleChange = (e)=>{
        setTask((prevTask)=>({
            ...prevTask,
            [e.target.name]: e.target.value
        }))
    }

    const handleSave = async ()=>{
        try{
            const response = await axios.put(`http://localhost:3099/api/tasks/${task._id}`, task)
            dispatch({type: "UPDATE_TASK", payload: response.data})
            dispatch({type: "CLEAR_SELECTED_TASK"})
            setModal(false)
            setIsEdit(false)
            setTask(undefined)
        }catch(e){
            console.log(e)
        }
        
    }

    return(
        <div className="col-md-8">
            <h2>Listing tasks - {tasks.data.length}</h2>
            {/* <b>Selected task - {tasks.selectedTask} <button onClick={()=>{
                dispatch({type: "CLEAR_TASK"})}
            } >clear</button></b> */}

            {task && (
                <div>
                    <Modal isOpen={modal} toggle={toggle}>
                        <ModalHeader toggle={toggle}>
                            {isEdit ? 'Edit Task' : (
                                <>
                                    {task.title} <span className={chooseColor(task.status)}>{task.status}</span>
                                </>
                            )}
                        </ModalHeader>
                        <ModalBody>
                            {isEdit ? (
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group">
                                        <label className="form-label">title</label>
                                        <input type="text" value={task.title} name="title" onChange={handleChange} className="form-control"/>
                                        </div>
                                        
                                        <div className="form-group">
                                        <label className="form-label">description</label>
                                        <textarea value={task.description} name="description" onChange={handleChange} className="form-control">
                                        </textarea>
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Select status</label>
                                            <select value={task.status} name="status" onChange={handleChange} className="form-control">
                                                <option value="To Do">To Do</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Done">Done</option>
                                            </select>
                                        </div>
                                    </form>    
                            ) : task.description}
                        </ModalBody>
                        <ModalFooter>
                            {isEdit ?
                             <Button color="success" onClick={handleSave}>save</Button> : 
                             <Button color="primary" onClick={handleEdit}>Edit</Button>
                             }
                            <Button color="secondary" onClick={toggle}>close</Button>
                        </ModalFooter>
                    </Modal>
                </div>
            )}
            <ul className="list-group">
                {tasks.data.map((ele)=>{
                    return <li key={ele.id} className="list-group-item">{ele.title}
                    <div className="float-end">
                        <span className={chooseColor(ele.status)}>{ele.status}</span>
                        <button onClick={()=>{handleRemove(ele._id)}} className="btn btn-outline-danger btn-sm">remove</button>
                        <button onClick={()=>{
                            handleSelect(ele._id)
                        }} className="btn btn-outline-primary btn-sm">view</button>
                    </div>
                        
                     </li>
                })}
            </ul>
        </div>
    )
}