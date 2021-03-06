import {useAuth0} from '@auth0/auth0-react';
import {faClipboardList, faEdit, faTrash, faUsers, faEye} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React from 'react';
import {Button, Card, Col, Row} from 'react-bootstrap';
import {ITask} from '../../models/task.model';
import api from '../../utils/api';
import addNotification from "react-push-notification";

interface TaskCardProps {
  task: ITask;
  getUserList: () => void;
  showModal: (value: boolean) => void;
  showView: (value: boolean) => void;
  setCurrentTask: (task: ITask) => void;
  [key: string]: any;
}

export default function TaskCard(props: TaskCardProps): JSX.Element {
  const {task, getUserList, showModal, showView, setCurrentTask} = props;
  const {getAccessTokenSilently} = useAuth0();

  const deleteTask = async (): Promise<void> => {
    console.log(task.id);
    console.log(props)
    const token = await getAccessTokenSilently();
    api.delete('/api/task', {
      headers: {'Authorization': `Bearer ${token}`},
      data: {id: task.id},
    }).then(() => {
      addNotification( {
        title: 'Information',
        subtitle: 'Votre tâche a bien était supprimer.',
        theme: 'light',
      })
    });
    getUserList();
  }

  const updateCard = (): void => {
    setCurrentTask(task)
    showModal(true)
  }

  const showCard = (): void => {
    setCurrentTask(task)
    showView(true)
  }

  return (
    <Card     style={{ border: '3px solid #54b4eb', borderColor: '#54b4eb' }}
              border="info">
      <Card.Body>
        <Card.Title>
          <Row className="justify-content-between">
            <Col xs="auto">
              {task.globalPicture ? <img src={task.globalPicture} width={50} height={50} alt=""/>
                : <FontAwesomeIcon icon={task.category === "task" ? faClipboardList : faUsers}/>
              }
            </Col>
            <Col xs="auto">
              {task.title}
            </Col>
            <Col>
            </Col>
          </Row>
        </Card.Title>
        <Card.Text dangerouslySetInnerHTML={{__html: task.description ?? ""}}>
        </Card.Text>
      </Card.Body>
      <Card.Footer>
        <Row className="justify-content-end">
          <Col xs="auto">
            <Button size="sm" variant="outline-warning" title="Regarder" onClick={() => showCard()}>
              <FontAwesomeIcon icon={faEye}/>
            </Button>
          </Col>
          <Col xs="auto">
            <Button size="sm" variant="outline-success" title="Editer" onClick={() => updateCard()}>
              <FontAwesomeIcon icon={faEdit}/>
            </Button>
          </Col>
          <Col xs="auto">
            <Button size="sm" variant="outline-danger" title="Supprimer" onClick={deleteTask}>
              <FontAwesomeIcon icon={faTrash}/>
            </Button>
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  );
}
