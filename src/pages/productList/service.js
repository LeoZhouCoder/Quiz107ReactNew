import request from '@/utils/request';

export async function getProducts(params) {
  return request('/api/getProducts', {
    method: 'POST',
    data: params,
  });
}
export async function addProduct(params) {
  return request('/api/addProduct', {
    method: 'POST',
    data: params,
  });
}
export async function editProduct(params) {
  return request('/api/editProduct', {
    method: 'POST',
    data: params,
  });
}
