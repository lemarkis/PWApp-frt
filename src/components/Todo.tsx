import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {Button, Card, Col, Row} from "react-bootstrap";
import Forms from "./Forms";

interface Props {
    todo: TodoComponent
}

interface TodoComponent {
    id: number | undefined;
    profilePicture?: string;
    category: string;
    title: string;
    description: string;
    deadline: Date | undefined;
    location?: string;
    picture?: string
}

interface Location {
    address: string | undefined;
    long: number | undefined,
    let: number | undefined
}

interface State {
    isShow: boolean
}

export default class Todo extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state= {
            isShow: false
        }
    }

    setModalShow = (value: boolean) => {
        this.setState({isShow: value})
    }

    deleteTodo = () => {
        console.log("Delete" + this.props.todo.id)
    }

    updateTodo = () => {
        <Forms show={this.state.isShow} onHide={() => this.setModalShow(false)} todo={this.props.todo} />
    }

    render() {
        return (
            <Card style={{width: '18rem'}}>
                <Card.Body>
                    <Card.Title>
                        <Row>
                            <Col xs="auto" className="align-self-center mr-auto">
                                {this.props.todo.title}
                            </Col>
                            <Col xs="auto">
                                <Button type="button" variant="outline-danger" onClick={this.deleteTodo}>
                                    <FontAwesomeIcon icon={faTrash}/>
                                </Button>
                            </Col>
                        </Row>
                    </Card.Title>
                    <Card.Text>
                        {this.props.todo.description}
                    </Card.Text>
                    <Button variant="primary" onClick={() => this.setModalShow(true)}>Update</Button>
                </Card.Body>
                <Forms show={this.state.isShow} onHide={() => this.setModalShow(false)} todo={this.props.todo}/>
            </Card>
        )
    }
}
