import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('https://16d1-110-224-167-243.ngrok-free.app');

const App = () => {
  const [logs, setLogs] = useState([]);
  const [blockedIPs, setBlockedIPs] = useState([]);
  const [serverStatus, setServerStatus] = useState('Primary');
  const [attackInProgress, setAttackInProgress] = useState(false);

  useEffect(() => {
    // Fetch initial data
    const headers = {
      'ngrok-skip-browser-warning': 'true',
    }
    const fetchData = async () => {
      const logRes = await axios.get('https://16d1-110-224-167-243.ngrok-free.app/api/logs', { headers });
      const ipRes = await axios.get('https://16d1-110-224-167-243.ngrok-free.app/api/blocked-ips', { headers });
      setLogs(logRes.data);
      setBlockedIPs(ipRes.data);
    };
    fetchData();

    // Listen to real-time updates
    socket.on('blocked-ip', (ip) => {
      setBlockedIPs((prev) => [...prev, { ip, createdAt: new Date().toISOString() }]);
    });
    socket.on('server-switch', (server) => setServerStatus(server));
  }, []);

  const startDosAttack = async () => {
    setAttackInProgress(true);
    // Simulate the attack by sending requests in a loop to a target endpoint
    const simulateAttack = async () => {
      while (attackInProgress) {
        try {
          await axios.get('https://16d1-110-224-167-243.ngrok-free.app/api/target');
        } catch (error) {
          console.error('Error during attack simulation', error);
        }
      }
    };
    simulateAttack();
  };

  const stopDosAttack = () => {
    setAttackInProgress(false);
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
          disabled={attackInProgress}
        >
          Start DoS Attack
        </button>
        <button
          onClick={stopDosAttack}
          style={styles.dosButton}
          disabled={!attackInProgress}
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
    backgroundColor: '#1b1b2f',
    color: '#eaeaea',
    minHeight: '100vh',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '2.5rem',
    color: '#00d4ff',
    textShadow: '0 0 10px #00d4ff, 0 0 20px #00d4ff',
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
  },
  section: {
    backgroundColor: '#162447',
    borderRadius: '10px',
    padding: '15px',
    flex: 1,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    borderBottom: '2px solid #00d4ff',
    paddingBottom: '5px',
    marginBottom: '10px',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
    maxHeight: '400px',
    overflowY: 'auto',
  },
  listItem: {
    padding: '8px 10px',
    marginBottom: '5px',
    backgroundColor: '#1f4068',
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  dosButtonContainer: {
    marginTop: '20px',
    textAlign: 'center',
  },
  dosButton: {
    padding: '10px 20px',
    fontSize: '1rem',
    backgroundColor: '#ff5722',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '10px',
  },
};

export default App;
