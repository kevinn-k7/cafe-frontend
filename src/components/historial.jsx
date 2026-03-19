import { useEffect, useState } from 'react';
import api from '../services/api';
import { FaClipboardList } from 'react-icons/fa';

function Historial() {

  const [ventas, setVentas] = useState([]);
  const [editando, setEditando] = useState(null);
  const [formEdit, setFormEdit] = useState({});
  const [filtro, setFiltro] = useState('');

  const cargarVentas = () => {
    api.get('/ventas')
      .then(res => setVentas(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    cargarVentas();
  }, []);

  const iniciarEdicion = (venta) => {
    setEditando(venta.id);
    setFormEdit({
      cantidad: venta.cantidad,
      tipo_venta: venta.tipo_venta,
      estado_pago: venta.estado_pago
    });
  };

  const handleEditChange = (e) => {
    setFormEdit({
      ...formEdit,
      [e.target.name]: e.target.value
    });
  };

  const guardarCambios = async (id) => {
    await api.put(`/ventas/${id}`, formEdit);
    setEditando(null);
    cargarVentas();
  };

  const ventasFiltradas = ventas.filter(v => {
    if (!filtro) return true;
    return v.fecha?.startsWith(filtro);
  });

  return (
    <div style={styles.container}>

      {/* HEADER */}
      <div style={styles.header}>
        <FaClipboardList style={styles.icon} />
        <h1 style={styles.title}>Historial de Ventas</h1>
      </div>

      {/* FILTRO */}
      <div style={styles.filterBox}>
        <input
          type="date"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={styles.input}
        />
      </div>

      {/* TABLA */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Presentación</th>
              <th>Cantidad</th>
              <th>Tipo</th>
              <th>Total</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {ventasFiltradas.map(v => (
              <tr key={v.id} style={styles.row}>

                <td>{v.id}</td>
                <td>{v.cliente_nombre || 'General'}</td>
                <td>{v.presentacion_nombre}</td>

                <td>
                  {editando === v.id ? (
                    <input
                      type="number"
                      name="cantidad"
                      value={formEdit.cantidad}
                      onChange={handleEditChange}
                      style={styles.input}
                    />
                  ) : v.cantidad}
                </td>

                <td>
                  {editando === v.id ? (
                    <select
                      name="tipo_venta"
                      value={formEdit.tipo_venta}
                      onChange={handleEditChange}
                      style={styles.input}
                    >
                      <option value="menudeo">Menudeo</option>
                      <option value="mayoreo">Mayoreo</option>
                    </select>
                  ) : v.tipo_venta}
                </td>

                <td style={{ fontWeight: 'bold', color: '#33190e' }}>
                  ${v.total}
                </td>

                <td>
                  {editando === v.id ? (
                    <select
                      name="estado_pago"
                      value={formEdit.estado_pago}
                      onChange={handleEditChange}
                      style={styles.input}
                    >
                      <option value="pagado">Pagado</option>
                      <option value="pendiente">Pendiente</option>
                    </select>
                  ) : (
                    <span style={{
                      ...styles.badge,
                      backgroundColor: v.estado_pago === 'pendiente'
                        ? '#ffe5e5'
                        : '#e6f7e6',
                      color: v.estado_pago === 'pendiente'
                        ? '#c0392b'
                        : '#2e7d32'
                    }}>
                      {v.estado_pago}
                    </span>
                  )}
                </td>

                <td>
                  {editando === v.id ? (
                    <>
                      <button
                        onClick={() => guardarCambios(v.id)}
                        style={styles.save}
                      >
                        ✔
                      </button>

                      <button
                        onClick={() => setEditando(null)}
                        style={styles.cancel}
                      >
                        ✖
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => iniciarEdicion(v)}
                      style={styles.edit}
                    >
                      ✏️
                    </button>
                  )}
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

  icon: {
    fontSize: '26px',
    color: '#33190e'
  },

  title: {
    color: '#33190e'
  },

  filterBox: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px'
  },

  input: {
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #ccc'
  },

  tableContainer: {
    background: 'white',
    borderRadius: '12px',
    padding: '15px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },

  row: {
    transition: '0.2s',
    cursor: 'pointer'
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
    padding: '6px 10px',
    borderRadius: '6px',
    cursor: 'pointer'
  },

  save: {
    background: '#2e7d32',
    color: 'white',
    border: 'none',
    padding: '6px',
    marginRight: '5px',
    borderRadius: '6px'
  },

  cancel: {
    background: '#c0392b',
    color: 'white',
    border: 'none',
    padding: '6px',
    borderRadius: '6px'
  }
};

export default Historial;