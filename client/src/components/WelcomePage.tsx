import { useNavigate } from 'react-router-dom';
import '../styles/WelcomePage.css';

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/home'); 
  };

  return (
    <div className="page-background">
      <div className="welcome-title-container">
        <h1 className="welcome-title">Welcome to SleepWell!</h1>
      </div>

      <div className="section-title">
        <h2>What is SleepWell?</h2>
      </div>
      <div className="section-text">
        <p>
          <strong>SleepWell</strong> is your companion for balancing productivity and rest. Designed with students in mind, our app helps you track your daily achievements and reflect on your progress to foster guilt-free, restful nights.
        </p>
        <p>
          We understand how hard it can be to feel like you're not doing enough but <strong>SleepWell</strong> is here to remind you of everything you do accomplish. By providing tools to monitor your productivity and sleep patterns, our goal is to help you gain confidence in your efforts and prioritize your well-being. Remember, your worth isn’t measured by how many tasks you check off! SleepWell is a tool to support you in finding balance, not to pressure you into doing more.
        </p>
        <p>
          Gain insights using <strong>SleepWell</strong> how your daytime activities and nighttime rest impact each other ❤️
        </p>
      </div>

      <div className="section-title">
  <h2>How to Use SleepWell</h2>
</div>
<div className="how-to-use-container">
  <div className="how-to-use-box">
    <h3 className="box-title">TODAY'S TASKS</h3>
    <p>Add your tasks for the day and track time for each using the timer. When you complete a task, check it off to add a red heart ❤️ to the "Weekly Progress" board below. The hearts show how many tasks you've completed, giving you an easy way to visualize your productivity.</p>
  </div>
  <div className="how-to-use-box">
    <h3 className="box-title">SLEEP TRACKER</h3>
    <p>Record your sleep hours using the slider in the sleep tracker. As you drag the slider, the moon's shading changes to reflect your sleep quality. Your sleep data is also added to the "Weekly Progress" board.</p>
  </div>
  <div className="how-to-use-box">
    <h3 className="box-title">WEEKLY PROGRESS BOARD</h3>
    <p>The "Weekly Progress" board combines your productivity and sleep data, showing completed tasks as red hearts and sleep patterns for the week in one easy-to-read view.</p>
  </div>
</div>


      <button className="button-styling" onClick={handleButtonClick}>
        Let's get started!
      </button>
    </div>
  );
};

export default WelcomePage;
