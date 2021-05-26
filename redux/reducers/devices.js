const initial = { value: [] };

function devices(state = initial, action) {
  switch (action.type) {
    case "add_device":
      return { ...state, value: [action.value, ...state.value] } || state;
    case "remove_device":
      return (
        {
          ...state,
          value: state.value.filter((item) => item.id !== action.value.id),
        } || state
      );
    case "delete_all_devices":
      return initial;
    default:
      return state;
  }
}

export default devices;
