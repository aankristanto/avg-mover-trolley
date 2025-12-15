import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { Navbar, Row } from "react-bootstrap";


export function PageRegSuccess(){
    useEffect(() => {
        localStorage.removeItem('formData');
    }, []); // Dependency array ensures this runs whenever formData is updated

    return (
        <div>
            <Navbar bg="light" sticky="top">
                <Container>
                    <Navbar.Brand href="/">
                        <img
                        alt="Logo PT Sumbiri"
                        src="/images/sumbiriheader.png"
                        height="50"
                        className="d-inline-block align-top"
                        />
                    </Navbar.Brand>
                </Container>
            </Navbar>
            <br/>
            <Container>
                <Row>
                    <h3>Terima Kasih atas lamaran yang telah diinput.</h3>
                </Row>
            </Container>
        </div>
    )
}