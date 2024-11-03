import "./App.css";
import Dashboard from "./components/Dashboard";
import WelcomePage from "./components/WelcomePage";
import { Route, Routes } from "react-router-dom";

const App = () => {
 return (
   <div>
     <Routes>
       <Route path="/" element={<WelcomePage />} />
       <Route path="/home" element={<Dashboard  />} />
     </Routes>
   </div>
 );
};

export default App;