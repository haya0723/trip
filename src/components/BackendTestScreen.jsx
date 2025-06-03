import React, { useState } from 'react';
import axios from 'axios';

const BACKEND_URL = 'https://trip-app-final-v2-493005991008.asia-northeast1.run.app'; // 正しいURLに修正

function BackendTestScreen({ onBack }) {
  const [healthResult, setHealthResult] = useState('');
  const [dbTestResult, setDbTestResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTestHealth = async () => {
    setLoading(true);
    setError('');
    setHealthResult('');
    try {
      const response = await axios.get(`${BACKEND_URL}/health`);
      setHealthResult(response.data);
    } catch (err) {
      setError(`Health check failed: ${err.message}`);
      console.error(err);
    }
    setLoading(false);
  };

  const handleTestDbConnection = async () => {
    setLoading(true);
    setError('');
    setDbTestResult('');
    try {
      const response = await axios.get(`${BACKEND_URL}/db-test`);
      setDbTestResult(JSON.stringify(response.data, null, 2));
    } catch (err) {
      setError(`DB test failed: ${err.message}`);
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="backend-test-screen" style={{ padding: '20px' }}>
      <header className="app-header">
        <h1>Backend API Test</h1>
        <button onClick={onBack} className="back-button">戻る</button>
      </header>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleTestHealth} disabled={loading} style={{marginRight: '10px'}}>
          Test /health
        </button>
        {healthResult && <pre>Health Result: {healthResult}</pre>}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleTestDbConnection} disabled={loading}>
          Test /db-test
        </button>
        {dbTestResult && <pre>DB Test Result: {dbTestResult}</pre>}
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
}

export default BackendTestScreen;
