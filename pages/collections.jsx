import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { Empty } from 'antd'

import ProductItem from '@/components/CollectionPage/ProductItem'

import { backendAPI } from '@/config'

const CollectionPage = () => {
    const router = useRouter()
    const { category } = router.query
    const [productList, setProductList] = useState([])
    const token = localStorage.getItem('tokenU');
    useEffect(() => {
        const getProductList = async () => {
            try {
                let url = category ? `${backendAPI}/api/app/item/get-list-item?searchFields%5B%5D=itemTypeId&search=${category}` : `${backendAPI}/api/app/item/get-list-item`
                const result = await axios.get(url)
                setProductList(result.data.data)
            } catch (err) {
                console.log(err)
            }
        }
        getProductList()
    }, [category])

    return (
        <div className="product-page">
            <div className="product-box d-flex flex-row flex-wrap justify-content-start">
                {
                    productList.length ?
                        productList.map((product, index) => {
                            return (
                                <ProductItem
                                    key={index}
                                    product_id={product.id}
                                    name={product.name}
                                    img={product.image}
                                    price={product.price}
                                // colour_id={product.colour_id}
                                // sizes={product.size}
                                // rating={4.9}
                                // feedback_quantity={product.feedback_quantity}
                                />
                            )
                        })
                        :
                        <div className='d-flex' style={{ width: "100%", height: "400px" }}>
                            <Empty style={{ margin: "auto" }} />
                        </div>
                }
            </div>
        </div>
    )
}

export default CollectionPage