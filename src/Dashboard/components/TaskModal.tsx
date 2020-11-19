import React, { useState } from 'react';
import { Button, Col, Form, InputGroup, Modal } from 'react-bootstrap';
import { ITask } from '../../models/task.model';
import DatePicker from 'react-datepicker';

import "react-datepicker/dist/react-datepicker.css";
import { useAPI } from '../../contexts/api.context';

interface TaskModalProps {
  task: ITask;
  setTask: React.Dispatch<React.SetStateAction<ITask>>;
  show: boolean;
  onHide: () => void;
}

export default function TaskModal(props: TaskModalProps): JSX.Element {
  const { task, setTask, show, onHide } = props;
  const { api } = useAPI();

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>): void => {
    setTask({ ...task, [target.name]: target.value });
  }

  const handleDeadlineChange = (deadline: Date, e: React.SyntheticEvent): void => {
    setTask({ ...task, deadline});
  }

  const submitTask = (e: React.FormEvent): void => {
    e.preventDefault();
    api.post('/api/task', task);
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
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title id="taskModal">What's next ?</Modal.Title>
      </Modal.Header>
      <Form onSubmit={submitTask}>
        <Modal.Body>
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
                  <InputGroup.Text id="title">Titre</InputGroup.Text>
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
                <Form.Control
                  name="description"
                  as="textarea"
                  value={task.description}
                  onChange={handleChange}
                />
              </InputGroup>
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
                  locale="fr-FR"
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={onHide}>Annuler</Button>
          <Button type="submit" variant="success">Sauvegarder</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}