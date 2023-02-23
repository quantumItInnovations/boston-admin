export const getError = (error) => {
  console.log(error);
  return error.response && error.response.data.error.message
    ? error.response.data.error.message
    : error.response;
};