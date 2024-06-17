import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { Rate } from 'antd';
import { StarFilled } from '@ant-design/icons'
import { swtoast } from '@/mixins/swal.mixin'
import CarouselFade from '@/components/ProductDetailPage/Carousel.jsx'
import OptionButton from '@/components/ProductDetailPage/OptionButton.jsx'
import ProductQuantityInput from '@/components/ProductDetailPage/ProductQuantityInput.jsx'
import PolicyItem from '@/components/ProductDetailPage/PolicyItem.jsx'
import FeedbackBox from '@/components/ProductDetailPage/FeedbackBox.jsx'
import { policyList } from '@/data/PolicyData'
import { addToCart, clearError } from '@/store/actions/cartActions'
import { backendAPI } from '@/config'

const listSize = [{ size_id: 1, size_name: 'S' }, { size_id: 2, size_name: 'M' }, { size_id: 3, size_name: 'L' }];

const ProductDetailPage = () => {

	const router = useRouter()
	const { product_id } = router.query
	const dispatch = useDispatch()
	const isErrorInCart = useSelector((state) => state.cart.isError)
	const messageErrorInCart = useSelector((state) => state.cart.messageError)
	const [productName, setProductName] = useState('')
	const [productDescription, setProductDescription] = useState('')
	const [feedbackQuantity, setFeedbackQuantity] = useState('')
	const [sizeList, setSizeList] = useState([]);
	const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
	const [productVariantId, setProductVariantId] = useState('');
	const [quantity, setQuantity] = useState(1);
	const [price, setPrice] = useState('0');
	const [product_image, setProduct_Image] = useState([]);
	const [feedbackList, setFeedbackList] = useState([]);
	const token = localStorage.getItem('tokenU');

	useEffect(() => {
		const handleGetProduct = async () => {
			try {
				let respond = await axios.get(backendAPI + `/api/app/item/get-item?id=${product_id}`);
				setProductName(respond.data.data.name);
				setProductDescription(respond.data.data.description);
				setPrice(respond.data.data.price);
				setProduct_Image(respond.data.data.image);
				// setSold(respond.data.data.price);
				setSizeList(listSize);
			} catch (error) {
				console.log(error);
			}
		}
		if (product_id) {
			handleGetProduct();
		}
	}, [product_id])

	useEffect(() => {
		const handleGetProductVariant = async () => {
			try {
				let respond = await axios.get(backendAPI + `/api/app/item/get-item?id=${product_id}`);
				setProductVariantId(respond.data.data.id);
				setPrice(respond.data.data.price);
				setSizeList(listSize);
				setProduct_Image(respond.data.data.image);
			} catch (error) {
				console.log(error);
			}
		}
		handleGetProductVariant();
	}, []);

	useEffect(() => {
		if (isErrorInCart) {
			swtoast.fire({
				text: messageErrorInCart
			});
			dispatch(clearError());
		}
	}, [isErrorInCart])

	const handleAddToCart = async () => {
		let product = {
			productVariantId: productVariantId,
			name: productName,
			size: sizeList[selectedSizeIndex].size_name,
			image: product_image,
			price: price,
			quantity: quantity
		}
		try {
			const response = await axios.post(`${backendAPI}/api/app/cart/add-product-to-cart`, {
				itemId: productVariantId,
				number: quantity,
				size: sizeList[selectedSizeIndex].size_name
			}, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
		} catch (err) {
			console.log(err);
			swtoast.error({
				text: "Có lỗi khi tạo đơn hàng vui lòng thử lại!"
			});
		}
		dispatch(addToCart(product));
		setQuantity(1);
		if (!isErrorInCart)
			swtoast.success({ text: "Thêm sản phẩm vào giỏ hàng thành công" });
	}

	return (
		<div className='product-detail-page'>
			<div className="row main-infor-product">
				<div className="col-4">
					<CarouselFade product_image={product_image} />
				</div>
				<div className="col-8">
					<h6 className="product-name">{productName}</h6>
					<div className="rating d-flex align-items-center">
						<span className='d-flex align-items-center'>
							<Rate disabled allowHalf value={5} />
						</span>
					</div>
					<div className="price-box">
						<span>{price}đ</span>
					</div>
					<div className="size-option-box">
						<span>Kích cỡ:&nbsp;
							<strong>
								{sizeList[selectedSizeIndex] ? sizeList[selectedSizeIndex].size_name : ''}
							</strong>
						</span>
						<div>
							{sizeList &&
								sizeList.map((size, index) => {
									return (
										<OptionButton
											getContent={() => setSelectedSizeIndex(index)}
											content={size.size_name}
											key={index}
											isSelected={selectedSizeIndex === index}
										/>
									);
								})}
						</div>
					</div>
					<div className="action-box row">
						<ProductQuantityInput quantity={quantity} setQuantity={setQuantity} />
						<div className="add-product-to-cart-button border-radius col-7 d-flex justify-content-around align-items-center" onClick={handleAddToCart}>
							Thêm vào giỏ hàng
						</div>
					</div>
					<div className="policy-box d-flex flex-wrap justify-content-around position-relative">
						{
							policyList && policyList.map((item, index) => {
								return (
									<PolicyItem key={index} icon={item.icon} des={item.des} />
								)
							})
						}
					</div>
				</div>
			</div>

			<div className="row product-detail">
				<div className="col-12">
					<h5 className='title text-center'>Chi tiết sản phẩm</h5>
					<div
						dangerouslySetInnerHTML={{ __html: productDescription }}
					/>
				</div>
			</div>
			<div className="review-box position-relative d-flex align-items-center">
				<div className="">
					<h5 className='feedback_quantify-detail d-inline-block'>{feedbackQuantity} Đánh giá</h5>
					<h5 className='rating-detail d-inline-block'>5 / 5 <span className='star-icon'><StarFilled /></span></h5>
				</div>
			</div>
			<FeedbackBox feedbackList={feedbackList} />
		</div >
	)
}

export default ProductDetailPage