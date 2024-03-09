import { useReducer } from "react"
import TasksContext from "../Context/Tasks"
import List from "./List"
import Form from "./Form"


const reducer = (state, action) => {
    switch(action.type) {
        case 'ADD_TASK': {
            return {...state, data: [...state.data, action.payload]}
        }
        case 'SET_TASKS': {
            return {...state, data: action.payload}
        }
        case 'REMOVE_TASK': {
            return {...state, data: state.data.filter(ele => ele._id !== action.payload)}
        }
        case 'SET_TASK': {
            return {...state, selectedTask: action.payload}
        }
        case 'CLEAR_SELECTED_TASK': {
            return {...state, selectedTask:''}
        }
        case 'UPDATE_TASK': {
            return {...state, data: state.data.map(ele=>{
                if(ele._id === action.payload._id){
                    return {...ele, ...action.payload}
                }else{
                    return {...ele}
                }
            })}
        }
        default: {
            return {...state }
        }
    }
}

export default function Container() {
    const [tasks, dispatch] = useReducer(reducer, { data: [], selectedTask: '' })
    return (
        <TasksContext.Provider value={{tasks: tasks, dispatch: dispatch}}>
            <div className="row">
                <List />
                <Form />
            </div>
        </TasksContext.Provider>
    )
}