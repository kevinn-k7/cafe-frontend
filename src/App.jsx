import { useState } from 'react';
import Ventas from './components/ventas';
import Historial from './components/historial';
import Dashboard from './components/dashboard';
import Clientes from './components/clientes';
import Inventario from './components/inventario';
import Compras from './components/compras';
import Configuracion from './components/configuracion';

import {
  FaCoffee,
  FaChartBar,
  FaUsers,
  FaCog,
  FaBox,
  FaShoppingCart,
  FaClipboardList,
  FaDollarSign
} from 'react-icons/fa';

function App() {
  const [vista, setVista] = useState('dashboard');

  return (
    <div style={styles.container}>

      {/* 🔥 SIDEBAR */}
      <div style={styles.sidebar}>

        {/* LOGO */}
        <div style={styles.logoContainer}>
          <img src="/logo.png" style={styles.logoImg} />
          <span style={styles.logoText}>La Reserva 1600</span>
        </div>

        {/* VENTAS */}
        <button
          onClick={() => setVista('ventas')}
          style={{
            ...styles.menuBtn,
            ...(vista === 'ventas' ? styles.active : {})
          }}
        >
          <FaDollarSign style={styles.icon} />
          Ventas
        </button>

        {/* HISTORIAL */}
        <button
          onClick={() => setVista('historial')}
          style={{
            ...styles.menuBtn,
            ...(vista === 'historial' ? styles.active : {})
          }}
        >
          <FaClipboardList style={styles.icon} />
          Historial
        </button>

        {/* DASHBOARD */}
        <button
          onClick={() => setVista('dashboard')}
          style={{
            ...styles.menuBtn,
            ...(vista === 'dashboard' ? styles.active : {})
          }}
        >
          <FaChartBar style={styles.icon} />
          Dashboard
        </button>

        {/* INVENTARIO */}
        <button
          onClick={() => setVista('inventario')}
          style={{
            ...styles.menuBtn,
            ...(vista === 'inventario' ? styles.active : {})
          }}
        >
          <FaBox style={styles.icon} />
          Inventario
        </button>

        {/* COMPRAS */}
        <button
          onClick={() => setVista('compras')}
          style={{
            ...styles.menuBtn,
            ...(vista === 'compras' ? styles.active : {})
          }}
        >
          <FaShoppingCart style={styles.icon} />
          Compras
        </button>

        {/* CLIENTES */}
        <button
          onClick={() => setVista('clientes')}
          style={{
            ...styles.menuBtn,
            ...(vista === 'clientes' ? styles.active : {})
          }}
        >
          <FaUsers style={styles.icon} />
          Clientes
        </button>

        {/* CONFIGURACIÓN */}
        <button
          onClick={() => setVista('configuracion')}
          style={{
            ...styles.menuBtn,
            ...(vista === 'configuracion' ? styles.active : {})
          }}
        >
          <FaCog style={styles.icon} />
          Configuración
        </button>

      </div>

      {/* 🔥 CONTENIDO */}
      <div style={styles.content}>
        {vista === 'dashboard' && <Dashboard />}
        {vista === 'ventas' && <Ventas />}
        {vista === 'historial' && <Historial />}
        {vista === 'clientes' && <Clientes />}
        {vista === 'inventario' && <Inventario />}
        {vista === 'compras' && <Compras />}
        {vista === 'configuracion' && <Configuracion />}
      </div>

    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    background: '#fcf9f5'
  },

  sidebar: {
    width: '230px',
    background: '#33190e',
    color: 'white',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },

  logoContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '25px'
  },

  logoImg: {
    width: '100px',
    marginBottom: '10px',
    filter: 'brightness(0) invert(1)'
  },

  logoText: {
    fontWeight: 'bold',
    fontSize: '16px'
  },

  menuBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    border: 'none',
    background: 'transparent',
    color: 'white',
    cursor: 'pointer',
    borderRadius: '8px',
    fontSize: '15px',
    transition: '0.2s'
  },

  icon: {
    fontSize: '16px'
  },

  active: {
    background: '#f5e6c8',
    color: '#33190e',
    fontWeight: 'bold'
  },

  content: {
    flex: 1,
    padding: '30px',
    overflowY: 'auto',
    background: '#f5e6c8'
  }
};

export default App;