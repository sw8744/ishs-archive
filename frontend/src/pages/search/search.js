import './search.css';
import Header from '../../components/header/header';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Search() {
    const [subject, setSubject] = useState();
    const [grade, setGrade] = useState();
    const [year, setYear] = useState();
    const [season, setSeason] = useState();
    const [term, setTerm] = useState();
    const [teacher, setTeacher] = useState();
    const navigate = useNavigate();
    let userFilter = {
        subject: subject,
        grade: grade,
        year: year,
        season: season,
        term: term,
        teacher: teacher
    };
    const [filter, setFilter] = useState();
    const [posts, setPosts] = useState([]);

    const fetchFilter = async () => {
        const response = await fetch('http://127.0.0.1:5000/api/getinfo');
        const data = await response.json();
        setFilter(data);
    };

    const fetchSearch = async () => {
        let query = "?";
        if (userFilter.subject) {
            query += `subject=${userFilter.subject}&`;
        }
        if (userFilter.grade) {
            query += `grade=${userFilter.grade}&`;
        }
        if (userFilter.year) {
            query += `year=${userFilter.year}&`;
        }
        if (userFilter.season) {
            query += `season=${userFilter.season}&`;
        }
        if (userFilter.term) {
            query += `term=${userFilter.term}&`;
        }
        if (userFilter.teacher) {
            query += `teacher=${userFilter.teacher}&`;
        }
        const response = await fetch('http://127.0.0.1:5000/api/get' + query);
        const data = await response.json();
        console.log(data);
        setPosts(data);
    };

    const handlePdf = async (id) => {
        window.location.href = 'http://127.0.0.1:5000/api/getpdf?id=' + id;
    }

    useEffect(() => {
        fetchFilter();
        fetchSearch();
    }
    , []);

    return (
        <div>
            <div className="searchRoot">
                <Header />
                <div id='searchBanner'>
                    <div id='searchSubjectDiv'>
                        <div id='searchSubjectTitle'>과목</div>
                        <select id='searchSubjectSelect' onChange={(e) => setSubject(e.target.value)}>
                            <option value="">선택 안함</option>
                            {filter && filter.subject.map((subject) => (
                                <option key={subject} value={subject}>{subject}</option>
                            ))}
                        </select>
                    </div>
                    <div id='searchYearDiv'>
                        <div id='searchYearTitle'>연도</div>
                        <select id='searchYearSelect' onChange={(e) => setYear(e.target.value)}>
                            <option value="">선택 안함</option>
                            {filter && filter.year.map((year) => (
                                <option key={year} value={year}>{year}학년도</option>
                            ))}
                        </select>
                    </div>
                    <div id='searchSeasonDiv'>
                        <div id='searchSeasonTitle'>학기</div>
                        <select id='searchSeasonSelect' onChange={(e) => setSeason(e.target.value)}>
                            <option value="">선택 안함</option>
                            {filter && filter.season.map((season) => (
                                <option key={season} value={season}>{season}학기</option>
                            ))}
                        </select>
                    </div>
                    <div id='searchTermDiv'>
                        <div id='searchTermTitle'>고사</div>
                        <select id='searchTermSelect' onChange={(e) => setTerm(e.target.value)}>
                            <option value="">선택 안함</option>
                            {filter && filter.term.map((term) => (
                                <option key={term} value={term}>{term}회고사</option>
                            ))}
                        </select>
                    </div>
                    <div id='searchTeacherDiv'>
                        <div id='searchTeacherTitle'>출제 교사</div>
                        <select id='searchTeacherSelect' onChange={(e) => setTeacher(e.target.value)}>
                            <option value="">선택 안함</option>
                            {filter && filter.teacher.map((teacher) => (
                                <option key={teacher} value={teacher}>{teacher}</option>
                            ))}
                        </select>
                    </div>
                    <button id='searchButton' onClick={() => {fetchSearch()}}>검색</button>
                </div>
                <div id='searchResultDiv'>
                    <div id='searchResultList'>
                        {posts.map((post) => (
                            <div className='searchResultItem' key={post.id} onClick={() => handlePdf(post.id)}>
                                <div className='searchResultItemInfo'>
                                    <div className='searchResultItemSubject'>{post.subject}</div>
                                    <div className='searchResultItemGrade'>{post.grade}학년</div>
                                    <div className='searchResultItemYear'>{post.year}학년도</div>
                                    <div className='searchResultItemSeason'>{post.season}학기</div>
                                    <div className='searchResultItemTerm'>{post.term}회고사</div>
                                    <div className='searchResultItemTeacher'>{post.teacher}</div>
                                    <div className='searchResultItemIsDigital'>{post.isdigital === 1 ? '디지털' : '스캔본'}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Search;