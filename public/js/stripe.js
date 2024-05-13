/* eslint-disable */
import axios from 'axios';
const stripe = Stripe('pk_test_51OtKC6J52yGuQmE3SVXK7dypXANa46jlX2NTnuPTp0nSbz6e3wdu1tGVGyWxSX9BzxkJSR7o6ScgZaLwGxUk5jQE00f0xrPCD6');

export const bookTour = async tourId => {
    // 1) Get checkout session from API
    const session = await axios(
        `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);

    // 2) Create checkout form + charge credit card
}