import Chart from 'chart.js/auto'
import { collection, getDocs, query, where } from 'firebase/firestore'
import React, { useEffect, useRef, useState } from 'react'
import { firestore_database } from '../../Firebase'

const Home = () => {
  // State variables to hold various totals and invoice data
  const [total, setTotal] = useState(0)
  const [totalInvoice, setTotalInvoice] = useState(56789)
  const [totalMonthCollection, setTotalMonthCollection] = useState(0)
  const [invoices, setInvoices] = useState([])
  const chartRef = useRef(null)

  // Function to fetch data from Firestore
  const getData = async () => {
    const q = query(collection(firestore_database, 'invoice'), where('uid', '==', localStorage.getItem('uid')))
    const querySnapshot = await getDocs(q);

    // Map through the fetched documents and set the invoices state
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setInvoices(data);
    console.log('home', data)
  };

  // Function to calculate the overall total from the list of invoices
  const getOverallTotal = (invoicesList) => {
    const t = invoicesList.reduce((acc, data) => acc + data.total, 0);
    setTotal(t);
  }

  // Function to calculate the total for the current month
  const getMonthTotal = (invoicesList) => {
    let mt = 0;
    invoicesList.forEach(data => {
      const date = new Date(data.date.seconds * 1000);
      // Check if the invoice date is in the current month and year
      if (date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear()) {
        console.log(data)
        mt += data.total
      }
    })
    setTotalMonthCollection(mt)
  }

  // Function to calculate and accumulate totals for each month of the current year
  const MonthWiseCollection = (data) => {
    const chartData = {
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
    };

    data.forEach(d => {
      const date = new Date(d.date.seconds * 1000);
      // Check if the invoice date is in the current year
      if (date.getFullYear() === new Date().getFullYear()) {
        const month = date.toLocaleString('default', { month: 'short' });
        chartData[month] += d.total;
      }
    });

    console.log(chartData);
    // Call createChart with the calculated chartData
    createChart(chartData)
  };

  // Function to create a bar chart with the provided chartData
  const createChart = (chartData) => {
    const ctx = document.getElementById('myChart');

    // Destroy the previous chart instance if it exists
    if (chartRef.current) {
      chartRef.current.destroy()
    }

    // Create a new chart instance
    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(chartData), // Use keys of chartData as labels
        datasets: [{
          label: 'Monthly Invoice Record',
          data: Object.values(chartData), // Use values of chartData as data
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

    // Cleanup function to destroy the chart instance when the component unmounts
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
      }
    }
  }

  // Fetch data when the component mounts
  useEffect(() => {
    getData()
  }, [])

  // Recalculate totals and update the chart when invoices state changes
  useEffect(() => {
    getOverallTotal(invoices)
    getMonthTotal(invoices)
    MonthWiseCollection(invoices)
  }, [invoices])

  return (
    <div>
      <div className='home-first-row'>
        <div className='home-box box-1'>
          <h1 className='box-header'>rs {total}</h1>
          <p className='box-title'>overall</p>
        </div>

        <div className='home-box box-2'>
          <h1 className='box-header'> {invoices.length}</h1>
          <p className='box-title'>Total Invoice</p>
        </div>

        <div className='home-box box-3'>
          <h1 className='box-header'>rs {totalMonthCollection}</h1>
          <p className='box-title'>this Month</p>
        </div>
      </div>

      <div className='home-second-row'>
        <div className='chart-box'>
          <canvas id="myChart"></canvas>
        </div>

        <div className='recent-invoice-list'>
          <h1>Recent invoice list</h1>
          <div>
            <p>Customer name</p>
            <p>Date</p>
            <p>Total</p>
          </div>

         { invoices.slice(0,6).map(data=>(
            <div>
               <p>{data.to}</p>
            <p>{new Date(data.date.seconds * 1000).toLocaleDateString()}</p>
            <p>{data.total}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
