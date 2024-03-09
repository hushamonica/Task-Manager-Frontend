import { useContext, useState } from "react"
import axios from 'axios'
import TasksContext from "../Context/Tasks"

export default function Form() {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [formErrors, setFormErrors] = useState({})
    const errors = {}

    const { dispatch } = useContext(TasksContext)

    const runValidations = () => {
        if(title.trim().length === 0) {
            errors.title = 'title is required'
        }
        if(description.trim().length === 0) {
            errors.description = 'description is required'
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = {
            title: title,
            description: description,
            status: 'To Do'
        }
        // console.log(formData)
        runValidations()

        if (Object.keys(errors).length !== 0) {
            setFormErrors(errors)
        }else{
            try{
                const response = await axios.post('http://localhost:3099/api/tasks', formData)
                dispatch({type: 'ADD_TASK', payload: response.data})
                setTitle('')
                setDescription('')
                setFormErrors({})
            }catch(e){
                console.log(e)
            }  
        }
    }

    return (
        <div className="col-md-4">
            <h3>Add Task</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group" >
                    <label htmlFor="title" className="form-label">title</label>
                    <input type='text' 
                    value={title} 
                    onChange={(e) => { setTitle(e.target.value) }} 
                    id='title'
                    className={`form-control ${formErrors.title ? 'is-invalid' : ''}`} />

                     {formErrors.title && (
                        <div className="invalid-feedback">
                            {formErrors.title}
                        </div>
                     )}
                </div>

                <div className="form-group" >
                    <label htmlFor='description' className="form-label">description</label>
                    <textarea value={description} 
                    id='description' 
                    onChange={(e) => { setDescription(e.target.value) }} 
                    className={`form-control ${formErrors.description ? 'is-invalid': ''}`}> </textarea>

                    {formErrors.description && (
                        <div className="invalid-feedback">
                            {formErrors.description}
                        </div>
                    )}
                </div>
                    <input type='submit' className="btn btn-primary" />
            </form>
        </div>
    )
}