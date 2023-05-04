const quantityReducer = (state, action) => {
    switch (action.type) {
      case "FETCH_REQUEST":
        return { ...state, loading: true };
      case "FETCH_SUCCESS":
        return {
          ...state,
          quantities: action.payload.quantities,
          quantityCount: action.payload.quantityCount,
          filteredQuantityCount: action.payload.filteredQuantityCount,
          loading: false,
        };
      case "FETCH_FAIL":
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  const viewQuantityReducer = (state, action) => {
    switch (action.type) {
      case "FETCH_REQUEST":
        return { ...state, loading: true };
      case "FETCH_SUCCESS":
        return { ...state, loading: false, quantity: action.payload.quantity };
      case "FETCH_FAIL":
        return { ...state, loading: false, error: action.payload };
  
      default:
        return state;
    }
  };
  
  export { quantityReducer, viewQuantityReducer };
  