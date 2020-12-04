import React from 'react';
import {IReminders, ITask} from "../../models/task.model";
import {Badge, Button, Col, Container, Form, InputGroup, Modal, Row} from "react-bootstrap";
import moment from "moment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClipboardList, faMinusCircle, faUsers} from "@fortawesome/free-solid-svg-icons";

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
      size="lg"
      onHide={onHide}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="taskModal">
          <FontAwesomeIcon icon={task.category === "task" ? faClipboardList : faUsers}/>
          {"   " + task.title} </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {task.globalPicture ?
          <Row>
            <Col className="align-self-center mr-auto">
              <img src={task.globalPicture} width={400} height={400} alt="Profile picture"/>
            </Col>
            <Col xs={4}>
              <h1>{task.category === "meeting" ? <p> Réunion</p> : <p> Tâche à faire</p>}</h1>
              {task.deadline ?
                <p>Le <strong>{moment(task.deadline).format('MMMM Do YYYY, h:mm:ss a')}</strong></p>
                : <p>Vous n'avez pas renseigné de date pour la fin des cette tâche</p>}
              <br/>
              <strong>Description:</strong>
              {task.description ? <p dangerouslySetInnerHTML={{__html: task.description}}/> :
                <p> Vous n'avez pas donner de description a cette tâche.</p>}
              <br/>
              <p>{task.location
                ? <p> La réunion a lieu sur: {task.location}</p>
                : <p>Aucune addresse de renseigner pour cette réunion.</p>}</p>
              <br/>
              <p>Des rappels seront envoyés sur ces dates:</p>
              <p>{task.reminders?.map((reminder: IReminders) => {
                return (
                  <p>Le <strong>{moment(reminder.date).format('LLLL').toString()}</strong></p>
                )
              })
              }</p>
            </Col>
            <Col></Col>
          </Row>
          : <Container>
            <h1>{task.category === "meeting" ? <p> Réunion</p> : <p> Tâche à faire</p>}</h1>
            {task.deadline ?
              <p>Le <strong>{moment(task.deadline).format('MMMM Do YYYY, h:mm:ss a')}</strong></p>
              : <p>Vous n'avez pas renseigné de date pour la fin des cette tâche</p>}
            <br/>
            <strong>Description:</strong>
            {task.description ? <p dangerouslySetInnerHTML={{__html: task.description}}/> :
              <p> Vous n'avez pas donner de description a cette tâche.</p>}
            <br/>
            <p>{task.location
              ? <p> La réunion a lieu sur: {task.location}</p>
              : <p>Aucune addresse de renseigner pour cette réunion.</p>}</p>
            <br/>
            <p>Des rappels seront envoyés sur ces dates:</p>
            <p>{task.reminders?.map((reminder: IReminders) => {
              return (
                <p>Le <strong>{moment(reminder.date).format('LLLL').toString()}</strong></p>
              )
            })
            }</p>
          </Container>
        }
      </Modal.Body>
    </Modal>
  )
}
