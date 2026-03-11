import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import './FeedbackModal.css';
import axios from "../../api/api";
import { toast } from 'react-toastify';
import { formatDate } from '../../utils/general';

const getStatusConfig = (isApprove) => {
        if (isApprove === null) return { label: 'Pending', class: 'pending', icon: '⏳' };
        if (isApprove) return { label: 'Approved', class: 'approved', icon: '✅' };
        return { label: 'Rejected', class: 'rejected', icon: '❌' };
    };

    
    const truncateText = (text, maxLength = 100) => {
        if (!text) return 'No content';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

const FeedbackModal = ({ show, stationId, handleClose }) => {

    const [step, setStep] = useState(2);
    const [isImportant, setIsImportant] = useState(false);
    const [complaintText, setComplaintText] = useState('');
    const [loading, setLoading] = useState(false)

    const [listAduanSistem, setListAduanSistem] = useState([])
    const [showGriev, setShowGriev] = useState(false)

    const handleNext = () => setStep(2);

    const handleSubmit = async () => {
        if (loading) return

        setLoading(true)
        try {
            await axios.post(`feedback-system`, {
                APP_NAME: "AGV-MOVER",
                PICTURE_URL: "",
                BODY: complaintText,
                IS_IMPORTANT: isImportant,
                LEVEL: 0,
                USER_ID: stationId.slice(3)
            })

            toast.success("Makasih udah lapor, tunggu ya kami bakal langsung tanganin")
            handleClose();
            setComplaintText('');
            setIsImportant(false);
            setLoading(false)
        } catch (err) {
            setLoading(false)
            toast.error(err?.response?.data?.message || "Gagal mengirimkan aduan")
        }
    };

    const handleOpenHistory = async () => {
        try {
            const { data } = await axios.post(`feedback-system/history`, {
                USER_ID: stationId.slice(3), APP_NAME: "AGV-MOVER"
            })
            setListAduanSistem(data.data)
            setShowGriev(true)
        } catch (err) {
            toast.error(err?.response?.data?.message || "Gagal Melihat Riwaray aduan")
        }
    }

    useEffect(() => {
        const firstUi = sessionStorage.getItem("first_log")
        setStep(2)
        if (!firstUi) {
            sessionStorage.setItem("first_log", "true")
            setStep(1)
        }
    }, [])

    return (
        <>
            {!showGriev && <Modal
                show={show}
                onHide={handleClose}
                size="xl"
                centered
                className="aduan-modal-wrapper"
                contentClassName="aduan-modal-content"
            >
                <Modal.Header closeButton className="aduan-modal-header">
                    <Modal.Title className="aduan-modal-title">
                        {step === 1 ? 'Layanan Aduan Sistem' : 'Formulir Aduan Sistem'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="aduan-modal-body">
                    {step === 1 && (
                        <div className="aduan-modal-slide-intro">
                            <div className="aduan-modal-icon-wrapper">
                                🛡️
                            </div>
                            <h3>Aduan Sistem Summit</h3>
                            <p className="text-muted">
                                Gunakan fitur ini untuk <b>melaporkan masalah pada sistem</b>.
                            </p>

                            <ul className="aduan-modal-feature-list">
                                <li className="aduan-modal-feature-item">
                                    <span className="aduan-modal-feature-icon">✔</span>
                                    <strong style={{ width: 170 }}>100% Rahasia</strong> Identitas pelapor dijaga kerahasiaannya
                                </li>
                                <li className="aduan-modal-feature-item">
                                    <span className="aduan-modal-feature-icon">✔</span>
                                    <strong style={{ width: 170 }}>Langsung ke IT</strong> Laporan langsung masuk ke tim teknis inti
                                </li>
                                <li className="aduan-modal-feature-item">
                                    <span className="aduan-modal-feature-icon">✔</span>
                                    <strong style={{ width: 170 }}>Respon Cepat</strong> Prioritas penanganan berdasarkan urgensi
                                </li>
                            </ul>

                            <div className="mt-4">
                                <Button variant="primary" size="md" onClick={handleNext} className="px-5">
                                    Buat Aduan Sekarang
                                </Button>
                            </div>
                        </div>
                    )}


                    {step === 2 && (
                        <div className="aduan-modal-form-container" style={{ animation: 'aduan-modal-fade-in 0.5s ease' }}>
                            <Form>
                                <Form.Group className="aduan-modal-form-group" controlId="formComplaint">
                                    <Form.Label>Silakan jelaskan masalah sistem yang kamu alami:</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={5}
                                        className="aduan-modal-textarea"
                                        placeholder="Contoh: Tidak bisa nyalain downtime, muncul pesan error seperti ini ..."
                                        value={complaintText}
                                        onChange={(e) => setComplaintText(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="d-flex align-items-center">
                                    <Form.Switch
                                        id="custom-switch"
                                        checked={isImportant}
                                        onChange={(e) => setIsImportant(e.target.checked)}
                                        label={
                                            <span className="aduan-modal-switch-label">
                                                {isImportant ? "PENTING / MENDESAK" : "Tandai sebagai Penting"}
                                            </span>
                                        }
                                    />
                                </Form.Group>
                                {isImportant && <small className="text-danger mt-1 d-block">
                                    * Laporan ini akan diprioritaskan oleh tim IT.
                                </small>}
                            </Form>
                        </div>
                    )}
                </Modal.Body>

                <Modal.Footer className="aduan-modal-footer">
                    <Button variant="secondary" onClick={handleOpenHistory}> Riwayat aduan</Button>

                    {step === 2 && 
                        <Button variant="primary" onClick={handleSubmit} disabled={!complaintText}>
                            {loading ? 'Loading' : 'Kirim Aduan'}
                        </Button>
}
                </Modal.Footer>
            </Modal>}

            <Modal
                show={showGriev}
                onHide={() => setShowGriev(false)}
                size="lg"
                centered
                scrollable
                className="modal-aduan-history"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        📜 History Aduan
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {listAduanSistem.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📭</div>
                            <p className="mb-0">Belum ada history aduan</p>
                            <small>Data aduan yang telah diproses akan muncul disini</small>
                        </div>
                    ) : (

                        <div className="history-list">
                            {listAduanSistem.map((item, index) => {
                                const status = getStatusConfig(item.IS_APPROVE);

                                return (
                                    <div
                                        key={item.ID || index}
                                        className={`history-item ${status.class}`}
                                        role="button"
                                        tabIndex={0}
                                    >

                                        <div className="history-header">
                                            <div className="d-flex align-items-center gap-2">
                                                <div className={`status-badge ${status.class}`}>
                                                    {status.icon} {status.label}
                                                </div>

                                                     {item.IS_IMPORTANT && (
                                                    <span className="important-flag">
                                                        ⚠️ Important
                                                    </span>
                                                )}
                                            </div>
                                        </div>


                                        <div className="history-meta">
                                            <span>🕐 {formatDate(item.CREATED_AT)}</span>
                                        </div>
                                        <div className="history-body">
                                            <p title={item.BODY}>
                                                {truncateText(item.BODY)}
                                            </p>
                                        </div>
                                        {item.IS_APPROVE !== null ? (
                                            <div className="history-footer">
                                                <div className="response-info">
                                                    <span>Responded by:</span>
                                                    <span className="responder">
                                                        {item.RESPONSE_USER?.USER_INISIAL || `User ${item.RESPONSE_USER_ID}`}
                                                    </span>
                                                </div>
                                                {item.RESPONSE_FEEDBACK && (
                                                    <span className="feedback-preview" title={item.RESPONSE_FEEDBACK}>
                                                        💬 "{truncateText(item.RESPONSE_FEEDBACK, 50)}"
                                                    </span>
                                                )}
                                            </div>
                                        ) : <div className="history-footer"><div className="response-info"> <i>Menunggu tim teknis memberikan response</i></div></div>}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        variant="secondary"
                        size="md"
                        onClick={() => setShowGriev(false)}
                        className="px-4"
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default FeedbackModal;