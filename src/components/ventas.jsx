import { useEffect, useState } from 'react';
import api from '../services/api';
import { FaDollarSign } from 'react-icons/fa';

function Ventas() {

  const [presentaciones, setPresentaciones] = useState([]);
  const [clientes, setClientes] = useState([]);

  const [presentacionId, setPresentacionId] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [tipoVenta, setTipoVenta] = useState('menudeo');
  const [estadoPago, setEstadoPago] = useState('pagado');
  const [clienteId, setClienteId] = useState('');

  const [precio, setPrecio] = useState(0);
  const [total, setTotal] = useState(0);

  // 🔄 cargar datos
  useEffect(() => {
    api.get('/presentaciones')
      .then(res => setPresentaciones(res.data));

    api.get('/clientes')
      .then(res => setClientes(res.data));
  }, []);

  // 💰 calcular precio
  useEffect(() => {
    const p = presentaciones.find(p => p.id == presentacionId);

    if (p) {
      let precioUnitario = 0;

      if (tipoVenta === 'mayoreo') {
        if (p.peso_gramos >= 500) {
          precioUnitario = (p.peso_gramos / 1000) * 260;
        }
      } else {
        precioUnitario = p.precio_venta;
      }

      setPrecio(precioUnitario);
      setTotal(precioUnitario * cantidad);
    }

  }, [presentacionId, cantidad, tipoVenta, presentaciones]);

  const registrarVenta = async () => {
    try {
      await api.post('/ventas', {
        presentacion_id: presentacionId,
        cantidad,
        tipo_venta: tipoVenta,
        estado_pago: estadoPago,
        cliente_id: clienteId || null
      });

      alert('Venta registrada');

      setCantidad(1);
      setPresentacionId('');
      setClienteId('');

    } catch (error) {
      console.error(error);
      alert('Error al registrar venta');
    }
  };

  return (
    <div style={styles.container}>

      {/* 🔥 HEADER */}
      <div style={styles.header}>
        <FaDollarSign style={styles.headerIcon} />
        <h1 style={styles.title}>Ventas</h1>
      </div>

      {/* 🧾 FORM */}
      <div style={styles.form}>

        {/* Cliente */}
        <div style={styles.group}>
          <label>Cliente</label>
          <select
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            style={styles.input}
          >
            <option value="">General</option>
            {clientes.map(c => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Presentación */}
        <div style={styles.group}>
          <label>Presentación</label>
          <select
            value={presentacionId}
            onChange={(e) => setPresentacionId(e.target.value)}
            style={styles.input}
          >
            <option value="">Selecciona</option>
            {presentaciones.map(p => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Cantidad */}
        <div style={styles.group}>
          <label>Cantidad</label>
          <input
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            style={styles.input}
          />
        </div>

        {/* Tipo */}
        <div style={styles.group}>
          <label>Tipo de venta</label>
          <select
            value={tipoVenta}
            onChange={(e) => setTipoVenta(e.target.value)}
            style={styles.input}
          >
            <option value="menudeo">Menudeo</option>
            <option value="mayoreo">Mayoreo</option>
          </select>
        </div>

        {/* Estado */}
        <div style={styles.group}>
          <label>Estado de pago</label>
          <select
            value={estadoPago}
            onChange={(e) => setEstadoPago(e.target.value)}
            style={styles.input}
          >
            <option value="pagado">Pagado</option>
            <option value="pendiente">Pendiente</option>
          </select>
        </div>

      </div>

      {/* 💰 RESUMEN */}
      <div style={styles.summary}>
        <p style={{ 
          fontSize: '14px', 
          opacity: 0.8, 
          marginBottom: '5px' 
        }}>
          Precio: ${precio}
        </p>

        <h2 style={{ 
          fontSize: '32px', 
          margin: 0, 
          fontWeight: 'bold' 
        }}>
          Total: ${total}
        </h2>
      </div>

      {/* BOTÓN */}
      <button onClick={registrarVenta} style={styles.button}>
        Registrar venta
      </button>

    </div>
  );
}

// 🎨 ESTILOS PRO
const styles = {
  container: {
    maxWidth: '600px',
    margin: 'auto',
    background: 'white',
    padding: '25px',
    borderRadius: '15px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
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

  form: {
    display: 'grid',
    gap: '15px'
  },

  group: {
    display: 'flex',
    flexDirection: 'column'
  },

  input: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc'
  },

    summary: {
      marginTop: '20px',
      textAlign: 'center',
      padding: '18px',
      background: '#33190e', // oscuro
      borderRadius: '12px',
      color: 'white',
      boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
    },

  button: {
    marginTop: '20px',
    background: '#33190e',
    color: 'white',
    padding: '12px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    width: '100%'
  }
};

export default Ventas;