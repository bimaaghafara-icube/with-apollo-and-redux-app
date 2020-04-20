import { createStore } from 'redux'

// initial state
const initialState = {
  chartProducts: []
};

const latestChartProducts = (chartProducts, payload) => {
  const index = chartProducts.findIndex(el => el.id === payload.product.id);
  if (index < 0) {
    chartProducts.push({...payload.product, count: payload.count})
  } else {
    chartProducts[index].count = Number(chartProducts[index].count) + Number(payload.count);
  }
  return chartProducts
}

// reducer
const reducer = (state = initialState, action) => {
  // debugger
  switch (action.type) {
    case 'ADD_PRODUCT_TO_CHART':
      return {
        ...state,
        chartProducts: latestChartProducts(state.chartProducts, action.payload)
      }
    default:
      return state
  }
};

// const initialState = {
//   lastUpdate: 0,
//   light: false,
//   count: 0,
// }

// const reducer = (state = initialState, action) => {
//   switch (action.type) {
//     case 'TICK':
//       return {
//         ...state,
//         lastUpdate: action.lastUpdate,
//         light: !!action.light,
//       }
//     case 'INCREMENT':
//       return {
//         ...state,
//         count: state.count + 1,
//       }
//     case 'DECREMENT':
//       return {
//         ...state,
//         count: state.count - 1,
//       }
//     case 'RESET':
//       return {
//         ...state,
//         count: initialState.count,
//       }
//     default:
//       return state
//   }
// }

export const initializeStore = (preloadedState = initialState) => {
  return createStore(reducer, preloadedState)
}
