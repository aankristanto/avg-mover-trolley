import { useState, useEffect } from "react";
import axios from "../../api/api.js";
import { useNavigate } from 'react-router-dom';

import { Container, Navbar, Row, Col, Button, Modal, Form, InputGroup } from "react-bootstrap";
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid


export function PageLanding(){
    const [ DataLoker, setDataLoker ]   = useState([]);
    const [ ModalKode, setModalKode ]   = useState(false);
    const [ PassKey, setPassKey]        = useState('');
    const [ MsgPassKey, setMsgPassKey]  = useState('');


    const colDefLoker = [
        { headerName: "Posisi", field: "Posisi" },
        { headerName: "Kualifikasi", field: "Kualifikasi", cellRenderer: (params) => {
            return params.value ? params.value.replace(/\n/g, '<br/>') : '';
          } },
        { headerName: "Tenggat Waktu", field: "EndDate" },
    ]

    const navigate = useNavigate();
    
    const defaultColDef = {
        sortable: true,
        editable: false,
        filter: true,
        //floatingFilter: true,
        suppressSizeToFit: true,
        resizable: true,
        flex: 1,
    };
    

    const backgroundImageStyle = {
        backgroundImage: "url('/images/bglanding1compressed.webp')",
        backgroundSize: 'cover', // Or 'contain', depending on your needs
        backgroundPosition: 'center',
        height: '100vh', // Adjust as needed
        width: '100%',
      };

      

      const ModalKodeOpen = () => {
            setModalKode(true);
      }

      const ModalKodeClose = () => {
        setModalKode(false);
        setPassKey('');
      }

      const inputPasskey = (event) => {
        const { value } = event.target;
        setPassKey(value);
      }

      const submitPassKey = (event) => {
        event.preventDefault();
        axios
            .post("/hr/check-passkey", { PassKey: PassKey })
            .then((response) => { 
                if (response.status === 200) { 
                    navigate(`/register?pk=${PassKey}`);
                } else {
                    setMsgPassKey('PassKey yang dimasukkan tidak dikenal!');
                } 
            })
            .catch((error) => { 
                if (error.response) {
                    setMsgPassKey('PassKey yang dimasukkan tidak dikenal!'); }});
      }
      

    useEffect(() => {
        const getLokerActive = () => {
            axios
            .get("/hr/get-active-job")
            .then((response) => {
                if(response.status===200){
                    setDataLoker(response.data.data)
                }
            })
            .catch((error) => {
                console.error(error);
            })
          }

          getLokerActive();
    }, []);



    return (
        <div style={backgroundImageStyle}>
            <Navbar bg="light" sticky="top">
                <Container>
                    <Navbar.Brand className="m-0" href="/">
                        <img
                        alt="Header Sumbiri"
                        src="/images/sumbiriheader.png"
                        height="50"
                        className="d-inline-block align-top"
                        />

                    </Navbar.Brand>
                </Container>
            </Navbar>
            <br/><br/><br/>
            <Container>
                <Row>
                    <Col lg={6}>
                    <iframe 
                        width="100%" 
                        height="315" 
                        src="https://www.youtube.com/embed/S1NKV6gGc-w?si=owHgxny2tuvGArhP&amp;controls=0&amp;autoplay=1" 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerPolicy="strict-origin-when-cross-origin" 
                        style={{
                            width: '100%',
                            aspectRatio: '16 / 9'
                        }}
                        allowFullScreen />    
                    </Col>
                    <Col lg={6}>
                        <h3>REKRUTMEN KARYAWAN</h3>
                        <p>Pelaksanaan rekrutmen karyawan PT Sumber Bintang Rejeki dilakukan secara <i>on the spot</i> dan dilaksanakan pada periode <i>one day service</i> dan tanpa dipungut biaya apapun</p>
                        <Button variant="primary" onClick={ModalKodeOpen}>LAMAR SEKARANG</Button> 
                    </Col>
                </Row>
                <Row>
                    <Col className="pt-2 pt-lg-2">
                        <br/>
                        <h5><b>DAFTAR LOWONGAN AKTIF</b></h5>
                        <div className="ag-theme-quartz" style={{ height: "100%", minHeight:"20vh", width: "100%" }} >
                            <AgGridReact 
                                columnDefs={colDefLoker} 
                                rowData={DataLoker} 
                                defaultColDef={defaultColDef} 
                            >
                            </AgGridReact>
                        </div>
                                <br/>
                            </Col>
                </Row>
            </Container>
            <br/><br/><br/>
            <Row className="bg-dark text-white m-0">
                    <Col sm="12" md="12" lg="12">
                        &nbsp;
                    </Col>
                    <Col bg="primary" lg="6" className="text-center">
                        <img src="/images/logo-white.png" alt="Logo Sumbiri White" style={{maxWidth:"200px"}}/>
                        <br/><br/>
                    </Col>
                    <Col lg="6" className="mx-2 mx-md-0">
                        <h5>Informasi:</h5>
                        <h6>Head Office</h6>
                        <p>Jl Batusari Barat No.22 Batuceper Tangerang 15121</p> 
                        <h6>Factory:</h6>
                        <p>Jl Raya Tegalpanas-Jimbaran Ds.Secang RT.01/01 Dsn.Samban Kec.Bawen Kab.Semarang 50661 </p>
                    </Col>
                </Row>
            <Row className="bg-dark text-white m-0">
                <Col className="text-center">
                    <footer className="footer">
                        &copy;2024 PT Sumber Bintang Rejeki Semarang
                    </footer>
                </Col>
            </Row>

            <Modal show={ModalKode} onHide={ModalKodeClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Kode PassKey</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Masukkan Kode PassKey yang disebutkan oleh Team Rekrutmen untuk melanjutkan proses lamaran</p>
                    <p className="text-danger">{MsgPassKey}</p>
                    <InputGroup className="mb-3">
                        <Form.Control
                        type="text"
                        placeholder=""
                        aria-label=""
                        aria-describedby="basic-addon1"
                        onChange={inputPasskey}
                        />
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={submitPassKey}>Submit</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}