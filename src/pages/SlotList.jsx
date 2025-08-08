import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
collection,
query,
where,
getDocs,
} from "firebase/firestore";

const SlotList = () => {
const [timeSlots, setTimeSlots] = useState([
"1 PM - 3 PM",
"3 PM - 5 PM",
"5 PM - 7 PM",
"7 PM - 9 PM",
"9 PM - 11 PM",
"11 PM - 1 AM",
]);
const [selectedSlot, setSelectedSlot] = useState("");
const [teamList, setTeamList] = useState([]);
const [loading, setLoading] = useState(false);

// When slot selected, fetch teams
useEffect(() => {
const fetchTeams = async () => {
  if (!selectedSlot) {
    setTeamList([]);
    return;
  }
  setLoading(true);
  try {
    const q = query(
      collection(db, "registrations"),
      where("timeSlot", "==", selectedSlot)
    );
    const snap = await getDocs(q);
    // sort in UI by createdAt or teamName if you want
    const data = snap.docs.map(doc => doc.data());
    setTeamList(data);
  } finally {
    setLoading(false);
  }
};
fetchTeams();
}, [selectedSlot]);

return (
<div className="slot-list-container">
  {/* Geometric background patterns */}
  <div style={{
    position: 'fixed',
    inset: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
    zIndex: 0
  }}>
    {/* Hexagonal patterns */}
    <div style={{
      position: 'absolute',
      top: '5%',
      left: '5%',
      width: '100px',
      height: '100px',
      background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
      clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
      animation: 'rotate 15s linear infinite'
    }}></div>
    <div style={{
      position: 'absolute',
      top: '20%',
      right: '10%',
      width: '80px',
      height: '80px',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
      clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
      animation: 'rotate 20s linear infinite reverse'
    }}></div>
    <div style={{
      position: 'absolute',
      bottom: '15%',
      left: '15%',
      width: '120px',
      height: '120px',
      background: 'linear-gradient(225deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
      clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
      animation: 'rotate 25s linear infinite'
    }}></div>
    {/* Floating triangles */}
    <div style={{
      position: 'absolute',
      top: '60%',
      right: '20%',
      width: '0',
      height: '0',
      borderLeft: '30px solid transparent',
      borderRight: '30px solid transparent',
      borderBottom: '52px solid rgba(255,255,255,0.1)',
      animation: 'float 8s ease-in-out infinite'
    }}></div>
    <div style={{
      position: 'absolute',
      bottom: '30%',
      right: '5%',
      width: '0',
      height: '0',
      borderLeft: '20px solid transparent',
      borderRight: '20px solid transparent',
      borderBottom: '35px solid rgba(255,255,255,0.08)',
      animation: 'float 12s ease-in-out infinite reverse'
    }}></div>
  </div>
  <div className="content-wrapper">
    {/* Futuristic Header */}
    <div className="header-section">
      <div className="header-title-container">
        <h1 className="header-title">
          TEAM REGISTRY
        </h1>
        <div className="header-pulse-effect"></div>
      </div>
      <p className="header-subtitle">
        Advanced Team Slot Management System
      </p>
    </div>
    {/* Slot Selector Card */}
    <div className="slot-selector-card">
      {/* Card decoration */}
      <div className="card-top-gradient"></div>
      <div className="slot-selector-content">
        <div className="slot-selector-icon-container">
          <div className="slot-selector-icon">
            ⏰
          </div>
          <div>
            <h3 className="slot-selector-title">
              Time Slot Selection
            </h3>
            <p className="slot-selector-subtitle">
              Choose your preferred time slot
            </p>
          </div>
        </div>
        <div className="slot-selector-dropdown-container">
          <select
            value={selectedSlot}
            onChange={e => setSelectedSlot(e.target.value)}
            className="slot-select"
          >
            <option value="">-- Select Slot --</option>
            {timeSlots.map(slot => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
          {selectedSlot && (
            <div className="selected-slot-display">
              <span style={{ fontSize: '1.2rem' }}>📅</span>
              {selectedSlot}
            </div>
          )}
        </div>
      </div>
    </div>
    {/* Loading State */}
    {loading && (
      <div className="loading-state-card">
        <div className="loading-spinner-container">
          <div className="spinner-large"></div>
          <div className="spinner-medium"></div>
          <div className="spinner-small"></div>
        </div>
        <h3 className="loading-title">
          Loading Team Data
        </h3>
        <p className="loading-subtitle">
          Fetching registered teams...
        </p>
      </div>
    )}
    {/* Teams Display */}
    {selectedSlot && teamList.length > 0 && !loading && (
      <div className="teams-display-card">
        {/* Header Section */}
        <div className="teams-display-header">
          <div className="teams-display-header-bg-circle"></div>
          <div className="teams-display-header-content">
            <div className="teams-display-icon">
              👥
            </div>
            <div>
              <h2 className="teams-display-title">
                Registered Teams
              </h2>
              <p className="teams-display-subtitle">
                {selectedSlot} Time Slot
              </p>
            </div>
            <div className="teams-count-badge">
              {teamList.length} Teams
            </div>
            <div className="active-slot-badge">
              Active Slot
            </div>
          </div>
        </div>
        {/* Teams Grid */}
        <div style={{
          overflowX: 'hidden',
          borderRadius: '16px',
          border: '1px solid rgba(0, 131, 143, 0.2)',
          boxShadow: '0 8px 24px rgba(0, 96, 100, 0.08)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{
              background: 'linear-gradient(135deg, #e1f5fe, #b3e5fc)',
              borderBottom: '2px solid #4fc3f7'
            }}>
              <tr>
                <th style={{ padding: '1.2rem', textAlign: 'center', fontWeight: 'bold', color: '#006064', fontSize: '1rem', borderRight: '1px solid rgba(0, 131, 143, 0.1)' }}>Slot No.</th>
                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: 'bold', color: '#006064', fontSize: '1rem', borderRight: '1px solid rgba(0, 131, 143, 0.1)' }}>Team Name</th>
                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: 'bold', color: '#006064', fontSize: '1rem', borderRight: '1px solid rgba(0, 131, 143, 0.1)' }}>Erangle Drop</th>
                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: 'bold', color: '#006064', fontSize: '1rem', borderRight: '1px solid rgba(0, 131, 143, 0.1)' }}>Miramar Drop</th>
                <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: 'bold', color: '#006064', fontSize: '1rem' }}>Sanhok drop</th>
              </tr>
            </thead>
            <tbody>
              {teamList.map((reg, idx) => (
                <tr
                  key={reg.id}
                  style={{
                    backgroundColor: idx % 2 === 0 ? 'rgba(255,255,255,0.8)' : 'rgba(225,245,254,0.5)',
                    transition: 'all 0.3s ease',
                    borderBottom: '1px solid rgba(0, 131, 143, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(179, 229, 252, 0.3)';
                    e.currentTarget.style.transform = 'scale(1.005)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 96, 100, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = idx % 2 === 0 ? 'rgba(255,255,255,0.8)' : 'rgba(225,245,254,0.5)';
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 'bold', color: '#006064', borderRight: '1px solid rgba(0, 131, 143, 0.1)' }}>{idx + 3}</td>
                  <td style={{ padding: '1rem', fontWeight: '600', color: '#006064', borderRight: '1px solid rgba(0, 131, 143, 0.1)' }}>{reg.teamName}</td>
                  <td style={{ padding: '1rem', color: '#00838f', borderRight: '1px solid rgba(0, 131, 143, 0.1)' }}>{reg.dropdown1Selection}</td>
                  <td style={{ padding: '1rem', color: '#00838f', borderRight: '1px solid rgba(0, 131, 143, 0.1)' }}>{reg.dropdown2Selection}</td>
                  <td style={{ padding: '1rem', color: '#00838f' }}>{reg.dropdown3Selection}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
    {/* Empty State */}
    {selectedSlot && !loading && teamList.length === 0 && (
      <div className="empty-state-card">
        <div className="empty-state-icon">
          📋
        </div>
        <h3 className="empty-state-title">
          No Teams Registered
        </h3>
        <p className="empty-state-message">
          No teams have registered for the <strong>{selectedSlot}</strong> time slot yet.
        </p>
      </div>
    )}
    {/* Welcome State */}
    {!selectedSlot && (
      <div className="welcome-state-card">
        <div className="welcome-state-bg-circle"></div>
        <div className="welcome-state-content">
          <div className="welcome-state-icon">
            🎯
          </div>
          <h3 className="welcome-state-title">
            Welcome to Team Registry
          </h3>
          <p className="welcome-state-message">
            Select a time slot from the dropdown above to view all registered teams for that specific time period.
          </p>
        </div>
      </div>
    )}
  </div>
  <style jsx>{`
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-15px); }
    }
    @keyframes rotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
      50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.05); }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideInUp {
      from { opacity: 0; transform: translateY(50px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(30px); }
      to { opacity: 1; transform: translateX(0); }
    }

    /* Base Styles */
    .slot-list-container {
      min-height: 100vh;
      background: radial-gradient(ellipse at top, #e0f7fa 0%, #b2ebf2 25%, #80deea 50%, #4dd0e1 75%, #26c6da 100%);
      padding: 1.5rem;
      font-family: 'Inter', 'Segoe UI', sans-serif;
      position: relative;
    }

    .content-wrapper {
      position: relative;
      z-index: 10;
      max-width: 1400px;
      margin: 0 auto;
    }

    /* Header Section */
    .header-section {
      text-align: center;
      margin-bottom: 3rem;
      position: relative;
    }

    .header-title-container {
      display: inline-block;
      position: relative;
      padding: 2rem;
    }

    .header-title {
      font-size: 4rem;
      font-weight: 900;
      background: linear-gradient(135deg, #006064, #00838f, #0097a7);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.5rem;
      letter-spacing: 0.1em;
      text-shadow: 0 0 30px rgba(0, 96, 100, 0.3);
      position: relative;
    }

    .header-pulse-effect {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 120%;
      height: 120%;
      border: 2px solid rgba(0, 151, 167, 0.2);
      border-radius: 20px;
      z-index: -1;
      animation: pulse 3s ease-in-out infinite;
    }

    .header-subtitle {
      font-size: 1.3rem;
      color: #006064;
      font-weight: 600;
      margin-top: 1rem;
      opacity: 0.9;
    }

    /* Slot Selector Card */
    .slot-selector-card {
      background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85));
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 2.5rem;
      margin-bottom: 2.5rem;
      box-shadow: 0 25px 50px rgba(0, 96, 100, 0.15), inset 0 1px 0 rgba(255,255,255,0.6);
      border: 1px solid rgba(255,255,255,0.3);
      position: relative;
      overflow: hidden;
    }

    .card-top-gradient {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #006064, #00838f, #0097a7, #00acc1);
    }

    .slot-selector-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .slot-selector-icon-container {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .slot-selector-icon {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #006064, #00838f);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.8rem;
      box-shadow: 0 8px 16px rgba(0, 96, 100, 0.3);
    }

    .slot-selector-title {
      font-size: 1.4rem;
      font-weight: 700;
      color: #006064;
      margin: 0;
      margin-bottom: 0.25rem;
    }

    .slot-selector-subtitle {
      font-size: 0.95rem;
      color: #00838f;
      margin: 0;
      opacity: 0.8;
    }

    .slot-selector-dropdown-container {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap; /* Allow wrapping on smaller screens */
      justify-content: center; /* Center items when wrapped */
    }

    .slot-select {
      padding: 1.2rem 2rem;
      font-size: 1.1rem;
      border: 2px solid transparent;
      border-radius: 16px;
      background: linear-gradient(white, white) padding-box, linear-gradient(135deg, #00838f, #0097a7) border-box;
      color: #006064;
      font-weight: 600;
      outline: none;
      cursor: pointer;
      min-width: 250px;
      box-shadow: 0 8px 24px rgba(0, 131, 143, 0.2);
      transition: all 0.3s ease;
      appearance: none;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23006064' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
      background-position: right 1rem center;
      background-repeat: no-repeat;
      background-size: 1.5em 1.5em;
      padding-right: 3.5rem;
    }

    .slot-select:focus {
      transform: translateY(-2px);
      box-shadow: 0 12px 32px rgba(0, 131, 143, 0.3);
    }

    .slot-select:blur {
      transform: translateY(0);
      box-shadow: 0 8px 24px rgba(0, 131, 143, 0.2);
    }

    .selected-slot-display {
      background: linear-gradient(135deg, #00838f, #0097a7);
      color: white;
      padding: 1.2rem 2rem;
      border-radius: 16px;
      font-weight: 700;
      font-size: 1rem;
      box-shadow: 0 8px 24px rgba(0, 131, 143, 0.4);
      animation: slideInRight 0.5s ease-out;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    /* Loading State */
    .loading-state-card {
      background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85));
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 4rem;
      text-align: center;
      box-shadow: 0 25px 50px rgba(0, 96, 100, 0.15);
      border: 1px solid rgba(255,255,255,0.3);
      animation: fadeIn 0.5s ease-out;
    }

    .loading-spinner-container {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .spinner-large, .spinner-medium, .spinner-small {
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .spinner-large {
      width: 60px;
      height: 60px;
      border: 4px solid #e0f7fa;
      border-top: 4px solid #006064;
    }

    .spinner-medium {
      width: 50px;
      height: 50px;
      border: 3px solid #e0f7fa;
      border-top: 3px solid #00838f;
      animation: spin 1.5s linear infinite reverse;
    }

    .spinner-small {
      width: 40px;
      height: 40px;
      border: 3px solid #e0f7fa;
      border-top: 3px solid #0097a7;
      animation: spin 0.8s linear infinite;
    }

    .loading-title {
      font-size: 1.5rem;
      color: #006064;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .loading-subtitle {
      font-size: 1.1rem;
      color: #00838f;
      margin: 0;
      opacity: 0.8;
    }

    /* Teams Display */
    .teams-display-card {
      background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85));
      backdrop-filter: blur(20px);
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 25px 50px rgba(0, 96, 100, 0.15);
      border: 1px solid rgba(255,255,255,0.3);
      animation: slideInUp 0.6s ease-out;
    }

    .teams-display-header {
      background: linear-gradient(135deg, #006064, #00838f, #0097a7);
      color: white;
      padding: 2rem;
      position: relative;
      overflow: hidden;
    }

    .teams-display-header-bg-circle {
      position: absolute;
      top: 0;
      right: 0;
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
      border-radius: 50%;
      transform: translate(50%, -50%);
    }

    .teams-display-header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
      position: relative;
      z-index: 1;
    }

    .teams-display-icon {
      width: 50px;
      height: 50px;
      background-color: rgba(255,255,255,0.2);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }

    .teams-display-title {
      font-size: 1.8rem;
      font-weight: 800;
      margin: 0;
      margin-bottom: 0.25rem;
    }

    .teams-display-subtitle {
      font-size: 1rem;
      margin: 0;
      opacity: 0.9;
    }

    .teams-count-badge {
      background-color: rgba(255,255,255,0.2);
      padding: 0.8rem 1.5rem;
      border-radius: 20px;
      font-size: 1.1rem;
      font-weight: 700;
    }

    .active-slot-badge {
      background-color: rgba(255,255,255,0.15);
      padding: 0.8rem 1.5rem;
      border-radius: 20px;
      font-size: 1rem;
      font-weight: 600;
    }

    .teams-grid {
      padding: 2rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .team-card {
      background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(240,248,255,0.8));
      border-radius: 16px;
      padding: 1.5rem;
      border: 1px solid rgba(0, 131, 143, 0.1);
      box-shadow: 0 8px 24px rgba(0, 96, 100, 0.08);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .team-card:hover {
      transform: translateY(-4px) scale(1.02);
      box-shadow: 0 16px 40px rgba(0, 96, 100, 0.15);
      border-color: rgba(0, 131, 143, 0.3);
    }

    .team-number-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #00838f, #0097a7);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      font-weight: bold;
    }

    .team-name-section {
      margin-bottom: 1.5rem;
    }

    .team-name-title {
      font-size: 1.3rem;
      font-weight: 700;
      color: #006064;
      margin: 0;
      margin-bottom: 0.5rem;
      padding-right: 3rem;
    }

    .team-name-underline {
      width: 40px;
      height: 3px;
      background: linear-gradient(90deg, #00838f, #0097a7);
      border-radius: 2px;
    }

    .team-details-list {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
    }

    .team-detail-item {
      display: flex;
      align-items: center;
      gap: 0.8rem;
    }

    .detail-bullet-1, .detail-bullet-2, .detail-bullet-3 {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .detail-bullet-1 { background-color: #00838f; }
    .detail-bullet-2 { background-color: #0097a7; }
    .detail-bullet-3 { background-color: #00acc1; }

    .detail-label {
      font-size: 0.9rem;
      color: #006064;
      font-weight: 600;
      min-width: 60px;
    }

    .detail-value {
      background-color: rgba(0, 131, 143, 0.1);
      color: #006064;
      padding: 0.3rem 0.8rem;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 500;
    }

    /* Empty State */
    .empty-state-card {
      background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85));
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 4rem;
      text-align: center;
      box-shadow: 0 25px 50px rgba(0, 96, 100, 0.15);
      border: 1px solid rgba(255,255,255,0.3);
      animation: fadeIn 0.6s ease-out;
    }

    .empty-state-icon {
      font-size: 5rem;
      margin-bottom: 1.5rem;
      opacity: 0.7;
    }

    .empty-state-title {
      font-size: 2rem;
      font-weight: 700;
      color: #006064;
      margin-bottom: 1rem;
    }

    .empty-state-message {
      font-size: 1.2rem;
      color: #00838f;
      margin: 0 auto;
      opacity: 0.8;
      max-width: 400px;
      line-height: 1.6;
    }

    /* Welcome State */
    .welcome-state-card {
      background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85));
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 4rem;
      text-align: center;
      box-shadow: 0 25px 50px rgba(0, 96, 100, 0.15);
      border: 1px solid rgba(255,255,255,0.3);
      position: relative;
      overflow: hidden;
    }

    .welcome-state-bg-circle {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(0, 131, 143, 0.05) 0%, transparent 70%);
      border-radius: 50%;
    }

    .welcome-state-content {
      position: relative;
      z-index: 1;
    }

    .welcome-state-icon {
      font-size: 5rem;
      margin-bottom: 1.5rem;
    }

    .welcome-state-title {
      font-size: 2.2rem;
      font-weight: 800;
      color: #006064;
      margin-bottom: 1rem;
    }

    .welcome-state-message {
      font-size: 1.3rem;
      color: #00838f;
      margin: 0 auto;
      opacity: 0.9;
      max-width: 500px;
      line-height: 1.6;
    }

    /* Media Queries */
    @media (max-width: 1024px) {
      .content-wrapper {
        max-width: 90%;
      }
      .teams-grid {
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      }
    }

    @media (max-width: 768px) {
      .slot-list-container {
        padding: 1rem;
      }
      .content-wrapper {
        max-width: 95%;
      }
      .header-title {
        font-size: 2.5rem;
      }
      .header-subtitle {
        font-size: 1rem;
      }
      .slot-selector-card, .loading-state-card, .teams-display-card, .empty-state-card, .welcome-state-card {
        padding: 2rem;
      }
      .slot-selector-content {
        flex-direction: column;
        gap: 1.5rem;
      }
      .slot-selector-dropdown-container {
        flex-direction: column;
        width: 100%;
      }
      .slot-select {
        min-width: unset;
        width: 100%;
      }
      .selected-slot-display {
        width: 100%;
        justify-content: center;
      }
      .teams-grid {
        grid-template-columns: 1fr; /* Stack on small screens */
        padding: 1.5rem;
      }
      .loading-state-card, .empty-state-card, .welcome-state-card {
        padding: 2.5rem;
      }
      .empty-state-title, .welcome-state-title {
        font-size: 1.8rem;
      }
      .empty-state-message, .welcome-state-message {
        font-size: 1rem;
      }
    }

    @media (max-width: 480px) {
      .slot-list-container {
        padding: 0.5rem;
      }
      .header-title {
        font-size: 2rem;
        padding: 1.5rem;
      }
      .header-subtitle {
        font-size: 0.9rem;
      }
      .slot-selector-card, .loading-state-card, .teams-display-card, .empty-state-card, .welcome-state-card {
        padding: 1.5rem;
      }
      .slot-selector-icon {
        width: 50px;
        height: 50px;
        font-size: 1.5rem;
      }
      .slot-selector-title {
        font-size: 1.2rem;
      }
      .slot-selector-subtitle {
        font-size: 0.85rem;
      }
      .slot-select {
        padding: 1rem 1.5rem;
        font-size: 1rem;
      }
      .selected-slot-display {
        padding: 1rem 1.5rem;
        font-size: 0.9rem;
      }
      .teams-display-header {
        padding: 1.5rem;
      }
      .teams-display-icon {
        width: 40px;
        height: 40px;
        font-size: 1.2rem;
      }
      .teams-display-title {
        font-size: 1.5rem;
      }
      .teams-display-subtitle {
        font-size: 0.9rem;
      }
      .teams-count-badge, .active-slot-badge {
        padding: 0.6rem 1rem;
        font-size: 0.9rem;
      }
      .teams-grid {
        padding: 1rem;
      }
      .team-card {
        padding: 1.2rem;
      }
      .team-name-title {
        font-size: 1.1rem;
      }
      .detail-label, .detail-value {
        font-size: 0.8rem;
      }
      .empty-state-icon, .welcome-state-icon {
        font-size: 4rem;
      }
      .empty-state-title, .welcome-state-title {
        font-size: 1.5rem;
      }
      .empty-state-message, .welcome-state-message {
        font-size: 0.9rem;
      }
    }
  `}</style>
</div>
);
};

export default SlotList;
