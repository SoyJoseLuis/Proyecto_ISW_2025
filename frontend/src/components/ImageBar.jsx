import '@styles/ImageBar.css';

const ImageBar = () => {
  return (
    <div className="image-bar">
      <div className="logo-container logo-left">
        <img 
          src="/assets/LogoFace.svg" 
          alt="Logo UBB" 
          className="logo-left"
        />
      </div>
      <div className="logo-container logo-right">
        <img 
          src="/assets/Ubb.svg" 
          alt="Logo Facultad" 
          className="logo-right"
        />
      </div>
    </div>
  );
};

export default ImageBar; 