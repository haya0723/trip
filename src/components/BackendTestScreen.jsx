import React, { useState } from 'react';
import axios from 'axios';
import { useAppLogic } from '../hooks/useAppLogic'; 

const BACKEND_URL = 'https://trip-app-final-v2-493005991008.asia-northeast1.run.app';

function BackendTestScreen({ onBack }) {
  const { currentUser } = useAppLogic(); 

  const [healthResult, setHealthResult] = useState('');
  const [dbTestResult, setDbTestResult] = useState('');
  const [apiResponse, setApiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- Trip API States ---
  const [tripName, setTripName] = useState('My Test Trip');
  const [tripStartDate, setTripStartDate] = useState('2025-01-01');
  const [tripEndDate, setTripEndDate] = useState('2025-01-03');
  const [tripIdForSchedule, setTripIdForSchedule] = useState(''); 
  const [tripIdToFetch, setTripIdToFetch] = useState('');
  const [tripIdToUpdate, setTripIdToUpdate] = useState('');
  const [tripNameToUpdate, setTripNameToUpdate] = useState('My Updated Test Trip');
  const [tripIdToDelete, setTripIdToDelete] = useState('');

  // --- Schedule API States ---
  const [scheduleDate, setScheduleDate] = useState('2025-01-01');
  const [scheduleDescription, setScheduleDescription] = useState('Test Day 1');
  const [scheduleIdToFetch, setScheduleIdToFetch] = useState('');
  const [scheduleIdToUpdate, setScheduleIdToUpdate] = useState('');
  const [scheduleDescriptionToUpdate, setScheduleDescriptionToUpdate] = useState('Updated Day 1');
  const [scheduleIdToDelete, setScheduleIdToDelete] = useState('');

  const makeApiCall = async (method, endpoint, data = null) => {
    setLoading(true);
    setError('');
    setApiResponse('');
    if (!currentUser || !currentUser.token) {
      setError('Not logged in. Please log in to test authenticated APIs.');
      setLoading(false);
      return;
    }
    try {
      const config = {
        method,
        url: `${BACKEND_URL}${endpoint}`,
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json',
        },
      };
      if (data) {
        config.data = data;
      }
      const response = await axios(config);
      setApiResponse(JSON.stringify(response.data, null, 2));
      return response.data; 
    } catch (err) {
      setError(`API call failed: ${err.response?.data?.error || err.message}`);
      setApiResponse(JSON.stringify(err.response?.data || { error: err.message }, null, 2));
      console.error(err);
      // エラーが発生した場合でも、呼び出し元で response.data を期待しているかもしれないので、
      // null や undefined を返すか、エラーオブジェクトをそのまま返すか検討が必要。
      // 今回は、エラーメッセージはsetErrorで表示しているので、ここでは何も返さない。
    } finally {
      setLoading(false); // 成功時もエラー時も必ず実行される
    }
  };

  const handleTestHealth = async () => {
    setLoading(true); setError(''); setHealthResult('');
    try {
      const response = await axios.get(`${BACKEND_URL}/health`);
      setHealthResult(response.data);
    } catch (err) { setError(`Health check failed: ${err.message}`); console.error(err); }
    setLoading(false);
  };

  const handleTestDbConnection = async () => {
    setLoading(true); setError(''); setDbTestResult('');
    try {
      const response = await axios.get(`${BACKEND_URL}/db-test`);
      setDbTestResult(JSON.stringify(response.data, null, 2));
    } catch (err) { setError(`DB test failed: ${err.message}`); console.error(err); }
    setLoading(false);
  };

  const handleCreateTrip = async () => {
    const tripData = { name: tripName, start_date: tripStartDate, end_date: tripEndDate, status: "計画中" };
    const createdTrip = await makeApiCall('post', '/api/trips', tripData);
    if (createdTrip && createdTrip.id) {
      setTripIdToFetch(createdTrip.id); 
      setTripIdToUpdate(createdTrip.id);
      setTripIdToDelete(createdTrip.id);
      setTripIdForSchedule(createdTrip.id); 
    }
  };
  const handleGetMyTrips = () => makeApiCall('get', '/api/trips');
  const handleGetTripById = () => makeApiCall('get', `/api/trips/${tripIdToFetch}`);
  const handleUpdateTrip = () => makeApiCall('put', `/api/trips/${tripIdToUpdate}`, { name: tripNameToUpdate, status: "予約済み" });
  const handleDeleteTrip = () => makeApiCall('delete', `/api/trips/${tripIdToDelete}`);

  const handleCreateSchedule = async () => {
    if (!tripIdForSchedule) { setError("Please create or set a Trip ID first for schedule tests."); return; }
    const scheduleData = { date: scheduleDate, day_description: scheduleDescription, hotel_info: {name: "Test Hotel"} };
    const createdSchedule = await makeApiCall('post', `/api/trips/${tripIdForSchedule}/schedules`, scheduleData);
    if (createdSchedule && createdSchedule.id) {
      setScheduleIdToFetch(createdSchedule.id);
      setScheduleIdToUpdate(createdSchedule.id);
      setScheduleIdToDelete(createdSchedule.id);
    }
  };
  const handleGetSchedulesForTrip = () => {
    if (!tripIdForSchedule) { setError("Please set a Trip ID first."); return; }
    makeApiCall('get', `/api/trips/${tripIdForSchedule}/schedules`);
  };
  const handleGetScheduleById = () => {
    if (!tripIdForSchedule || !scheduleIdToFetch) { setError("Please set Trip ID and Schedule ID to fetch."); return; }
    makeApiCall('get', `/api/trips/${tripIdForSchedule}/schedules/${scheduleIdToFetch}`);
  };
  const handleUpdateSchedule = () => {
    if (!tripIdForSchedule || !scheduleIdToUpdate) { setError("Please set Trip ID and Schedule ID to update."); return; }
    makeApiCall('put', `/api/trips/${tripIdForSchedule}/schedules/${scheduleIdToUpdate}`, { day_description: scheduleDescriptionToUpdate });
  };
  const handleDeleteSchedule = () => {
    if (!tripIdForSchedule || !scheduleIdToDelete) { setError("Please set Trip ID and Schedule ID to delete."); return; }
    makeApiCall('delete', `/api/trips/${tripIdForSchedule}/schedules/${scheduleIdToDelete}`);
  };

  return (
    <div className="backend-test-screen" style={{ padding: '20px', fontFamily: 'monospace' }}>
      <header className="app-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Backend API Test</h1>
        <button onClick={onBack} className="back-button">戻る</button>
      </header>

      {loading && <p style={{color: 'blue'}}>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {apiResponse && <div style={{marginTop: '10px', padding: '10px', border: '1px solid #ccc', background: '#f9f9f9'}}><h3>API Response:</h3><pre>{apiResponse}</pre></div>}

      <section style={{border: '1px solid #eee', padding: '10px', marginBottom: '15px'}}>
        <h2>Basic Checks</h2>
        <div style={{ marginBottom: '10px' }}>
          <button onClick={handleTestHealth} disabled={loading} style={{marginRight: '10px'}}>Test /health</button>
          {healthResult && <pre>Health Result: {healthResult}</pre>}
        </div>
        <div>
          <button onClick={handleTestDbConnection} disabled={loading}>Test /db-test</button>
          {dbTestResult && <pre>DB Test Result: {dbTestResult}</pre>}
        </div>
      </section>

      <section style={{border: '1px solid #eee', padding: '10px', marginBottom: '15px'}}>
        <h2>Trips API</h2>
        <div>
          <h4>Create Trip (POST /api/trips)</h4>
          <input type="text" value={tripName} onChange={(e) => setTripName(e.target.value)} placeholder="Trip Name" style={{marginRight: '5px'}} />
          <input type="date" value={tripStartDate} onChange={(e) => setTripStartDate(e.target.value)} style={{marginRight: '5px'}} />
          <input type="date" value={tripEndDate} onChange={(e) => setTripEndDate(e.target.value)} style={{marginRight: '5px'}} />
          <button onClick={handleCreateTrip} disabled={loading}>Create Trip</button>
        </div>
        <div style={{marginTop: '10px'}}>
          <button onClick={handleGetMyTrips} disabled={loading}>Get My Trips (GET /api/trips)</button>
        </div>
        <div style={{marginTop: '10px'}}>
          <h4>Get/Update/Delete Trip by ID</h4>
          <input type="text" value={tripIdToFetch} onChange={(e) => setTripIdToFetch(e.target.value)} placeholder="Trip ID to Fetch" style={{marginRight: '5px', width: '250px'}} />
          <button onClick={handleGetTripById} disabled={loading || !tripIdToFetch}>Get Trip</button>
          <br/>
          <input type="text" value={tripIdToUpdate} onChange={(e) => setTripIdToUpdate(e.target.value)} placeholder="Trip ID to Update" style={{marginRight: '5px', width: '250px', marginTop: '5px'}} />
          <input type="text" value={tripNameToUpdate} onChange={(e) => setTripNameToUpdate(e.target.value)} placeholder="New Trip Name" style={{marginRight: '5px', marginTop: '5px'}} />
          <button onClick={handleUpdateTrip} disabled={loading || !tripIdToUpdate}>Update Trip</button>
          <br/>
          <input type="text" value={tripIdToDelete} onChange={(e) => setTripIdToDelete(e.target.value)} placeholder="Trip ID to Delete" style={{marginRight: '5px', width: '250px', marginTop: '5px'}} />
          <button onClick={handleDeleteTrip} disabled={loading || !tripIdToDelete}>Delete Trip</button>
        </div>
        <div style={{marginTop: '10px'}}>
          <label>Trip ID for Schedule Tests: </label>
          <input type="text" value={tripIdForSchedule} onChange={(e) => setTripIdForSchedule(e.target.value)} placeholder="Trip ID for Schedules" style={{width: '250px'}}/>
        </div>
      </section>

      <section style={{border: '1px solid #eee', padding: '10px', marginBottom: '15px'}}>
        <h2>Schedules API (for Trip ID: {tripIdForSchedule || 'N/A'})</h2>
        {!tripIdForSchedule && <p style={{color: 'orange'}}>Set a "Trip ID for Schedule Tests" in the Trips API section above to enable these tests.</p>}
        <div>
          <h4>Create Schedule (POST /api/trips/:tripId/schedules)</h4>
          <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} style={{marginRight: '5px'}} />
          <input type="text" value={scheduleDescription} onChange={(e) => setScheduleDescription(e.target.value)} placeholder="Day Description" style={{marginRight: '5px'}} />
          <button onClick={handleCreateSchedule} disabled={loading || !tripIdForSchedule}>Create Schedule</button>
        </div>
        <div style={{marginTop: '10px'}}>
          <button onClick={handleGetSchedulesForTrip} disabled={loading || !tripIdForSchedule}>Get Schedules for Trip</button>
        </div>
        <div style={{marginTop: '10px'}}>
          <h4>Get/Update/Delete Schedule by ID</h4>
          <input type="text" value={scheduleIdToFetch} onChange={(e) => setScheduleIdToFetch(e.target.value)} placeholder="Schedule ID to Fetch" style={{marginRight: '5px', width: '250px'}} />
          <button onClick={handleGetScheduleById} disabled={loading || !tripIdForSchedule || !scheduleIdToFetch}>Get Schedule</button>
          <br/>
          <input type="text" value={scheduleIdToUpdate} onChange={(e) => setScheduleIdToUpdate(e.target.value)} placeholder="Schedule ID to Update" style={{marginRight: '5px', width: '250px', marginTop: '5px'}} />
          <input type="text" value={scheduleDescriptionToUpdate} onChange={(e) => setScheduleDescriptionToUpdate(e.target.value)} placeholder="New Day Description" style={{marginRight: '5px', marginTop: '5px'}} />
          <button onClick={handleUpdateSchedule} disabled={loading || !tripIdForSchedule || !scheduleIdToUpdate}>Update Schedule</button>
          <br/>
          <input type="text" value={scheduleIdToDelete} onChange={(e) => setScheduleIdToDelete(e.target.value)} placeholder="Schedule ID to Delete" style={{marginRight: '5px', width: '250px', marginTop: '5px'}} />
          <button onClick={handleDeleteSchedule} disabled={loading || !tripIdForSchedule || !scheduleIdToDelete}>Delete Schedule</button>
        </div>
      </section>

    </div>
  );
}

export default BackendTestScreen;
