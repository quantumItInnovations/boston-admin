const promotionReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        promotions: action.payload.promotions,
        loading: false,
      };
    case "FETCH_ADD_PROMOTION_SUCCESS":
      return {
        ...state,
        categories: action.payload.categories,
        subCategories: action.payload.subCategories,
        products: action.payload.products,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const viewPromotionReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, promotion: action.payload.promotion };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export { promotionReducer, viewPromotionReducer };
