import {
  GET_PRODUCTS,
  SELECT_PRODUCT,
  ADD_RECOMMEND,
  GET_RECOMMENDS,
  AWAIT_NEW_RECOMMEND_RESPONSE,
  RECEIVE_NEW_RECOMMEND_RESPONSE,
  RECOMMEND_DISPLAY_MESSAGE,
  RECOMMEND_DISPLAY_ERROR,
  AUTH_USER,
  AUTH_ERROR
} from './types';
import {browserHistory} from 'react-router';
import axios from 'axios';
import Firebase from 'firebase';

const LOCAL_SERVER_URL = 'http://localhost:5000';
const SERVER_URL = 'https://takethis-server.herokuapp.com';
const FIREBASE_URL = 'https://takethis-93203.firebaseio.com/';


const firebaseConfig = {
  apiKey: "AIzaSyBonhzdkZ6DeQYhSqSNLVjGfWlWGM6h9yI",
  authDomain: "takethis-93203.firebaseapp.com",
  databaseURL: "https://takethis-93203.firebaseio.com",
  storageBucket: "takethis-93203.appspot.com",
  messagingSenderId: "1036649018270"
};

Firebase.initializeApp(firebaseConfig);

const recommendsRef = Firebase.database().ref('recommends/');

export function getProducts(props) {
  const request = axios({
    method: 'POST',
    url: `${SERVER_URL}/products`,
    data: {
      "keyword": props.keyword,
      "category": props.category
    }
  })

  return {
    type: GET_PRODUCTS,
    payload: request
  }
}

export function selectProduct(props) {
  // console.log('action hit');
  // console.log(props);
  return {
    type: SELECT_PRODUCT,
    payload: props
  }
}

export function addRecommend(props) {
  // console.log('addRecommend hit');
  // console.log(props);
  return (dispatch, getState) => {
    const state = getState();
    console.log(state);
    dispatch({type: AWAIT_NEW_RECOMMEND_RESPONSE});
    recommendsRef.push(props, (error) => {
      dispatch({type: RECEIVE_NEW_RECOMMEND_RESPONSE})
      if (error) {
        dispatch({type: RECOMMEND_DISPLAY_ERROR, error: "Submission failed!"+error});
      } else {
        dispatch({type: RECOMMEND_DISPLAY_MESSAGE, message: "Submission posted!"});
        browserHistory.push('/')
      }
    })
  }
}

export function getRecommends() {
  return (dispatch, getState) => {
    recommendsRef.on("value", (snapshot) => {
      dispatch({
        type: GET_RECOMMENDS,
        payload: snapshot.val()
      })
    })
  }
}

export function signUpUserEmail(creds) {
  return (dispatch) => {
    Firebase.auth().createUserWithEmailAndPassword(creds.email, creds.password)
      .then((response) => {
        dispatch(authUser());
        browserHistory.push('/');
      })
      .catch((error) => {
        dispatch(authError(error));
      })
  }
}

export function signInUser(creds) {
  return (dispatch) => {
    Firebase.auth().signInWithEmailAndPassword(creds.email, creds.password)
      .then((response) => {
        dispatch(authUser());
        browserHistory.push('/');
      })
      .catch((error) => {
        dispatch(authError(error));
      })
  }
}

export function authUser() {
  return {
    type: AUTH_USER
  }
}

export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  }
}