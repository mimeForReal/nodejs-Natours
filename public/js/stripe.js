import axios from 'axios';
import { showAlerts } from './alerts';

export const bookTour = async (tourId) => {
  try {
    const res = await axios(
      `http://127.0.0.1:8000/api/v1/bookings/checkout/${tourId}`,
    );
    window.location.href = res.data.session.url;
  } catch (err) {
    showAlerts('error', err.message);
  }
};
