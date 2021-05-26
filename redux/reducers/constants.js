import color from "color";

const initial = {
  colors: {
    primary: color("#488aff").lighten(0.2).hex(),
    secondary: "#32db64",
    danger: "#f53d3d",
    light: "#f4f4f4",
    dark: "#161616",
    maincolor: "#17958c",
  },
};

function constants(state = initial, action) {
  switch (action.type) {
    default:
      return state;
  }
}

export default constants;
