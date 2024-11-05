import '../styles/WelcomePage.css'; 
import { useNavigate } from 'react-router-dom'; // Import useNavigate
const WelcomePage = () => {
  const navigate = useNavigate(); // Initialize the navigate function

    const handleButtonClick = () => {
        navigate('/home'); // Replace '/another' with the path to the page you want to navigate to
    };
    return (
        <div className="page-background">
          <div className='welcome-title-container'>
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
          <div className= "section-title">
            <h2 className="section-title">How to Use the App</h2>
          </div>
          <div className= "section-text">
            <p className="section-text">
            Our app is designed to boost your productivity while helping you get a restful night's sleep!
            <br></br>
            <br></br>
            On the main dashboard, you’ll find customizable features tailored to fit your workflow. 
            On the right side, a window displays Today’s TO-DOs for easy access and lets you check 
            off tasks as you complete them. You can expand this window by clicking the icon in the upper 
            right corner, where you’ll find additional tools like a personalized timer for each task. 
            This timer allows you to start, pause, or stop as needed, helping you track your progress 
            and the time spent on individual tasks. At the top of this expanded view, there’s also an 
            overall timer that shows the total time spent on all tasks for the day. You can reorder tasks 
            by dragging them, as well as add or delete any task as you see fit.
            <br></br>
            <br></br>
            On the left side of the page, you’ll see a moon icon. 
            Expanding this view opens a window where you can log the hours of 
            sleep you got the previous night using easy-to-select buttons.
            <br></br>
            <br></br>
            The main dashboard also displays a table that tracks your sleep patterns over time, 
            showing the hours logged each night. Additionally, you’ll see hearts that reflect the 
            number of tasks completed each day over the past week, providing a quick visual of your 
            productivity.
            </p>
          </div>

          <button className='button-styling' onClick={handleButtonClick}>Let's get started!</button>
           
        </div>
      );
     
};

export default WelcomePage;