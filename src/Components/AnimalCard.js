import React from "react";
import { Card, Button } from "react-bootstrap";

function AnimalCard({ name, description, image, actionLabel }) {
  return (
    <Card className="mb-4 shadow" style={{ width: "18rem" }}>
      <Card.Img variant="top" src={image} alt={name} style={{ height: "200px", objectFit: "cover" }} />
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text>{description}</Card.Text>
        <Button variant="primary">{actionLabel}</Button>
      </Card.Body>
    </Card>
  );
}

export default AnimalCard;
