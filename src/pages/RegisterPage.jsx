import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";

const dropdown1Options = ["Sosnovka Military Base", "Mylta Power", "Small Mylta Power", "Georgopol", "Georgopol Crates", "Pochinki", "Yasnaya Polyana", "School", "Rozhok", "Hospital", "Shelter", "Prison", "Mansion", "Novorepnoye", "Ferry Pier", "Primorsk", "Lipovka", "Severny", "Kameshki", "Shooting Range", "Ruins", "Stalber", "Quarry", "Gatka", "Farm", "Zharki", "Mylta"];
const dropdown2Options = ["Hacienda del Patrón", "Los Leones", "Pecado", "Chumacera", "San Martin", "Monte Nuevo", "Imapala", "El Azahar", "Valle del Mar", "Cruz del Valle", "Water Treatment", "Campo Militar", "Ruins", "Prison", "Ladrilleria"];
const dropdown3Options = ["Bootcamp", "Paradise Resort", "Pai Nan", "Camp Alpha", "Camp Bravo", "Camp Charlie", "Ruins", "Quarry", "Ha Tinh", "Sahmee (Sah Mee)", "Cave", "Docks", "Camp Bravo", "Camp Charlie", "Camp Alpha", "Mount Tyna"];

// IMPORTANT: Aligned defaultSlots with AdminPortal.jsx for consistency
const defaultSlots = [
  "1 PM - 3 PM",
  "3 PM - 5 PM",
  "5 PM - 7 PM",
  "7 PM - 9 PM",
  "9 PM - 11 PM",
  "11 PM - 1 AM",
];

const RegisterPage = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [dropdown1, setDropdown1] = useState("");
  const [dropdown2, setDropdown2] = useState("");
  const [dropdown3, setDropdown3] = useState("");
  const [taken1, setTaken1] = useState([]);
  const [taken2, setTaken2] = useState([]);
  const [taken3, setTaken3] = useState([]);
  const [loadingTaken, setLoadingTaken] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  // Registrations and admin status
  const [activeSlots, setActiveSlots] = useState({});
  const [slotLimits, setSlotLimits] = useState({});
  const [slotCounts, setSlotCounts] = useState({});
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [nextRegistrationStart, setNextRegistrationStart] = useState(null);

  // Countdown
  const [countdown, setCountdown] = useState("");

  // Fetch adminStatus on mount and subscribe for updates
  useEffect(() => {
    let unsubscribe;
    const fetchAdminStatus = async () => {
      const statusDocRef = doc(db, "adminStatus", "global");
      const statusSnap = await getDoc(statusDocRef);
      if (statusSnap.exists()) {
        const data = statusSnap.data();
        setIsRegistrationOpen(data.isRegistrationOpen ?? false);
        setActiveSlots(data.activeSlots ?? {});
        setSlotLimits(data.slotLimits ?? {});
        setNextRegistrationStart(
          data.nextRegistrationStart ? new Date(data.nextRegistrationStart.seconds * 1000) : null
        );
        if (data.day) {
          await fetchSlotCounts(data.day); // get slots registrations count for today
        }
      }
    };
    fetchAdminStatus();
    // No realtime subscription here; you can add if you want
    return () => unsubscribe && unsubscribe();
  }, []);

  // Fetch counts of registrations per slot for today
  const fetchSlotCounts = async (day) => {
    try {
      const q = query(collection(db, "registrations"), where("date", "==", day));
      const snapshot = await getDocs(q);
      const counts = {};
      snapshot.forEach((doc) => {
        const registration = doc.data();
        if (registration.timeSlot) {
          counts[registration.timeSlot] = (counts[registration.timeSlot] || 0) + 1;
        }
      });
      setSlotCounts(counts);
    } catch (err) {
      console.error("Failed to fetch slot counts:", err);
      setSlotCounts({});
    }
  };

  // Countdown timer logic when registration is closed and nextRegistrationStart is set
  useEffect(() => {
    if (isRegistrationOpen || !nextRegistrationStart) {
      setCountdown("");
      return;
    }
    const interval = setInterval(() => {
      const now = new Date();
      const diff = nextRegistrationStart.getTime() - now.getTime();
      if (diff <= 0) {
        setCountdown("Registration is now open!");
        clearInterval(interval);
        // Optionally, re-fetch admin status to update isRegistrationOpen
        // fetchAdminStatus(); // This would require moving fetchAdminStatus outside or making it a useCallback
        return;
      }
      const hours = Math.floor(diff / 1000 / 60 / 60);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setCountdown(
        `${hours}h ${minutes}m ${seconds}s until next registration starts`
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [isRegistrationOpen, nextRegistrationStart]);

  // Helper for IST Date string
  const getTodayDateIST = () => {
    const nowUtc = new Date();
    const IST_OFFSET = 5.5 * 60; // minutes
    const utcMinutes = nowUtc.getUTCMinutes();
    const nowIST = new Date(nowUtc.getTime() + (IST_OFFSET + utcMinutes - nowUtc.getMinutes()) * 60000);
    return nowIST.toISOString().slice(0, 10);
  };

  // Fetch taken dropdown options for the selected time slot
  useEffect(() => {
    if (!timeSlot) {
      setTaken1([]);
      setTaken2([]);
      setTaken3([]);
      setDropdown1("");
      setDropdown2("");
      setDropdown3("");
      return;
    }
    const fetchTaken = async () => {
      setLoadingTaken(true);
      try {
        const todayDate = getTodayDateIST();
        const q = query(
          collection(db, "registrations"),
          where("timeSlot", "==", timeSlot),
          where("date", "==", todayDate)
        );
        const snapshot = await getDocs(q);
        const t1 = [], t2 = [], t3 = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.dropdown1Selection) t1.push(data.dropdown1Selection);
          if (data.dropdown2Selection) t2.push(data.dropdown2Selection);
          if (data.dropdown3Selection) t3.push(data.dropdown3Selection);
        });
        setTaken1(t1);
        setTaken2(t2);
        setTaken3(t3);
        setDropdown1("");
        setDropdown2("");
        setDropdown3("");
      } catch (err) {
        setSubmitError("Could not load taken dropdown options.");
        console.error(err);
      } finally {
        setLoadingTaken(false);
      }
    };
    fetchTaken();
  }, [timeSlot]);

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!teamName || !managerEmail || !whatsapp || !timeSlot || !dropdown1 || !dropdown2 || !dropdown3) {
      setSubmitError("Please fill in all fields.");
      return;
    }
    if (dropdown1 === dropdown2 || dropdown2 === dropdown3 || dropdown1 === dropdown3) {
      setSubmitError("All three dropdowns must be different.");
      return;
    }
    // Check slot availability first
    if (!isRegistrationOpen) {
      setSubmitError("Registration is currently closed.");
      return;
    }
    if (!activeSlots[timeSlot]) {
      setSubmitError(`Selected time slot (${timeSlot}) is currently inactive.`);
      return;
    }
    if ((slotCounts[timeSlot] ?? 0) >= (slotLimits[timeSlot] ?? 16)) {
      setSubmitError(`Selected time slot (${timeSlot}) is already full.`);
      return;
    }
    setSubmitLoading(true);
    try {
      const todayDate = getTodayDateIST();
      // Re-check uniqueness here again (same as your previous logic)
      const q = query(
        collection(db, "registrations"),
        where("timeSlot", "==", timeSlot),
        where("date", "==", todayDate)
      );
      const snapshot = await getDocs(q);
      const takenSelections1 = new Set();
      const takenSelections2 = new Set();
      const takenSelections3 = new Set();
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.dropdown1Selection) takenSelections1.add(data.dropdown1Selection);
        if (data.dropdown2Selection) takenSelections2.add(data.dropdown2Selection);
        if (data.dropdown3Selection) takenSelections3.add(data.dropdown3Selection);
      });
      if (
        takenSelections1.has(dropdown1) ||
        takenSelections2.has(dropdown2) ||
        takenSelections3.has(dropdown3)
      ) {
        setSubmitError(
          "One or more selected options are now taken. Please try again."
        );
        setSubmitLoading(false);
        return;
      }
      await addDoc(collection(db, "registrations"), {
        userId: user.uid,
        teamName,
        managerEmail,
        whatsapp,
        timeSlot,
        dropdown1Selection: dropdown1,
        dropdown2Selection: dropdown2,
        dropdown3Selection: dropdown3,
        date: todayDate,
        createdAt: serverTimestamp(),
      });
      alert("Registration successful!");
      // Clear form
      setTeamName("");
      setManagerEmail("");
      setWhatsapp("");
      setTimeSlot("");
      setDropdown1("");
      setDropdown2("");
      setDropdown3("");
      setTaken1([]);
      setTaken2([]);
      setTaken3([]);
      setSubmitError("");
      await fetchSlotCounts(todayDate); // update counts after registration
    } catch (error) {
      setSubmitError("Failed to submit registration. Please try again.");
      console.error(error);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading)
    return (
      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at top, #e0f7fa 0%, #b2ebf2 25%, #80deea 50%, #4dd0e1 75%, #26c6da 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', 'Segoe UI', sans-serif"
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid #e0f7fa',
            borderTop: '4px solid #006064',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid #e0f7fa',
            borderTop: '3px solid #00838f',
            borderRadius: '50%',
            animation: 'spin 1.5s linear infinite reverse'
          }}></div>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e0f7fa',
            borderTop: '3px solid #0097a7',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }}></div>
        </div>
        <h3 style={{
          fontSize: '1.5rem',
          color: '#006064',
          fontWeight: '700',
          marginBottom: '0.5rem'
        }}>
          Loading User Data
        </h3>
        <p style={{
          fontSize: '1.1rem',
          color: '#00838f',
          margin: 0,
          opacity: 0.8
        }}>
          Authenticating user...
        </p>
      </div>
    );
  if (!user) {
    // If user is not logged in, redirect to home or login page
    navigate("/");
    return null;
  }

  // Filter active slots and mark full slots for dropdown options
  const availableTimeSlots = Object.entries(activeSlots)
    .filter(([slot, isActive]) => isActive)
    .map(([slot]) => slot);

  return (
    <div className="register-page-container">
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
      <div className="form-card">
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #006064, #00838f, #0097a7, #00acc1)'
        }}></div>
        <div className="form-header">
          <h2 className="form-title">
            Team Registration Form
          </h2>
          <p className="form-subtitle">
            Secure your spot for the event!
          </p>
        </div>
        {!isRegistrationOpen && countdown && (
          <div className="countdown-message">
            Registration is currently closed. <br />
            {countdown}
          </div>
        )}
        {submitError && (
          <div className="error-message">
            ❌ {submitError}
          </div>
        )}

        {/* Slot Availability Bar Meter */}
        {timeSlot && (
          <div className="slot-meter-container">
            <h4 className="slot-meter-title">
              {timeSlot} Slot Availability
            </h4>
            <div className="slot-meter-bar-background">
              <div className="slot-meter-bar-fill"
                style={{
                  background: (slotCounts[timeSlot] ?? 0) >= (slotLimits[timeSlot] ?? 16)
                    ? 'linear-gradient(to right, #dc2626, #ef4444)' // Red for full
                    : ((slotCounts[timeSlot] ?? 0) / (slotLimits[timeSlot] ?? 16)) * 100 > 75
                      ? 'linear-gradient(to right, #fbbf24, #facc15)' // Yellow for nearly full
                      : 'linear-gradient(to right, #22c55e, #10b981)', // Green for available
                  width: `${Math.min(((slotCounts[timeSlot] ?? 0) / (slotLimits[timeSlot] ?? 16)) * 100, 100)}%`,
                }}
              >
                {`${slotCounts[timeSlot] ?? 0} / ${slotLimits[timeSlot] ?? 16}`}
              </div>
            </div>
            <p className="slot-meter-info">
              {((slotCounts[timeSlot] ?? 0) >= (slotLimits[timeSlot] ?? 16))
                ? "This slot is currently full."
                : `Slots remaining: ${Math.max(0, (slotLimits[timeSlot] ?? 16) - (slotCounts[timeSlot] ?? 0))}`}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="registration-form">
          <label>
            <span className="label-text">Select Time Slot:</span>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              required
              disabled={submitLoading || !isRegistrationOpen}
              className="form-select"
            >
              <option value="">-- Select Time Slot --</option>
              {defaultSlots.map((slot) => {
                const isFull = (slotCounts[slot] ?? 0) >= (slotLimits[slot] ?? 16);
                const isActive = activeSlots[slot] ?? true;
                if (!isActive) return null; // Only show active slots
                return (
                  <option key={slot} value={slot} disabled={isFull}>
                    {slot} {isFull ? "(Full)" : ""}
                  </option>
                );
              })}
            </select>
          </label>
          <label>
            <span className="label-text">Team Name:</span>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
              disabled={submitLoading || !isRegistrationOpen}
              className="form-input"
            />
          </label>
          {/* Dropdown 1 */}
          <label>
            <span className="label-text">Your Erangle Drop:</span>
            {loadingTaken ? (
              <div className="loading-options">Loading options...</div>
            ) : (
              <select
                value={dropdown1}
                onChange={(e) => setDropdown1(e.target.value)}
                required
                disabled={!timeSlot || submitLoading || !isRegistrationOpen}
                className="form-select"
              >
                <option value="">Select option</option>
                {dropdown1Options.map((opt) => (
                  <option key={opt} value={opt} disabled={taken1.includes(opt)}>
                    {opt} {taken1.includes(opt) ? " (Taken)" : ""}
                  </option>
                ))}
              </select>
            )}
          </label>
          {/* Dropdown 2 */}
          <label>
            <span className="label-text">Your Miramar Drop:</span>
            {loadingTaken ? (
              <div className="loading-options">Loading options...</div>
            ) : (
              <select
                value={dropdown2}
                onChange={(e) => setDropdown2(e.target.value)}
                required
                disabled={!timeSlot || submitLoading || !isRegistrationOpen}
                className="form-select"
              >
                <option value="">Select option</option>
                {dropdown2Options.map((opt) => (
                  <option key={opt} value={opt} disabled={taken2.includes(opt)}>
                    {opt} {taken2.includes(opt) ? " (Taken)" : ""}
                  </option>
                ))}
              </select>
            )}
          </label>
          {/* Dropdown 3 */}
          <label>
            <span className="label-text">Your Sanhok Drop:</span>
            {loadingTaken ? (
              <div className="loading-options">Loading options...</div>
            ) : (
              <select
                value={dropdown3}
                onChange={(e) => setDropdown3(e.target.value)}
                required
                disabled={!timeSlot || submitLoading || !isRegistrationOpen}
                className="form-select"
              >
                <option value="">Select option</option>
                {dropdown3Options.map((opt) => (
                  <option key={opt} value={opt} disabled={taken3.includes(opt)}>
                    {opt} {taken3.includes(opt) ? " (Taken)" : ""}
                  </option>
                ))}
              </select>
            )}
          </label>
          <label>
            <span className="label-text">Manager Email:</span>
            <input
              type="email"
              value={managerEmail}
              onChange={(e) => setManagerEmail(e.target.value)}
              required
              disabled={submitLoading || !isRegistrationOpen}
              className="form-input"
            />
          </label>
          <label>
            <span className="label-text">WhatsApp Number:</span>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              required
              disabled={submitLoading || !isRegistrationOpen}
              pattern="[0-9]+"
              title="Please enter digits only"
              className="form-input"
            />
          </label>
          <button
            type="submit"
            disabled={submitLoading || loadingTaken || !isRegistrationOpen}
            className="submit-button"
          >
            {submitLoading ? "Submitting..." : "Submit Registration"}
          </button>
        </form>
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

        /* Responsive Styles for RegisterPage */
        .register-page-container {
          min-height: 100vh;
          background: radial-gradient(ellipse at top, #e0f7fa 0%, #b2ebf2 25%, #80deea 50%, #4dd0e1 75%, #26c6da 100%);
          padding: 1.5rem;
          position: relative;
          font-family: 'Inter', 'Segoe UI', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .form-card {
          position: relative;
          z-index: 10;
          max-width: 600px;
          width: 100%;
          background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85));
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 0 25px 50px rgba(0, 96, 100, 0.15), inset 0 1px 0 rgba(255,255,255,0.6);
          border: 1px solid rgba(255,255,255,0.3);
          overflow: hidden;
          animation: fadeIn 0.6s ease-out;
        }

        .form-header {
          text-align: center;
          margin-bottom: 2rem;
          position: relative;
        }

        .form-title {
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #006064, #00838f);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
          letter-spacing: 0.02em;
          text-shadow: 0 0 15px rgba(0, 96, 100, 0.2);
        }

        .form-subtitle {
          font-size: 1rem;
          color: #00838f;
          margin-top: 0.5rem;
          opacity: 0.8;
        }

        .countdown-message, .error-message {
          margin-bottom: 1.5rem;
          padding: 1.2rem;
          border-radius: 12px;
          text-align: center;
          font-weight: 600;
          box-shadow: 0 8px 24px rgba(0, 131, 143, 0.2);
          border: 1px solid rgba(0, 131, 143, 0.1);
          animation: fadeIn 0.5s ease-out;
        }

        .countdown-message {
          background: linear-gradient(135deg, rgba(224,247,250,0.95), rgba(178,235,242,0.85));
          color: #006064;
        }

        .error-message {
          color: #dc2626;
          background: linear-gradient(135deg, rgba(255,240,240,0.95), rgba(255,220,220,0.85));
          box-shadow: 0 8px 24px rgba(220, 38, 38, 0.15);
          border: 1px solid rgba(220, 38, 38, 0.2);
        }

        .registration-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .label-text {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
          font-weight: 600;
          color: #006064;
        }

        .form-input{
          width: 87%;
          padding: 1rem 1.5rem;
          font-size: 1rem;
          border: 2px solid #00acc1; /* Changed to solid border matching image */
          border-radius: 16px; /* Increased border-radius for more rounded corners */
          outline: none;
          color: #006064;
          background-color: rgba(255, 255, 255, 0.9); /* Slightly opaque white background */
          box-shadow: 0 4px 12px rgba(0, 131, 143, 0.1); /* Adjusted shadow */
          transition: all 0.2s;
          opacity: 1; /* Default opacity */
        }
          .form-select {
          width: 95%;
          padding: 1rem 1.5rem;
          font-size: 1rem;
          border: 2px solid #00acc1; /* Changed to solid border matching image */
          border-radius: 16px; /* Increased border-radius for more rounded corners */
          outline: none;
          color: #006064;
          background-color: rgba(255, 255, 255, 0.9); /* Slightly opaque white background */
          box-shadow: 0 4px 12px rgba(0, 131, 143, 0.1); /* Adjusted shadow */
          transition: all 0.2s;
          opacity: 1; /* Default opacity */
        }

        .form-select {
          background: linear-gradient(white, white) padding-box, linear-gradient(135deg, #00838f, #0097a7) border-box;
          appearance: none;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23006064' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 1rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          padding-right: 3.5rem;
        }

        .form-input:focus, .form-select:focus {
          border-color: #006064;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 131, 143, 0.3);
        }

        .form-input:disabled, .form-select:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .loading-options {
          color: #00838f;
          font-size: 0.9rem;
          padding: 1rem 1.5rem; /* Match input padding */
          border: 2px solid #e0f7fa; /* Lighter border for loading state */
          border-radius: 12px;
          background: rgba(255,255,255,0.5);
          box-shadow: 0 4px 12px rgba(0, 131, 143, 0.05);
        }

        .submit-button {
          background: linear-gradient(135deg, #006064, #00838f);
          color: white;
          font-weight: bold;
          padding: 1rem 2rem;
          border-radius: 12px;
          border: none;
          box-shadow: 0 10px 20px rgba(0, 96, 100, 0.3);
          cursor: pointer;
          transform: scale(1);
          transition: all 0.3s ease;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          opacity: 1;
        }

        .submit-button:disabled {
          background: linear-gradient(135deg, #a0aec0, #718096); /* Gray for disabled */
          cursor: not-allowed;
          opacity: 0.7;
          box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
        }

        .submit-button:not(:disabled):hover {
          transform: scale(1.02);
        }

        /* Slot Meter Styles */
        .slot-meter-container {
          margin-bottom: 1.5rem;
          padding: 1.2rem;
          background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,248,255,0.85));
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 131, 143, 0.2);
          border: 1px solid rgba(0, 131, 143, 0.1);
          animation: fadeIn 0.5s ease-out;
          text-align: center;
        }

        .slot-meter-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #006064;
          margin-bottom: 0.8rem;
        }

        .slot-meter-bar-background {
          width: 100%;
          background-color: #e0f7fa;
          border-radius: 9999px;
          height: 1.2rem;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
          overflow: hidden;
          position: relative;
        }

        .slot-meter-bar-fill {
          height: 100%;
          border-radius: 9999px;
          transition: width 0.4s ease-out, background 0.4s ease-out;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 0.85rem;
          text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }

        .slot-meter-info {
          font-size: 0.9rem;
          color: #00838f;
          margin-top: 0.8rem;
          font-weight: 500;
        }

        /* Media Queries */
        @media (max-width: 768px) {
          .register-page-container {
            padding: 1rem;
          }
          .form-card {
            padding: 2rem;
          }
          .form-title {
            font-size: 2rem;
          }
        }

        @media (max-width: 480px) {
          .form-card {
            padding: 1.5rem;
          }
          .form-title {
            font-size: 1.8rem;
          }
          .registration-form {
            gap: 1rem;
          }
          .form-input, .form-select {
            padding: 0.8rem 1rem;
            font-size: 0.9rem;
          }
          .form-select {
            padding-right: 3rem;
            background-size: 1.2em 1.2em;
          }
          .submit-button {
            padding: 0.8rem 1.5rem;
            font-size: 1rem;
          }
          .slot-meter-container {
            padding: 1rem;
          }
          .slot-meter-title {
            font-size: 1rem;
          }
          .slot-meter-bar-fill {
            font-size: 0.75rem;
          }
          .slot-meter-info {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;
