import React, {useState} from 'react';
import {Card, Accordion, Button, Col, Container, Form, InputGroup, Modal, Row} from 'react-bootstrap';
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
import 'moment/locale/fr';
import {IReminders} from '../../models/task.model';

import addNotification from "react-push-notification";
import './../../components/Form.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSave, faMinusCircle, faPlusCircle} from "@fortawesome/free-solid-svg-icons";
import swPush from "../../swPush";

moment.locale("fr");         // fr

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
  const [showDate, setShowDate] = useState(false);
  const [reminderDate, setReminderDate] = useState<Date | undefined>(new Date());

  const handleChange = ({target}: React.ChangeEvent<HTMLInputElement>): void => {
    setTask({...task, [target.name]: target.value});
  }

  const handleDeadlineChange = (deadline: Date, e: React.SyntheticEvent): void => {
    setTask({...task, deadline});
  }

  const handleTakePhoto = (globalPicture: string) => {
    setTask({...task, globalPicture})
  }

  const submitTask = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    task.description = description;
    const token = await getAccessTokenSilently();
    api.post('/api/task', task, {
      headers: {'Authorization': `Bearer ${token}`},
    }).then(() => {
        addNotification({
          title: 'Information',
          subtitle: 'Votre tâche a bien été créer.',
          message: 'Votre Tâche a bien été créer / modifier ',
          theme: 'darkblue',
        });
        setTask({...task, 'title': ''});
        setTask({...task, 'deadline': undefined})
        setReminderDate(undefined);
        onHide();
      }
    ).catch((e) => {
      addNotification({
        title: 'Attention',
        subtitle: 'Erreur - submitTask - Votre tache n\'a pas pus etre créer ou modifier.',
        message: 'Il semble qu\'il y est eu un problème sur la création / modification de vôtre tâche.',
        theme: 'red',
      })
    });
  }

  const generateId = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : ((r & 0x3) | 0x8);
      return v.toString(16);
    });
  }

  const addReminder = async () => {
    const perm = await swPush.askNotificationPermission();
    if (perm !== 'granted') {
      addNotification({
        title: 'Attention',
        subtitle: 'Vous devez autorisé l\'accée au notifications pour utilisé cette fonctionnalité.',
        theme: 'red',
      });
    } else {
      const token = await getAccessTokenSilently();
      swPush.subscribeToNotifications(token);
      if (Date.parse(moment(task.deadline).toDate().toString()) < Date.parse(moment(reminderDate).toDate().toString())) {
        addNotification({
          title: 'Attention',
          subtitle: 'Votre rappel ne doit pas dépasser la date de rendu de votre tâche.',
          theme: 'red',
        })
      } else if (reminderDate) {
        if (!task.reminders) {
          task.reminders = [];
        }
        const reminder: IReminders = {
          id: generateId(),
          date: reminderDate,
        }
        task.reminders.push(reminder);
        setShowDate(false);
        setReminderDate(undefined);
      }
    }
  }

  const removeReminder = (reminder: IReminders) => {
    const index = task.reminders?.findIndex(x => x.id === reminder.id);
    if (index !== undefined) {
      task.reminders?.splice(index, 1);
      setTask({...task, 'reminder': task.reminders});
    }
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
            <Col></Col>
            <Col xs={8}>
              {isAuthorized
                ?
                <Container fluid={"sm"}>
                  <Camera
                    imageType={IMAGE_TYPES.JPG}
                          imageCompression={1}
                    onTakePhoto={(e) => handleTakePhoto(e)}
                  />
                          <Row>
                            <Col></Col>
                            <Col xs={1}>
                              <Button id={'returnCam'}  onClick={() => setAuthorized(false)}>Return</Button>
                            </Col>
                            <Col></Col>
                          </Row>
                </Container>
                : <></>
              }
              {!isAuthorized
                ? <Container>
                  <Form.Row className="justify-content-between">
                    <Form.Group as={Col}>
                      <InputGroup>
                        <InputGroup.Prepend>
                          <InputGroup.Text id="profilePicture">Image de profile</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Col xs="auto">
                          <Button onClick={() => setAuthorized(true)}> Take picture</Button>
                        </Col>
                      </InputGroup>
                    </Form.Group>
                  </Form.Row>
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
                      <InputGroup style={{width: '20px', height: '20px'}}>
                        <InputGroup.Prepend>
                          <InputGroup.Text id="inputGroup-sizing-default">Titre</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                          required
                          name="title"
                          value={task.title}
                          onChange={handleChange}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <br/>
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
                              ['link']
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
                    </Form.Group>
                  </Form.Row>
                  <Form.Row>
                    <Form.Group as={Col}>
                      <InputGroup>
                        <InputGroup.Prepend>
                          <InputGroup.Text id="deadline">Date d'échéance</InputGroup.Text>
                        </InputGroup.Prepend>
                        <DatePicker
                          selected={task.deadline ? moment(task.deadline).toDate() : undefined}
                          onChange={handleDeadlineChange}
                          timeIntervals={15}
                          showTimeSelect
                          dateFormat="dd MMM yyyy HH:mm"
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
                  <Form.Row>
                    <Form.Group as={Col}>
                      <Accordion>
                        <Card>
                          <Accordion.Toggle as={Button} variant="link" eventKey="0">
                            Ajouter / Supprimer un rappel
                          </Accordion.Toggle>
                          <Accordion.Collapse eventKey="0">
                            <Card.Body>
                              {task.reminders?.map((reminder: IReminders) => {
                                return (
                                  <Row key={reminder.id}>
                                    <Col>
                                      <p>{moment(reminder.date).format('LLLL').toString()}</p>
                                    </Col>
                                    <Col>
                                      <Button size="sm" variant="outline-danger" onClick={() => removeReminder(reminder)}>
                                        <FontAwesomeIcon icon={faMinusCircle}/>
                                      </Button>
                                    </Col>
                                  </Row>
                                )
                              })}
                              {showDate &&
                                <Row>
                                  <DatePicker
                                    selected={reminderDate}
                                    onChange={(date: Date) => setReminderDate(date)}
                                    timeIntervals={15}
                                    showTimeSelect
                                    withPortal
                                    dateFormat="dd MMM yyyy HH:mm"
                                  />
                                  <Button size="sm" variant="outline-success" title="Ajouter" onClick={addReminder}>
                                    <FontAwesomeIcon icon={faSave}/>
                                  </Button>
                                </Row>
                              }
                              {(task.reminders && task.reminders.length < 5 && showDate === false) &&
                                <Button size="sm" variant="outline-success" title="Ajouter"
                                        onClick={() => setShowDate(true)}>
                                  <FontAwesomeIcon icon={faPlusCircle}/>
                                </Button>
                              }
                            </Card.Body>
                          </Accordion.Collapse>
                        </Card>
                      </Accordion>
                    </Form.Group>
                  </Form.Row>
                </Container>
                : <></>
              }
            </Col>
            <Col></Col>
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
