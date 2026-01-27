import React, { useEffect, useState } from "react";
import { Container, Col, Row, Form, Card, Button, Table } from "react-bootstrap";
import TitleHeader from "../../TitleHeader";
import axios from "../../api/api.js";
import { FaCheck, FaLocationArrow } from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import moment from "moment";
import OperationDayCard from "../cardLimit/OperationDayCard.js";

const DefaultPage = () => {
    const [SelectedStation, setSelectedStation] = useState({
        SITE: "",
        LOCATION: "",
        STATION: "",
        LIST_STATION: [],
    });
    const [firstSetup, setFirstSetup] = useState(false)
    const [alreadyPickup, setAlreadyPickup] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [StationList, setStationList] = useState([]);
    const [LogStationList, setLogStationList] = useState({});
    const [listSewingOut, setListSewingOut] = useState([]);
    const [LogHistory, setLogHistory] = useState([]);
          const [todayData, setTodayData] = useState(null);

    
    const getListStation = async () => {
        try {
            const response = await axios.get(`/station/`);
            if (response.status === 200) {
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

    const fetchOperationDay = async (code) => {
        try {
            const { data } = await axios.get('/operation-day/v2-list-today', {params: {BUILDING_CODE: code}});
            setTodayData(data.data);
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to fetch operation day');
        }
    };

    const getListLogByStation = async (id) => {
        try {
            const { data: data2 } = await axios.get(`/station/spesific/${id}`);
            const data = data2.data
            fetchOperationDay(data?.STATION?.SITE_NAME)
            setLogStationList({
                TROLLEY_ID: data?.TROLLEY?.TROLLEY_ID,
                TROLLEY: data.TROLLEY,
                STATION: data.STATION,
                ORIGIN_STATUS: data.IS_SEWING_IN,
                DESTINATION_STATUS: data.IS_SEWING_OUT
            });

            setListSewingOut(data.SEWING_OUT)
            setAlreadyPickup(data.IS_PACKING_IN)
        } catch (error) {
            console.error("Error fetching station list:", error);
        }
    };

    const ocStationSelection = (event) => {
        try {
            const { name, value } = event.target;
            if (name === "SITE") {
                const ListStationSelected = StationList.filter(station => station.SITE_NAME === value && station.STATION_LOCATION === "SEWING");
                setSelectedStation((prevData) => ({
                    ...prevData,
                    LIST_STATION: ListStationSelected,
                }));
            }
            setSelectedStation((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        } catch (err) {
            console.log("Failed to Scan Trolley ID, Please Check!");
        }
    }

    const ClickMoveTrolley = async () => {
        if (loading2) return
        const trolleyCode = String(LogStationList?.TROLLEY_ID ?? "").slice(0, 6);
        const lineCode = String(SelectedStation?.STATION ?? "").slice(0, 8);

        setLoading2(true)
        try {
            await axios.post('/mover/action', { trolleyCode, lineCode });
            toast.success("Success set command to move trolley");
            setLogStationList((prevData) => ({
                ...prevData,
                DESTINATION_STATUS: true,
            }));
            setLoading2(false)
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to move trolley");
            setLoading2(false)
        }
    };

    const handleConfirmState = () => {
        localStorage.setItem("default_key", JSON.stringify({ STATION: SelectedStation.STATION, LOCATION: SelectedStation.LOCATION }))
        getListLogByStation(SelectedStation.STATION)
        setFirstSetup(false)
    }


    const sendToPacking = async () => {
        if (loading) return

 
        const result = await Swal.fire({
            title: "Are you sure?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            reverseButtons: true,
        });
        if (!result.isConfirmed) return
        setLoading(true)
        try {
            const trolleyCode = String(LogStationList?.TROLLEY_ID ?? "").slice(0, 6);
            const lineCode = String(SelectedStation?.STATION ?? "").slice(0, 8);

            await axios.post(`/sewing/send-to-packing`, { trolleyCode, lineCode })
            toast.success("Success call AGV To Pickup this trolley to Packing")
            setAlreadyPickup(true)
            setLoading(false)
        } catch (err) {
            setLoading(false)
            toast.error(err?.response?.data?.message || "Filed to send trolley to packing")
        }
    }

    const formatDate = (date) => {


        const dateFormatter = new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });


        const formattedDate = dateFormatter.format(date);
        return formattedDate
    }

    useEffect(() => {
        const strg = localStorage.getItem('default_key')
        if (strg) {
            setFirstSetup(false)
            const data = JSON.parse(strg)
            getListLogByStation(data.STATION)
            setSelectedStation(prev => ({
                ...prev,
                STATION: data.STATION,
                LOCATION: data.LOCATION,
            }))
        } else {
            setFirstSetup(true)
            getListStation();
        }
    }, []);

    useEffect(() => {
        if (!SelectedStation?.STATION) return;

        getListLogByStation(SelectedStation.STATION);

        const interval = setInterval(() => {
            getListLogByStation(SelectedStation.STATION);
        }, 5000);

        return () => clearInterval(interval);
    }, [SelectedStation.STATION]);


    const getStatusClass = (status) => (status === 1 ? "station-status-active" : "station-status-inactive");
    const getStatusText = (status) => (status === 1 ? "Active" : "Inactive");

   
    const postRequestTrolley = async() => {
        try {
            const dataRequest = {
                STATION_ID: SelectedStation.STATION
            };
            const tryPost = await axios.post('/mover/log-empty-trolley-req', { dataRequest});
            if(tryPost){
                toast.success("Success request Empty Trolley");
                // await getLogHistoryEmptyTrolleyRequest(moment().format('YYYY-MM-DD'));
            } else {
                toast.warning("Failed to request Empty Trolley");
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Filed to send trolley to packing")
        }
            
    }

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

    useEffect(() => {
            getListStation();
            getLogHistoryEmptyTrolleyRequest(moment().format('YYYY-MM-DD'));
    }, []);
    
    useEffect(() => {
        
        const interval = setInterval(() => {
            getLogHistoryEmptyTrolleyRequest(moment().format('YYYY-MM-DD'));
        }, 5000);

        return () => clearInterval(interval);
    }, []);
    

    

    return (
        <div>
            <TitleHeader title="AGV Mover Trolley" />
            <br />
            <Container fluid>
                {
                    firstSetup ? <Row>

                        <Col sm={12}>
                            <Card>
                                <Card.Header as="h5" className="bg-primary text-white">Select Station Process & Sewing</Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col sm={12} md={4}>
                                            <Form.Label>Select Site</Form.Label>
                                            <Form.Select name="SITE" onChange={ocStationSelection} required>
                                                <option disabled selected> </option>
                                                <option value="SBR_01">SBR 01</option>
                                                <option value="SBR_02">SBR 02</option>
                                                <option value="SBR_03">SBR 03</option>
                                                <option value="SBR_04">SBR 04</option>
                                            </Form.Select>
                                        </Col>
                                        <Col sm={12} md={4}>
                                            <Form.Label>Select Station / Line</Form.Label>
                                            <Form.Select name="STATION" onChange={ocStationSelection}>
                                                <option disabled selected> </option>
                                                {SelectedStation.LIST_STATION && SelectedStation.LIST_STATION.length > 0 ? (
                                                    SelectedStation.LIST_STATION.map((station, index) => (
                                                        <option key={index} value={station.STATION_ID}>{station.STATION_NAME}</option>
                                                    ))
                                                ) : null}
                                            </Form.Select>
                                        </Col>
                                        <Col sm={12} md={4} className="d-flex align-items-end gap-2">
                                            <Button variant="primary" className="px-4" onClick={handleConfirmState}>
                                                Confirm
                                            </Button>
                                            
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row> : <Row>
                        <Col sm={12} className="mt-3">
                        <OperationDayCard
                                    data={todayData}
                                    showEndTime={true}
                                />
                            <div className="station-card">
                                <div className="station-header">
                                    <div className="station-id">{LogStationList?.STATION?.STATION_ID} | {LogStationList?.STATION?.STATION_NAME}</div>
                                    <span className="station-location-badge">{LogStationList?.STATION?.STATION_LOCATION}</span>
                                </div>

                                <div className="station-details">
                                    <div className="station-detail-item">
                                        <span className="station-detail-label">Station B ID</span>
                                        <span className="station-detail-value">{LogStationList?.STATION?.STATION_B_ID}</span>
                                    </div>

                                    <div className="station-detail-item">
                                        <span className="station-detail-label">Staging ID</span>
                                        <span className="station-detail-value">{LogStationList?.STATION?.STAGING_ID}</span>
                                    </div>

                                    <div className="station-detail-item">
                                        <span className="station-detail-label">Site</span>
                                        <span className="station-site-name">{LogStationList?.STATION?.SITE_NAME}</span>
                                    </div>
                                </div>

                                <div className="station-status-row">
                                    <div className={`station-status-item ${getStatusClass(LogStationList?.STATION?.STATION_STATUS)}`}>
                                        <span className="station-status-dot"></span>
                                        Station: {getStatusText(LogStationList?.STATION?.STATION_STATUS)}
                                    </div>
                                    <div className={`station-status-item ${getStatusClass(LogStationList?.STATION?.STATION_PICKUP_STATUS)}`}>
                                        <span className="station-status-dot"></span>
                                        Pickup: {getStatusText(LogStationList?.STATION?.STATION_PICKUP_STATUS)}
                                    </div>
                                    <div className={`station-status-item ${getStatusClass(LogStationList?.STATION?.STATION_DROP_STATUS)}`}>
                                        <span className="station-status-dot"></span>
                                        Drop: {getStatusText(LogStationList?.STATION?.STATION_DROP_STATUS)}
                                    </div>
                                </div>
                            </div>
                        </Col>
                        {LogStationList.TROLLEY_ID ? (

                            <>
                                <Col sm={12} className="mt-3">
                                    <Card>
                                        <Card.Header ><Card.Title>Trolley at Selected Station</Card.Title></Card.Header>
                                        <Card.Body>
                                            <Row>
                                                <Col sm={12} className="mb-3">

                                                    <Card>
                                                        <Card.Body>
                                                            <Row>
                                                                <Col sm={6}><strong>Trolley:</strong> {LogStationList?.TROLLEY?.MASTER_TROLLEY_ID || ''}</Col>
                                                                <Col sm={6}><strong>Schedule Date:</strong> {LogStationList?.TROLLEY?.SCHEDULE_DATE || ''}</Col>
                                                            </Row>
                                                            <Row className="mt-4">
                                                                <Col sm={6}>
                                                                    <div className="d-grid gap-2" style={{ height: '30vh' }}>
                                                                        <Button variant="primary" size="lg" disabled={LogStationList.ORIGIN_STATUS}>
                                                                            {LogStationList.ORIGIN_STATUS ? <FaCheck /> : ""}
                                                                        </Button>
                                                                    </div>
                                                                    <p className="text-center my-0 mt-2" style={{ color: 'gray', fontSize: 13 }}>Loading</p>
                                                                </Col>
                                                                <Col sm={6}>
                                                                    <div className="d-grid gap-2" style={{ height: '30vh' }}>
                                                                        <Button variant="danger" size="lg" disabled={LogStationList.DESTINATION_STATUS} onClick={ClickMoveTrolley}>
                                                                            {LogStationList.DESTINATION_STATUS ? <FaCheck /> : ""}
                                                                        </Button>

                                                                    </div>
                                                                    <p className="text-center my-0 mt-2" style={{ color: 'gray', fontSize: 13 }}>Finish Good</p>
                                                                </Col>
                                                            </Row>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col sm={12} className="mt-3">
                                    <Card>
                                        <Card.Header>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <Card.Title>Bundle Sewing Out</Card.Title>
                                            </div>
                                        </Card.Header>
                                        <Card.Body>
                                            <div className="table-responsive">
                                                <Table
                                                    striped
                                                    bordered
                                                    hover
                                                    size="sm"
                                                    className="align-middle text-center"
                                                >
                                                    <thead className="table-dark">
                                                        <tr>
                                                            <th>No</th>
                                                            <th>Trolley ID</th>
                                                            <th>Barcode Serial</th>
                                                            <th>Barcode Main</th>
                                                            <th>Location</th>
                                                            <th>Scan Time</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {listSewingOut?.length > 0 ? (
                                                            listSewingOut.map((item, index) => (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{item.TROLLEY_ID}</td>
                                                                    <td>{item.BARCODE_SERIAL}</td>
                                                                    <td>{item.BARCODE_MAIN}</td>
                                                                    <td>{item.SEWING_SCAN_LOCATION}</td>
                                                                    <td>
                                                                        {item.SEWING_SCAN_TIME ? formatDate(new Date(item.SEWING_SCAN_TIME)) : ''}
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="9" className="text-muted">
                                                                    Data tidak tersedia
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                
                                <Col sm={12} className="my-3">
                                    {LogStationList.DESTINATION_STATUS && !alreadyPickup && <Button variant="success" disabled={loading} style={{ width: '100%' }} onClick={sendToPacking}>{loading ? 'Loading...' : 'Send To Packing'}</Button>}
                                </Col>
                            </>) : 
                            <>
                            <Col sm={12}>
                                <h2 className="text-center" style={{marginTop: '50px'}}>No trolley available</h2>
                            </Col>
                            <Col sm={12} className="mt-3">
                                <Card>
                                    <Card.Header
                                        as="h5"
                                        className="bg-dark text-white d-flex justify-content-between align-items-center"
                                        >
                                        <span>Empty Trolley Request History</span>

                                        <Button
                                            variant="warning"
                                            onClick={postRequestTrolley}
                                            disabled={LogStationList?.TROLLEY?.MASTER_TROLLEY_ID}
                                        >
                                            <FaLocationArrow className="me-2" />
                                            REQUEST EMPTY TROLLEY
                                        </Button>
                                    </Card.Header>

                                    <Card.Body>
                                        <Row>
                                            <Col sm={12} md={4} lg={3}>
                                                
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
                                                            LogHistory.filter((x => x.STATION_ID===SelectedStation.STATION)).map((item, index) => (
                                                                <tr key={index}>
                                                                    <td className="text-center">{moment(item?.REQUEST_TIME).format('YYYY-MM-DD HH:mm:ss')}</td>
                                                                    <td className="text-center">{item?.SITE_NAME}</td>
                                                                    <td className="text-center">{item?.STATION_ID}</td>
                                                                    <td className="text-center">{item?.CONFIRM_STATUS === 'Y' ? <FaCheck/> : ""}</td>
                                                                    <td className="text-center">{item?.CONFIRM_TIME ? moment(item?.CONFIRM_TIME).format('YYYY-MM-DD HH:mm:ss') : ''}</td>
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
                            </>
                        }
                    </Row>
                    

                }
            </Container>
        </div>
    );
};

export default DefaultPage;