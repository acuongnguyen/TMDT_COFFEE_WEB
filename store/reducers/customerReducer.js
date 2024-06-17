import actionTypes from "../actions/actionTypes";
const storedToken = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
const initialState = {
    isLoggedIn: !!storedToken,
    customerInfo: null,
    token: null
};

const customerReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.CUSTOMER_LOGIN_OR_REGISTER:
            return {
                ...state,
                isLoggedIn: true,
                customerInfo: action.customerInfo,
                token: storedToken
            };

        case actionTypes.CUSTOMER_LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                customerInfo: null,
                token: null
            };

        default:
            return state;
    }
};

export default customerReducer;