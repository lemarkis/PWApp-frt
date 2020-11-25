import React, {useState} from 'react';
import {Button, Col, Container, Form, InputGroup, Modal, Row} from 'react-bootstrap';
import {ITask} from '../../models/task.model';
import DatePicker from 'react-datepicker';

import "react-datepicker/dist/react-datepicker.css";
import Camera, {IMAGE_TYPES} from "react-html5-camera-photo";
import ReactQuill from 'react-quill'; // ES6
import 'react-html5-camera-photo/build/css/index.css';
import 'react-quill/dist/quill.snow.css'; // ES6
import { useAuth0 } from '@auth0/auth0-react';
import api from '../../utils/api';

interface TaskModalProps {
  task: ITask;
  setTask: React.Dispatch<React.SetStateAction<ITask>>;
  show: boolean;
  onHide: () => void;
}

export default function TaskModal(props: TaskModalProps): JSX.Element {
  const {task, setTask, show, onHide} = props;
  const { getAccessTokenSilently } = useAuth0();
  const [isAuthorized, setAuthorized] = useState(false)
  const [description, setDescription] = useState("")

  const handleChange = ({target}: React.ChangeEvent<HTMLInputElement>): void => {
    setTask({...task, [target.name]: target.value});
  }

  const handleChangeLocalisation = (e: any, key: string): void => {
    setTask({...task, [key]: e.target.value})
  }

  const handleDeadlineChange = (deadline: Date, e: React.SyntheticEvent): void => {
    setTask({...task, 'deadline': deadline});
  }

  const handleTakePhoto = (profilePicture: string) => {
    console.log('takePhoto');
    setTask( {...task, profilePicture})
  }


  const submitTask = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    task["description"] = description
    const token = await getAccessTokenSilently();
    console.log(task)
    api.post('/api/task', task, {
      headers: { 'Authorization': `Bearer ${token}`},
    });
    onHide();
  }

  const DateInput = ({value, onClick}: any): JSX.Element => (
    <Form.Control
      name="deadline"
      value={value}
      onClick={onClick}
      readOnly
    />
  )

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="taskModal">What's next ?</Modal.Title>
      </Modal.Header>
      <Form onSubmit={submitTask}>
        <Modal.Body>
          <Row>
            <Col className="align-self-center mr-auto">
              <Form>
                <Row>
                  <Col md={{span: 5, offset: 2}} className="mr-auto text-center">
                    {isAuthorized
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
                  </Col> {isAuthorized
                  ? <></>
                  : <Col xs={1}> Or </Col>
                }
                  <Col className="text-center">
                    {isAuthorized
                      ? <Container>
                        <Camera imageType={IMAGE_TYPES.JPG}
                                imageCompression={1}
                                onTakePhoto={(e) => {
                                  handleTakePhoto(e);
                                }}/>
                        <Button variant="light" onClick={() => setAuthorized(false)}>Return</Button>
                      </Container>
                      : <Button onClick={() => setAuthorized(true)}> Take picture</Button>}
                  </Col>
                </Row>
              </Form>
            </Col>
            <Col>
              <Form.Row>
                <Form.Group as={Col}>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="category">Catégorie</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      name="category"
                      as="select"
                      onChange={handleChange}
                      value={task.category}
                    >
                      <option value="task">Tâche</option>
                      <option value="meeting">Réunion</option>
                    </Form.Control>
                  </InputGroup>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col}>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-default">Titre</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      name="title"
                      value={task.title}
                      onChange={handleChange}
                    />
                  </InputGroup>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col}>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="description">Description</InputGroup.Text>
                    </InputGroup.Prepend>
                    <ReactQuill
                    theme="snow"
                    value={description}
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
                    onChange={setDescription}
                    />
                  </InputGroup>
                  <br/>
                  <br/>
                  <br/>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col}>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="deadline">Date d'échéance</InputGroup.Text>
                    </InputGroup.Prepend>
                    <DatePicker
                      selected={task.deadline}
                      onChange={handleDeadlineChange}
                      timeIntervals={15}
                      showTimeSelect
                      dateFormat="dd MMM yyyy HH:mm"
                      // customInput={<DateInput />}
                    />
                  </InputGroup>
                </Form.Group>
              </Form.Row>
              {task.category === "meeting" &&
              <Form.Row>
                  <Form.Group as={Col}>
                      <InputGroup>
                          <InputGroup.Prepend>
                              <InputGroup.Text id="location">Localisation</InputGroup.Text>
                          </InputGroup.Prepend>
                          <Form.Control
                              name="location"
                              value={task.location}
                              onChange={(e) => handleChangeLocalisation(e, "localisation")}
                          />
                      </InputGroup>
                  </Form.Group>
              </Form.Row>
              }
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={onHide}>Annuler</Button>
          <Button type="submit" variant="success">Sauvegarder</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
