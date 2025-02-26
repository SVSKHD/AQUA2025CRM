import axios from "axios";

const BASE: string = "https://api.aquakart.co.in/v1";

export const categoryOperations = {
  getCatgories: async () => await axios.get(`${BASE}/allcategories`),

  //   createProduct: async (product: any, token: string) =>
  //     await axios.post(`${BASE}/create-product`, product, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }),

  //   updateProduct: async (product: any, token: string) =>
  //     await axios.put(`${BASE}/update-product`, product, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }),

  //   deleteProduct: async (productId: string, token: string) =>
  //     await axios.delete(`${BASE}/delete-product/${productId}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }),
};
