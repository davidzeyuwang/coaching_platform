import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import CoachList from './components/Coach/CoachList';
import CoachPage from './components/Coach/CoachPage';
import StudentList from './components/Student/StudentList';
import StudentPage from './components/Student/StudentPage';
import SlotList from './components/Slot/SlotList';
import SlotPage from './components/Slot/SlotPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/coaches/:id" element={<CoachPage />} />
        <Route path="/coaches" element={<CoachList />} />
        <Route path="/students/:id" element={<StudentPage />} />
        <Route path="/students" element={<StudentList />} />
        <Route path="/slots/:id" element={<SlotPage />} />
        <Route path="/slots" element={<SlotList />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
