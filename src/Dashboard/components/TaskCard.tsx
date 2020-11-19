import { faClipboardList, faEdit, faTrash, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { ITask } from '../../models/task.model';

interface TaskCardProps {
  task: ITask;
  [key: string]: any;
}

export default function TaskCard(props: TaskCardProps): JSX.Element {
  const { task } = props;

  return (
    <Card>
      <Card.Body>
        <Card.Title>
          <Row className="justify-content-between">
            <Col xs="auto">
              <FontAwesomeIcon icon={task.category === "task" ? faClipboardList : faUsers} />
            </Col>
            <Col xs="auto">
              {task.title}
            </Col>
            <Col xs="auto">
              <Button size="sm" variant="outline-info" title="Editer">
                <FontAwesomeIcon icon={faEdit} />
              </Button>
              <Button size="sm" variant="outline-danger" title="Supprimer">
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </Col>
          </Row>
        </Card.Title>
        <Card.Text>
          {task.description}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}