import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import { CloseOutlined } from '@ant-design/icons'
import axios from 'axios';
import { decrementQuantity, incrementQuantity } from '@/store/actions/cartActions'
import { removeItem } from '@/store/actions/cartActions'
import { backendAPI } from '@/config'

const CartItem = (props) => {
    const [newQuantity, setNewQuantity] = useState(props.quantity);
    const [newTotalValue, setNewTotalValue] = useState(props.totalValue);
    const token = localStorage.getItem('tokenU');
    const dispatch = useDispatch()

    const handleDecrementQuantity = () => {
        if (newQuantity > 1) {
            setNewQuantity(newQuantity - 1);
            dispatch(decrementQuantity(props.productVariantId));
        }
    }

    const handleIncrementQuantity = () => {
        setNewQuantity(newQuantity + 1);
        dispatch(incrementQuantity(props.productVariantId));
    }

    const handleDeleteProduct = async () => {
        dispatch(removeItem(props.productVariantId));
        try {
            const response = await axios.delete(`${backendAPI}/api/app/cart/delete-product-in-cart`, {
                data: {
                    id: [props.productVariantId]
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            props.refetchListCart();
        } catch (error) {
            console.error('Error Update Cart:', error);
        }
    }

    useEffect(() => {
        setNewTotalValue(newQuantity * props.price);
        props.onQuantityChange(props.productVariantId, newQuantity, newQuantity * props.price)
    }, [newQuantity])

    useEffect(() => {
        async function updateCart() {
            try {
                const response = await axios.post(`${backendAPI}/api/app/cart/update-cart`, [
                    {
                        id: props.productVariantId,
                        number: newQuantity
                    }
                ], {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } catch (error) {
                console.error('Error Update Cart:', error);
            }
        }
        if (newQuantity !== props.quantity) {
            updateCart();
        }
    }, [newQuantity])

    return (
        <div className="cart-item">
            <div className="row">
                <div className="cart-col-left col-3">
                    <div className="box-img position-relative border-radius">
                        <img className="border-radius" src={props.image} alt="" style={{ width: '100px', height: '100px', marginLeft: '13px' }} />
                    </div>
                </div>
                <div className="cart-col-right col-9 d-flex flex-column justify-content-between">
                    <div className="cart-item-info position-relative">
                        <div className="product-name">
                            <p className="fw-bold">
                                {props.name}
                            </p>
                        </div>
                        <CloseOutlined
                            className="cart-item-remove position-absolute"
                            onClick={() => handleDeleteProduct(props.productVariantId)}
                        />
                        <div className="orther-info">
                            <p>{`${props.size}`}</p>
                        </div>
                        <div className="cart-item-action">
                            <div
                                className="fw-bold quantity-button col-3 d-flex justify-content-between align-items-center"
                                style={{ border: '1px solid #000 ', borderRadius: '8px' }}
                            >
                                <MinusOutlined onClick={handleDecrementQuantity} />
                                <span>{newQuantity}</span>
                                <PlusOutlined onClick={handleIncrementQuantity} />
                            </div>
                        </div>
                    </div>
                    <div className="cart-item-price">
                        {newTotalValue}đ
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartItem