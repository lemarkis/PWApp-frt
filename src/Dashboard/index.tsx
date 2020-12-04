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

import "./../components/Form.css"
import TaskCardView from "./components/TaskCardView";
import moment from "moment";
import addNotification from "react-push-notification";

const emptyTask: ITask = {
  category: 'task',
  title: '',
  reminders: [],
}

export default function Dashboard(): JSX.Element {
  const { getAccessTokenSilently } = useAuth0();
  const [taskList, setTaskList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showView, setShowView] = useState(false);
  const [currentTask, setCurrentTask] = useState(emptyTask);

  useEffect(() => {
    getUserList()
  }, [getAccessTokenSilently]);

  const checkDate = (): void => {
    const date = moment().format('MMMM Do YYYY');
    taskList.map((task: ITask) => {
      if (task.deadline) {
        let tmp = moment(task.deadline).format('MMMM Do YYYY')
        console.log(date)
        console.log(tmp)
        if (date == tmp) {
          addNotification({
            title: 'Information',
            subtitle: 'Vous avez une tache aujourd\'hui à ' + moment(task.deadline).format('h:mm:ss a'),
            message: 'Votre Tâche a bien été créer / modifier ',
            theme: 'darkblue',
            native: true // when using native, your OS will handle theming.
          })
        }
      }
      console.log(task)
    })
  }

  const getUserList = (): void => {
    getAccessTokenSilently().then((token) => {
      api.get('/api/task', {
        headers: { 'Authorization': `Bearer ${token}`},
      }).then((res: AxiosResponse<any>) => {
        setTaskList(res.data);
        checkDate();
      }).catch(err => console.log(err.toJSON()));
    });
  }

  const onHide = (): void => {
    setShowModal(false);
    getUserList()
    setCurrentTask(emptyTask);
  }

  const viewOnHide = (): void => {
    console.log(currentTask)
    setShowView(false)
  }

  return (
    <div>
      <br/>
      <Row className="justify-content-center">
        <Col xs="auto">
          <img
            src="/logo.png"
            height="100"
            className="d-inline-block align-top"
            alt="What's Next"
          />
        </Col>
      </Row>
      <br/>
      <CardColumns>
        {taskList.map((task: ITask) => <TaskCard key={task.id} task={task} getUserList={getUserList} showModal={setShowModal} showView={setShowView}  setCurrentTask={setCurrentTask} />)}
      </CardColumns>
      <Button variant="success" onClick={() => setShowModal(true)}><FontAwesomeIcon icon={faPlus} /></Button>
      <TaskModal show={showModal} onHide={onHide} task={currentTask} setTask={setCurrentTask} />
      <TaskCardView show={showView} onHide={viewOnHide} task={currentTask} />
    </div>
  );
}
