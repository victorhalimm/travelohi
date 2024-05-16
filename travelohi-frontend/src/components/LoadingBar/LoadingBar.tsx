import './LoadingBar.css'


const LoadingBar = () => {
  return (

    <div className="loading-overlay"> 
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default LoadingBar;
