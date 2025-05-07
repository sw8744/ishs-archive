import './upload.css';
import Header from '../../components/header/header';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Upload() {
    const [subject, setSubject] = useState();
    const [grade, setGrade] = useState();
    const [year, setYear] = useState();
    const [season, setSeason] = useState();
    const [term, setTerm] = useState();
    const [teacher, setTeacher] = useState();
    const [type, setType] = useState('test');
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const navigate = useNavigate();

    const handleUpload = async () => {
        const formData = new FormData();
        if (!file) {
            alert('파일을 선택해주세요');
            return;
        }
        if (!subject || !grade || !year || !season || !term || !teacher) {
            alert('모든 정보를 입력해주세요');
            return;
        }
        formData.append('file', file);
        formData.append('subject', subject);
        formData.append('grade', grade);
        formData.append('year', year);
        formData.append('season', season);
        formData.append('term', term);
        formData.append('teacher', teacher);
        formData.append('type', type);

        const response = await fetch('http://127.0.1:5000/api/upload', {
            method: 'POST',
            body: formData,
        });
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            alert('업로드 성공');
            navigate('/search');
        } else {
            alert('업로드 실패');
        }
    };
    return (
        <div>
            <Header />
            <div id='searchBanner'>
                <div id='searchSubjectDiv'>
                        <div id='searchSubjectTitle'>과목</div>
                        <input id='searchSubjectInput' type='text' placeholder='과목(띄어쓰기까지 정확히!)' onChange={(e) => setSubject(e.target.value)} />
                    </div>
                    <div id='searchYearDiv'>
                        <div id='searchYearTitle'>연도</div>
                        <input id='searchYearInput' type='text' placeholder='연도' onChange={(e) => setYear(e.target.value)} />
                    </div>
                    <div id='searchSeasonDiv'>
                        <div id='searchSeasonTitle'>학기</div>
                        <input id='searchSeasonInput' type='text' placeholder='학기' onChange={(e) => setSeason(e.target.value)} />
                    </div>
                    <div id='searchTermDiv'>
                        <div id='searchTermTitle'>고사</div>
                        <input id='searchTermInput' type='text' placeholder='고사' onChange={(e) => setTerm(e.target.value)} />
                    </div>
                    <div id='searchTeacherDiv'>
                        <div id='searchTeacherTitle'>출제 교사</div>
                        <input id='searchTeacherInput' type='text' placeholder='교사(쉼표사용, 띄어쓰기X!)' onChange={(e) => setTeacher(e.target.value)} />
                    </div>
                    <div id='searchTestDiv'>
                        <select id='searchTestSelect' onChange={(e) => setType(e.target.value)}>
                            <option value="test">시험지</option>
                            <option value="answer">답지</option>
                        </select>
                    </div>
                    <button id='searchButton' onClick={() => {handleUpload()}}>업로드</button>
            </div>
            <div id="pdfContainerDiv">
                <input type="file" id="fileInput" accept='application/pdf' onChange={(e) => {handleFileChange(e)}} />
                <iframe id='pdfFrame' src={file ? URL.createObjectURL(file) : ''} width="100%" height="100%"></iframe>
            </div>
        </div>
    );
};

export default Upload;