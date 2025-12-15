import { useEffect, useState } from "react";
import axios from "../../api/api.js";
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Navbar, Row, Col, Button, Form } from "react-bootstrap";




export function PageRegistration(){
    const [ dataLoker, setDataLoker ]               = useState([]);
    const [ listProv, setListProv]                  = useState([]);
    const [ listKabkota, setListKabkota]            = useState([]);
    const [ listKcmtn, setListKcmtn]                = useState([]);
    const [ listKlrhn, setListKlrhn ]               = useState([]);
    const [ filterBirthCity, setFilterBirthCity]    = useState([]);
    const [ filterKabKota, setFilterKabKota]        = useState([]);
    const [ filterKcmtn, setFilterKcmtn]            = useState([]);
    const [ filterKlrhn, setFilterKlrhn ]           = useState([]);
    const [ filterKabKotaTgl, setFilterKabKotaTgl]  = useState([]);
    const [ filterKcmtnTgl, setFilterKcmtnTgl]      = useState([]);
    const [ filterKlrhnTgl, setFilterKlrhnTgl ]     = useState([]);
    const [ isKTPCurrent, setIsKTPCurrent]          = useState(true);
    const [ isOrganisasi, setIsOrganisasi]          = useState(false);
    const [ isPsikotest, setIsPsikotest]            = useState(false);
    const [ isReadyContract, setIsReadyContract]    = useState(false);
    const [ isReadyPlacement, setIsReadyPlacement]  = useState(false);
    const [ isValidStatement, SetIsValidStatement]  = useState(false);
    const [ dataLamaran, setDataLamaran ]           = useState({
        FullName: '',
        NikKTP: '',
        BirthDate: '',
        BirthPlace: '',
        Email: '',
        Phone: '',
        FatherName: '',
        MotherName: '',
    });
    

    
    // validasi passkey ketika akses halaman register
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const PassKey = searchParams.get('pk');
    if(!PassKey) navigate("/");


    // onchange ketika input NIK KTP
    const ocInputNIk = (event) => {
        let { name, value } = event.target;
        setDataLamaran(prevState => ({
            ...prevState,
            PassKey: PassKey,
            [name]: value,
            isKTPCurrent: isKTPCurrent,
            isPsikotest: isPsikotest,
            isReadyContract: isReadyContract,
            isOrganisasi: isOrganisasi,
            isReadyPlacement: isReadyPlacement,
            isDocValid: isValidStatement
        }));
    }


    // onchange ketika input field data lamaran
    const ocInputLamaran = (event) => {
        let { name, value } = event.target;
        switch(name){
            case 'AddressBirthProvID':
                const dataBirthCity             = listKabkota.filter(item => item.id_prov === parseInt(value));
                setFilterBirthCity(dataBirthCity);
            break;
            case 'AddressKTPProvID':
                const dataRegency               = listKabkota.filter(item => item.id_prov === parseInt(value));
                setFilterKabKota(dataRegency);
            break;
            case 'AddressDOMProvID':
                const dataRegencyTgl            = listKabkota.filter(item => item.id_prov === parseInt(value));
                setFilterKabKotaTgl(dataRegencyTgl);    
            break;
            case 'AddressKTPKabKotaID':
                const dataDistrict              = listKcmtn.filter(item => item.id_kabkota === parseInt(value));
                setFilterKcmtn(dataDistrict);
            break;
            case 'AddressDOMKabKotaID':
                const dataDistrictTgl           = listKcmtn.filter(item => item.id_kabkota === parseInt(value)); 
                setFilterKcmtnTgl(dataDistrictTgl);
            break;  
            case 'AddressKTPKecamatanID':
                const dataFilterKelurahan       = listKlrhn.filter(item => item.id_kecamatan === parseInt(value));
                setFilterKlrhn(dataFilterKelurahan); 
            break;
            case 'AddressDOMKecamatanID':
                const dataFilterKelurahanTgl    = listKlrhn.filter(item => item.id_kecamatan === parseInt(value)); 
                setFilterKlrhnTgl(dataFilterKelurahanTgl);
            break;
            
            default:
            break;
        }
        
        const newDataLamaran = {
            ...dataLamaran,
            [name]: value,
            PassKey: PassKey,
            isKTPCurrent: isKTPCurrent,
            isOrganisasi: isOrganisasi,
            isPsikotest: isPsikotest,
            isReadyContract: isReadyContract,
            isReadyPlacement: isReadyPlacement,
            isDocValid: isValidStatement
        };
        setDataLamaran(newDataLamaran);
        localStorage.setItem('formData', JSON.stringify(newDataLamaran));
    }
    
    // submit data lamaran
    const SubmitLamaran = (event) => {
        try {
            event.preventDefault();
            axios
            .post(`/hr/submit-lamaran`, { dataLamaran: dataLamaran })
            .then((response) => { 
                if (response.status === 200) { 
                    navigate('/success-apply');
                }
            })
            .catch((error) => { if (error.response) return console.log('fail') });
            localStorage.removeItem('formData');
        } catch(err){
            console.log(err);
        }
    }

    // onchange switch on off field
    const checkKTPCurrent       = () => { setIsKTPCurrent(!isKTPCurrent) };
    const checkOrganisasi       = () => { setIsOrganisasi(!isOrganisasi) };
    const checkPsikotest        = () => { setIsPsikotest(!isPsikotest) };
    const checkReadyContract    = () => { setIsReadyContract(!isReadyContract) };
    const checkReadyPlacement   = () => { setIsReadyPlacement(!isReadyPlacement) };
    
    // checkbox pernyataan valid data oleh pelamar
    const checkStateValid       = () => { 
        SetIsValidStatement(!isValidStatement);
        setDataLamaran(prevState => ({
            ...prevState,
            PassKey: PassKey,
            isKTPCurrent: isKTPCurrent,
            isOrganisasi: isOrganisasi,
            isPsikotest: isPsikotest,
            isReadyContract: isReadyContract,
            isReadyPlacement: isReadyPlacement,
            isDocValid: !isValidStatement
        }));
    };
    const checkEduField         = dataLamaran.Level === '';

    useEffect(() => {
        const getMasterProvinsi = () => {
            axios
            .get("/hr/master-address-provinsi")
            .then((response) => { if(response.status===200) {
                setListProv(response.data.data);
                localStorage.setItem('provDataCache', JSON.stringify(response.data.data));
            }})
            .catch((error) => { console.error(error)})
        }

        const getMasterKabkota = () => {
            axios
            .get("/hr/master-address-kabkota")
            .then((response) => { if(response.status===200) {
                setListKabkota(response.data.data);
                localStorage.setItem('kabkotaDataCache', JSON.stringify(response.data.data));
            }})
            .catch((error) => { console.error(error)})
        }
        
        const getMasterKecamatan = () => {
            axios
            .get("/hr/master-address-kecamatan")
            .then((response) => { if(response.status===200) {
                setListKcmtn(response.data.data);
                localStorage.setItem('kecamatanDataCache', JSON.stringify(response.data.data));
            }})
            .catch((error) => { console.error(error)})
        }

        const getMasterKelurahan = () => {
            axios
            .get("/hr/master-address-kelurahan")
            .then((response) => { if(response.status===200) setListKlrhn(response.data.data)})
            .catch((error) => { console.error(error)})
        }

        const getLokerActive = () => {
            axios
            .get("/hr/get-active-job")
            .then((response) => { if(response.status===200) setDataLoker(response.data.data)})
            .catch((error) => { console.error(error)})
          }

        // running get data alamat
        getMasterProvinsi();
        getMasterKabkota();
        getMasterKecamatan();
        getMasterKelurahan();
        getLokerActive();


        
    }, []);

    // Load data from localStorage when the component mounts
    useEffect(() => {
        const getSavedData = async() => {
            const savedData         = localStorage.getItem('formData');
            
            if (savedData) setDataLamaran(JSON.parse(savedData));
        }
        
        getSavedData();
    }, []); // Empty dependency array means this runs once when the component mounts


    // Save data to localStorage whenever formData changes
    useEffect(() => {
        localStorage.setItem('formData', JSON.stringify(dataLamaran));
    }, [dataLamaran]); // Dependency array ensures this runs whenever formData is updated

    return (
        <div>
            <Navbar bg="light" sticky="top">
                <Container>
                    <Navbar.Brand href="#">
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
                    <Col>
                        <h3>FORM PELAMAR</h3>
                        <br/>
                    </Col>
                </Row>
                    <Form onSubmit={SubmitLamaran}>
                        <Row>
                            <Col sm={12} md={12} lg={12}><h5><b>DATA PELAMAR</b></h5></Col>
                            <Col sm={12} md={6} lg={6}>
                                <Form.Label>Nama Lengkap *</Form.Label>
                                <Form.Control type="text" name="FullName" onChange={ocInputLamaran} value={dataLamaran.FullName} required={true} style={{textTransform:'uppercase'}} />
                            </Col>
                            <Col sm={12} md={6} lg={6}>
                                <Form.Label>Posisi Yang Dilamar</Form.Label>
                                <Form.Select aria-label="Posisi" name="Position" onChange={ocInputLamaran}  value={dataLamaran.Posisi} required={true}>
                                    <option value="" disabled selected>Silahkan Pilih</option>
                                    {dataLoker.map((item, index) => (
                                        <option key={index} value={item.Posisi}>{item.Posisi}</option> 
                                    ))}
                                </Form.Select>
                            </Col>
                            <Col sm={12} md={12} lg={12}><h5><b>DATA PRIBADI</b></h5></Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>NIK KTP *</Form.Label>
                                <Form.Control type="number" minLength={16} maxLength={16} name="NikKTP" onChange={ocInputNIk} value={dataLamaran.NikKTP} required={true} />
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Provinsi Tempat Lahir</Form.Label>
                                <Form.Select aria-label="Provinsi" name="AddressBirthProvID" onChange={ocInputLamaran} value={dataLamaran.AddressBirthProvID}>
                                    <option value="" disabled selected>Silahkan Pilih</option>
                                    {listProv.map((item, index) => (
                                        <option key={index} value={item.id_prov}>{item.nama_prov}</option> 
                                    ))}
                                </Form.Select>
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Kabupaten / Kota Tempat Lahir</Form.Label>
                                <Form.Select aria-label="Kabupaten / Kota" name="BirthPlace" onChange={ocInputLamaran} required={true} value={dataLamaran.BirthPlace}>
                                    <option value="" disabled selected>Silahkan Pilih</option>
                                    {filterBirthCity.map((item, index) => (
                                        <option key={index} value={item.nama_kabkota}>{item.nama_kabkota}</option> 
                                    ))}
                                </Form.Select>
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Tanggal Lahir *</Form.Label>
                                <Form.Control type="date" name="BirthDate" onChange={ocInputLamaran} required={true} value={dataLamaran.BirthDate}/>
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>No Telp *</Form.Label>
                                <Form.Control type="number"  name="Phone" onChange={ocInputLamaran} required={true} value={dataLamaran.Phone}/>
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Email *</Form.Label>
                                <Form.Control type="text"  name="Email" onChange={ocInputLamaran} required={true} value={dataLamaran.Email}/>
                            </Col>
                            <Col sm={12} md={12} lg={12}><h5><b>DATA ALAMAT</b></h5></Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Provinsi</Form.Label>
                                <Form.Select aria-label="Provinsi" name="AddressKTPProvID" onChange={ocInputLamaran} required={true} value={dataLamaran.AddressKTPProvID}>
                                    <option value="" disabled selected>Silahkan Pilih</option>
                                    {listProv.map((item, index) => (
                                        <option key={index} value={item.id_prov}>{item.nama_prov}</option> 
                                    ))}
                                </Form.Select>
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Kabupaten / Kota</Form.Label>
                                <Form.Select aria-label="Kabupaten / Kota" name="AddressKTPKabKotaID" onChange={ocInputLamaran} required={true} value={dataLamaran.AddressKTPKabKotaID}>
                                    <option value="" disabled selected>Silahkan Pilih</option>
                                    {filterKabKota.map((item, index) => (
                                        <option key={index} value={item.id_kabkota}>{item.nama_kabkota}</option> 
                                    ))}
                                </Form.Select>
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Kecamatan</Form.Label>
                                <Form.Select aria-label="Kecamatan" name="AddressKTPKecamatanID" onChange={ocInputLamaran} required={true} value={dataLamaran.AddressKTPKecamatanID}>
                                    <option value="" disabled selected>Silahkan Pilih</option>
                                    {filterKcmtn.map((item, index) => (
                                        <option key={index} value={item.id_kecamatan}>{item.nama_kecamatan}</option> 
                                    ))}
                                </Form.Select>
                            </Col>
                            <Col xs={12} sm={6} md={6} lg={4}>
                                <Form.Label>Kelurahan / Desa</Form.Label>
                                <Form.Select aria-label="Kelurahan" name="AddressKTPKelurahanID" onChange={ocInputLamaran} required={true} value={dataLamaran.AddressKTPKelurahanID}>
                                    <option value="" disabled selected>Silahkan Pilih</option>
                                    {filterKlrhn.map((item, index) => (
                                        <option key={index} value={item.nama_kelurahan}>{item.nama_kelurahan}</option> 
                                    ))}
                                </Form.Select>
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={4}>
                                <Form.Label>RT</Form.Label>
                                <Form.Control type="number"  name="AddressKTPRT" onChange={ocInputLamaran}  required={true} value={dataLamaran.AddressKTPRT}/>
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={4}>
                                <Form.Label>RW</Form.Label>
                                <Form.Control type="number"  name="AddressKTPRW" onChange={ocInputLamaran}  required={true} value={dataLamaran.AddressKTPRW}/>
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Alamat Detail</Form.Label>
                                <Form.Control type="text"  name="AddressKTPDetail" onChange={ocInputLamaran} required={true} value={dataLamaran.AddressKTPDetail} style={{textTransform:'uppercase'}}/>
                            </Col>
                            <Col sm={12} md={12} lg={12}>
                                <br/>
                                <i>
                                <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    checked={isKTPCurrent}
                                    name="AddressKTPisCurrent"
                                    label="Alamat Tempat Tinggal sesuai dengan KTP"
                                    onChange={checkKTPCurrent}
                                    value={dataLamaran.isKTPCurrent}
                                />
                                </i>
                            </Col>
                            <Col sm={12} md={12} lg={12}>
                                <br/><b>ALAMAT TEMPAT TINGGAL</b>
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Provinsi</Form.Label>
                                <Form.Select aria-label="Provinsi" name="AddressDOMProvID" onChange={ocInputLamaran} disabled={isKTPCurrent}  value={dataLamaran.AddressDOMProvID}>
                                    <option value="" disabled selected>Silahkan Pilih</option>
                                    {listProv.map((item, index) => (
                                        <option key={index} value={item.id_prov}>{item.nama_prov}</option> 
                                    ))}
                                </Form.Select>
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Kabupaten / Kota</Form.Label>
                                <Form.Select aria-label="Kabupaten / Kota" name="AddressDOMKabKotaID" onChange={ocInputLamaran}  value={dataLamaran.AddressDOMKabKotaID} disabled={isKTPCurrent}>
                                    <option value="" disabled selected>Silahkan Pilih</option>
                                    {filterKabKotaTgl.map((item, index) => (
                                        <option key={index} value={item.id_kabkota}>{item.nama_kabkota}</option> 
                                    ))}
                                </Form.Select>
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Kecamatan</Form.Label>
                                <Form.Select aria-label="Kecamatan" name="AddressDOMKecamatanID"  value={dataLamaran.AddressDOMKecamatanID} onChange={ocInputLamaran} disabled={isKTPCurrent}>
                                    <option value="" disabled selected>Silahkan Pilih</option>
                                    {filterKcmtnTgl.map((item, index) => (
                                        <option key={index} value={item.id_kecamatan}>{item.nama_kecamatan}</option> 
                                    ))}
                                </Form.Select>
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={4}>
                                <Form.Label>Kelurahan / Desa</Form.Label>
                                <Form.Select aria-label="Kelurahan" name="AddressDOMKelurahanID"  value={dataLamaran.AddressDOMKelurahanID} onChange={ocInputLamaran} disabled={isKTPCurrent}>
                                    <option value="" disabled selected>Silahkan Pilih</option>
                                    {filterKlrhnTgl.map((item, index) => (
                                        <option key={index} value={item.nama_kelurahan}>{item.nama_kelurahan}</option> 
                                    ))}
                                </Form.Select>
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={4}>
                                <Form.Label>RT</Form.Label>
                                <Form.Control type="number"  name="AddressDOMRT" onChange={ocInputLamaran} value={dataLamaran.AddressDOMRT} disabled={isKTPCurrent}/>
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={4}>
                                <Form.Label>RW</Form.Label>
                                <Form.Control type="number"  name="AddressDOMRW" onChange={ocInputLamaran} value={dataLamaran.AddressDOMRW} disabled={isKTPCurrent}/>
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Alamat Detail</Form.Label>
                                <Form.Control type="text"  name="AddressDOMDetail" onChange={ocInputLamaran}  value={dataLamaran.AddressDOMDetail} disabled={isKTPCurrent} style={{textTransform:'uppercase'}}/>
                            </Col>
                            <Col sm={12} md={12} lg={12}>
                                <br/><b>KONTAK DARURAT</b>
                            </Col>
                            <Col sm={12} md={6} lg={2}>
                                <Form.Label>Golongan Darah</Form.Label>
                                <Form.Select aria-label="Golongan Darah" name="BloodType" value={dataLamaran.BloodType} onChange={ocInputLamaran} required={true}>
                                    <option value="" disabled selected>Silahkan Pilih</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="AB">AB</option>
                                    <option value="O">O</option>
                                    <option value="NULL">TIDAK TAHU</option>
                                </Form.Select>
                            </Col>
                            <Col sm={12} md={6} lg={3}>
                                <Form.Label>Nama Ayah</Form.Label>
                                <Form.Control type="text" name="FatherName" value={dataLamaran.FatherName} onChange={ocInputLamaran} required={true} style={{textTransform:'uppercase'}}/>
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Pekerjaan Ayah</Form.Label>
                                <Form.Control type="text"  name="FatherJob" value={dataLamaran.FatherJob} onChange={ocInputLamaran} style={{textTransform:'uppercase'}}/>
                            </Col>
                            <Col sm={12} md={6} lg={3}>
                                <Form.Label>Nama Ibu</Form.Label>
                                <Form.Control type="text" name="MotherName" value={dataLamaran.MotherName} onChange={ocInputLamaran} required={true} style={{textTransform:'uppercase'}}/>
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Pekerjaan Ibu</Form.Label>
                                <Form.Control type="text"  name="MotherJob" value={dataLamaran.MotherJob} onChange={ocInputLamaran} style={{textTransform:'uppercase'}}/>
                            </Col>
                            <Col sm={12} md={6} lg={5}>
                                <Form.Label>Alamat Orangtua / Wali</Form.Label>
                                <Form.Control type="text"  name="ParentAddress"  value={dataLamaran.ParentAddress} onChange={ocInputLamaran} required={true} style={{textTransform:'uppercase'}}/>
                            </Col>
                            <Col sm={12} md={6} lg={3}>
                                <Form.Label>No Telp Orangtua / Wali</Form.Label>
                                <Form.Control type="text"  name="ParentPhone"  value={dataLamaran.ParentPhone} onChange={ocInputLamaran} required={true}/>
                            </Col>
                            <Col sm={12} md={12} lg={12}>
                                <br/><b>RIWAYAT PENDIDIKAN TERAKHIR</b>
                            </Col>
                            <Col sm={12} md={6} lg={3}>
                                <Form.Label>Jenjang Pendidikan</Form.Label>
                                <Form.Select aria-label="Jenjang" name="EduLastLevel" value={dataLamaran.EduLastLevel} onChange={ocInputLamaran} required={true}>
                                    <option value="" disabled selected>Silahkan Pilih</option>
                                    <option value={"SD"}>SD</option>
                                    <option value={"SMP"}>SMP</option>
                                    <option value={"SMA"}>SMA / SMK</option>
                                    <option value={"D1"}>D-1</option>
                                    <option value={"D2"}>D-2</option>
                                    <option value={"D3"}>D-3</option>
                                    <option value={"S1"}>S-1</option>
                                </Form.Select>
                            </Col>
                            <Col sm={12} md={6} lg={3}>
                                <Form.Label>Nama Sekolah</Form.Label>
                                <Form.Control type="text"  name={`EduLastName`} onChange={ocInputLamaran} disabled={checkEduField} required={true} style={{textTransform:'uppercase'}}/>
                            </Col>
                            <Col sm={12} md={6} lg={3}>
                                <Form.Label>Kabupaten / Kota</Form.Label>
                                <Form.Control type="text" name={`EduLastCity`} onChange={ocInputLamaran} disabled={checkEduField} required={true} style={{textTransform:'uppercase'}}/>
                            </Col>
                            <Col sm={12} md={6} lg={3}>
                                <Form.Label>Jurusan</Form.Label>
                                <Form.Control type="text"  name={`EduLastType`} onChange={ocInputLamaran} disabled={checkEduField}  style={{textTransform:'uppercase'}}/>
                            </Col>
                            <Col sm={12} md={6} lg={3}>
                                <Form.Label>Tahun Lulus</Form.Label>
                                <Form.Control type="number"  name={`EduLastYear`} onChange={ocInputLamaran} disabled={checkEduField} required={true}/>
                            </Col>
                            <Col sm={12} md={12} lg={12}>
                                <br/><b>PENGALAMAN KERJA</b>
                            </Col>
                            <Col sm={12} md={12} lg={12}>
                                <Form.Label>Perusahaan 1</Form.Label>
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Nama Perusahaan</Form.Label>
                                <Form.Control type="text"  name="Work1Name" value={dataLamaran.Work1Name} onChange={ocInputLamaran} style={{textTransform:'uppercase'}}/>
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Jabatan</Form.Label>
                                <Form.Control type="text"  name="Work1Position" value={dataLamaran.Work1Position} onChange={ocInputLamaran} style={{textTransform:'uppercase'}} />
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Tempat Perusahaan</Form.Label>
                                <Form.Control type="text"  name="Work1Place" value={dataLamaran.Work1Place} onChange={ocInputLamaran} style={{textTransform:'uppercase'}} />
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Lama Kerja</Form.Label>
                                <Form.Control type="text"  name="Work1Periode" value={dataLamaran.Work1Periode} onChange={ocInputLamaran} style={{textTransform:'uppercase'}} />
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Gaji Terakhir</Form.Label>
                                <Form.Control type="number"  name="Work1Salary" value={dataLamaran.Work1Salary} onChange={ocInputLamaran} />
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Alasan Keluar</Form.Label>
                                <Form.Control type="text"  name="Work1Reason" value={dataLamaran.Work1Reason} onChange={ocInputLamaran} style={{textTransform:'uppercase'}}/>
                            </Col>
                            
                            <Col sm={12} md={12} lg={12}>
                                <Form.Label><br/>Perusahaan 2</Form.Label>
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Nama Perusahaan</Form.Label>
                                <Form.Control type="text"  name="Work2Name" value={dataLamaran.Work2Name} onChange={ocInputLamaran}  style={{textTransform:'uppercase'}}/>
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Jabatan</Form.Label>
                                <Form.Control type="text"  name="Work2Position" value={dataLamaran.Work2Position} onChange={ocInputLamaran}  style={{textTransform:'uppercase'}}/>
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Tempat Perusahaan</Form.Label>
                                <Form.Control type="text"  name="Work2Place" value={dataLamaran.Work2Place} onChange={ocInputLamaran}  style={{textTransform:'uppercase'}}/>
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Lama Kerja</Form.Label>
                                <Form.Control type="text"  name="Work2Periode" value={dataLamaran.Work2Periode} onChange={ocInputLamaran} />
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Gaji Terakhir</Form.Label>
                                <Form.Control type="number"  name="Work2Salary" value={dataLamaran.Work2Salary} onChange={ocInputLamaran} />
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Alasan Keluar</Form.Label>
                                <Form.Control type="text"  name="Work2Reason" value={dataLamaran.Work2Reason} onChange={ocInputLamaran} style={{textTransform:'uppercase'}}/>
                            </Col>
                            <Col sm={12} md={12} lg={12}>
                                <Form.Label><br/>Perusahaan 3</Form.Label>
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Nama Perusahaan</Form.Label>
                                <Form.Control type="text"  name="Work3Name" value={dataLamaran.Work3Name} onChange={ocInputLamaran}  style={{textTransform:'uppercase'}}/>
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Jabatan</Form.Label>
                                <Form.Control type="text"  name="Work3Position" value={dataLamaran.Work3Position} onChange={ocInputLamaran}  style={{textTransform:'uppercase'}}/>
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Tempat Perusahaan</Form.Label>
                                <Form.Control type="text"  name="Work3Place" value={dataLamaran.Work3Place} onChange={ocInputLamaran}  style={{textTransform:'uppercase'}}/>
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Lama Kerja</Form.Label>
                                <Form.Control type="text"  name="Work3Periode" value={dataLamaran.Work3Periode} onChange={ocInputLamaran}  style={{textTransform:'uppercase'}}/>
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Gaji Terakhir</Form.Label>
                                <Form.Control type="number"  name="Work3Salary" value={dataLamaran.Work3Salary} onChange={ocInputLamaran} />
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Alasan Keluar</Form.Label>
                                <Form.Control type="text"  name="Work3Reason" value={dataLamaran.Work3Reason} onChange={ocInputLamaran}  style={{textTransform:'uppercase'}}/>
                            </Col>
                            <Col sm={12} md={12} lg={12}>
                                <br/><b>RIWAYAT KURSUS</b>
                            </Col>
                            <Col sm={12} md={12} lg={12}>
                                <Form.Label>Kursus 1</Form.Label>
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Materi Kursus</Form.Label>
                                <Form.Control type="text"  name="Kursus1Topic" value={dataLamaran.Kursus1Topic} onChange={ocInputLamaran} style={{textTransform:'uppercase'}} />
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Tempat Kursus</Form.Label>
                                <Form.Control type="text"  name="Kursus1Location" value={dataLamaran.Kursus1Location} onChange={ocInputLamaran} style={{textTransform:'uppercase'}} />
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Durasi Kursus</Form.Label>
                                <Form.Control type="text"  name="Kursus1Periode" value={dataLamaran.Kursus1Periode} onChange={ocInputLamaran} style={{textTransform:'uppercase'}} />
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Nama Lembaga</Form.Label>
                                <Form.Control type="text"  name="Kursus1Place" value={dataLamaran.Kursus1Place} onChange={ocInputLamaran} style={{textTransform:'uppercase'}} />
                            </Col>
                            
                            <Col sm={12} md={12} lg={12}>
                                <Form.Label>Kursus 2</Form.Label>
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Materi Kursus</Form.Label>
                                <Form.Control type="text"  name="Kursus2Topic" value={dataLamaran.Kursus2Topic} onChange={ocInputLamaran} style={{textTransform:'uppercase'}} />
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Tempat Kursus</Form.Label>
                                <Form.Control type="text"  name="Kursus2Location" value={dataLamaran.Kursus2Location} onChange={ocInputLamaran} style={{textTransform:'uppercase'}} />
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Durasi Kursus</Form.Label>
                                <Form.Control type="text"  name="Kursus2Periode" value={dataLamaran.Kursus2Periode} onChange={ocInputLamaran} style={{textTransform:'uppercase'}} />
                            </Col>    
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Nama Lembaga</Form.Label>
                                <Form.Control type="text"  name="Kursus2Place" value={dataLamaran.Kursus2Place} onChange={ocInputLamaran} style={{textTransform:'uppercase'}} />
                            </Col>

                            <Col sm={12} md={12} lg={12}>
                                <br/><b>ORGANISASI</b>
                            </Col>
                            <Col sm={12} md={12} lg={12}>
                                <i>
                                <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    checked={isOrganisasi}
                                    name="isOrganisasi"
                                    label="Bergabung di Organisasi"
                                    onChange={checkOrganisasi}
                                    value={dataLamaran.isOrganisasi}
                                />
                                </i>
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Nama Organisasi</Form.Label>
                                <Form.Control type="text" name="Org1Name" value={dataLamaran.Org1Name} onChange={ocInputLamaran} disabled={!isOrganisasi} style={{textTransform:'uppercase'}} />
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Jabatan</Form.Label>
                                <Form.Control type="text"  name="Org1Position" value={dataLamaran.Org1Position} onChange={ocInputLamaran}  disabled={!isOrganisasi} style={{textTransform:'uppercase'}} />
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Lama</Form.Label>
                                <Form.Control type="text"  name="Org1Periode" value={dataLamaran.Org1Periode} onChange={ocInputLamaran}  disabled={!isOrganisasi} style={{textTransform:'uppercase'}} />
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Tempat</Form.Label>
                                <Form.Control type="text"  name="Org1Place" value={dataLamaran.Org1Place} onChange={ocInputLamaran}  disabled={!isOrganisasi} style={{textTransform:'uppercase'}} />
                            </Col>

                            <Col sm={12} md={12} lg={12}>
                                <br/><b>SUSUNAN KELUARGA</b>
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Nama Suami / Istri</Form.Label>
                                <Form.Control type="text"  name="SpouseName" value={dataLamaran.SpouseName} onChange={ocInputLamaran} style={{textTransform:'uppercase'}} />
                            </Col>
                            <Col xs={8} sm={8} md={6} lg={4}>
                                <Form.Label>Anak 1</Form.Label>
                                <Form.Control type="text"  name="Child1Name" value={dataLamaran.Child1Name} onChange={ocInputLamaran} style={{textTransform:'uppercase'}} />
                            </Col>
                            <Col xs={4} sm={4} md={6} lg={4}>
                                <Form.Label> Usia (Tahun) </Form.Label>
                                <Form.Control type="number"  name="Child1Age" value={dataLamaran.Child1Age} onChange={ocInputLamaran} />
                            </Col>
                            <Col xs={8} sm={8} md={6} lg={4}>
                                <Form.Label>Anak 2</Form.Label>
                                <Form.Control type="text"  name="Child2Name" value={dataLamaran.Child2Name} onChange={ocInputLamaran} style={{textTransform:'uppercase'}} />
                            </Col>
                            <Col xs={4} sm={4} md={6} lg={4}>
                                <Form.Label> Usia (Tahun) </Form.Label>
                                <Form.Control type="number"  name="Child2Age" value={dataLamaran.Chhild2Age} onChange={ocInputLamaran} />
                            </Col>
                            <Col xs={8} sm={8} md={6} lg={4}>
                                <Form.Label>Anak 3</Form.Label>
                                <Form.Control type="text"  name="Child3Name" value={dataLamaran.Child3Name} onChange={ocInputLamaran} style={{textTransform:'uppercase'}} />
                            </Col>
                            <Col xs={4} sm={4} md={6} lg={4}>
                                <Form.Label> Usia (Tahun) </Form.Label>
                                <Form.Control type="number" name="Child3Age" value={dataLamaran.Child3Age} onChange={ocInputLamaran} />
                            </Col>
                            <Col xs={8} sm={8} md={6} lg={4}>
                                <Form.Label>Anak 4</Form.Label>
                                <Form.Control type="text"  name="Child4Name" value={dataLamaran.Child4Name} onChange={ocInputLamaran} style={{textTransform:'uppercase'}} />
                            </Col>
                            <Col xs={4} sm={4} md={6} lg={4}>
                                <Form.Label> Usia (Tahun) </Form.Label>
                                <Form.Control type="number"  name="Child4Age" value={dataLamaran.Child4Age} onChange={ocInputLamaran} />
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={4}>
                                <Form.Label>Jumlah Saudara</Form.Label>
                                <Form.Control type="number"  name="CountFamily" value={dataLamaran.CountFamily} onChange={ocInputLamaran} />
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={4}>
                                <Form.Label> Anak ke </Form.Label>
                                <Form.Control type="number"  name="SeqFamily" value={dataLamaran.SeqFamily} onChange={ocInputLamaran} />
                            </Col>

                            <Col sm={12} md={12} lg={12}>
                                <br/><b>KARYAWAN YANG DIKENAL</b>
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Nama</Form.Label>
                                <Form.Control type="text"  name="ReffName" value={dataLamaran.ReffName} onChange={ocInputLamaran} style={{textTransform:'uppercase'}} />
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Departemen</Form.Label>
                                <Form.Control type="text"  name="ReffDept" value={dataLamaran.ReffDept} onChange={ocInputLamaran} style={{textTransform:'uppercase'}} />
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Hubungan</Form.Label>
                                <Form.Select aria-label="ReffRelation" name="ReffRelation" value={dataLamaran.ReffRelation} onChange={ocInputLamaran} required={true}>
                                    <option value="" disabled selected>Silahkan Pilih</option>
                                    <option value={"TEMAN"}>TEMAN</option>
                                    <option value={"SAUDARA"}>SAUDARA</option>
                                    <option value={"MEDIA SOSIAL"}>MEDIA SOSIAL</option>
                                </Form.Select>
                            </Col>
                            <Col sm={12} md={12} lg={12}>
                                <br/><b>LAIN-LAIN</b>
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Olahraga Yang Disukai</Form.Label>
                                <Form.Control type="text"  name="LikeSports" value={dataLamaran.LikeSports} onChange={ocInputLamaran} style={{textTransform:'uppercase'}} />
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Kesenian Yang Disukai</Form.Label>
                                <Form.Control type="text"  name="LikeArts" value={dataLamaran.LikeArts} onChange={ocInputLamaran} style={{textTransform:'uppercase'}} />
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Hobi</Form.Label>
                                <Form.Control type="text"  name="LikeHobby" value={dataLamaran.LikeHobby} onChange={ocInputLamaran} style={{textTransform:'uppercase'}} />
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Cita-Cita</Form.Label>
                                <Form.Control type="text"  name="LikeVision" value={dataLamaran.LikeVision} onChange={ocInputLamaran} style={{textTransform:'uppercase'}} />
                            </Col>
                            <Col sm={12} md={12} lg={12}>
                                <br/><i>
                                <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    checked={isPsikotest}
                                    name="isPsikotest"
                                    label="Pernah Mengikuti Psikotest"
                                    onChange={checkPsikotest}
                                    value={dataLamaran.isPsikotest}
                                />
                                </i>
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={4}>
                                <Form.Label>Tempat Psikotest</Form.Label>
                                <Form.Control type="text"  name="PsikotestPlace" value={dataLamaran.PsikotestPlace} onChange={ocInputLamaran} disabled={!isPsikotest} style={{textTransform:'uppercase'}} />
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={4}>
                                <Form.Label>Kapan</Form.Label>
                                <Form.Control type="text"  name="PsikotestTime" value={dataLamaran.PsikotestTime} onChange={ocInputLamaran} disabled={!isPsikotest} style={{textTransform:'uppercase'}}/>
                            </Col>
                            <Col sm={12} md={6} lg={4}>
                                <Form.Label>Kapan Siap Untuk Bekerja</Form.Label>
                                <Form.Control type="date"  name="ExpectedTMB" onChange={ocInputLamaran} />
                            </Col>
                        </Row> 
                        <Row>
                            <Col sm={12} md={12} lg={12}>
                                <br/>
                                <i>
                                <Form.Check
                                    type="checkbox"
                                    id="custom-switch"
                                    checked={isReadyContract}
                                    name="isReadyContract"
                                    label="Bersedia mengikuti masa kontrak"
                                    onChange={checkReadyContract}
                                    required={true}
                                />
                                </i>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={12} md={12} lg={12}>
                                <br/><i>
                                <Form.Check
                                    type="checkbox"
                                    id="custom-switch"
                                    checked={isReadyPlacement}
                                    name="isReadyPlacement"
                                    label="Bersedia ditempatkan dimana saja sesuai kebutuhan perusahaan"
                                    onChange={checkReadyPlacement}
                                    required={true}
                                />
                                </i>
                            </Col>    
                        </Row>
                        <Row>
                            <Col sm={12} md={12} lg={12}>
                                <br/><i>
                                <Form.Check
                                    type="checkbox"
                                    id="custom-switch"
                                    checked={isValidStatement}
                                    name="isDocValid"
                                    label="Dengan ini Saya menyatakan bahwa data yang saya isi adalah benar. Bila dikemudian hari ditemukan adanya kepalsuan maka saya bersedia mengundurkan diri tanpa syarat apa pun."
                                    onChange={checkStateValid}
                                    required={true}
                                />
                                </i>
                            </Col>    
                        </Row>
                        <Row>
                            <Col sm={12} md={12} lg={12}>
                                <br/>
                                <Button variant="primary" size="lg" type="submit" disabled={!isValidStatement||!isReadyPlacement||!isReadyContract}>SUBMIT</Button>
                            </Col>
                        </Row>
                    </Form>
                    <br/>
            </Container>
        </div>
    )
}