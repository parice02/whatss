const initial = { value: [] };
/* 
conversations = [
  { 
  sender: {}, 
  receiver:{}, 
  is_sent: false, 
  recieved_date: "",
  sent_date: "",
  message: "", 
  is_read:false
}
]; */

function conversations(state = initial, action) {
  switch (action.type) {
    case "add_conversation":
      return { ...state, value: [action.value, ...state.value] } || state;
    case "delete_all_conversations":
      return initial;
    default:
      return state;
  }
}

export default conversations;
