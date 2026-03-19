import { useEffect, useState } from 'react';
import api from '../services/api';
import { FaShoppingCart } from 'react-icons/fa';

function Compras() {

  const [compras, setCompras] = useState([]);

  const [tipo, setTipo] = useState('cafe');
  const [descripcion, setDescripcion] = useState('');
  const [kg, setKg] = useState('');
  const [precioKg, setPrecioKg] = useState('');
  const [total, setTotal] = useState('');

  const [editando, setEditando] = useState(null);

  const cargarCompras = () => {
    api.get('/compras')
      .then(res => setCompras(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    cargarCompras();
  }, []);

  const resetForm = () => {
    setTipo('cafe');
    setDescripcion('');
    setKg('');
    setPrecioKg('');
    setTotal('');
    setEditando(null);
  };

  const registrarCompra = async () => {
    try {

      const payload = {
        tipo,
        descripcion,
        cantidad_kg: kg || null,
        precio_por_kg: precioKg || null,
        total
      };

      if (editando) {
        await api.put(`/compras/${editando}`, payload);
      } else {
        await api.post('/compras', payload);
      }

      alert(editando ? 'Compra actualizada' : 'Compra registrada');

      resetForm();
      cargarCompras();

    } catch (error) {
      console.error(error);
      alert('Error');
    }
  };

  const editarCompra = (c) => {
    setEditando(c.id);
    setTipo(c.tipo);
    setDescripcion(c.descripcion || '');
    setKg(c.cantidad_kg || '');
    setPrecioKg(c.precio_por_kg || '');
    setTotal(c.total);
  };

  return (
    <div style={styles.container}>

      {/* HEADER */}
      <div style={styles.header}>
        <FaShoppingCart style={styles.icon} />
        <h1 style={styles.title}>Compras / Gastos</h1>
      </div>

      {/* FORM */}
      <div style={styles.card}>

        <div style={styles.formGrid}>

          <div style={styles.inputGroup}>
            <label>Tipo</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)} style={styles.input}>
              <option value="cafe">Compra de café</option>
              <option value="gasto">Gasto general</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label>Descripción</label>
            <input
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              style={styles.input}
            />
          </div>

          {tipo === 'cafe' && (
            <>
              <div style={styles.inputGroup}>
                <label>Kilogramos</label>
                <input
                  type="number"
                  value={kg}
                  onChange={(e) => setKg(e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label>Precio por kg</label>
                <input
                  type="number"
                  value={precioKg}
                  onChange={(e) => setPrecioKg(e.target.value)}
                  style={styles.input}
                />
              </div>
            </>
          )}

          {tipo === 'gasto' && (
            <div style={styles.inputGroup}>
              <label>Total</label>
              <input
                type="number"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                style={styles.input}
              />
            </div>
          )}

        </div>

        <div style={styles.buttons}>
          <button onClick={registrarCompra} style={styles.button}>
            {editando ? 'Actualizar' : 'Guardar'}
          </button>

          {editando && (
            <button onClick={resetForm} style={styles.cancel}>
              Cancelar
            </button>
          )}
        </div>

      </div>

      {/* TABLA */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Total</th>
              <th>Fecha</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {compras.map(c => (
              <tr key={c.id} style={styles.row}>

                <td>
                  <span style={{
                    ...styles.badge,
                    background: c.tipo === 'cafe' ? '#e6f7e6' : '#ffe5e5',
                    color: c.tipo === 'cafe' ? '#2e7d32' : '#c0392b'
                  }}>
                    {c.tipo}
                  </span>
                </td>

                <td>{c.descripcion}</td>

                <td style={{ fontWeight: 'bold', color: '#33190e' }}>
                  ${c.total}
                </td>

                <td>
                  {new Date(c.fecha).toLocaleDateString()}
                </td>

                <td>
                  <button
                    onClick={() => editarCompra(c)}
                    style={styles.edit}
                  >
                    ✏️
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

// 🎨 ESTILOS
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

  icon: {
    fontSize: '26px',
    color: '#33190e'
  },

  title: {
    color: '#33190e'
  },

  card: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    marginBottom: '20px'
  },

  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '15px'
  },

  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },

  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc'
  },

  buttons: {
    marginTop: '20px',
    display: 'flex',
    gap: '10px'
  },

  button: {
    background: '#33190e',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '8px',
    cursor: 'pointer'
  },

  cancel: {
    background: '#888',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '8px'
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

  badge: {
    padding: '5px 10px',
    borderRadius: '10px',
    fontWeight: 'bold'
  },

  edit: {
    background: '#33190e',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '6px',
    cursor: 'pointer'
  }
};

export default Compras;