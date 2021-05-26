const initial = { value: [] };

function connected_devices(state = initial, action) {
  switch (action.type) {
    case "add_connected_device":
      return { ...state, value: [action.value, ...state.value] } || state;
    case "remove_connected_device":
      return (
        {
          ...state,
          value: state.value.filter((item) => item.id !== action.value.id),
        } || state
      );
    case "delete_all_connected_devices":
      return initial;
    default:
      return state;
  }
}

export default connected_devices;
