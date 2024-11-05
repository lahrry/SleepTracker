import '../styles/WelcomePage.css'; 
import { useNavigate } from 'react-router-dom'; // Import useNavigate
const WelcomePage = () => {
  const navigate = useNavigate(); // Initialize the navigate function

    const handleButtonClick = () => {
        navigate('/home'); // Replace '/another' with the path to the page you want to navigate to
    };
    return (
        <div className="page-background">
          <div>
            <h2 className="welcome-title">Welcome to SleepWell!</h2>
          </div>
          <div className= "section-title">
            <h2 className="section-title">What is SleepWell?</h2>
          </div>
          <div className= "section-text">
            <p className="section-text">
              Discover a new approach to wellness with SleepWell. 
              We are a sleep app designed for students to keep track of their
              productivity through the day so they can sleep through the night. 
              For students who feel guilty about wasting time when they sleep, 
              they can use this app to track their productivity and reflect on 
              everything they have done at the end of the day. Our hope is that you 
              will realize how much you actually do during the day, and not feel 
              guilty about getting well deserved rest. But, please remember that 
              your value is not determined by how many tasks you complete in a day!
              This app is simply to be used as a tool to track how your time is 
              spent and quantify the time that you spend doing work and getting 
              sleep. 
              <br></br>
              Our dashboard provides insightful analytics on your productivity and sleep patterns, allowing you to understand how rest impacts your daytime performance. We hope that this data will be useful for you to manage your balance between work and life!
            </p>

          </div>

          <button className='button-styling' onClick={handleButtonClick}>Let's get started!</button>
           
        </div>
      );
     
};

export default WelcomePage;