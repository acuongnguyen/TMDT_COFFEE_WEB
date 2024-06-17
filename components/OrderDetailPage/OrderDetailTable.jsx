import React, { useEffect, useState } from 'react'
import { formatPrice } from '@/helpers/format';

const OrderDetailTable = (props) => {

    const { orderItems, totalOrderValue } = props;
    const [deliveryCharges, setDeliveryCharges] = useState(20000);
    const [totalProductValue, setTotalProductValue] = useState(totalOrderValue);
    useEffect(() => {
        if (totalOrderValue > 200000) {
            setDeliveryCharges(0);
            setTotalProductValue(totalOrderValue)
        } else {
            setDeliveryCharges(20000);
            setTotalProductValue(totalOrderValue - deliveryCharges);
        }
    }, [totalOrderValue])

    const getSize = (size) => {
        switch (size) {
            case "0":
                return 'S';
            case "1":
                return 'M';
            case "2":
                return 'L';
            default:
                return 'S';
        }
    };

    return (
        <div className="order-detail-table">
            <table className='table table-striped'>
                <thead>
                    <tr>
                        <th>Tên sản phẩm</th>
                        <th>Số lượng</th>
                        <th>Giá niêm yết</th>
                        <th>Biến thể</th>
                        <th>Thành tiền</th>
                    </tr>
                </thead>
                <tbody className='text-right'>
                    {
                        orderItems && orderItems.map((orderItem1, index) => {
                            return (
                                <tr key={index}>
                                    <td>{orderItem1.item.name}</td>
                                    <td className='text-center'>{orderItem1.orderItem.number}</td>
                                    <td className='text-center'>{orderItem1.orderItem.price}</td>
                                    <td className='text-center'>{`${getSize(orderItem1.orderItem.size)}`}</td>
                                    <td className='text-right'>{orderItem1.orderItem.number * orderItem1.orderItem.price}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
                <tfoot>
                    <tr className=''>
                        <td colSpan="4" className=''>Tổng giá trị sản phẩm</td>
                        <td colSpan="1">{totalProductValue}</td>
                    </tr>
                    <tr className=''>
                        <td colSpan="4" className=''>Phí giao hàng</td>
                        <td colSpan="1">{deliveryCharges}</td>
                    </tr>
                    <tr className='total'>
                        <td colSpan="4" className=''>Tổng thanh toán</td>
                        <td colSpan="1">{totalOrderValue}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}

export default OrderDetailTable