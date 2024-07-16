import React, { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { firestore_database } from '../../Firebase';
import { useNavigate } from 'react-router-dom';

const ShowBuy = () => {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true)
    const q = query(collection(firestore_database, 'buy_prodect'), where('uid', "==", localStorage.getItem('uid')))
    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setInvoices(data);
    setLoading(false)
  };

  const delete_Invoice = async (id) => {
    const isSure = window.confirm("Are you sure want to delete")

    if (isSure) {
      try {
        await deleteDoc(doc(firestore_database, 'buy_prodect', id))
        getData()
      }
      catch {
        window.alert("Somthing is wrong")
      }
    }
  }

  return (
    <div className="container">
      {isLoading ? <div style={{ display: 'flex', height: '100vh', fontSize: '30px', justifyContent: 'center', alignItems: 'center' }}>  <i class="fa-solid fa-spinner fa-spin-pulse"></i>  </div> :
        <div>
          {invoices.map(data => (
            <div className="box" key={data.id}>
              <p className="to">{data.to}</p>
              <p className="date">{new Date(data.date.seconds * 1000).toLocaleDateString()}</p>
              <p className="total">rs. {data.total}</p>
              <button onClick={() => { delete_Invoice(data.id) }} className="delete"> <i class="fa-solid fa-trash"></i> Delete</button>
              <button onClick={() => { navigate('/dashboard/invoice-detail', { state: data }) }} className="delete" style={{ backgroundColor: 'blue' }}> <i class="fa-solid fa-eye"></i> View</button>
            </div>
          ))}

          { invoices.length<1 &&
              <div style={{height:'100vh',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',textAlign:'center'}}>
                   <h2 style={{marginBottom:'3%'}}>add invoice first</h2>
                    <button style={{padding:'1%'}} onClick={()=>{navigate('/dashboard/new-invoice')}}>Create New invoice</button>
              </div>
          }

        </div>
      }
    </div>
  );
};

export default ShowBuy;
