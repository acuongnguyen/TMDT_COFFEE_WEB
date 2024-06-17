import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import axios from 'axios'

import AccountSidebar from '@/components/AccountSidebar'
import OrderDetailTable from '@/components/OrderDetailPage/OrderDetailTable'
import { swtoast } from '@/mixins/swal.mixin'
import { formatTime } from '@/helpers/format';
import { backendAPI } from '@/config'

const OrderDetailPage = () => {
    const router = useRouter()
    const { order_id } = router.query

    const [customerId, setCustomerId] = useState('')
    const [stateId, setStateId] = useState('')
    const [orderId, setOrderId] = useState('')
    const [stateName, setStateName] = useState('')
    const [orderItems, setOrderItems] = useState([])
    const [totalProductValue, setTotalProductValue] = useState(0)
    const [paymentType, setPaymentType] = useState('Chuyển khoản');
    const [totalOrderValue, setTotalOrderValue] = useState(0)
    const [createdAt, setCreatedAt] = useState('')
    const [customerName, setCustomerName] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [address, setAddress] = useState('')
    const isLoggedIn = useSelector(state => state.customer.isLoggedIn)
    const customerInfo = useSelector((state) => state.customer.customerInfo)
    const token = localStorage.getItem('tokenU');

    useEffect(() => {
        if (isLoggedIn)
            customerInfo != null ? setCustomerId(customerInfo.customer_id) : setCustomerId('')
    }, [isLoggedIn]);

    const getPaymentType = (paymentOptionId) => {
        switch (paymentOptionId) {
            case 1:
                return 'Chuyển khoản';
            case 2:
                return 'Tiền mặt';
            default:
                return 'Chuyển khoản';
        }
    };

    useEffect(() => {
        const getOrderDetail = async () => {
            try {
                let response = await axios.get(backendAPI + `/api/app/bill/get-bill-detail?billId=${order_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setOrderId(response.data.data.bill.id)
                setStateName(getStateName(response.data.data.bill.status))
                setStateId(response.data.data.bill.status)
                setCreatedAt(response.data.data.bill.created_at)
                setOrderItems(response.data.data.billDetail)
                setPaymentType(getPaymentType(response.data.data.bill.paymentOptionId))
                setTotalOrderValue(response.data.data.bill.total)
                setCustomerName(response.data.data.address.name)
                setEmail(response.data.data.address.note)
                setPhoneNumber(response.data.data.address.phone)
                setAddress(response.data.data.address.city + " " + response.data.data.address.district + " " + response.data.data.address.ward)
            } catch (error) {
                console.log(error)
            }
        }
        if (order_id) {
            getOrderDetail();
        }
    }, [order_id])

    const renderCancelBtn = () => {
        if (stateId == 0) {
            return (
                <button className='cancel-order-btn' onClick={handleCancelOrder}>Hủy đơn hàng</button>
            )
        }
    }

    const getStateName = (stateId) => {
        switch (stateId) {
            case 0:
                return 'Cần thanh toán';
            case 4:
                return 'Đã hoàn tất';
            case 5:
                return 'Chờ xác nhận';
            case 6:
                return 'Chờ giao hàng';
            default:
                return 'Chờ xác nhận';
        }
    };

    const handleCancelOrder = async () => {
        try {
            await axios.put(`${backendAPI}/api/order/change-status/${orderId}/5`)
            swtoast.success({ text: "Hủy đơn hàng thành công" });
            router.push('/account/orders')
        } catch (err) {
            console.log(err);
            swtoast.error({
                text: "Có lỗi khi hủy đơn hàng vui lòng thử lại!"
            });
        }
    }

    return (
        <div className='order-detail-page'>
            <div className="row">
                <div className="col-4">
                    <AccountSidebar />
                </div>
                <div className="col-8">
                    <div className="order-detail">
                        <h1 className="title">Thông tin đơn hàng của bạn</h1>
                        <div className="d-flex row align-items-center justify-content-between">
                            <div className="col-3">
                                {/* {renderCancelBtn()} */}
                            </div>
                            <div className="col-6 order-title border-radius d-flex align-items-center justify-content-center fw-bold">
                                <div>
                                    ĐƠN HÀNG #{orderId}
                                    <span className='order-state'>{stateName}</span>
                                </div>
                            </div>
                            <div className="order-date col-3 d-flex align-items-center justify-content-end">
                                Ngày đặt: {formatTime(createdAt)}
                            </div>
                        </div>
                        <div>
                            <OrderDetailTable
                                orderItems={orderItems}
                                totalOrderValue={totalOrderValue}
                            />
                        </div>
                        <p className='receive-info-title'>Thông tin nhận hàng</p>
                        <div className="receive-info-box border-radius">
                            <p>
                                Tên người nhận:
                                <strong>{" " + customerName}</strong>
                            </p>
                            <p>
                                Số điện thoại:
                                <strong>{" " + phoneNumber}</strong>
                            </p>
                            <p>
                                Hình thức thanh toán:
                                <strong> {paymentType}</strong>
                            </p>
                            <p>
                                Địa chỉ giao hàng:
                                <strong>{" " + address}</strong>
                            </p>
                            <p>
                                Địa chỉ cụ thể:
                                <strong>{" " + email}</strong>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderDetailPage