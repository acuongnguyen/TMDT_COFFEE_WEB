import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios';
import { swtoast } from '@/mixins/swal.mixin'
import { Radio, Select } from 'antd';
import { FaShippingFast } from 'react-icons/fa'
import CartItem from '@/components/CartPage/CartItem'
import Input from '@/components/Input'
import { backendAPI } from '@/config'
import { formatPrice } from '@/helpers/format'
import { clearCart } from '@/store/actions/cartActions'
import Router, { useRouter } from 'next/router';

const { Option } = Select;

const CartPage = () => {
    const [customerName, setCustomerName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [deliveryCharges, setDeliveryCharges] = useState(20000);
    const customerInfo = useSelector((state) => state.customer.customerInfo);
    const isLoggedIn = useSelector(state => state.customer.isLoggedIn);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const productList = useSelector((state) => state.cart.productList);
    const [listProduct, setListProduct] = useState([]);
    const dispatch = useDispatch();
    const [shippingAddresses, setShippingAddresses] = useState([]);
    const [error, setError] = useState('');
    const [statePayment, setStatePayment] = useState('');
    const [note, setNote] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const token = localStorage.getItem('tokenU');
    const [pttt, setPttt] = useState(1);

    const router = useRouter();
    const param = router.query;

    useEffect(() => {
        async function getProductList() {
            try {
                const response = await axios.post(`${backendAPI}/api/app/cart/get-cart`, {
                    id: []
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setListProduct(response.data.data);
            } catch (error) {
                console.error('Error fetching shipping addresses:', error);
            }
        }
        getProductList();
    }, [])

    const refetchListCart = async () => {
        try {
            const response = await axios.post(`${backendAPI}/api/app/cart/get-cart`, {
                id: []
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setListProduct(response.data.data);
        } catch (error) {
            console.error('Error fetching shipping addresses:', error);
        }
    }

    useEffect(() => {
        if (param.partnerCode !== 0) {
            async function paymentResult() {
                try {
                    const response = await axios.get(`${backendAPI}/api/app/payment/momo-payment-confirmed`, {
                        params: param
                    });
                    setStatePayment(response.data.message);
                    if (response.data.message === 'Thành công') {
                        setShowSuccessToast(true);
                    }
                } catch (error) {
                    console.error('Error fetching shipping addresses:', error);
                }
            }
            paymentResult();
        }
    }, [param.partnerCode])

    useEffect(() => {
        async function fetchShippingAddresses() {
            try {
                const response = await axios.get(`${backendAPI}/api/app/address/get-list-address`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setShippingAddresses(response.data.data);
            } catch (error) {
                console.error('Error fetching shipping addresses:', error);
            }
        }

        fetchShippingAddresses();
    }, []);

    useEffect(() => {
        if (totalPrice > 200000) {
            setDeliveryCharges(0)
        }
        else setDeliveryCharges(20000)
    }, [totalPrice])

    useEffect(() => {
        customerInfo != null ? setCustomerName(customerInfo.customer_name) : setCustomerName('')
        customerInfo != null ? setPhoneNumber(customerInfo.phone_number) : setPhoneNumber('')
    }, [customerInfo])

    const finalTotal = (price) => {
        return price + deliveryCharges
    }

    const getSizeName = (size) => {
        switch (size) {
            case 0:
                return 'S';
            case 1:
                return 'M';
            case 2:
                return 'L';
            default:
                return 'S';
        }
    };

    const handleOrder = async () => {
        if (isLoggedIn && productList.length) {
            try {
                const respond = await axios.post(`${backendAPI}/api/app/bill/create-bill`, {
                    id: listProduct.map((item) => item.item.id),
                    appointmentTime: "08:26 25/05/2024",
                    total: finalTotal(totalPrice),
                    paymentOptionId: pttt,
                    deliveryOptionId: 1,
                    addressId: address,
                    note: note,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (respond.data.data.paymentOptionId === 2) {
                    Router.push('/account/orders');
                }
                if (respond.data.data.payUrl) {
                    window.location.href = respond.data.data.payUrl;
                }
                dispatch(clearCart())
                swtoast.success({ text: "Đặt hàng thành công" });
            } catch (err) {
                console.log(err);
                swtoast.error({
                    text: "Có lỗi khi tạo đơn hàng vui lòng thử lại!"
                });
            }
        }
    }

    useEffect(() => {
        if (address && shippingAddresses) {
            const selectedAddress = shippingAddresses.find((item) => item.id === address);
            if (selectedAddress) {
                setCustomerName(selectedAddress.name);
                setPhoneNumber(selectedAddress.phone)
            }
        }
    }, [address, shippingAddresses]);

    const handleQuantityChange = (productVariantId, newQuantity, newTotalValue) => {
        const updatedList = listProduct.map(product => {
            if (product.item.id === productVariantId) {
                return {
                    ...product,
                    item: {
                        ...product.item,
                        number: newQuantity,
                    },
                    totalValue: newTotalValue
                };

            }
            return product;
        });
        setListProduct(updatedList);

        const updatedTotalPrice = updatedList.reduce((accumulator, product) => {
            return accumulator + product.totalValue;
        }, 0);

        setTotalPrice(updatedTotalPrice);
    };

    useEffect(() => {
        const totalPrice = listProduct.reduce((accumulator, product) => {
            return accumulator + product.item_info.price * product.item.number;
        }, 0);
        setTotalPrice(totalPrice);
    }, [listProduct]);

    return (
        <div className="cart-page">
            <div className="row">
                <div className="col-7 cart-left-section">
                    <div className="title">
                        Thông tin vận chuyển
                    </div>
                    <div>
                        <div className="row">
                            <div className="col-6">
                                <Input
                                    type="text"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    error={error}
                                    placeholder="Họ tên"
                                />
                            </div>
                            <div className="col-6">
                                <Input
                                    type="text"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    error={error}
                                    placeholder="Số điện thoại"
                                />
                            </div>
                        </div>
                        <Select
                            style={{ width: '100%', marginBottom: '16px' }}
                            className='rounded-md'
                            placeholder="Chọn địa chỉ nhận hàng"
                            value={address}
                            onChange={(value) => {
                                if (value === "addAddress") {
                                    Router.push('/account/infor');
                                } else {
                                    setAddress(value);
                                }
                            }}
                        >
                            {
                                shippingAddresses.map((address) => (
                                    <Option key={address.id} value={address.id}>
                                        {address.city + " - " + address.district + " - " + address.ward}
                                    </Option>
                                ))
                            }
                            <Option key="addAddress" value="addAddress" className="border">Thêm địa chỉ nhận hàng</Option>
                        </Select>
                    </div>
                    <div className="payment">
                        <div className="title">
                            Hình thức thanh toán
                        </div>
                        <div>
                            <label htmlFor="" className="payment-item w-100 border-radius d-flex align-items-center justify-content-start">
                                <div className='payment-item-radio'>
                                    <Radio checked={pttt === 2} onChange={() => setPttt(2)}></Radio>
                                </div>
                                <div className='payment-item-icon'>
                                    <FaShippingFast />
                                </div>
                                <div className="payment-item-name">
                                    <p className="text-uppercase">cod</p>
                                    <p className="">Thanh toán khi nhận hàng</p>
                                </div>
                            </label>
                        </div>
                        <div>
                            <label htmlFor="" className="payment-item w-100 border-radius d-flex align-items-center justify-content-start">
                                <div className='payment-item-radio'>
                                    <Radio checked={pttt === 1} onChange={() => setPttt(1)}></Radio>
                                </div>
                                <div className='payment-item-icon'>
                                    <img src="../img/momo2.png" alt="" width={30} height={30} />
                                </div>
                                <div className="payment-item-name">
                                    <p className="text-uppercase">Momo</p>
                                    <p className="">Thanh toán qua ứng dụng Momo</p>
                                </div>
                            </label>
                        </div>
                    </div>
                    <button className="order-btn border-radius" style={{ backgroundColor: '#1677ff' }} onClick={handleOrder}>Đặt Hàng</button>
                </div>
                {showSuccessToast && (
                    <div className="swtoast-container">
                        <div className="swtoast">
                            <p>Thanh toán thành công!</p>
                            <button onClick={() => {
                                setShowSuccessToast(false);
                                Router.push('/account/orders');
                            }}>Xác nhận</button>
                        </div>
                    </div>
                )}
                <div className="col-5 cart-right-section">
                    <div className="title">
                        Giỏ hàng
                    </div>
                    <div className="cart-section">
                        {
                            listProduct.length > 0 ?
                                listProduct && listProduct.map((product) => {
                                    return (
                                        <CartItem
                                            key={product.item.id}
                                            productVariantId={product.item.id}
                                            name={product.item_info.name}
                                            image={product.item_info.image}
                                            size={getSizeName(product.item.size)}
                                            quantity={product.item.number}
                                            price={product.item_info.price}
                                            totalValue={formatPrice(product.item.number * product.item_info.price)}
                                            onQuantityChange={handleQuantityChange}
                                            refetchListCart={refetchListCart}
                                        />

                                    )
                                }) : <p className="text-center">Chưa có sản phẩm nào trong giỏ hàng</p>
                        }
                    </div>
                    <div className="row pricing-info">
                        <div className="pricing-info-item position-relative d-flex justify-content-between">
                            <p>
                                Tạm tính
                            </p>
                            <p>
                                {formatPrice(totalPrice)}đ
                            </p>
                        </div>
                        <div className="pricing-info-item d-flex justify-content-between">
                            <p>Phí giao hàng</p>
                            <p>{formatPrice(deliveryCharges)}đ</p>
                        </div>
                        <div className="pricing-info-item final-total-box position-relative d-flex justify-content-between">
                            <p className='fw-bold'>Tổng</p>
                            <p className='fw-bold' style={{ fontSize: "20px" }}>
                                {formatPrice(finalTotal(totalPrice))}đ
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartPage