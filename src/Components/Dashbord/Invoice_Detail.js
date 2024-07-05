import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const Invoice_Detail = () => {
    const location = useLocation();
    const [data, setData] = useState(location.state);

    console.log(data);

    // Create PDF
    const printInvoice = () => {
        const input = document.getElementById('invoice');
        html2canvas(input,{useCORS:true})
            .then((canvas) => {
                const imageData = canvas.toDataURL('image/png', 1.0);
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'pt',
                    format: [612, 792],
                });
                pdf.internal.scaleFactor = 1;
                const imageProps = pdf.getImageProperties(imageData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imageProps.height * pdfWidth) / imageProps.width;
                pdf.addImage(imageData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`invoice_${new Date().toISOString()}.pdf`);
            })
            .catch((err) => {
                console.error('Error generating PDF:', err);
            });
    };

    return (
        <div>
            <div className='invoice-top-header'>
                <button onClick={printInvoice} className='print-btn'>Print Invoice</button>
            </div>

            <div id='invoice' className='invoice-wrapper'>
                <div className='invoice-header'>
                    <div className='company-detail'>
                        <img
                            className='company-logo'
                            src={localStorage.getItem('Photo_url')}
                            alt='Company Logo'
                            
                        />
                        <p className='cName'>{localStorage.getItem('Com_name')}</p>
                        <p>{localStorage.getItem('email')}</p>
                    </div>

                    <div className='customer-detail'>
                        <h1>Invoice</h1>
                        <p>To: {data.to}</p>
                        <p>Phone: {data.phone}</p>
                        <p>Address: {data.address}</p>
                    </div>
                </div>

                <table className='product-table'>
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Product Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.product.map((product, index) => (
                            <tr key={product.id}>
                                <td>{index + 1}</td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.quantity}</td>
                                <td>{product.quantity * product.price}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className='tfoot'>
                        <tr>
                            <td colSpan='4' style={{ textAlign: 'center' }}>Total</td>
                            <td>{data.total}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default Invoice_Detail;
