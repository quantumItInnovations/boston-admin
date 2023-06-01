const faqReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      const keyVal = Object.entries(action.payload.faqs);
      return {
        ...state,
        faqs: keyVal.map(([k, v]) => v).flat(1),
        filteredFaqCount: action.payload.filteredFaqCount,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const viewFaqReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, faq: action.payload.faq };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export { faqReducer, viewFaqReducer };
