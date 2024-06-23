import axios from 'axios';

const API_BASE_URL = 'https://twosportapiv2.azurewebsites.net/api/Product';

export const getProductList = (perPage = 15, sortBy = '') => {
  const url = `${API_BASE_URL}/list-products`;
  const params = {};
  if (sortBy) {
    params.perPage = 15;
    params.sortBy = sortBy;
  } else {
    params.perPage = 15;
    params.sortBy = '""';
  }
  return axios.get(url, {
    perPage,
    params,
    headers: {
      'accept': '*/*'
    }
  });
};
export const getProductById = (id) => {
  const url = `${API_BASE_URL}/get-product/${id}`;
  return axios.get(url, {
    headers: {
      'accept': '*/*'
    }
  });
};

export const getProductFilterBy = (brandIds, categoryIds, minPrice, maxPrice) => {
  const url = `${API_BASE_URL}/filter-sort-products`;
  const params = {};

  if (brandIds && brandIds.length > 0) {
    brandIds.forEach((id, index) => {
      params[`brandIds[${index}]`] = id;
    });
  }

  if (categoryIds && categoryIds.length > 0) {
    categoryIds.forEach((id, index) => {
      params[`categoryIds[${index}]`] = id;
    });
  }

  if (minPrice !== 0) {
    params.minPrice = minPrice;
  }
  if (maxPrice !== 0) {
    params.maxPrice = maxPrice;
  }
  return axios.get(url, {
    params,
    headers: {
      'accept': '*/*'
    }
  });
};


export const searchProducts = (keywords) => {
  const url = `${API_BASE_URL}/search-products`;
  return axios.get(url, {
    params: { keywords },
    headers: {
      'accept': '*/*'
    }
  });
};