import React, {useState} from 'react';
import {Button, Col, Container, Form, InputGroup, Modal, Row} from 'react-bootstrap';
import {ITask} from '../../models/task.model';
import DatePicker from 'react-datepicker';

import "react-datepicker/dist/react-datepicker.css";
import Camera, {IMAGE_TYPES} from "react-html5-camera-photo";
import ReactQuill from 'react-quill'; // ES6
import 'react-html5-camera-photo/build/css/index.css';
import 'react-quill/dist/quill.snow.css'; // ES6
import {useAuth0} from '@auth0/auth0-react';
import api from '../../utils/api';
import moment from 'moment';

import addNotification from "react-push-notification";

interface TaskModalProps {
  task: ITask;
  setTask: React.Dispatch<React.SetStateAction<ITask>>;
  show: boolean;
  onHide: () => void;
}

export default function TaskModal(props: TaskModalProps): JSX.Element {
  const {task, setTask, show, onHide} = props;
  const {getAccessTokenSilently} = useAuth0();
  const [isAuthorized, setAuthorized] = useState(false);
  const [description, setDescription] = useState('');

  const handleChange = ({target}: React.ChangeEvent<HTMLInputElement>): void => {
    setTask({...task, [target.name]: target.value});
  }

  const handleDeadlineChange = (deadline: Date, e: React.SyntheticEvent): void => {
    setTask({...task, deadline});
  }

  const handleTakePhoto = (globalPicture: string) => {
    console.log('takePhoto');
    setTask({...task, globalPicture})
  }

  const submitTask = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    task.description = description;
    const token = await getAccessTokenSilently();
    console.log(task)
    api.post('/api/task', task, {
      headers: {'Authorization': `Bearer ${token}`},
    }).then(() => {
        addNotification({
          title: 'Information',
          subtitle: 'Votre tache a bien était créer.',
          message: 'Votre Tâche a bien été créer / modifier ',
          theme: 'darkblue',
        })
        setDescription('')
        onHide();
      }
    ).catch((e) => {
      addNotification({
        title: 'Attention',
        subtitle: 'Erreur - submitTask - Votre tache n\'a pas pus etre créer ou modifier.',
        message: 'Il semble qu\'il y est eu un problème sur la création / modification de vôtre tâche.',
        theme: 'red',
      })
      console.log("Error: " + e)
    });
  }

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
              <Row>
                <Col md={{span: 5, offset: 1}} className="mr-auto text-center">
                  {isAuthorized
                    ? <></>
                    : <Form.Group as={Row}>
                      <Form.File
                        type="file"
                        className="custom-file-label"
                        id="inputGroupFile01"
                        label="Upload"
                        custom
                      />
                    </Form.Group>
                  }
                </Col> {isAuthorized
                ? <></>
                : <Col xs={1}> Or </Col>
              }
                { isAuthorized
                  ?
                  <Col className="text-center">
                    <Container fluid={true}>
                      <Camera imageType={IMAGE_TYPES.JPG}
                              imageCompression={1}
                              onTakePhoto={(e) => {
                                handleTakePhoto(e);
                              }}/>
                      <Button variant="light" onClick={() => setAuthorized(false)}>Return</Button>
                    </Container>
                  </Col>
                  :
                  <Col md={{span: 3, offset: 1}} className="text-center">
                    <Button onClick={() => setAuthorized(true)}> Take picture</Button>
                  </Col>
                }
              </Row>
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
                          [{'header': '1'}, {'header': '2'}, {'font': []}],
                          [{size: []}],
                          ['bold', 'italic', 'underline', 'blockquote'],
                          [{'list': 'ordered'}, {'list': 'bullet'},
                            {'indent': '-1'}, {'indent': '+1'}],
                          ['link'],
                          ['clean']
                        ],
                        clipboard: {
                          // toggle to add extra line breaks when pasting HTML:
                          matchVisual: false,
                        }
                      }}
                      formats={['header', 'font', 'size',
                        'bold', 'italic', 'underline', 'blockquote',
                        'list', 'bullet', 'indent',
                        'link']}
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
                      selected={task.deadline ? moment(task.deadline).toDate() : moment().toDate()}
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
                              onChange={handleChange}
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
