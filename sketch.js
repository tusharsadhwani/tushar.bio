let toggle1 = document.getElementById("checkbox1")
let toggle2 = document.getElementById("checkbox2")
let toggle3 = document.getElementById("checkbox3")

function check1() {
    if (toggle2.checked && toggle3.checked) {
      Math.random() > 0.5 ? toggle2.checked = false : toggle3.checked = false;
    }
}
function check2() {
    if (toggle1.checked && toggle3.checked) {
      Math.random() > 0.5 ? toggle1.checked = false : toggle3.checked = false;
    }
}
function check3() {
    if (toggle1.checked && toggle2.checked) {
      Math.random() > 0.5 ? toggle1.checked = false : toggle2.checked = false;
    }
}
toggle1.onchange = check1;
toggle2.onchange = check2;
toggle3.onchange = check3;
