import '@styles/ImageBar.css';
import LogoFace from '../assets/LogoFace.svg';
import LogoUbb from '../assets/ubb.svg';

const ImageBar = () => {
  return (
    <div className="image-bar">
      <div className="logo-container logo-left">
        <img 
          src={LogoFace}
          alt="Logo UBB" 
          className="logo-left"
        />
      </div>
      <div className="logo-container logo-right">
        <img 
          src={LogoUbb}
          alt="Logo Facultad" 
          className="logo-right"
        />
      </div>
    </div>
  );
};

export default ImageBar; 