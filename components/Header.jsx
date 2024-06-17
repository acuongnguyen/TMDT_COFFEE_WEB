import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import Link from 'next/link'
import { swalert } from '@/mixins/swal.mixin';
import { FaShoppingBag } from 'react-icons/fa'

import Login from "./Login"
import Register from './Register';
import { customerLogOut } from '../store/actions/customerActions'
import { backendAPI } from '@/config'

const Header = () => {
	const [categoryList, setCategoryList] = useState([]);
	const [isLogInOpen, setIsLogInOpen] = useState(false);
	const [isRegisterOpen, setIsRegisterOpen] = useState(false)
	const isLoggedIn = useSelector(state => state.customer.isLoggedIn);
	const dispatch = useDispatch()

	useEffect(() => {
		const getListCategory = async () => {
			try {
				const result = await axios.get(`${backendAPI}/api/app/category/get-list-category`)
				setCategoryList(result.data.data)
			} catch (err) {
				console.log(err);
			}
		}
		getListCategory();
	}, [])

	const toClose = () => {
		setIsLogInOpen(false)
		setIsRegisterOpen(false)
	}

	return (
		<div className="header-wrapper position-relation">
			{
				!isLoggedIn &&
				<>
					<div className={!isLogInOpen ? `${'d-none'}` : ''}>
						<Login
							toRegister={() => {
								setIsLogInOpen(false)
								setIsRegisterOpen(true)
							}}
							toClose={toClose}
						/>
					</div>
					<div className={!isRegisterOpen ? `${'d-none'}` : ''}>
						<Register
							toLogin={() => {
								setIsRegisterOpen(false)
								setIsLogInOpen(true)
							}}
							toClose={toClose}
						/>
					</div>
				</>
			}
			<div className="header w-100 d-flex align-items-center">
				<div className="logo-box p-2">
					<Link href="/">
						<img className='logo' src="../img/logo2.png" alt="logo" />
					</Link>
				</div>
				<ul className="menu p-2" >
					<li className="menu-item fw-bold text-uppercase position-relative">
						<Link
							href="/collections"
							className="d-flex align-items-center"
						>
							Tất cả
						</Link>
					</li>
					{
						categoryList.map((category, index) => {
							return (
								<li
									className="menu-item fw-bold text-uppercase position-relative"
									key={index}>
									<Link
										href={{ pathname: "/collections", query: { category: category.id } }}
										className="d-flex align-items-center"
									>
										{category.name}
									</Link>
								</li>
							)
						})
					}
				</ul>
				<ul className="header-inner p-2 ms-auto">
					{
						!isLoggedIn ?
							<li onClick={() => {
								setIsLogInOpen(true)
							}}
								className="inner-item menu-item fw-bold text-uppercase">
								<a href='#'>Đăng Nhập</a>
							</li>
							:
							<>
								<li className="inner-item menu-item fw-bold text-uppercase">
									<Link href="/account/infor">Account</Link>
								</li>
								<li onClick={() => {
									swalert
										.fire({
											title: "Đăng xuất",
											icon: "warning",
											text: "Bạn muốn đăng xuất?",
											showCloseButton: true,
											showCancelButton: true,
										})
										.then(async (result) => {
											if (result.isConfirmed) {
												dispatch(customerLogOut())
												window.location.assign('/')
											}
										})
								}} className="inner-item menu-item fw-bold text-uppercase">
									<a href='#'>Log Out</a>
								</li>
							</>
					}
					<li className="cart inner-item menu-item fw-bold text-uppercase">
						<Link href="/cart"><FaShoppingBag /></Link>
					</li>
				</ul>
			</div >
		</div >
	)
}

export default Header