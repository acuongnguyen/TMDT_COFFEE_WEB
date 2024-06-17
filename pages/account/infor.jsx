import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { Form, Select } from 'antd';
import AccountSidebar from '@/components/AccountSidebar'
import Input from '@/components/Input'
import { swtoast } from '@/mixins/swal.mixin'
import { customerLoginOrRegister } from '@/store/actions/customerActions'
import { backendAPI } from '@/config'

const CustomerInfoPage = () => {
    const dispatch = useDispatch()
    const [customerName, setCustomerName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const customerInfo = useSelector((state) => state.customer.customerInfo);
    const [cities, setCities] = useState('');
    const [districts, setDistricts] = useState('');
    const [wards, setWards] = useState('');
    const [selectedCities, setSelectedCities] = useState('');
    const [selectedDistricts, setSelectedDistricts] = useState('');
    const [selectedWards, setSelectedWards] = useState('');
    const [note, setNote] = useState('');
    const token = localStorage.getItem('tokenU');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json');
                setCities(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        customerInfo != null ? setCustomerName(customerInfo.customer_name) : setCustomerName('')
        customerInfo != null ? setPhoneNumber(customerInfo.phone_number) : setPhoneNumber('')
    }, [customerInfo])

    const handleUpdate = async () => {
        if (validate()) {
            try {
                let address = {
                    name: customerName,
                    city: selectedCities.Name,
                    district: selectedDistricts.Name,
                    ward: selectedWards.Name,
                    note: note,
                    phone: phoneNumber,
                }
                const response = await axios.post(`${backendAPI}/api/app/address/create-address`, address, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                let customerInfo = {
                    customer_name: customerName,
                    phone_number: response.data.data.phone,
                }
                dispatch(customerLoginOrRegister(customerInfo));
                swtoast.success({ text: "Cập nhật tài khoản thành công" });
            } catch (err) {
                console.log(err);
                swtoast.error({
                    text: "Có lỗi khi cập nhật tài khoản vui lòng thử lại!"
                });
            }
        }
    }

    const handleCityChange = (value) => {
        const selectedCity = cities.find(city => city.Id === value);
        setSelectedCities(selectedCity)
        if (selectedCity) {
            setDistricts(selectedCity.Districts || []);
            setWards([]);
        } else {
            setDistricts([]);
            setWards([]);
        }
    };

    const handleDistrictChange = (value) => {
        const selectedDistrict = districts.find(district => district.Id === value);
        setSelectedDistricts(selectedDistrict)
        if (selectedDistrict) {
            setWards(selectedDistrict.Wards || []);
        } else {
            setWards([]);
        }
    };

    const handleWardChange = (value) => {
        const selectedWard = wards.find(ward => ward.Id === value);
        setSelectedWards(selectedWard);
    };


    const validate = () => {
        if (!customerName) {
            swtoast.error({ text: "Tên người dùng không được để trống" })
            return false
        }
        if (!phoneNumber) {
            swtoast.error({ text: "Số điện thoại không được để trống" })
            return false
        }
        if (!cities || !districts || !wards) {
            swtoast.error({ text: "Địa chỉ không được để trống" })
            return false
        }
        return true
    }

    return (
        <div className="account-infor row">
            <div className="col-4">
                <AccountSidebar />
            </div>
            <div className="col-8">
                <div className="infor-tab">
                    <div className="title">
                        Thông tin nhận hàng
                    </div>
                    <div className="infor-tab-item col-12 row d-flex align-items-center">
                        <div className="col-3">Họ tên</div>
                        <div className="col-7">
                            <Input
                                type="text"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                placeholder='Họ và tên của bạn'
                            />
                        </div>
                    </div>
                    <div className="infor-tab-item col-12 row d-flex align-items-center">
                        <div className="col-3">Số điện thoại</div>
                        <div className="col-7">
                            <Input
                                type="text"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder='Số điện thoại'
                            />
                        </div>
                    </div>
                    <div className="infor-tab-item col-12 row d-flex align-items-center">
                        <div className="col-3">Địa chỉ</div>
                        <div className="col-7">
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexDirection: 'column' }} className="rounded-xl">
                                <Select className="form-select form-select-sm custom-select" onChange={handleCityChange}>
                                    <Option value="" disabled >
                                        Chọn tỉnh thành
                                    </Option>
                                    {cities && cities.map(city => (
                                        <Option key={city.Id} value={city.Id}>
                                            {city.Name}
                                        </Option>
                                    ))}
                                </Select>
                                <Select className="form-select form-select-sm custom-select" onChange={handleDistrictChange}>
                                    <Option value="" disabled>
                                        Chọn quận huyện
                                    </Option>
                                    {districts && districts.map(district => (
                                        <Option key={district.Id} value={district.Id}>
                                            {district.Name}
                                        </Option>
                                    ))}
                                </Select>
                                <Select className="form-select form-select-sm custom-select" onChange={handleWardChange}>
                                    <Option value="" disabled>
                                        Chọn phường xã
                                    </Option>
                                    {wards && wards.map(ward => (
                                        <Option key={ward.Id} value={ward.Id}>
                                            {ward.Name}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className="infor-tab-item col-12 row d-flex align-items-center">
                        <div className="col-3">Địa chỉ cụ thể</div>
                        <div className="col-7">
                            <Input
                                type="text"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder='Địa chỉ cụ thể'
                            />
                        </div>
                    </div>
                    <div className="infor-tab-item col-12 row d-flex align-items-center">
                        <div className="col-3">
                            <button className='update-account-btn border-radius' onClick={handleUpdate}>Thêm địa chỉ mới</button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default CustomerInfoPage