import './header.css'
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const handleSearchButtonClick = () => {
    navigate('/search');
  };
  const handleUploadButtonClick = () => {
    navigate('/upload');
  };
  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header id='topBanner'>
      <div id="topBannerLogo" onClick={() => {handleLogoClick()}}>On: Zone</div>
      <div id="topBannerMenuSearch" onClick={() => {handleSearchButtonClick()}}>Search</div>
      <div id="topBannerMenuUpload" onClick={() => {handleUploadButtonClick()}}>Upload</div>
    </header>
  );
}

export default Header;