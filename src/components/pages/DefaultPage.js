import React, { useEffect, useState} from "react";
import { Container, Col, Row, Form, Card, Button } from "react-bootstrap";
import TitleHeader from "../../TitleHeader";
import axios from "../../api/api.js";
import { FaCheck } from "react-icons/fa";


const DefaultPage = () => {
    const [ SelectedStation, setSelectedStation ] = useState({});
    const [ StationList, setStationList ] = useState([]);
    const [ LogStationList, setLogStationList ] = useState({});

    const getListStation = async () => {
        try {
            const response = await axios.get(`/agv/station/`);
            if(response.status === 200){
                setStationList(response.data.data);
                setSelectedStation((prevData) => ({
                ...prevData,
                    LIST_STATION: response.data.data,
                }));
            }
        } catch (error) {
            console.error("Error fetching station list:", error);
        }
    };

    const getListLogByStation = async (id, location) => {
        try {
            const response = await axios.get(`/agv/station/log/${id}`);
            if(response.status === 200){
                const dataLog = response.data.data;
                const historyList = dataLog.HISTORY_LIST;
                
                if(location==="PREPARATION"){
                    const listPreparationINDropReadyToMove = historyList.filter(log => log.TYPE==="preparationInDrop");
                    const listPreparationOutDrop = historyList.filter(log => log.TYPE==="preparationOutDrop");
                    const dataList = {};
                    if(listPreparationINDropReadyToMove.length > 0 && listPreparationOutDrop.length===0){
                        dataList.TROLLEY_ID = listPreparationINDropReadyToMove[0].TROLLEY_ID;
                        dataList.TYPE = "Ready to Move";
                        dataList.SOURCE_TYPE = "preparationInDrop";
                        dataList.DESTINATION_TYPE = "preparationOutDrop";
                        setLogStationList(dataList);
                    }
                }

                if(location==="SEWING"){
                    const listSewingINDropReadyToMove = historyList.filter(log => log.TYPE==="sewingInDrop");
                    const listSewingOutPickup = historyList.filter(log => log.TYPE==="sewingOutPickup");
                    const dataList = {};
                        
                    if(listSewingINDropReadyToMove.length > 0){
                        dataList.TROLLEY_ID = listSewingINDropReadyToMove[0].TROLLEY_ID;
                        dataList.ORIGIN_STATUS = listSewingINDropReadyToMove.length > 0 ? true : false;
                        dataList.DESTINATION_STATUS = listSewingOutPickup.length > 0 ? true : false;
                        setLogStationList(dataList);
                    }
                }

                
                
            }
        } catch (error) {
            console.error("Error fetching station list:", error);
        }
    };

    const ocStationSelection = (event) => {
        try {
            const { name, value } = event.target;
            if(name==="SITE"){
                const ListStationSelected = StationList.filter(station => station.SITE_NAME === value);
                setSelectedStation((prevData) => ({
                ...prevData,
                    LIST_STATION: ListStationSelected,
                }));
            }
            if(name==="LOCATION"){
                const ListStationSelected = SelectedStation.LIST_STATION.filter(station => station.STATION_LOCATION === value);
                setSelectedStation((prevData) => ({
                ...prevData,
                    LIST_STATION: ListStationSelected,
                }));
            }
            setSelectedStation((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        } catch(err){
            console.log("Failed to Scan Trolley ID, Please Check!");
        }
    }

    useEffect(() => {
        getListStation();
    }, []);

    useEffect(() => {
        if(SelectedStation.STATION && SelectedStation.LOCATION){
            getListLogByStation(SelectedStation.STATION, SelectedStation.LOCATION);
        }
    }, [SelectedStation.STATION, SelectedStation.LOCATION]);

    console.log(LogStationList);

    return (
        <div>
            <TitleHeader title="AGV Mover Trolley" />
            <br/>
            <Container fluid>
                <Row>
                    <Col sm={12}>
                        <Card>
                            <Card.Header as="h5" className="bg-primary text-white">Select Station Process & Sewing</Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col sm={12} md={4} lg={4}>
                                        <Form.Label>Select Site</Form.Label>
                                        <Form.Select name="SITE" onChange={ocStationSelection} required>
                                            <option disabled selected> </option>
                                            <option value="SBR_01">SBR 01</option>
                                            <option value="SBR_02">SBR 02</option>
                                            <option value="SBR_03">SBR 03</option>
                                            <option value="SBR_04">SBR 04</option>
                                        </Form.Select>
                                    </Col>
                                    <Col sm={12} md={4} lg={4}>
                                        <Form.Label>Select Process</Form.Label>
                                        <Form.Select name="LOCATION" onChange={ocStationSelection} required>
                                            <option disabled selected> </option>
                                            <option value="PREPARATION">Preparation Station</option>
                                            <option value="SEWING">Sewing Station</option>
                                        </Form.Select>
                                    </Col>
                                    <Col sm={12} md={4} lg={4}>
                                        <Form.Label>Select Station / Line</Form.Label>
                                        <Form.Select name="STATION" onChange={ocStationSelection}>
                                            <option disabled selected> </option>
                                            { SelectedStation.LIST_STATION && SelectedStation.LIST_STATION.length > 0 ? (
                                                SelectedStation.LIST_STATION.map((station, index) => (
                                                    <option key={index} value={station.STATION_ID}>{station.STATION_ID}</option>
                                                ))
                                            ) : null }
                                            
                                        </Form.Select>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} className="mt-3">
                        <Card>
                            <Card.Header as="h5" className="bg-success text-white">Trolley List at Selected Station</Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col sm={12} className="mb-3">
                                        { LogStationList.TROLLEY_ID && (
                                        <Card>
                                            <Card.Body>
                                                    <Row>
                                                        <Col sm={12}>
                                                            <strong>Trolley ID :</strong> {LogStationList.TROLLEY_ID ? LogStationList.TROLLEY_ID : "-"}
                                                        </Col>
                                                    </Row>
                                                    <Row className="mt-4">
                                                        <Col sm={6}>
                                                            <Card className="bg-primary" style={{height:'20vh'}}>
                                                                <Card.Body>
                                                                    <Row>
                                                                        <Col sm={12}>
                                                                            <div className="d-grid gap-2">
                                                                                <Button variant="primary" size="lg" disabled={LogStationList.ORIGIN_STATUS}>
                                                                                    { LogStationList.ORIGIN_STATUS ? <FaCheck /> : "" }
                                                                                </Button>
                                                                            </div>
                                                                        </Col>
                                                                    </Row>
                                                                </Card.Body>
                                                            </Card>
                                                        </Col>
                                                        <Col sm={6}>
                                                            <Card className="bg-danger" style={{height:'20vh'}}>
                                                                <Card.Body>
                                                                    <Row>
                                                                        <Col sm={12}>
                                                                            <div className="d-grid gap-2">
                                                                                <Button variant="danger" size="lg" disabled={LogStationList.DESTINATION_STATUS}>
                                                                                    { LogStationList.DESTINATION_STATUS ? <FaCheck /> : "" }
                                                                                </Button>
                                                                            </div>
                                                                        </Col>
                                                                    </Row>
                                                                </Card.Body>
                                                            </Card>
                                                        </Col>
                                                    </Row>     
                                            </Card.Body>
                                        </Card>
                                        )}
                                    </Col>
                                </Row>
                                
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default DefaultPage;

