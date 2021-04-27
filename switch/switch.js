const switch1 = document.getElementById("switch1");
const switch2 = document.getElementById("switch2");
const switch3 = document.getElementById("switch3");

const onSwitch = (event) => {
  if (switch1.checked && switch2.checked && switch3.checked) {
    const switches = [switch1, switch2, switch3].filter((sw) => sw != event.target);
    console.log({ switches });
    const [switch_a, switch_b] = switches;

    if (Math.random() > 0.5) switch_a.checked = false;
    else switch_b.checked = false;
  }
};
