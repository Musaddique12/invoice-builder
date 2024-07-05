import { Timestamp, addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react'
import { firestore_database } from '../../Firebase';
import { useNavigate } from 'react-router-dom';

const New_Invoice = () => {
    const navigate = useNavigate()
    const [to, setTo] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [product_name, setProduct_name] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState([])
    const [total, setTotal] = useState(0)
    const [isLoading, setLoading] = useState(false)
    const [is_product_added, set_is_product_added] = useState(false)

    const addProduct = (e) => {

        e.preventDefault()

        if (phone.length === 10 && quantity.valueOf() > 0 && price.valueOf() > 0) {
            setProduct([...product, { 'id': product.length, 'name': product_name, 'price': price, 'quantity': quantity }])
            const t = quantity * price
            setTotal(total + t)
            setProduct_name('')
            setPrice('')
            setQuantity('')

            set_is_product_added(true)
        }
        else {
            window.alert('Enter valid Information')
        }
    }

    const saveData = async () => {
        setLoading(true)
        console.log(to, phone, address)
        console.log(product)
        console.log(total)

        const data = await addDoc(collection(firestore_database, 'invoice'), {
            to: to,
            phone: phone,
            address: address,
            product: product,
            total: total,
            uid: localStorage.getItem('uid'),
            date: Timestamp.fromDate(new Date())
        })

        console.log(data)
        navigate('/dashboard/invoices')
        setLoading(false)
    }

    return (
        <div>
            <div className='header-row'>
                <p className='new-invoice-heading'>New Invoice</p>
                {is_product_added &&
                    <button onClick={saveData} className='add-btn' type='button'>Save Data  {isLoading && <i class="fa-solid fa-spinner fa-spin-pulse"></i>}</button>}
            </div>
            <form className='new-invoice-form'>
                <div className='first-row'>
                    <input onChange={(e) => { setTo(e.target.value) }} value={to} placeholder='To'></input>
                    <input
                        onChange={(e) => { setPhone(e.target.value); }} value={phone} placeholder='Phone' type='number' />
                    <input onChange={(e) => { setAddress(e.target.value) }} value={address} placeholder='Address'></input>
                </div>

                <div className='second-row'>
                    <input onChange={(e) => { setProduct_name(e.target.value) }} value={product_name} placeholder='Product Name'></input>
                    <input onChange={(e) => { setPrice(e.target.value) }} value={price} type='number' placeholder='Price'></input>
                    <input onChange={(e) => { setQuantity(e.target.value) }} value={quantity} type='number' placeholder='quantity'></input>
                </div>
                {to && phone && address && product_name && price && quantity &&
                    <button className='add-btn' type='submit' onClick={addProduct}>Add Product</button>}
            </form>

            {product.length > 0 &&
                <div className='product-wrapper'>
                    <div className='product-list'>
                        <p>s. No</p>
                        <p>Product</p>
                        <p>Price</p>
                        <p>Quantitya</p>
                        <p>Total</p>
                    </div>
                    {
                        product.map((data, index) => (
                            <div className='product-list' key={index}>
                                <p>{index + 1}</p>
                                <p>{data.name}  </p>
                                <p>{data.price}</p>
                                <p>{data.quantity}</p>
                                <p>{data.quantity * data.price}</p>
                            </div>
                        ))
                    }
                    <div className='total-wrapper'>
                        <p >total : {total}</p>
                    </div>
                </div>
            }

        </div>
    )
}

export default New_Invoice