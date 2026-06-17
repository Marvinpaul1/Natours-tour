import axios from 'axios';
import { showAlert } from './alert';

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session endpoint from API
    const res = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // if (res.data.status === 'success') {
    //   const { authorization_url } = res.data.data;
    //   // 2) Redirect the user directly to the paystack secure checkout page
    // }
    window.location.href = res.data.data.authorization_url;
    console.log(res.data);
  } catch (err) {
    console.log(err);
    showAlert(
      'error',
      err.response?.data?.message || 'Something went wrong please try again',
    );
  }
};
