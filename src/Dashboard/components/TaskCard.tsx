import {useAuth0} from '@auth0/auth0-react';
import {faClipboardList, faEdit, faTrash, faUsers} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React from 'react';
import {Button, Card, Col, Row} from 'react-bootstrap';
import {ITask} from '../../models/task.model';
import api from '../../utils/api';

interface TaskCardProps {
  task: ITask;
  getUserList: () => void;
  showModal: (value: boolean) => void;
  setCurrentTask: (task: ITask) => void;
  [key: string]: any;
}

export default function TaskCard(props: TaskCardProps): JSX.Element {
  const {task, getUserList, showModal, setCurrentTask} = props;
  const {getAccessTokenSilently} = useAuth0();

  const deleteTask = async (): Promise<void> => {
    console.log(task.id);
    console.log(props)
    const token = await getAccessTokenSilently();
    api.delete('/api/task', {
      headers: {'Authorization': `Bearer ${token}`},
      data: {id: task.id},
    });
    getUserList();
  }

  const updateCard = (): void => {
    setCurrentTask(task)
    showModal(true)
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title>
          <Row className="justify-content-between">
            <Col xs="auto">
              {task.globalPicture ? <img src={task.globalPicture} width={50} height={50} alt="Profile picture"/>
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
            <Button size="sm" variant="outline-info" title="Editer" onClick={() => updateCard()}>
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
