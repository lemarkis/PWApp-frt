import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import {Button, Col, Container, Form, FormControl, FormGroup, InputGroup, Modal, Row} from "react-bootstrap";
import Camera, {FACING_MODES, IMAGE_TYPES} from 'react-html5-camera-photo';
import ReactQuill from 'react-quill'; // ES6
import 'react-html5-camera-photo/build/css/index.css';
import 'react-quill/dist/quill.snow.css'; // ES6
import './Form.css'

interface Props {
  todo: TodoComponent
  onHide: any
  show: boolean
}

interface TodoComponent {
  id?: number;
  category?: string;
  title?: string;
  description?: string;
  deadline?: Date;
  location?: string;
  depart?: Location;
  picture?: string;
  // arrival: Location | undefined;
}

interface State {
  category?: string;
  title?: string;
  description?: string;
  deadline?: Date,
  location?: string,
  isAuthorized?: boolean,
}

interface Location {
  address?: string
  long?: number,
  let?: number,
}

export default class Forms extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      category: this.props.todo.category,
      title: this.props.todo.title,
      description: this.props.todo.description,
      deadline: this.props.todo.deadline,
      isAuthorized: false,
    }
    this.handleChange = this.handleChange.bind(this)
    console.log(this.props)
  }

  handleChange(e: any, key: string) {
    this.setState({[key]: e.target.value})
    console.log(this.state.category)
  }

  handleChangeDescription(e: string) {
    this.setState({description: e})
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

  handleTakePhoto = (dataUri: string) => {
    // Do stuff with the photo...
    console.log(dataUri);
    console.log('takePhoto');
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide} size="xl" aria-labelledby="contained-modal-title-vcenter"
             centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            What is your next task?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col className="align-self-center mr-auto">
              <Form>
                <Row>
                  <Col md={{span: 5, offset: 2}} className="mr-auto text-center">
                    {this.state.isAuthorized
                      ? <></>
                      : <Form.Group as={Row}>
                        <Form.File
                          type="file"
                          className="custom-file-label"
                          id="inputGroupFile01"
                          label="Upload File"
                          custom
                        />
                      </Form.Group>
                    }
                  </Col> {this.state.isAuthorized
                  ? <></>
                  : <Col xs={1}> Or </Col>
                }
                  <Col className="text-center">
                    {this.state.isAuthorized
                      ? <Container>
                        <Camera imageType={IMAGE_TYPES.JPG}
                                imageCompression={1}
                                onTakePhoto={(e) => {
                                  this.handleTakePhoto(e);
                                }}/>
                        <Button variant="light" onClick={() => this.setState({isAuthorized: false})}>Return</Button>
                      </Container>
                      : <Button onClick={() => this.setState({isAuthorized: true})}> Take picture</Button>}
                  </Col>
                </Row>
              </Form>
            </Col>
            <Col>
              <FormGroup>
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
                  <ReactQuill
                    theme="snow"
                    value={this.state.description}
                    modules={{
                      toolbar: [
                        [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                        [{size: []}],
                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                        [{'list': 'ordered'}, {'list': 'bullet'},
                          {'indent': '-1'}, {'indent': '+1'}],
                        ['link', 'image', 'video'],
                        ['clean']
                      ],
                      clipboard: {
                        // toggle to add extra line breaks when pasting HTML:
                        matchVisual: false,
                      }}}
                    formats= {['header', 'font', 'size',
                      'bold', 'italic', 'underline', 'strike', 'blockquote',
                      'list', 'bullet', 'indent',
                      'link', 'image', 'video']}
                    onChange={(e) => this.handleChangeDescription(e)}/>
                  {/*<FormControl defaultValue={this.props.todo.description}*/}
                  {/*             onChange={(e) => this.handleChange(e, "description")} as="textarea"*/}
                  {/*             aria-label="With textarea"/>*/}
                </InputGroup>
                <br/>
                <br/>
                <br/>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>Deadline</InputGroup.Text>
                  </InputGroup.Prepend>
                  <DatePicker
                    id="deadlineInput"
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
              </FormGroup>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-secondary" onClick={this.props.onHide}>Close</Button>
          <Button type="button" className="btn btn-primary" onClick={this.sendTodo}>Save changes</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
