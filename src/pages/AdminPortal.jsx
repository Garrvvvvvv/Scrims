"use client"
import React, { useEffect, useState, useRef } from "react";
import { db } from "../firebase"; // Adjusted path for Next.js App Router structure
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import html2canvas from 'html2canvas'; // Import html2canvas for image export

const defaultSlots = [
  "1 PM - 3 PM",
  "3 PM - 5 PM",
  "5 PM - 7 PM",
  "7 PM - 9 PM",
  "9 PM - 11 PM",
  "11 PM - 1 AM",
];

// Helper to get today's date string "YYYY-MM-DD"
const todayStr = () => new Date().toISOString().slice(0, 10);

const AdminPortal = () => {
  const [status, setStatus] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextRegStart, setNextRegStart] = useState("");
  const nextRegStartInputRef = useRef(null);

  // Effect for listening to adminStatus changes
  useEffect(() => {
    const statusDocRef = doc(db, "adminStatus", "global");

    const unsubscribeStatus = onSnapshot(
      statusDocRef,
      async (docSnap) => {
        let statusData;
        if (docSnap.exists()) {
          statusData = docSnap.data();
          // Ensure default values if not present
          if (!statusData.slotLimits) {
            statusData.slotLimits = Object.fromEntries(
              defaultSlots.map((s) => [s, 16])
            );
          }
          if (!statusData.activeSlots) {
            statusData.activeSlots = Object.fromEntries(
              defaultSlots.map((s) => [s, true])
            );
          }
          setStatus(statusData);

          // Handle nextRegistrationStart timestamp
          if (statusData.nextRegistrationStart) {
            const timestamp = statusData.nextRegistrationStart;
            if (timestamp && typeof timestamp.seconds === 'number') {
              setNextRegStart(
                new Date(timestamp.seconds * 1000)
                  .toISOString()
                  .slice(0, 16)
              );
            } else {
              setNextRegStart(""); // Reset if invalid timestamp
            }
          } else {
            setNextRegStart(""); // Reset if null
          }
        } else {
          // If adminStatus document doesn't exist, create it with defaults
          statusData = {
            isRegistrationOpen: false,
            day: todayStr(),
            slotLimits: Object.fromEntries(defaultSlots.map((s) => [s, 16])),
            activeSlots: Object.fromEntries(defaultSlots.map((s) => [s, true])),
            nextRegistrationStart: null,
          };
          await setDoc(statusDocRef, statusData);
          setStatus(statusData);
        }
        setLoading(false); // Data loaded
        setError(null); // Clear any previous errors
      },
      (err) => {
        setError("Failed to load admin data. Check Firebase config and rules.");
        console.error("Firebase adminStatus fetch error:", err);
        setLoading(false);
      }
    );

    return () => unsubscribeStatus(); // Unsubscribe on component unmount
  }, []); // Empty dependency array means this runs once on mount

  // Effect for listening to registrations based on the current day from status
  useEffect(() => {
    if (!status || !status.day) {
      setRegistrations([]); // Clear registrations if status or day is not available
      return;
    }

    const q = query(collection(db, "registrations"), where("date", "==", status.day));

    const unsubscribeRegistrations = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setRegistrations(docs);
        setError(null); // Clear any previous errors
      },
      (err) => {
        setError("Failed to fetch registrations. Check Firebase config and rules.");
        console.error("Firebase registrations fetch error:", err);
        setRegistrations([]);
      }
    );

    return () => unsubscribeRegistrations(); // Unsubscribe when day changes or component unmounts
  }, [status?.day]); // Re-run this effect when status.day changes

  const toggleRegistration = async () => {
    if (!status) return;
    setLoading(true);
    setError(null);
    try {
      if (!status.isRegistrationOpen) {
        // Starting registration - just toggle flag and update day
        await updateDoc(doc(db, "adminStatus", "global"), {
          isRegistrationOpen: true,
          day: todayStr(), // Ensure day is updated to today
        });
        // The onSnapshot listener will update the status state, no need to setStatus here
      } else {
        // Stop registration
        await updateDoc(doc(db, "adminStatus", "global"), {
          isRegistrationOpen: false,
        });
        // The onSnapshot listener will update the status state
      }
    } catch (err) {
      setError("Failed to toggle registration status.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startNewDay = async () => {
    if (
      !window.confirm(
        "Starting a new day will DELETE ALL existing registrations. Are you sure?"
      )
    )
      return;
    setLoading(true);
    setError(null);
    try {
      const allRegsSnap = await getDocs(collection(db, "registrations"));
      const deletePromises = allRegsSnap.docs.map((docRef) => deleteDoc(docRef.ref));
      await Promise.all(deletePromises);

      const newDay = todayStr();
      // Update adminStatus document with new day and reset registration status
      await setDoc(doc(db, "adminStatus", "global"), {
        ...status, // Keep existing slotLimits and activeSlots
        day: newDay,
        isRegistrationOpen: false,
        nextRegistrationStart: null, // Reset next registration start time
      });
      // The onSnapshot listeners will automatically update status and registrations states
    } catch (err) {
      setError("Failed to start a new day.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateSlotLimit = async (slot, newLimit) => {
    if (!status || newLimit < 1) return;
    setLoading(true);
    setError(null);
    try {
      const updatedSlotLimits = { ...status.slotLimits, [slot]: newLimit };
      await updateDoc(doc(db, "adminStatus", "global"), { slotLimits: updatedSlotLimits });
      // The onSnapshot listener will update the status state
    } catch (err) {
      setError("Failed to update slot limit.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateSlotActive = async (slot, isActive) => {
    if (!status) return;
    setLoading(true);
    setError(null);
    try {
      const updatedActiveSlots = { ...status.activeSlots, [slot]: isActive };
      await updateDoc(doc(db, "adminStatus", "global"), { activeSlots: updatedActiveSlots });
      // The onSnapshot listener will update the status state
    } catch (err) {
      setError("Failed to update slot active state.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateNextRegStart = async () => {
    if (!status || !nextRegStart) return;
    setLoading(true);
    setError(null);
    try {
      const dateObj = new Date(nextRegStart);
      // Firebase Timestamp expects seconds, not milliseconds
      await updateDoc(doc(db, "adminStatus", "global"), {
        nextRegistrationStart: { seconds: Math.floor(dateObj.getTime() / 1000), nanoseconds: 0 },
      });
      // The onSnapshot listener will update the status state
      alert("Next registration start time updated");
    } catch (err) {
      setError("Failed to update next registration start time");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Count registrations per slot
  const slotCounts = {};
  defaultSlots.forEach((slot) => (slotCounts[slot] = 0));
  registrations.forEach((reg) => {
    if (reg.timeSlot && slotCounts[reg.timeSlot] !== undefined) {
      slotCounts[reg.timeSlot]++;
    }
  });

  // --- COPY HELPERS ---
  const copySlotEmails = (regs) => {
    const emails = regs.map((reg) => reg.managerEmail).filter(Boolean).join(", ");
    if (emails.length === 0) return alert("No emails to copy for this slot.");
    navigator.clipboard.writeText(emails);
    alert("All emails for this slot copied to clipboard.");
  };
  const copySlotPhones = (regs) => {
    const phones = regs.map((reg) => reg.whatsapp).filter(Boolean).join(", ");
    if (phones.length === 0) return alert("No phone numbers to copy for this slot.");
    navigator.clipboard.writeText(phones);
    alert("All phone numbers for this slot copied to clipboard.");
  };

  // --- DOWNLOAD JPG HELPER ---
  const downloadTableAsJPG = async (slot, regs) => {
    setLoading(true); // Indicate loading for image generation
    try {
      // Create a temporary div to hold the table for capture
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px'; // Move off-screen
      tempDiv.style.top = '-9999px';
      tempDiv.style.width = 'max-content'; // Allow content to dictate width
      tempDiv.style.padding = '20px'; // Add some padding for the image
      tempDiv.style.backgroundColor = 'white'; // Ensure a white background for the image
      tempDiv.style.borderRadius = '16px';
      tempDiv.style.boxShadow = '0 8px 24px rgba(0, 96, 100, 0.08)';
      document.body.appendChild(tempDiv);

      // Construct the table HTML for the image
      let tableHtml = `
        <table style="width: 100%; border-collapse: collapse; font-family: 'Inter', 'Segoe UI', sans-serif;">
          <thead style="background: linear-gradient(135deg, #e1f5fe, #b3e5fc); border-bottom: 2px solid #4fc3f7;">
            <tr>
              <th style="padding: 1.2rem; text-align: center; font-weight: bold; color: #006064; font-size: 1rem; border-right: 1px solid rgba(0, 131, 143, 0.1);">Slot/Serial No.</th>
              <th style="padding: 1.2rem; text-align: left; font-weight: bold; color: #006064; font-size: 1rem; border-right: 1px solid rgba(0, 131, 143, 0.1);">Team Name</th>
              <th style="padding: 1.2rem; text-align: left; font-weight: bold; color: #006064; font-size: 1rem; border-right: 1px solid rgba(0, 131, 143, 0.1);">Drop 1</th>
              <th style="padding: 1.2rem; text-align: left; font-weight: bold; color: #006064; font-size: 1rem; border-right: 1px solid rgba(0, 131, 143, 0.1);">Drop 2</th>
              <th style="padding: 1.2rem; text-align: left; font-weight: bold; color: #006064; font-size: 1rem;">Drop 3</th>
            </tr>
          </thead>
          <tbody>
      `;

      regs.forEach((reg, idx) => {
        const rowBg = idx % 2 === 0 ? 'rgba(255,255,255,0.8)' : 'rgba(225,245,254,0.5)';
        tableHtml += `
          <tr style="background-color: ${rowBg}; border-bottom: 1px solid rgba(0, 131, 143, 0.1);">
            <td style="padding: 1rem; text-align: center; font-weight: bold; color: #006064; border-right: 1px solid rgba(0, 131, 143, 0.1);">${idx + 3}</td>
            <td style="padding: 1rem; font-weight: 600; color: #006064; border-right: 1px solid rgba(0, 131, 143, 0.1);">${reg.teamName}</td>
            <td style="padding: 1rem; color: #00838f; border-right: 1px solid rgba(0, 131, 143, 0.1);">${reg.dropdown1Selection}</td>
            <td style="padding: 1rem; color: #00838f; border-right: 1px solid rgba(0, 131, 143, 0.1);">${reg.dropdown2Selection}</td>
            <td style="padding: 1rem; color: #00838f;">${reg.dropdown3Selection}</td>
          </tr>
        `;
      });

      tableHtml += `
          </tbody>
        </table>
      `;

      tempDiv.innerHTML = tableHtml;

      const canvas = await html2canvas(tempDiv, {
        scale: 2, // Increase scale for better quality
        useCORS: true, // Important if there are images/external resources
        logging: false, // Disable logging for cleaner console
      });

      const image = canvas.toDataURL('image/jpeg', 0.9); // 0.9 quality for JPG

      const link = document.createElement('a');
      link.href = image;
      link.download = `${slot.replace(/\s/g, '-')}-registrations.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      document.body.removeChild(tempDiv); // Clean up the temporary div

      alert(`Table for ${slot} downloaded as JPG!`);
    } catch (err) {
      setError("Failed to download table as JPG.");
      console.error("Error generating image:", err);
    } finally {
      setLoading(false);
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
          Loading Admin Data
        </h3>
        <p style={{
          fontSize: '1.1rem',
          color: '#00838f',
          margin: 0,
          opacity: 0.8
        }}>
          Fetching portal information...
        </p>
      </div>
    );
  if (error)
    return (
      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at top, #e0f7fa 0%, #b2ebf2 25%, #80deea 50%, #4dd0e1 75%, #26c6da 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', 'Segoe UI', sans-serif"
      }}>
        <div style={{
          color: '#dc2626',
          fontSize: '1.25rem',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '2rem',
          borderRadius: '16px',
          border: '1px solid rgba(220, 38, 38, 0.3)',
          boxShadow: '0 10px 20px rgba(220, 38, 38, 0.2)',
          textAlign: 'center'
        }}>
          ❌ {error}
        </div>
      </div>
    );
  if (!status)
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
        </div>
        <h3 style={{
          fontSize: '1.5rem',
          color: '#006064',
          fontWeight: '700',
          marginBottom: '0.5rem'
        }}>
          Initializing Admin Portal...
        </h3>
      </div>
    );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #e0f7fa 0%, #b2ebf2 25%, #80deea 50%, #4dd0e1 75%, #26c6da 100%)',
      padding: '1.5rem',
      position: 'relative',
      fontFamily: "'Inter', 'Segoe UI', sans-serif"
    }}>
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
      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Futuristic Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem',
          position: 'relative'
        }}>
          <div style={{
            display: 'inline-block',
            position: 'relative',
            padding: '2rem'
          }}>
            <h1 style={{
              fontSize: '4rem',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #006064, #00838f, #0097a7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '0.5rem',
              letterSpacing: '0.1em',
              textShadow: '0 0 30px rgba(0, 96, 100, 0.3)',
              position: 'relative'
            }}>
              ADMIN
              <span style={{ color: '#4dd0e1' }}> PORTAL</span>
            </h1>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '120%',
              height: '120%',
              border: '2px solid rgba(0, 151, 167, 0.2)',
              borderRadius: '20px',
              zIndex: -1,
              animation: 'pulse 3s ease-in-out infinite'
            }}></div>
          </div>
          <p style={{
            fontSize: '1.3rem',
            color: '#006064',
            fontWeight: '600',
            marginTop: '1rem',
            opacity: 0.9
          }}>
            Centralized Control for Event Management
          </p>
        </div>
        {/* Control Panel */}
        <div style={{
          marginBottom: '2.5rem',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '2.5rem',
          boxShadow: '0 25px 50px rgba(0, 96, 100, 0.15), inset 0 1px 0 rgba(255,255,255,0.6)',
          border: '1px solid rgba(255,255,255,0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #006064, #00838f, #0097a7, #00acc1)'
          }}></div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #006064, #00838f)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              boxShadow: '0 8px 16px rgba(0, 96, 100, 0.3)'
            }}>
              ⚙️
            </div>
            <div>
              <h3 style={{
                fontSize: '1.4rem',
                fontWeight: '700',
                color: '#006064',
                margin: 0,
                marginBottom: '0.25rem'
              }}>
                Mission Control
              </h3>
              <p style={{
                fontSize: '0.95rem',
                color: '#00838f',
                margin: 0,
                opacity: 0.8
              }}>
                Manage global registration status
              </p>
            </div>
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <button
              onClick={toggleRegistration}
              disabled={loading}
              style={{
                background: status.isRegistrationOpen
                  ? 'linear-gradient(to right, #dc2626, #991b1b)'
                  : 'linear-gradient(to right, #16a34a, #15803d)',
                color: 'white',
                fontWeight: 'bold',
                padding: '1rem 2rem',
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
                cursor: 'pointer',
                transform: 'scale(1)',
                transition: 'all 0.3s ease',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                opacity: loading ? 0.7 : 1
              }}
              onMouseEnter={(e) => !e.target.disabled && (e.target.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              {status.isRegistrationOpen ? '⏹️ STOP REGISTRATIONS' : '▶️ START REGISTRATIONS'}
            </button>
            <button
              onClick={startNewDay}
              disabled={loading}
              style={{
                background: 'linear-gradient(to right, #374151, #111827)',
                color: 'white',
                fontWeight: 'bold',
                padding: '1rem 2rem',
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
                cursor: 'pointer',
                transform: 'scale(1)',
                transition: 'all 0.3s ease',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                opacity: loading ? 0.7 : 1
              }}
              onMouseEnter={(e) => !e.target.disabled && (e.target.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              title="Deletes all previous registrations and resets the day"
            >
              🔄 NEW DAY RESET
            </button>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'linear-gradient(135deg, #00838f, #0097a7)',
              color: 'white',
              padding: '1rem 1.5rem',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0, 131, 143, 0.4)',
              fontSize: '1.1rem',
              fontWeight: '700'
            }}>
              📅 TODAY: {status.day}
            </div>
          </div>
        </div>
        {/* Slot Management */}
        <div style={{
          marginBottom: '2.5rem',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '2.5rem',
          boxShadow: '0 25px 50px rgba(0, 96, 100, 0.15), inset 0 1px 0 rgba(255,255,255,0.6)',
          border: '1px solid rgba(255,255,255,0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #006064, #00838f, #0097a7, #00acc1)'
          }}></div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #006064, #00838f)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              boxShadow: '0 8px 16px rgba(0, 96, 100, 0.3)'
            }}>
              ⏰
            </div>
            <div>
              <h3 style={{
                fontSize: '1.4rem',
                fontWeight: '700',
                color: '#006064',
                margin: 0,
                marginBottom: '0.25rem'
              }}>
                Time Slot Command Center
              </h3>
              <p style={{
                fontSize: '0.95rem',
                color: '#00838f',
                margin: 0,
                opacity: 0.8
              }}>
                Configure slot availability and limits
              </p>
            </div>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {defaultSlots.map((slot) => {
              const count = slotCounts[slot] || 0;
              const limit = status.slotLimits?.[slot] ?? 16;
              const isFull = count >= limit;
              const isActive = status.activeSlots?.[slot] ?? true;
              const percentage = (count / limit) * 100;
              return (
                <div key={slot} style={{
                  background: isActive ? 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(240,248,255,0.8))' : 'linear-gradient(135deg, rgba(245,245,245,0.9), rgba(230,230,230,0.8))',
                  border: `1px solid ${isActive ? 'rgba(0, 131, 143, 0.2)' : 'rgba(150, 150, 150, 0.1)'}`,
                  borderRadius: '16px',
                  boxShadow: '0 8px 24px rgba(0, 96, 100, 0.08)',
                  padding: '1.5rem',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 16px 40px rgba(0, 96, 100, 0.15)';
                    e.currentTarget.style.borderColor = isActive ? 'rgba(0, 131, 143, 0.4)' : 'rgba(150, 150, 150, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 96, 100, 0.08)';
                    e.currentTarget.style.borderColor = isActive ? 'rgba(0, 131, 143, 0.2)' : 'rgba(150, 150, 150, 0.1)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem',
                    marginBottom: '1rem'
                  }}>
                    <input
                      type="checkbox"
                      checked={isActive}
                      disabled={loading}
                      onChange={(e) => updateSlotActive(slot, e.target.checked)}
                      style={{
                        width: '1.5rem',
                        height: '1.5rem',
                        accentColor: '#00838f',
                        cursor: 'pointer'
                      }}
                    />
                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#006064' }}>{slot}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '0.95rem', color: '#00838f' }}>Registered:</span>
                      <span style={{
                        background: isFull ? 'linear-gradient(to right, #dc2626, #991b1b)' : 'linear-gradient(to right, #00838f, #0097a7)',
                        color: 'white',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                      }}>
                        {count}
                      </span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.8rem'
                    }}>
                      <span style={{ fontSize: '0.95rem', color: '#00838f' }}>Limit:</span>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={limit}
                        disabled={loading}
                        onChange={(e) => updateSlotLimit(slot, parseInt(e.target.value, 10) || 1)}
                        style={{
                          width: '5rem',
                          height: '2.5rem',
                          textAlign: 'center',
                          border: '2px solid #00838f',
                          borderRadius: '8px',
                          outline: 'none',
                          fontSize: '1rem',
                          color: '#006064',
                          boxShadow: '0 2px 8px rgba(0, 131, 143, 0.1)',
                          transition: 'all 0.2s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#006064'}
                        onBlur={(e) => e.target.style.borderColor = '#00838f'}
                      />
                    </div>
                    {/* Progress bar */}
                    <div style={{
                      width: '100%',
                      backgroundColor: '#e0f7fa',
                      borderRadius: '9999px',
                      height: '0.6rem',
                      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{
                        height: '0.6rem',
                        borderRadius: '9999px',
                        transition: 'all 0.4s ease-out',
                        background: isFull ? 'linear-gradient(to right, #dc2626, #ef4444)' : percentage > 75 ? 'linear-gradient(to right, #fbbf24, #facc15)' : 'linear-gradient(to right, #22c55e, #10b981)',
                        width: `${Math.min(percentage, 100)}%`
                      }}></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
                      {isFull && isActive && (
                        <span style={{
                          background: 'linear-gradient(to right, #dc2626, #991b1b)',
                          color: 'white',
                          padding: '0.4rem 1rem',
                          borderRadius: '12px',
                          fontSize: '0.85rem',
                          fontWeight: 'bold',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
                        }}>
                          ⚠️ SLOT FULL
                        </span>
                      )}
                      {!isActive && (
                        <span style={{
                          background: 'linear-gradient(to right, #6b7280, #4b5563)',
                          color: 'white',
                          padding: '0.4rem 1rem',
                          borderRadius: '12px',
                          fontSize: '0.85rem',
                          fontWeight: 'bold',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
                        }}>
                          ❌ INACTIVE
                        </span>
                      )}
                      {isActive && !isFull && (
                        <span style={{
                          background: 'linear-gradient(to right, #22c55e, #10b981)',
                          color: 'white',
                          padding: '0.4rem 1rem',
                          borderRadius: '12px',
                          fontSize: '0.85rem',
                          fontWeight: 'bold',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
                        }}>
                          ✅ AVAILABLE
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Next Registration Timer */}
        <div style={{
          marginBottom: '2.5rem',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '2.5rem',
          boxShadow: '0 25px 50px rgba(0, 96, 100, 0.15), inset 0 1px 0 rgba(255,255,255,0.6)',
          border: '1px solid rgba(255,255,255,0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #006064, #00838f, #0097a7, #00acc1)'
          }}></div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #006064, #00838f)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              boxShadow: '0 8px 16px rgba(0, 96, 100, 0.3)'
            }}>
              🗓️
            </div>
            <div>
              <h3 style={{
                fontSize: '1.4rem',
                fontWeight: '700',
                color: '#006064',
                margin: 0,
                marginBottom: '0.25rem'
              }}>
                Next Registration Launch
              </h3>
              <p style={{
                fontSize: '0.95rem',
                color: '#00838f',
                margin: 0,
                opacity: 0.8
              }}>
                Set the exact start time for new registrations
              </p>
            </div>
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '1.5rem'
          }}>
            <input
              type="datetime-local"
              value={nextRegStart}
              ref={nextRegStartInputRef}
              onChange={(e) => setNextRegStart(e.target.value)}
              disabled={loading}
              style={{
                fontSize: '1.1rem',
                padding: '1rem 1.5rem',
                border: '2px solid #00838f',
                borderRadius: '12px',
                outline: 'none',
                minWidth: '280px',
                color: '#006064',
                boxShadow: '0 4px 12px rgba(0, 131, 143, 0.1)',
                transition: 'all 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#006064'}
              onBlur={(e) => e.target.style.borderColor = '#00838f'}
            />
            <button
              onClick={updateNextRegStart}
              disabled={loading || !nextRegStart}
              style={{
                background: 'linear-gradient(135deg, #006064, #00838f)',
                color: 'white',
                fontWeight: 'bold',
                padding: '1rem 2rem',
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 10px 20px rgba(0, 96, 100, 0.3)',
                cursor: 'pointer',
                transform: 'scale(1)',
                transition: 'all 0.3s ease',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                opacity: (loading || !nextRegStart) ? 0.7 : 1
              }}
              onMouseEnter={(e) => !e.target.disabled && (e.target.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              💾 SAVE LAUNCH TIME
            </button>
          </div>
        </div>
        {/* Registrations Display */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px rgba(0, 96, 100, 0.15)',
          border: '1px solid rgba(255,255,255,0.3)',
          animation: 'slideInUp 0.6s ease-out'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #006064, #00838f, #0097a7)',
            color: 'white',
            padding: '2rem',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '200px',
              height: '200px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              borderRadius: '50%',
              transform: 'translate(50%, -50%)'
            }}></div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.5rem',
              position: 'relative',
              zIndex: 1
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem'
              }}>
                📊
              </div>
              <div>
                <h2 style={{
                  fontSize: '1.8rem',
                  fontWeight: '800',
                  margin: 0,
                  marginBottom: '0.25rem'
                }}>
                  Registered Teams Database
                </h2>
                <p style={{
                  fontSize: '1rem',
                  margin: 0,
                  opacity: 0.9
                }}>
                  Overview of all registered teams by slot
                </p>
              </div>
            </div>
          </div>
          <div style={{ padding: '2rem' }}>
            {defaultSlots.map((slot) => {
              if (!status.activeSlots?.[slot]) return null;
              const regs = registrations.filter((reg) => reg.timeSlot === slot);
              if (!regs.length) return null;
              return (
                <div key={slot} style={{ marginBottom: '2.5rem' }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between", // Aligns slot title and buttons
                    gap: '1rem',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}>
                      <div style={{
                        background: 'linear-gradient(135deg, #00838f, #0097a7)',
                        color: 'white',
                        padding: '0.8rem 1.5rem',
                        borderRadius: '12px',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        boxShadow: '0 4px 12px rgba(0, 131, 143, 0.3)'
                      }}>
                        {slot}
                      </div>
                      <span style={{
                        border: '2px solid #00838f',
                        color: '#006064',
                        padding: '0.6rem 1.2rem',
                        borderRadius: '12px',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        background: 'rgba(0, 131, 143, 0.05)'
                      }}>
                        {regs.length} Teams
                      </span>
                    </div>
                    {/* Copy and Download buttons for this slot */}
                    <div
                      style={{
                        display: "flex",
                        gap: '0.75rem',
                        flexWrap: 'wrap', // Allow buttons to wrap on smaller screens
                        justifyContent: 'flex-end' // Align to end when wrapped
                      }}
                    >
                      <button
                        onClick={() => copySlotEmails(regs)}
                        style={{
                          background: 'linear-gradient(135deg, #00838f, #0097a7)',
                          color: "#fff",
                          border: "none",
                          borderRadius: '8px',
                          padding: "0.6rem 1.2rem",
                          cursor: "pointer",
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          boxShadow: '0 4px 8px rgba(0, 131, 143, 0.2)',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        📧 Copy Emails
                      </button>
                      <button
                        onClick={() => copySlotPhones(regs)}
                        style={{
                          background: 'linear-gradient(135deg, #006064, #00838f)',
                          color: "#fff",
                          border: "none",
                          borderRadius: '8px',
                          padding: "0.6rem 1.2rem",
                          cursor: "pointer",
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          boxShadow: '0 4px 8px rgba(0, 96, 100, 0.2)',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        📞 Copy Phones
                      </button>
                      <button
                        onClick={() => downloadTableAsJPG(slot, regs)} // Pass regs to the function
                        disabled={loading}
                        style={{
                          background: 'linear-gradient(135deg, #4CAF50, #8BC34A)', // Green gradient for download
                          color: "#fff",
                          border: "none",
                          borderRadius: '8px',
                          padding: "0.6rem 1.2rem",
                          cursor: "pointer",
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          boxShadow: '0 4px 8px rgba(76, 175, 80, 0.3)',
                          transition: 'all 0.2s ease',
                          opacity: loading ? 0.7 : 1
                        }}
                        onMouseEnter={(e) => !e.target.disabled && (e.currentTarget.style.transform = 'translateY(-2px)')}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        📸 Download JPG
                      </button>
                    </div>
                  </div>
                  <div style={{
                    overflow: 'hidden', // Changed from 'overflowX: auto' to 'overflow: hidden'
                    borderRadius: '16px',
                    border: '1px solid rgba(0, 131, 143, 0.2)',
                    boxShadow: '0 8px 24px rgba(0, 96, 100, 0.08)'
                  }}>
                    <table id={`table-${slot.replace(/\s/g, '-')}`} style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead style={{
                        background: 'linear-gradient(135deg, #e1f5fe, #b3e5fc)',
                        borderBottom: '2px solid #4fc3f7'
                      }}>
                        <tr>
                          <th style={{ padding: '1.2rem', textAlign: 'center', fontWeight: 'bold', color: '#006064', fontSize: '1rem', borderRight: '1px solid rgba(0, 131, 143, 0.1)' }}>#</th>
                          <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: 'bold', color: '#006064', fontSize: '1rem', borderRight: '1px solid rgba(0, 131, 143, 0.1)' }}>Team Name</th>
                          <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: 'bold', color: '#006064', fontSize: '1rem', borderRight: '1px solid rgba(0, 131, 143, 0.1)' }}>Email</th>
                          <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: 'bold', color: '#006064', fontSize: '1rem', borderRight: '1px solid rgba(0, 131, 143, 0.1)' }}>Phone</th>
                          <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: 'bold', color: '#006064', fontSize: '1rem', borderRight: '1px solid rgba(0, 131, 143, 0.1)' }}>Drop 1</th>
                          <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: 'bold', color: '#006064', fontSize: '1rem', borderRight: '1px solid rgba(0, 131, 143, 0.1)' }}>Drop 2</th>
                          <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: 'bold', color: '#006064', fontSize: '1rem', borderRight: '1px solid rgba(0, 131, 143, 0.1)' }}>Drop 3</th>
                          <th style={{ padding: '1.2rem', textAlign: 'left', fontWeight: 'bold', color: '#006064', fontSize: '1rem' }}>Registered At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {regs.map((reg, idx) => (
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
                            <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 'bold', color: '#006064', borderRight: '1px solid rgba(0, 131, 143, 0.1)' }}>{idx + 1}</td>
                            <td style={{ padding: '1rem', fontWeight: '600', color: '#006064', borderRight: '1px solid rgba(0, 131, 143, 0.1)' }}>{reg.teamName}</td>
                            <td style={{ padding: '1rem', color: '#00838f', borderRight: '1px solid rgba(0, 131, 143, 0.1)' }}>{reg.managerEmail}</td>
                            <td style={{ padding: '1rem', color: '#00838f', borderRight: '1px solid rgba(0, 131, 143, 0.1)' }}>{reg.whatsapp}</td>
                            <td style={{ padding: '1rem', color: '#00838f', borderRight: '1px solid rgba(0, 131, 143, 0.1)' }}>{reg.dropdown1Selection}</td>
                            <td style={{ padding: '1rem', color: '#00838f', borderRight: '1px solid rgba(0, 131, 143, 0.1)' }}>{reg.dropdown2Selection}</td>
                            <td style={{ padding: '1rem', color: '#00838f', borderRight: '1px solid rgba(0, 131, 143, 0.1)' }}>{reg.dropdown3Selection}</td>
                            <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#00838f' }}>
                              {reg.createdAt?.seconds
                                ? new Date(reg.createdAt.seconds * 1000).toLocaleString()
                                : "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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
      `}</style>
    </div>
  );
};

export default AdminPortal;
