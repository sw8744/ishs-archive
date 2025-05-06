import './main.css';
import { useNavigate } from 'react-router-dom';

function Main() {
    const navigate = useNavigate();
    const handleSearchButtonClick = () => {
        navigate('/search');
    };
    const handleUploadButtonClick = () => {
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