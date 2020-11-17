import React from 'react';
import Forms from "../components/Forms";
import axios from 'axios';
import addNotification from 'react-push-notification';

import TodoComponent from '../components/Todo'
import {Button, CardGroup} from "react-bootstrap";

interface Props {
}

interface Todo {
    id: number | undefined;
    category: string;
    title: string;
    description: string;
    deadline: Date | undefined;
    location: string | undefined;
}

interface State {
    emptyTodo: Todo;
    todoList: Array<Todo> | undefined;
    isShow: boolean;
}

export default class Home extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            emptyTodo: {
                id: undefined,
                category: ``,
                title: ``,
                description: ``,
                deadline: undefined,
                location: undefined
            },
            todoList: [
                {
                    id: 2,
                    category: `meeting`,
                    title: `It's a Meeting`,
                    description: `Hello meeting`,
                    deadline: undefined,
                    location: undefined
                },
                {
                    id: 1,
                    category: `task`,
                    title: `It's a Task`,
                    description: `Hello Task`,
                    deadline: undefined,
                    location: undefined
                }],
            isShow: false,

        }
        this.getTodoList()
    }

    componentDidMount() {

    }

    getTodoList = () => {
        addNotification({
            title: 'Warning',
            subtitle: 'This is a subtitle',
            message: 'This is a very long message',
            theme: 'darkblue',
            native: true // when using native, your OS will handle theming.
        })
        // axios.get("/api/task/").then(res => {
        //     console.log(res)
        // })
    }

    updateTodo = () => {
    }

    setModalShow = (value: boolean) => {
        this.setState({isShow: value})
        console.log(this.state.isShow)
    }

    render() {
        return (
            <div className="text-center hero my-5">
                <h1 className="mb-4">What's next ?</h1>
                <CardGroup>
                    {this.state.todoList?.map((i) => <TodoComponent key={i.id} todo={i}/>)}
                </CardGroup>
                <Button type="button" className="btn btn-primary" data-toggle="modal" onClick={() => this.setModalShow(true)}
                        data-target="#myModal">Add Todo
                </Button>
                <Forms show={this.state.isShow} onHide={() => this.setModalShow(false)} todo={this.state.emptyTodo}/>
            </div>
        );
    }
};

