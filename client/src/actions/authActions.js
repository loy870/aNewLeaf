import { GET_ERRORS, SET_CURRENT_USER } from './types';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';
//register user

export const registerUser = (userData, history) => (dispatch) => {
	axios.post('/api/users/register', userData).then((res) => history.push('/login')).catch((err) =>
		dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		})
	);
};

//Login get user token
export const loginUser = (userData) => (dispatch) => {
	axios
		.post('/api/users/login', userData)
		.then((res) => {
			//save token to local storage
			const token = res.data.token;

			localStorage.setItem('jwtToken', token);

            setAuthToken(token);
            const decoded = jwt_decode(token);

            //set current user
            dispatch(setCurrentUser(decoded));
		})
		.catch((err) =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		);
};
 
//set logged in user
export const setCurrentUser = (decoded) => {
    return{
        type: SET_CURRENT_USER,
        payload: decoded
    }
}

//log user out
export const userLogout = () => dispatch => {
	localStorage.removeItem('jwtToken');
	//remove auth header and set authenticated to false
	dispatch(setCurrentUser({}));
}
