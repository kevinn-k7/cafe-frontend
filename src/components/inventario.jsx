import { useEffect, useState } from 'react';
import api from '../services/api';
import { FaBox, FaPlus, FaMinus } from 'react-icons/fa';

function Inventario() {

  const [presentaciones, setPresentaciones] = useState([]);
  const [cantidades, setCantidades] = useState({});

  const cargarInventario = () => {
    api.get('/presentaciones')
      .then(res => setPresentaciones(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    cargarInventario();
  }, []);

  const handleChange = (id, value) => {
    setCantidades({
      ...cantidades,
      [id]: value
    });
  };

  // 🔼 AGREGAR STOCK
  const agregarStock = async (id) => {
    try {
      const cantidad = Number(cantidades[id]);

      if (!cantidad || cantidad <= 0) {
        alert('Cantidad inválida');
        return;
      }

      await api.put(`/presentaciones/${id}/stock`, { cantidad });

      alert('Stock agregado');

      setCantidades({
        ...cantidades,
        [id]: ''
      });

      cargarInventario();

    } catch (error) {
      console.error(error);
      alert('Error al agregar stock');
    }
  };

  // 🔽 NUEVO → QUITAR STOCK
  const quitarStock = async (id) => {
    try {
      const cantidad = Number(cantidades[id]);

      if (!cantidad || cantidad <= 0) {
        alert('Cantidad inválida');
        return;
      }

      await api.put(`/presentaciones/${id}/stock/reducir`, { cantidad });

      alert('Stock reducido');

      setCantidades({
        ...cantidades,
        [id]: ''
      });

      cargarInventario();

    } catch (error) {
      alert(error.response?.data?.error || 'Error al reducir stock');
    }
  };

  return (
    <div style={styles.container}>

      {/* 🔥 HEADER */}
      <div style={styles.header}>
        <FaBox style={styles.headerIcon} />
        <h1 style={styles.title}>Inventario</h1>
      </div>

      {/* 📦 TABLA */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>

          <thead>
            <tr>
              <th>Presentación</th>
              <th>Stock</th>
              <th>Cantidad</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {presentaciones.map(p => (
              <tr key={p.id} style={styles.row}>

                <td>{p.nombre}</td>

                <td style={{
                  color: p.stock_unidades < 5 ? '#c0392b' : '#27ae60',
                  fontWeight: 'bold'
                }}>
                  {p.stock_unidades}
                </td>

                <td>
                  <input
                    type="number"
                    placeholder="+ / -"
                    value={cantidades[p.id] || ''}
                    onChange={(e) => handleChange(p.id, e.target.value)}
                    style={styles.input}
                  />
                </td>

                <td style={styles.actions}>
                  <button
                    onClick={() => agregarStock(p.id)}
                    style={styles.add}
                  >
                    <FaPlus />
                  </button>

                  <button
                    onClick={() => quitarStock(p.id)}
                    style={styles.remove}
                  >
                    <FaMinus />
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
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
    gap: '10px',
    marginBottom: '20px'
  },

  headerIcon: {
    fontSize: '26px',
    color: '#33190e'
  },

  title: {
    color: '#33190e'
  },

  tableContainer: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },

  row: {
    transition: '0.2s'
  },

  input: {
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    width: '80px'
  },

  actions: {
    display: 'flex',
    gap: '8px'
  },

  add: {
    background: '#27ae60',
    color: 'white',
    border: 'none',
    padding: '8px',
    borderRadius: '6px',
    cursor: 'pointer'
  },

  remove: {
    background: '#c0392b',
    color: 'white',
    border: 'none',
    padding: '8px',
    borderRadius: '6px',
    cursor: 'pointer'
  }
};

export default Inventario;