import React, { useEffect, useState } from "react";
import { Container, Col, Row, Form, Card, Button, Table } from "react-bootstrap";
import TitleHeader from "../../TitleHeader";
import axios from "../../api/api.js";
import { FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";

const DefaultPage = () => {
    const [SelectedStation, setSelectedStation] = useState({
        SITE: "",
        LOCATION: "",
        STATION: "",
        LIST_STATION: [],
    });
    const [firstSetup, setFirstSetup] = useState(false)
    const [alreadyPickup, setAlreadyPickup] = useState(false)
    const [StationList, setStationList] = useState([]);
    const [LogStationList, setLogStationList] = useState({});
    const [listSewingOut, setListSewingOut] = useState([])

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

    const getListLogByStation = async (id, location) => {
        try {
            const response = await axios.get(`/station/log/${id}`);
            if (response.status === 200) {
                const dataLog = response.data.data;
                const historyList = dataLog.HISTORY_LIST;

                if (location === "PREPARATION") {
                    const listPreparationINDropReadyToMove = historyList.filter(log => log.TYPE === "preparationInDrop");
                    const listPreparationOutDrop = historyList.filter(log => log.TYPE === "preparationOutDrop");

                    const dataList = {};
                    if (listPreparationINDropReadyToMove.length > 0 && listPreparationOutDrop.length === 0) {
                        dataList.TROLLEY_ID = listPreparationINDropReadyToMove[0].TROLLEY_ID;
                        dataList.TYPE = "Ready to Move";
                        dataList.SOURCE_TYPE = "preparationInDrop";
                        dataList.DESTINATION_TYPE = "preparationOutDrop";
                        fetchSewingOut(dataList.TROLLEY_ID)
                        setLogStationList(dataList);
                    }
                }

                if (location === "SEWING") {
                    const listSewingINDropReadyToMove = historyList.filter(log => log.TYPE === "sewingInDrop");
                    const listSewingOutPickup = historyList.filter(log => log.TYPE === "sewingOutPickup");
                    const dataList = {};
                    if (listSewingINDropReadyToMove.length > 0) {
                        dataList.TROLLEY_ID = listSewingINDropReadyToMove[0].TROLLEY_ID;
                        dataList.ORIGIN_STATUS = listSewingINDropReadyToMove.length > 0 ? true : false;
                        dataList.DESTINATION_STATUS = listSewingOutPickup.length > 0 ? true : false;
                        fetchSewingOut(dataList.TROLLEY_ID)
                        setLogStationList(dataList);
                    }
                }
                const alreadyPickUp = historyList.filter(log => log.TYPE === "packingInPickup");


                setAlreadyPickup(alreadyPickUp.length > 0)
            }
        } catch (error) {
            console.error("Error fetching station list:", error);
        }
    };

    const ocStationSelection = (event) => {
        try {
            const { name, value } = event.target;
            if (name === "SITE") {
                const ListStationSelected = StationList.filter(station => station.SITE_NAME === value);
                setSelectedStation((prevData) => ({
                    ...prevData,
                    LIST_STATION: ListStationSelected,
                }));
            }
            if (name === "LOCATION") {
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
        } catch (err) {
            console.log("Failed to Scan Trolley ID, Please Check!");
        }
    }

    const ClickMoveTrolley = async () => {
        const trolleyCode = String(LogStationList?.TROLLEY_ID ?? "").slice(0, 6);
        const lineCode = String(SelectedStation?.STATION ?? "").slice(0, 8);

        try {
            await axios.post('/mover/action', { trolleyCode, lineCode });

            toast.success("Success set command to move trolley");
        } catch (err) {
            toast.warning("Failed to move trolley");
        }
        setLogStationList((prevData) => ({
            ...prevData,
            DESTINATION_STATUS: true,
        }));
    };

    const handleConfirmState = () => {
        localStorage.setItem("default_key", JSON.stringify({ STATION: SelectedStation.STATION, LOCATION: SelectedStation.LOCATION }))
        getListLogByStation(SelectedStation.STATION, SelectedStation.LOCATION)
        setFirstSetup(false)
    }

    const fetchSewingOut = async (trolleyCode) => {
        try {
            const { data } = await axios.get(`/sewing/out`, { params: { TROLLEY_ID: trolleyCode } })
            setListSewingOut(data.data)
        } catch (err) {
            toast.error(err?.response?.data?.message || "Filed to fetch bundle swing out")
        }
    }

    const sendToPacking = async () => {
        if (listSewingOut.length <= 0) {
            return toast.warn("Please fill bundle sewing out first")
        }
        try {
            const trolleyCode = String(LogStationList?.TROLLEY_ID ?? "").slice(0, 6);
            const lineCode = String(SelectedStation?.STATION ?? "").slice(0, 8);

            await axios.post(`/sewing/send-to-packing`, { trolleyCode, lineCode })
            toast.success("Success call AGV To Pickup this trolley to Packing")
            setAlreadyPickup(true)
        } catch (err) {
            toast.error(err?.response?.data?.message || "Filed to send trolley to packing")
        }
    }

    useEffect(() => {
        const strg = localStorage.getItem('default_key')
        if (strg) {
            setFirstSetup(false)
            const data = JSON.parse(strg)
            getListLogByStation(data.STATION, data.LOCATION)
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
                                        <Col sm={12} md={3}>
                                            <Form.Label>Select Site</Form.Label>
                                            <Form.Select name="SITE" onChange={ocStationSelection} required>
                                                <option disabled selected> </option>
                                                <option value="SBR_01">SBR 01</option>
                                                <option value="SBR_02">SBR 02</option>
                                                <option value="SBR_03">SBR 03</option>
                                                <option value="SBR_04">SBR 04</option>
                                            </Form.Select>
                                        </Col>
                                        <Col sm={12} md={3}>
                                            <Form.Label>Select Process</Form.Label>
                                            <Form.Select name="LOCATION" onChange={ocStationSelection} required>
                                                <option disabled selected> </option>
                                                <option value="PREPARATION">Preparation Station</option>
                                                <option value="SEWING">Sewing Station</option>
                                            </Form.Select>
                                        </Col>
                                        <Col sm={12} md={3}>
                                            <Form.Label>Select Station / Line</Form.Label>
                                            <Form.Select name="STATION" onChange={ocStationSelection}>
                                                <option disabled selected> </option>
                                                {SelectedStation.LIST_STATION && SelectedStation.LIST_STATION.length > 0 ? (
                                                    SelectedStation.LIST_STATION.map((station, index) => (
                                                        <option key={index} value={station.STATION_ID}>{station.STATION_ID}</option>
                                                    ))
                                                ) : null}
                                            </Form.Select>
                                        </Col>
                                        <Col sm={12} md={3} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                            <Button variant="primary" className="px-4" onClick={handleConfirmState}>Confirm</Button>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row> : <Row>
                        <Col sm={12} className="mt-3">
                            <Card>
                                <Card.Header as="h5" className="bg-success text-white">Trolley List at Selected Station</Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col sm={12} className="mb-3">
                                            {LogStationList.TROLLEY_ID && (
                                                <Card>
                                                    <Card.Body>
                                                        <Row>
                                                            <Col sm={12}>
                                                                <strong>Trolley ID :</strong> {LogStationList.TROLLEY_ID ? LogStationList.TROLLEY_ID : "-"}
                                                            </Col>
                                                        </Row>
                                                        <Row className="mt-4">
                                                            <Col sm={6}>
                                                                <div className="d-grid gap-2" style={{ height: '30vh' }}>
                                                                    <Button variant="primary" size="lg" disabled={LogStationList.ORIGIN_STATUS}>
                                                                        {LogStationList.ORIGIN_STATUS ? <FaCheck /> : ""}
                                                                    </Button>
                                                                </div>
                                                            </Col>
                                                            <Col sm={6}>
                                                                <div className="d-grid gap-2" style={{ height: '30vh' }}>
                                                                    <Button variant="danger" size="lg" disabled={LogStationList.DESTINATION_STATUS} onClick={ClickMoveTrolley}>
                                                                        {LogStationList.DESTINATION_STATUS ? <FaCheck /> : ""}
                                                                    </Button>
                                                                </div>
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
                        <Col sm={12} className="mt-3">
                            <Card>
                                <Card.Header>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Card.Title>Bundle Sewing Out</Card.Title>
                                        <Button variant="warning" onClick={() => fetchSewingOut(LogStationList.TROLLEY_ID)}>Reload</Button>
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
                                                                {new Date(item.SEWING_SCAN_TIME).toLocaleString()}
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
                            {LogStationList.DESTINATION_STATUS && !alreadyPickup && <Button variant="success" style={{ width: '100%' }} onClick={sendToPacking}>Send To Packing</Button>}
                        </Col>
                    </Row>
                }

            </Container>
        </div>
    );
};

export default DefaultPage;