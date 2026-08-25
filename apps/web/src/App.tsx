import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Overview } from './pages/Overview';
import { Findings } from './pages/Findings';
import { Placeholder } from './pages/Placeholder';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/findings" element={<Findings />} />
          <Route path="/repositories" element={<Placeholder title="Repositories" />} />
          <Route path="/scans" element={<Placeholder title="Scans" />} />
          <Route path="/dependencies" element={<Placeholder title="Dependencies" />} />
          <Route path="/secrets" element={<Placeholder title="Secrets" />} />
          <Route path="/containers" element={<Placeholder title="Containers" />} />
          <Route path="/iac" element={<Placeholder title="IaC" />} />
          <Route path="/experiments" element={<Placeholder title="Experiments" />} />
          <Route path="/reports" element={<Placeholder title="Reports" />} />
          <Route path="/settings" element={<Placeholder title="Settings" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
