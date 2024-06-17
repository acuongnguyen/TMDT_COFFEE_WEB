import Head from 'next/head'
import { Inter } from '@next/font/google'
import Slider from '@/components/Slider'
import { ArrowUpOutlined } from '@ant-design/icons'

const inter = Inter({ subsets: ['latin'] })
export default function HomePage() {
	return (
		<>
			<Head>
				<title>SAICO</title>
				<meta name="description" content="Generated by create next app" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<main className='home-page'>
				<div style={{ margin: "0 -64px" }}>
					<Slider />
				</div>
				<div className="homepage-basic bg-dark text-light">
					<div className="d-flex">
						<div className="content-left">
							<h2 className='content_h2'>
								SAICO -<br /> Nguồn Cung Cấp Năng Lượng
							</h2>
							<p className='content_p'>Chất lượng sản phẩm đã được xác nhận thông qua quá trình kiểm nghiệm kỹ lưỡng.</p>
							<div>
								<button className='border-radius fw-bold'>
									Khám phá ngay
								</button>
							</div>
						</div>
						<div className="content-right">
							<img style={{ marginLeft: '50px' }} src="../img/slider_10.jpg" alt="" />
						</div>
					</div>
				</div>
				{/* <div className="homepage-brands">
					<div className="d-flex">
						<div className="position-relative">
							<img className='p-0' src="https://mcdn.coolmate.me/image/March2023/mceclip0_166.jpg" alt="" />
							<div className="homepage-brands-content position-absolute">
								<h2 className='content_h2'>84Rising*</h2>
								<p className='content_p'>Thương hiệu thời trang dành riêng cho giới trẻ bởi ElevenT</p>
								<div>
									<button className='border-radius fw-bold'>
										Khám phá ngay
									</button>
								</div>
							</div>
						</div>
						<div className="position-relative">
							<img src="https://mcdn.coolmate.me/image/March2023/mceclip3_13.jpg" alt="" />
							<div className="homepage-brands-content position-absolute">
								<h2 className='content_h2'>CM24</h2>
								<p className='content_p'>Thương hiệu chăm sóc cá nhân dành cho nam giới bởi Coolmate</p>
								<div>
									<button className='border-radius fw-bold'>
										Khám phá ngay
									</button>
								</div>
							</div>
						</div>
					</div>
				</div> */}
				<div className="homepage-hagstag">
					<div className="row">
						<div className="col-6">
							<p className='text-uppercase'>NƠI CUỘC HẸN TRÒN ĐẦY VỚI CÀ PHÊ ĐẶC SẢN, <br />MÓN ĂN ĐA BẢN SẮC VÀ KHÔNG GIAN CẢM HỨNG </p>
						</div>
						<div className="col-6 d-flex justify-content-around align-items-center">
							<div className="">
								<p className="hagstag-title">
									#SAICO
								</p>
							</div>
							<div className="">
								<p className='text-uppercase'>NƠI MỌI NGƯỜI XÍCH LẠI GẦN NHAU<br />đề cao giá trị kết nối con người</p>
							</div>
						</div>
					</div>
				</div>
				<div className="homepage-service">
					<div className="d-flex">
						<div className="position-relative">
							<img className='p-0' src="https://mcdn.coolmate.me/image/March2023/mceclip0_26.jpg" alt="" />
							<div className="homepage-service-content position-absolute d-flex justify-content-between align-items-center w-100">
								<span className='title'>Câu chuyện SAICO</span>
								<span className='title d-flex align-items-center'>
									<ArrowUpOutlined />
								</span>
							</div>
						</div>
						<div className="position-relative">
							<img src="https://mcdn.coolmate.me/image/March2023/mceclip1_16.jpg" alt="" />
							<div className="homepage-service-content position-absolute d-flex justify-content-between align-items-center w-100">
								<span className='title'>Dịch vụ hài lòng 100%</span>
								<span className='title d-flex align-items-center'>
									<ArrowUpOutlined />
								</span>
							</div>
						</div>
					</div>
				</div>
			</main>
		</>
	)
}