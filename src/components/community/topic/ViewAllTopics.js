import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import ViewTopicsCard from "./ViewTopicsCard";

import "../../../styles/Main.css";


const ViewAllTopics = () => {

  return (

    <Container>

      <Row lg={1} className="g-4">
        <Col>
          
          <br/>
          <ViewTopicsCard category='hot' title="금주의 인기 게시글" />
          <ViewTopicsCard category='1' title="잡담 게시글" />
          <ViewTopicsCard category='2' title="질문 게시글" />
          <ViewTopicsCard category='3' title="후기 게시글" />

        </Col>
      </Row>

    </Container>

  );

}

export default ViewAllTopics;
