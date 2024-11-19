import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('https://929c-27-59-126-123.ngrok-free.app', {
  extraHeaders: {
    'ngrok-skip-browser-warning': 'true',
  },
});

const App = () => {
  const [logs, setLogs] = useState([]);
  const [blockedIPs, setBlockedIPs] = useState([]);
  const [serverStatus, setServerStatus] = useState('Primary');
  const attackInProgress = useRef(false);

  useEffect(() => {
    const headers = {
      'ngrok-skip-browser-warning': 'true',
    }
    const fetchData = async () => {
      const logRes = await axios.get('https://929c-27-59-126-123.ngrok-free.app/api/logs', { headers });
      const ipRes = await axios.get('https://929c-27-59-126-123.ngrok-free.app/api/blocked-ips', { headers });
      setLogs(logRes.data);
      setBlockedIPs(ipRes.data);
    };
    fetchData();

    socket.on('blocked-ip', (ip) => {
      setBlockedIPs((prev) => [...prev, { ip, createdAt: new Date().toISOString() }]);
    });
    socket.on('server-switch', (server) => setServerStatus(server));
  }, []);

  const startDosAttack = async () => {
    attackInProgress.current = true;
    const headers = {
      'ngrok-skip-browser-warning': 'true',
    }

    const simulateAttack = async () => {
      console.log("attack start")

      while (true) {
        try {
          await axios.get('https://929c-27-59-126-123.ngrok-free.app/api/resource', { headers });
        } catch (error) {
          console.error('Error during attack simulation', error);
        }
      }
    };
    simulateAttack();
  };

  const stopDosAttack = () => {
    attackInProgress.current = false;
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Cybersecurity Dashboard</h1>
        <h2 style={styles.subtitle}>Server Status: <span style={serverStatus === 'Primary' ? styles.primary : styles.secondary}>{serverStatus}</span></h2>
      </header>
      <main style={styles.main}>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Blocked IPs</h2>
          <ul style={styles.list}>
            {blockedIPs.map((ip, index) => (
              <li key={index} style={styles.listItem}>
                <span>{ip.ip}</span> - <span>{new Date(ip.createdAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </section>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Request Logs</h2>
          <ul style={styles.list}>
            {logs.map((log, index) => (
              <li key={index} style={styles.listItem}>
                <span>{log.ip}</span> - <span>{log.endpoint}</span> - <span>{log.method}</span> - <span>{log.server}</span> - <span>{new Date(log.createdAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <div style={styles.dosButtonContainer}>
        <button
          onClick={startDosAttack}
          style={styles.dosButton}
          disabled={attackInProgress.current}
        >
          Start DoS Attack
        </button>
        <button
          onClick={stopDosAttack}
          style={styles.dosButton2}
          disabled={!attackInProgress.current}
        >
          Stop DoS Attack
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Courier New', Courier, monospace",
    backgroundColor: '#1a1b2f',
    color: '#eaeaea',
    minHeight: '100vh',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '3rem',
    color: '#00d4ff',
    textShadow: '0 0 15px #00d4ff, 0 0 30px #00d4ff',
  },
  subtitle: {
    fontSize: '1.5rem',
    margin: '10px 0',
  },
  primary: {
    color: '#4caf50',
    fontWeight: 'bold',
  },
  secondary: {
    color: '#ff5722',
    fontWeight: 'bold',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: '20px',
    flexWrap: 'wrap',  // Ensures the layout adjusts on smaller screens
  },
  section: {
    backgroundColor: '#162447',
    borderRadius: '10px',
    padding: '20px',
    flex: 1,
    minWidth: '280px',  // Minimum width for responsiveness
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    marginBottom: '20px',  // Add margin between sections
  },
  sectionTitle: {
    fontSize: '1.8rem',
    borderBottom: '2px solid #00d4ff',
    paddingBottom: '8px',
    marginBottom: '10px',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
    maxHeight: '400px',
    overflowY: 'auto',
  },
  listItem: {
    padding: '10px 12px',
    marginBottom: '8px',
    backgroundColor: '#1f4068',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1.1rem',
  },
  dosButtonContainer: {
    marginTop: '20px',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',  // Space buttons evenly
    flexWrap: 'wrap',  // Ensure buttons are responsive on smaller screens
  },
  dosButton: {
    padding: '12px 24px',
    fontSize: '1.2rem',
    backgroundColor: '#ff5722',
    color: '#fff',
    display: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#ff784e',  // Change color on hover for better interaction
    },
  },
  dosButton2: {
    padding: '12px 24px',
    fontSize: '1.2rem',
    backgroundColor: '#ff5722',
    color: '#fff',
    border: 'none',
    display: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#ff784e',  // Change color on hover for better interaction
    },
  },

  // Responsive styles
  '@media screen and (max-width: 768px)': {
    container: {
      padding: '10px',
    },
    title: {
      fontSize: '2rem',
    },
    subtitle: {
      fontSize: '1.2rem',
    },
    main: {
      flexDirection: 'column',
      alignItems: 'center',
    },
    section: {
      flex: 1,
      minWidth: '90%',
      marginBottom: '15px',
    },
    dosButtonContainer: {
      flexDirection: 'column',
    },
  },
};

export default App;
