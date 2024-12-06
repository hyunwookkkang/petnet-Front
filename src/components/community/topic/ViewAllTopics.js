import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import "../../../styles/Main.css";
import ViewTopicsCard from "./ViewTopicsCard";
import ViewHotTopicsCard from "./ViewHotTopicsCard";

const ViewAllTopics = () => {

  return (

    <Container>

      <Row lg={1} className="g-4">
        <Col>

          <ViewHotTopicsCard />
          <ViewTopicsCard category='1' />
          <ViewTopicsCard category='2' />
          <ViewTopicsCard category='3' />

        </Col>
      </Row>

    </Container>

  );

}

export default ViewAllTopics;
