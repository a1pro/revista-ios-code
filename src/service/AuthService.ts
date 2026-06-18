// services/authService.ts
import axios from 'axios';
import {Base_Url} from '../utils/ApiUrl';

export const loginUser = async (email: string, password: string) => {
  const response = await axios({
    method: 'POST',
    url: Base_Url.login,
    data: {
      email,
      password,
      guest_id: '1',
    },
  });
  return response.data;
};
