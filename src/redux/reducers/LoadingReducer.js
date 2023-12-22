export const LoadingReducer = (prevState = { isLoading: false }, action) => {
  // console.log(action)
  let { type, payload } = action
  switch (type) {
    case 'change_loading':
      return { ...prevState, isLoading: payload }
    default:
      return prevState
  }
}
