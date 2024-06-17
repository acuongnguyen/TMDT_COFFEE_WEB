import actionTypes from "./actionTypes";

export const customerLoginOrRegister = (customerInfo) => {
    const storedToken = localStorage.getItem('tokenU');
    return {
        type: actionTypes.CUSTOMER_LOGIN_OR_REGISTER,
        customerInfo: customerInfo,
        token: storedToken,
    }
}

export const customerLogOut = () => {
    localStorage.removeItem('tokenU');
    return {
        type: actionTypes.CUSTOMER_LOGOUT
    }
}