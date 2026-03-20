import { useEffect, useState } from 'react';
import api from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell
} from 'recharts';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import {
  FaChartBar,
  FaFilePdf,
  FaDollarSign,
  FaWallet,
  FaChartLine,
  FaCreditCard
} from 'react-icons/fa';

function Dashboard() {

  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/dashboard')
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!data) return <p style={{ padding: '20px' }}>Cargando...</p>;

  const estadoPagosFix = data.estado_pagos?.map(e => ({
    ...e,
    total: Number(e.total)
  })) || [];

  // 📄 PDF
  const generarPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Reporte Mensual - La Reserva 1600', 14, 20);

    doc.setFontSize(12);
    doc.text(`Ventas: $${data.ventas_mes}`, 14, 30);
    doc.text(`Gastos: $${data.gastos_mes}`, 14, 38);
    doc.text(`Utilidad: $${data.ganancia_mes}`, 14, 46);
    doc.text(`Pendientes: ${data.ventas_pendientes}`, 14, 54);

    const ventasRows = data.ventas_lista?.map(v => [
      new Date(v.fecha).toLocaleDateString(),
      v.presentacion,
      v.cantidad,
      `$${v.total}`
    ]) || [];

    autoTable(doc, {
      startY: 65,
      head: [['Fecha', 'Producto', 'Cantidad', 'Total']],
      body: ventasRows
    });

    const comprasRows = data.compras_lista?.map(c => [
      new Date(c.fecha).toLocaleDateString(),
      c.descripcion,
      `$${c.total}`
    ]) || [];

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [['Fecha', 'Descripción', 'Total']],
      body: comprasRows
    });

    doc.save('reporte-completo-cafe.pdf');
  };

  return (
    <div style={styles.container}>

      {/* 🔥 HEADER */}
      <div style={styles.header}>
        <FaChartBar style={styles.headerIcon} />
        <h1 style={styles.title}>Dashboard</h1>
      </div>

      {/* PDF */}
      <button onClick={generarPDF} style={styles.buttonPDF}>
        <FaFilePdf /> Exportar PDF
      </button>

      {/* CARDS */}
      <div style={styles.cards}>

        <div style={styles.card}>
          <FaDollarSign style={styles.cardIcon} />
          <div>
            <p>Ventas Del Dia</p>
            <h3>${data.ventas_hoy}</h3>
          </div>
        </div>

        <div style={styles.card}>
          <FaDollarSign style={styles.cardIcon} />
          <div>
            <p>Ventas Del Mes</p>
            <h3>${data.ventas_mes}</h3>
          </div>
        </div>

        <div style={styles.card}>
          <FaWallet style={styles.cardIcon} />
          <div>
            <p>Gastos</p>
            <h3>${data.gastos_mes}</h3>
          </div>
        </div>

        <div style={styles.card}>
          <FaChartLine style={styles.cardIcon} />
          <div>
            <p>Utilidad</p>
            <h3>${data.ganancia_mes}</h3>
          </div>
        </div>

        <div style={styles.card}>
          <FaCreditCard style={styles.cardIcon} />
          <div>
            <p>Pendientes</p>
            <h3>{data.ventas_pendientes}</h3>
          </div>
        </div>

      </div>

      {/* GRÁFICAS */}
      <div style={styles.charts}>

        <div style={styles.chartBox}>
          <h3 style={styles.chartTitle}>Ventas por mes</h3>

          <BarChart width={400} height={250} data={data.ventas_por_mes}>
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#33190e" />
          </BarChart>
        </div>

        <div style={styles.chartBox}>
          <h3 style={styles.chartTitle}>Pagado vs Pendiente</h3>

          {estadoPagosFix.length === 0 ? (
            <p>No hay datos</p>
          ) : (
            <PieChart width={300} height={250}>
              <Pie
                data={estadoPagosFix}
                dataKey="total"
                nameKey="estado_pago"
                outerRadius={80}
                label
              >
                {estadoPagosFix.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={index === 0 ? '#33190e' : '#d9bfa3'}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          )}
        </div>

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
    fontSize: '28px',
    color: '#33190e'
  },

  title: {
    color: '#33190e'
  },

  buttonPDF: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#33190e',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '25px'
  },

  cards: {
    display: 'flex',
    gap: '20px',
    marginBottom: '40px',
    flexWrap: 'wrap'
  },

  card: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    background: '#f5e6c8',
    padding: '20px',
    borderRadius: '12px',
    minWidth: '180px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
  },

  cardIcon: {
    fontSize: '24px',
    color: '#33190e'
  },

  charts: {
    display: 'flex',
    gap: '40px',
    flexWrap: 'wrap'
  },

  chartBox: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
  },

  chartTitle: {
    marginBottom: '10px',
    color: '#33190e'
  }
};

export default Dashboard;