import "./index.css";

function App() {
  return (
    <div className="container">
      {/* Background Video */}
      <video autoPlay muted loop playsInline className="video-bg">
        <source src="/background-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay */}
      <div className="overlay"></div>

      {/* Main Content */}
      <div className="content">
        <img
          src="/logo.png"
          alt="AIDATARIS Logo"
          className="logo"
        />

        <h1>AIDATARIS</h1>

        <p className="subtitle">
          Engineering the Future with AI & Data
        </p>

        <div className="construction-box">
          🚧 Website Under Construction 🚧
        </div>

        <p className="small-text">
          We are building something innovative and powerful.
        </p>
      </div>
    </div>
  );
}

export default App;