import React, { useEffect, useRef, useState } from 'react'
import Chart from 'chart.js/auto'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { firestore_database } from '../../Firebase'
import './Progress.css' // Import the CSS file

const Progress = () => {
  const [invoices, setInvoices] = useState([])
  const [products, setProducts] = useState([])
  const [productMonthly, setProductMonthly] = useState(0)
  const [invoiceMonthly, setInvoiceMonthly] = useState(0)
  const [productOverall, setProductOverall] = useState(0)
  const [invoiceOverall, setInvoiceOverall] = useState(0)
  const invoiceChartRef = useRef(null)
  const productChartRef = useRef(null)

  const initialChartData = () => ({
    Jan: 0,
    Feb: 0,
    Mar: 0,
    Apr: 0,
    May: 0,
    Jun: 0,
    Jul: 0,
    Aug: 0,
    Sep: 0,
    Oct: 0,
    Nov: 0,
    Dec: 0
  })

  useEffect(() => {
    getInvoice()
    getProduct()
  }, [])

  const getInvoice = async () => {
    const q = query(collection(firestore_database, 'invoice'), where('uid', '==', localStorage.getItem('uid')))
    const querySnapshot = await getDocs(q)

    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    setInvoices(data)

    const invoiceByOverall = getOverallTotal(data)
    setInvoiceOverall(invoiceByOverall)

    const invoiceByMonth = getMonthTotal(data)
    setInvoiceMonthly(invoiceByMonth)

    const invoiceData = calculateMonthWiseCollection(data)
    createChart('invoice', invoiceData, invoiceChartRef)
  }

  const getProduct = async () => {
    const q = query(collection(firestore_database, 'buy_prodect'), where('uid', '==', localStorage.getItem('uid')))
    const querySnapshot = await getDocs(q)

    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    setProducts(data)

    const productByOverall = getOverallTotal(data)
    setProductOverall(productByOverall)

    const productByMonth = getMonthTotal(data)
    setProductMonthly(productByMonth)

    const productData = calculateMonthWiseCollection(data)
    createChart('buy', productData, productChartRef)
  }

  const calculateMonthWiseCollection = (data) => {
    const chartData = initialChartData()

    data.forEach(d => {
      const date = new Date(d.date.seconds * 1000)
      if (date.getFullYear() === new Date().getFullYear()) {
        const month = date.toLocaleString('default', { month: 'short' })
        chartData[month] += d.total
      }
    })

    return chartData
  }

  const createChart = (id, chartdata, chartRef) => {
    const ctx = document.getElementById(id)

    if (chartRef.current) {
      chartRef.current.destroy()
    }

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(chartdata),
        datasets: [{
          label: 'Monthly Record',
          data: Object.values(chartdata),
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })
  }

  const getMonthTotal = (dataList) => {
    let mt = 0;
    dataList.forEach(data => {
      const date = new Date(data.date.seconds * 1000);
      if (date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear()) {
        mt += data.total
      }
    })
    return mt
  }

  const getOverallTotal = (dataList) => {
    const t = dataList.reduce((acc, data) => acc + data.total, 0);
    return t
  }

  return (
    <div id="progress-container">
      <div id="header">
        <div className="summary sell">
          <h2>Sell Data</h2>
          <h1>rs{invoiceOverall}</h1>
          <p>Overall</p>
          <h1>rs{invoiceMonthly}</h1>
          <p>This month</p>
        </div>
        <div className="summary buy">
          <h2>Buy Data</h2>
          <h1>rs{productOverall}</h1>
          <p>Overall</p>
          <h1>rs{productMonthly}</h1>
          <p>This month</p>
        </div>
      </div>

      <div id="charts">
        <div className="chart-container">
          <h4>Sell Data Chart</h4>
          <canvas id='invoice' />
        </div>
        <div className="chart-container">
          <h4>Buy Data Chart</h4>
          <canvas id='buy' />
        </div>
      </div>
    </div>
  )
}

export default Progress
