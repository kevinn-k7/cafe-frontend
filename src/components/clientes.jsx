import { useEffect, useState } from 'react';
import api from '../services/api';
import { FaUsers } from 'react-icons/fa';

function Clientes() {

  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    telefono: '',
    ubicacion: ''
  });

  const [editando, setEditando] = useState(null);

  const cargarClientes = () => {
    api.get('/clientes')
      .then(res => setClientes(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const guardarCliente = async () => {
    try {

      if (!form.nombre.trim()) {
        alert('El nombre es obligatorio');
        return;
      }

      if (editando) {
        await api.put(`/clientes/${editando}`, form);
      } else {
        await api.post('/clientes', form);
      }

      setForm({ nombre: '', telefono: '', ubicacion: '' });
      setEditando(null);
      cargarClientes();

    } catch (error) {
      console.error(error);
      alert('Error al guardar cliente');
    }
  };

  const editarCliente = (c) => {
    setEditando(c.id);
    setForm({
      nombre: c.nombre,
      telefono: c.telefono || '',
      ubicacion: c.ubicacion || ''
    });
  };

  return (
    <div style={styles.container}>

      {/* HEADER */}
      <div style={styles.header}>
        <FaUsers style={styles.icon} />
        <h1 style={styles.title}>Clientes</h1>
      </div>

      {/* FORM */}
      <div style={styles.card}>

        <div style={styles.formGrid}>

          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="text"
            name="telefono"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="text"
            name="ubicacion"
            placeholder="Ubicación"
            value={form.ubicacion}
            onChange={handleChange}
            style={styles.input}
          />

        </div>

        <div style={styles.buttons}>
          <button onClick={guardarCliente} style={styles.button}>
            {editando ? 'Actualizar' : 'Agregar'}
          </button>

          {editando && (
            <button
              onClick={() => {
                setEditando(null);
                setForm({ nombre: '', telefono: '', ubicacion: '' });
              }}
              style={styles.cancel}
            >
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
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Ubicación</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {clientes.map(c => (
              <tr key={c.id} style={styles.row}>

                <td>{c.nombre}</td>
                <td>{c.telefono || '-'}</td>
                <td>{c.ubicacion || '-'}</td>

                <td>
                  <button
                    onClick={() => editarCliente(c)}
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

  card: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    marginBottom: '20px'
  },

  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '10px'
  },

  input: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc'
  },

  buttons: {
    marginTop: '15px',
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
    borderRadius: '12px',
    padding: '15px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },

  row: {
    transition: '0.2s'
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

export default Clientes;