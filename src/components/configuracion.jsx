import { useEffect, useState } from 'react';
import api from '../services/api';
import { FaCog } from 'react-icons/fa';

function Configuracion() {

  const [presentaciones, setPresentaciones] = useState([]);

  useEffect(() => {
    api.get('/presentaciones')
      .then(res => setPresentaciones(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (index, campo, valor) => {
    const nuevas = [...presentaciones];
    nuevas[index][campo] = valor;
    setPresentaciones(nuevas);
  };

  const guardar = async (p) => {
    try {
      await api.put(`/presentaciones/${p.id}/config`, p);
      alert('Actualizado');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={styles.container}>

      {/* HEADER */}
      <div style={styles.header}>
        <FaCog style={styles.headerIcon} />
        <h1 style={styles.title}>Configuracion del negocio</h1>
      </div>


      {/* GRID */}
      <div style={styles.grid}>
        {presentaciones.map((p, index) => (
          <div key={p.id} style={styles.card}>

            <h3 style={styles.cardTitle}>{p.nombre}</h3>

            <label style={styles.label}>Precio menudeo</label>
            <input
              type="number"
              value={p.precio_venta || ''}
              onChange={(e) =>
                handleChange(index, 'precio_venta', e.target.value)
              }
              style={styles.input}
            />

            <label style={styles.label}>Precio mayoreo</label>
            <input
              type="number"
              value={p.precio_mayoreo || ''}
              onChange={(e) =>
                handleChange(index, 'precio_mayoreo', e.target.value)
              }
              style={styles.input}
            />

            <button
              onClick={() => guardar(p)}
              style={styles.button}
            >
              Guardar cambios
            </button>

          </div>
        ))}
      </div>

    </div>
  );
}

// 🎨 ESTILOS PRO
const styles = {
  container: {
    padding: '30px',
    background: '#fcf9f5',
    minHeight: '100vh'
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '25px'
  },

    headerIcon: {
    fontSize: '28px',
    color: '#33190e'
  },
  
  logo: {
    width: '60px',
    height: '60px',
    objectFit: 'contain'
  },

  title: {
    color: '#33190e',
    margin: 0
  },

  subtitleBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#555',
    marginTop: '5px'
  },

  icon: {
    color: '#33190e'
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px'
  },

  card: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },

  cardTitle: {
    color: '#33190e',
    marginBottom: '10px'
  },

  label: {
    fontSize: '14px',
    color: '#555'
  },

  input: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc'
  },

  button: {
    marginTop: '10px',
    background: '#33190e',
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '8px',
    cursor: 'pointer'
  }
};

export default Configuracion;