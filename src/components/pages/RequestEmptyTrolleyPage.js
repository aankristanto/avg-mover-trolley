import React, { useEffect, useState }  from "react";
import { Container, Col, Row, Card, Table, Button } from "react-bootstrap";
import TitleHeader from "../../TitleHeader";
import { useSearchParams } from "react-router-dom";
import axios from "../../api/api.js";
import { FaLocationArrow, FaMapSigns, FaShoppingCart } from "react-icons/fa";



const RequestEmptyTrolleyPage = () => {
    const [searchParams] = useSearchParams();
    const [StationList, setStationList] = useState([]);
        
    const CurrentSite = searchParams.get("SITE");
    const CurrentStation = searchParams.get("STATION");
    

    const getListStation = async () => {
            try {
                const response = await axios.get(`/station/`);
                if (response.status === 200) {
                    setStationList(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching station list:", error);
            }
    };

    useEffect(() => {
        getListStation();
    }, []);
    

    console.log(StationList);

    return (
        <div>
            <TitleHeader title="AGV Request Empty Trolley" />
            <br />
            <Container fluid>
                <Row>
                    <Col>
                        <Card>
                            <Card.Header as="h5" className="bg-primary text-white">Station Status</Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col sm={12} md={6}>
                                        <Card style={{height:'100px'}}>
                                            <Card.Header className="bg-primary text-white text-center"><b><FaMapSigns/>  SITE & STATION</b></Card.Header>
                                            <Card.Body className="text-center">
                                                { CurrentSite } - { CurrentStation }
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col sm={12} md={6}>
                                        <Card style={{height:'100px'}}>
                                            <Card.Header className="bg-primary text-white text-center"><b><FaShoppingCart/>  EXISTING TROLLEY</b></Card.Header>
                                            <Card.Body className="text-center">
                                                
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                                <Row className="mt-4">
                                    <Col className="text-center">
                                        <Button variant="success"><FaLocationArrow/> REQUEST EMPTY TROLLEY</Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row className="mt-4">
                    <Col sm={12}>
                        <Card>
                            <Card.Header as="h5" className="bg-primary text-white">Empty Trolley Request History</Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col sm={12} md={12}>
                                        <Table variant="secondary" bordered>
                                            <thead>
                                                <tr className="text-center">
                                                    <th>Req Time</th>
                                                    <th>Site</th>
                                                    <th>Station</th>
                                                    <th>Confirm Status</th>
                                                    <th>Confirm Time</th>
                                                    <th>Trolley ID</th>
                                                </tr>
                                            </thead>
                                        </Table>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}


export default RequestEmptyTrolleyPage;