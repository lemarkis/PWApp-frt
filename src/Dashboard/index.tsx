import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AxiosResponse } from 'axios';
import React, { useEffect, useState } from 'react';
import { Row, Col, CardGroup, Button } from 'react-bootstrap';
import { useAPI } from '../contexts/api.context';
import { ITask } from '../models/task.model';
import TaskCard from './components/TaskCard';
import TaskModal from './components/TaskModal';

const emptyTask: ITask = {
  category: 'task',
  title: ''
}

export default function Dashboard(): JSX.Element {
  const [taskList, setTaskList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(emptyTask);
  const { api } = useAPI();

  useEffect(() => {
    api.get('/api/task').then((res: AxiosResponse<any>) => {
      console.log(Date.now(), ' getTasks :', res);
      setTaskList(res.data);
    }).catch(err => console.log(err.toJSON()));
  }, [api]);

  const onHide = (): void => {
    setShowModal(false);
    setCurrentTask(emptyTask);
  }

  return (
    <>
      <Row className="justify-content-center">
        <Col xs="auto">
          <h1>What's Next ?</h1>
        </Col>
      </Row>
      <CardGroup>
        {taskList.map((task: ITask) => <TaskCard key={task.id} task={task} />)}
      </CardGroup>
      <Button variant="success" onClick={() => setShowModal(true)}><FontAwesomeIcon icon={faPlus} /></Button>
      <TaskModal show={showModal} onHide={onHide} task={currentTask} setTask={setCurrentTask} />
    </>
  );
}
