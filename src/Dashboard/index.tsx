import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { Row, Col, CardColumns, Button } from 'react-bootstrap';
import { ITask } from '../models/task.model';
import TaskCard from './components/TaskCard';
import TaskModal from './components/TaskModal';
import api from '../utils/api'
import { useAuth0 } from '@auth0/auth0-react';

const emptyTask: ITask = {
  category: 'task',
  title: ''
}

export default function Dashboard(): JSX.Element {
  const { getAccessTokenSilently } = useAuth0();
  const [taskList, setTaskList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(emptyTask);

  useEffect(() => {
    console.log("IT'S ON USE EFFECT")
    getUserList()
  }, [getAccessTokenSilently]);

  const getUserList = (): void => {
    getAccessTokenSilently().then((token) => {
      api.get('/api/task', {
        headers: { 'Authorization': `Bearer ${token}`},
      }).then((res: AxiosResponse<any>) => {
        setTaskList(res.data);
      }).catch(err => console.log(err.toJSON()));
    });
  }

  const onHide = (): void => {
    console.log("IT'S ON HIDE EFFECT")
    setShowModal(false);
    getUserList()
    setCurrentTask(emptyTask);
  }

  return (
    <>
      <Row className="justify-content-center">
        <Col xs="auto">
          <h1>What's Next ?</h1>
        </Col>
      </Row>
      <CardColumns>
        {taskList.map((task: ITask) => <TaskCard key={task.id} task={task} getUserList={getUserList} showModal={setShowModal} setCurrentTask={setCurrentTask} />)}
      </CardColumns>
      <Button variant="success" onClick={() => setShowModal(true)}><FontAwesomeIcon icon={faPlus} /></Button>
      <TaskModal show={showModal} onHide={onHide} task={currentTask} setTask={setCurrentTask} />
    </>
  );
}
