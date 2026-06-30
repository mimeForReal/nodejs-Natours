import axios from 'axios';
import { showAlerts } from './alerts';

export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'data'
        ? 'http://127.0.0.1:8000/api/v1/users/updateme'
        : 'http://127.0.0.1:8000/api/v1/users/updatemypassword';
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });
    if (res.data.status === 'success') {
      document.querySelector('.form__user-photo').src =
        `/img/users/${res.data.data.updatedUser.photo}`;
      document.querySelector('.nav__user-img').src =
        `/img/users/${res.data.data.updatedUser.photo}`;
      showAlerts('success', `${type.toUpperCase()} updated successfully!`);
    }
  } catch (err) {
    showAlerts('error', err.response.data.message);
  }
};
