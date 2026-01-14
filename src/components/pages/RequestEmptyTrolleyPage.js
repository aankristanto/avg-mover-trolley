import React, { useEffect, useState, useRef }  from "react";
import { Form, Container, Col, Row, Card, Table, Button } from "react-bootstrap";
import TitleHeader from "../../TitleHeader";
import { useSearchParams } from "react-router-dom";
import axios from "../../api/api.js";
import { FaCheck, FaLocationArrow, FaMapSigns, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaXmark } from "react-icons/fa6";
import moment from "moment";
import { toast } from "react-toastify";


const RequestEmptyTrolleyPage = () => {
    const [searchParams] = useSearchParams();
    const [StationList, setStationList] = useState([]);
    const [LogStationList, setLogStationList] = useState({});
    const [LogHistory, setLogHistory] = useState([]);

    const navigate = useNavigate();
    const debounceRef = useRef(null);
    
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

    const getLogHistoryEmptyTrolleyRequest = async(date) => {
        try {
            const response = await axios.get(`/mover/log-empty-trolley-req/${date}`);
            if (response.status === 200) {
                setLogHistory(response.data.data);
            }

        } catch(err){
            console.error('Error fetching log history');
        }
    }

    const getListLogByStation = async (id) => {
        try {
            const response = await axios.get(`/station/spesific/${id}`);
            if(response.status===200){
                const data = response.data.data;
                setLogStationList({
                    TROLLEY_ID: data?.TROLLEY?.TROLLEY_ID,
                    TROLLEY: data.TROLLEY,
                    STATION: data.STATION,
                    ORIGIN_STATUS: data.IS_SEWING_IN,
                    DESTINATION_STATUS: data.IS_SEWING_OUT
                });
            }
        } catch (error) {
            console.error("Error fetching station list:", error);
        }
    };

    const handleBackToMain = () => {
        navigate(`/`);
    };

    const handleDateLogHistory = (event) => {
        const value = event.target.value;

        clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            getLogHistoryEmptyTrolleyRequest(value);
        }, 400); // 300–500ms is ideal
    };

    const postRequestTrolley = async() => {
        const dataRequest = {
            STATION_ID: CurrentStation
        };
        const tryPost = await axios.post('/mover/log-empty-trolley-req', { dataRequest});
        if(tryPost){
            toast.success("Success request Empty Trolley");
            await getLogHistoryEmptyTrolleyRequest(moment().format('YYYY-MM-DD'));
        } else {
            toast.warning("Failed to request Empty Trolley");
        }
    }

    useEffect(() => {
        getListStation();
        getLogHistoryEmptyTrolleyRequest(moment().format('YYYY-MM-DD'));
    }, []);

    useEffect(() => {
        if (!CurrentStation) return;

        getListLogByStation(CurrentStation);

        const interval = setInterval(() => {
            getListLogByStation(CurrentStation);
        }, 5000);

        return () => clearInterval(interval);
    }, [CurrentStation]);
    

    console.log(StationList);

    return (
        <div>
            <TitleHeader title="AGV Request Empty Trolley" />
            <br />
            <Container fluid>
                <Row>
                    <Col>
                        <Card>
                            <Card.Header as="h5" className="bg-primary text-white d-flex align-items-center">
                                <span>Station Status</span>
                                <Button size="sm" variant="light" className="ms-auto" onClick={handleBackToMain}>
                                    <FaXmark />
                                </Button>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col sm={12} md={6}>
                                        <Card style={{height:'100px'}}>
                                            <Card.Header className="bg-primary text-white text-center"><b><FaMapSigns/>&nbsp; SITE & STATION</b></Card.Header>
                                            <Card.Body className="text-center" style={{fontSize:'large'}}>
                                                <b>{ CurrentSite } - { CurrentStation }</b>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col sm={12} md={6}>
                                        <Card style={{height:'100px'}}>
                                            <Card.Header className="bg-primary text-white text-center"><b><FaShoppingCart/>&nbsp; EXISTING TROLLEY ONSITE</b></Card.Header>
                                            <Card.Body className="text-center" style={{fontSize:'large'}}>
                                                <b>{ LogStationList?.TROLLEY?.MASTER_TROLLEY_ID || '' }</b>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                                <Row className="mt-4">
                                    <Col className="text-center">
                                        <Button variant="success" onClick={postRequestTrolley} disabled={LogStationList?.TROLLEY?.MASTER_TROLLEY_ID}>
                                            <FaLocationArrow/> 
                                            REQUEST EMPTY TROLLEY
                                        </Button>
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
                                    <Col sm={12} md={4} lg={3}>
                                        <Form.Control type="date" name="DATE_HISTORY" onChange={handleDateLogHistory}/>
                                    </Col>
                                </Row>
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
                                            <tbody>
                                                { LogHistory?.length > 0 ? (
                                                    LogHistory.map((item, index) => (
                                                        <tr key={index}>
                                                            <td className="text-center">{moment(item?.REQUEST_TIME).format('YYYY-MM-DD HH:mm:ss')}</td>
                                                            <td className="text-center">{item?.SITE_NAME}</td>
                                                            <td className="text-center">{item?.STATION_ID}</td>
                                                            <td className="text-center">{item?.CONFIRM_STATUS === 'Y' ? <FaCheck/> : ""}</td>
                                                            <td className="text-center">{item?.CONFIRM_TIME}</td>
                                                            <td className="text-center">{item?.TROLLEY_ID}</td>
                                                        </tr>
                                                    ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={6}>No History</td>
                                                        </tr>    
                                                )}
                                            </tbody>
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