import React, {Component} from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import {Button, Modal, Form, InputGroup, FormControl} from "react-bootstrap";

interface Props {
    todo: TodoComponent
    onHide: any
    show: boolean
}

interface TodoComponent {
    id: number | undefined;
    category: string;
    title: string;
    description: string;
    deadline: Date | undefined;
    location: string | undefined;
}

interface State {
    category?: string;
    title?: string;
    description?: string;
    deadline?: Date | undefined,
    location?: string
}

export default class Forms extends React.Component<Props, State> {
    constructor(props: any) {
        super(props);
        this.state = {
            category: this.props.todo.category,
            title: this.props.todo.title,
            description: this.props.todo.description,
            deadline: this.props.todo.deadline,
            location: this.props.todo.location,
        }
        this.handleChange = this.handleChange.bind(this)
        console.log(this.props)
    }

    handleChange(e: any, key: string) {
        this.setState({[key]: e.target.value})
        console.log(this.state.category)
    }

    handleChangeDeadline(date: any) {
        this.setState({deadline: date})
    }

    sendTodo = () => {
        console.log(this.state);
        axios.post('/api/task/', this.state).then(res => [
            console.log(res)
        ])
    }

    render() {
        return (
            <Modal
                show={this.props.show}
                onHide={this.props.onHide}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        What is your next task?
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text>Category</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control as="select" onChange={e => this.handleChange(e, "category")}
                                      defaultValue={this.props.todo.category}>
                            <option value="nothing">Choose</option>
                            <option value="task">Task</option>
                            <option value="meeting">Meeting</option>
                        </Form.Control>
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-default">Title</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                defaultValue={this.props.todo.title}
                                aria-label="Default"
                                aria-describedby="inputGroup-sizing-default"
                                onChange={(e) => this.handleChange(e, "title")}
                            />
                        </InputGroup>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text>Description</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl defaultValue={this.props.todo.description} onChange={(e) => this.handleChange(e, "description")} as="textarea"
                                         aria-label="With textarea"/>
                        </InputGroup>
                        <br/>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text>Deadline</InputGroup.Text>
                            </InputGroup.Prepend>
                            <DatePicker
                                selected={this.state.deadline}
                                onChange={(date) => this.handleChangeDeadline(date)}
                                locale="pt-FR"
                                showTimeSelect
                                timeFormat="p"
                                timeIntervals={15}
                                dateFormat="Pp"
                            />
                        </InputGroup>
                        <br/>
                        {this.state.category == "task"
                            ? <></>
                            : <InputGroup className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroup-sizing-default">Location</InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    aria-label="Default"
                                    aria-describedby="inputGroup-sizing-default"
                                    onChange={(e) => this.handleChange(e, "title")}
                                />
                            </InputGroup>}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="btn btn-secondary" onClick={this.props.onHide}>Close</Button>
                    <Button type="button" className="btn btn-primary" onClick={this.sendTodo}>Save changes</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}
