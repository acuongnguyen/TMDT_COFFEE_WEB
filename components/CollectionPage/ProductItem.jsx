import React from 'react'
import { StarFilled } from '@ant-design/icons'
import { frontendAPI } from '@/config'
import { formatRate } from '@/helpers/format'
import Link from "next/link";

const ProductItem = (props) => {
    return (
        <div className='product-item'>
            <Link href={{ pathname: `/product/${props.product_id}` }}>
                <div className="position-relative img-box">
                    <img className='img' src={props.img} alt="" style={{ width: '200px', height: '200px' }} />
                </div>
            </Link>
            <div className="infor-product">
                <Link href={{ pathname: `/product/${props.product_id}`, query: { colour: props.colour_id } }}>
                    <h6>{props.name}</h6>
                </Link>
                <div className='d-flex justify-content-start'>
                    <p className='price-after text-danger fw-bold'>{props.price}đ</p>
                </div>
            </div>
        </div>
    )
}

export default ProductItem