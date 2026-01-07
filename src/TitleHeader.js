import { useState } from "react";
import { Row, Col, InputGroup } from "react-bootstrap";
import useInterval from "use-interval";


const TitleHeader = ({ title }) => {
  let time = new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const [currentTime, setCurrentTime] = useState(time);

  const updateTime = () => {
    let time = new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setCurrentTime(time);
  };

  const handleRefresh = () => {
    localStorage.removeItem("default_key") 
    window.location.reload()
  }

  useInterval(() => {
    updateTime();
  }, 1000);

  return (
    <Row className="m-0 title-header shadow">
      <Col className="ps-4 p-2">
        <InputGroup>
            <img
            alt="Header Sumbiri"
            src="/images/logo.png"
            height="50"
            className="d-inline-block align-top"
            onClick={handleRefresh}
            />
            <p className="text fs-5 fw-bold mb-0 d-flex align-items-center">&nbsp; {title}</p>
        </InputGroup>
      </Col>
      <Col
        sm={2}
        className="d-none d-sm-block text-center text border-start border-2"
      >
        <div className="fw-bold">
          {currentTime}{" "}
          <div
            className="spinner-grow spinner-grow-sm text-primary"
            role="status"
          >
            {/* <span class="visually-hidden">Loading...</span> */}
          </div>
        </div>
        <div style={{ fontSize: "0.8rem" }}>
          {new Date().toLocaleString("en-GB", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </Col>
    </Row>
  );
};

export default TitleHeader;
