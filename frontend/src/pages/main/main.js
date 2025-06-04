import './main.css';
import { useNavigate } from 'react-router-dom';

function Main() {
    const navigate = useNavigate();
    const handleSearchButtonClick = () => { // 검색 버튼 클릭 시 검색 창으로 이동
        navigate('/search');
    };
    const handleUploadButtonClick = () => { // 업로드 버튼 클릭 시 업로드 창으로 이동
        navigate('/upload');
    };

  return (
    <div>
      <div className="mainRoot">
        <div id="mainTitle">On: Zone</div>
        <div id="mainSubTitle">Test Paper Archiving Platform</div>
        <div id='mainButtonDiv'>
            <button class= "mainButton" id="mainSearchButton" onClick={() => {handleSearchButtonClick()}}>Search</button>
            <button class= "mainButton" id="mainUploadButton" onClick={() => {handleUploadButtonClick()}}>Upload</button>
        </div>
        
      </div>
    </div>
  );
}
export default Main;