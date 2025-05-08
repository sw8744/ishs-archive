import './info.css';
import Header from '../../components/header/header';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.js'

function Info() {
    const [info, setInfo] = useState([]);
    const [query, setQuery] = useSearchParams();
    const id = query.get('id');

    const fetchInfo = async (id) => {
        const response = await fetch('http://on-zone.site:5000/api/get?id=' + id);
        const data = await response.json();
        setInfo(data[0]);
    };

    useEffect(() => {
        fetchInfo(id);
    }
    , []);

    return (
        <div>
            <Header />
            <div id='searchBanner'>
                {info.year}학년도 {info.grade}학년 {info.season}학기 {info.term}회고사 (출제 : {info.teacher})
                <button id='searchButton' onClick={() => { window.location.href = 'http://on-zone.site:5000/api/getpdf?id=' + id }}>다운로드</button>
                {
                    info.answer === 1 
                    ? <button id='searchButton' onClick={() => { window.location.href = 'http://on-zone.site:5000/api/getanswer?id=' + id }}>답지 다운로드</button>
                    : ""
                }
            </div>
            <div id="pdfContainer">
                <iframe id='pdfFrame' src={'http://on-zone.site:5000/api/getpdfview?id=' + id} width="100%" height="100%"></iframe>
            </div>
        </div>
    );
};

export default Info;