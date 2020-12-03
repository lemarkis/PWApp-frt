import React, {useState} from 'react';
import {ITask} from "../../models/task.model";
import {Badge, Button, Col, Container, Form, InputGroup, Modal, Row} from "react-bootstrap";
import Camera, {IMAGE_TYPES} from "react-html5-camera-photo";
import ReactQuill from "react-quill";
import DatePicker from "react-datepicker";
import moment from "moment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClipboardList, faUsers} from "@fortawesome/free-solid-svg-icons";

interface TaskCardViewProps {
  task: ITask;
  show: boolean;
  onHide: () => void;
}

export default function TaskCardView(props: TaskCardViewProps): JSX.Element {
  const {task, show, onHide} = props;

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="taskModal">
          <FontAwesomeIcon icon={task.category === "task" ? faClipboardList : faUsers}/>
          {"   "  + task.title} </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          {task.globalPicture ?
            <Col className="align-self-center mr-auto">
              <img src={task.globalPicture} width={400} height={400} alt="Profile picture"/>
            </Col>
            : <></>
          }
          <Col className="align-self-center mr-auto">
            <Form.Row>
              <Form.Group as={Col}>
                <InputGroup>
                  <InputGroup.Prepend>
                    <h2><Badge variant="secondary">Category</Badge></h2>
                  </InputGroup.Prepend>
                  <h4>{task.category === "meeting" ? <p> Réunion</p> : <p> Tâche à faire</p>}</h4>
                </InputGroup>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col}>
                <InputGroup>
                  <InputGroup.Prepend>
                    <h2><Badge variant="secondary">Description</Badge></h2>
                  </InputGroup.Prepend>
                  {task.description ? <p dangerouslySetInnerHTML={{ __html: task.description }} /> :
                    <p> Vous n'avez pas donner de description a cette tâche.</p>}
                </InputGroup>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col}>
                <InputGroup>
                  <InputGroup.Prepend>
                    <h2><Badge variant="secondary">Date d'échéance</Badge></h2>
                  </InputGroup.Prepend>
                  {task.deadline ?
                    <p>Cette tâche doit être effectuer avant
                      le {moment(task.deadline).format('MMMM Do YYYY, h:mm:ss a')}</p>
                    : <p>Vous n'avez pas renseigné de date pour la fin des cette tâche</p>}
                </InputGroup>
              </Form.Group>
            </Form.Row>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        {task.category === "meeting" &&
        <Form.Group as={Col}>
            <InputGroup>
                <InputGroup.Prepend>
                    <h2><Badge variant="secondary">Addresse</Badge></h2>
                </InputGroup.Prepend>
                <p>{task.location
                  ? <p> La réunion a lieu sur: {task.location}</p>
                  : <p>Aucune addresse de renseigner pour cette réunion.</p>}</p>
            </InputGroup>
        </Form.Group>
        }
      </Modal.Footer>
    </Modal>
  )
}
