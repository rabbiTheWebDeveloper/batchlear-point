import { api } from '@/lib';
import { getAuthHeaders } from '@/lib/auth';

export const deleteSlips = async (ids) => {
  const response = await api.post('/delete-slip', { ids }, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const completeSlips = async (ids) => {
  const response = await api.post('/complete-slip', { ids }, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const readyForPaymentSlips = async (ids) => {
  const response = await api.post('/ready-for-payment', { ids }, {
    headers: getAuthHeaders()
  });
  return response.data;
}; 