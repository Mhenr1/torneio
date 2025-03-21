const dropZone = document.getElementById('torneio');
const preview = document.getElementById('preview');

// Evita o comportamento padrão do navegador
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropZone.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

// Adiciona efeito visual ao arrastar sobre a área
['dragenter', 'dragover'].forEach(eventName => {
  dropZone.addEventListener(eventName, (e) => {

    target = e.target.closest("div");
    ancestor = target.closest(".column");
    if (!ancestor) {
      return
    }
    target.querySelector("figure").classList.add('hover')
  }, false);
});

['dragleave', 'drop'].forEach(eventName => {
  dropZone.addEventListener(eventName, (e) => {
    target = e.target.closest("div");
    ancestor = target.closest(".column");

    if (target.querySelector("figure"))
      target.querySelector("figure").classList.remove('hover')

  }, false);
});

// Manipula o arquivo solto
dropZone.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
  target = e.target.closest("div");
  ancestor = target.closest(".column");
  if (!ancestor) {
    return
  }

  const files = e.dataTransfer.files; // Pega os arquivos soltos
  if (files.length > 0) {
    const file = files[0]; // Pega o primeiro arquivo
    if (file.type.startsWith('image/')) { // Verifica se é uma imagem
      const reader = new FileReader(); // Cria um leitor de arquivos
      reader.onload = function (event) {
        target.querySelector("figure img").style.backgroundImage = "url(" + event.target.result + " ), url('./img/bg.png')"

        saveData();
      }
      reader.readAsDataURL(file)
    } else {
      alert('Por favor, solte apenas arquivos de imagem.');
    }
  }
}


function saveData() {
  store = [];
  document.querySelectorAll(".column").forEach((column) => {
    store.push(column.innerHTML);
  });
  localStorage.setItem("data", JSON.stringify(store));
}
function counter() {
  points = {
    left: 0,
    right: 0,
    total:0
  }
  document.querySelectorAll(".column")

    .forEach((column) => {
      side = column.classList[1]
      points[side] = column.querySelectorAll(".winner").length
      points.total = points.left + points.right;
      column.querySelector(".guild p").style.setProperty("--points", `" (${points[side]})"`)
    })
    localStorage.setItem("points", JSON.stringify(points));
    saveData();
}
function winner(){

  points = JSON.parse(localStorage.getItem("points"));
  if(points.total == 5){

    if(points.left > points.right){
      alert("Left side wins")
    }else{
      alert("Right side wins")
    }
  }
}
(() => {
  data = JSON.parse(localStorage.getItem("data"));
  if (data) {
    data.forEach((column, index) => {
      document.querySelectorAll(".column")[index].innerHTML = column;
    });
  }
  document.querySelectorAll("p ,figcaption").forEach(e => {

    e.addEventListener('click', function (event) {
      if (!event.ctrlKey) return

      e.contentEditable = true;
      e.focus();
      e.addEventListener('blur', function () {

        e.contentEditable = false;
        if (e.tagName == "P") {
          e.dataset.text = e.innerHTML;
        }
        saveData();
      });
    });


  });
  let round = document.querySelectorAll(".column div");
  Array.from(round).map((round) => {

    className = round.className;
    if (className.startsWith("round")) {
      round.addEventListener('click', function (event) {
        if (event.ctrlKey) return;
        roundNumber = round.classList[0];
        roundSelected = document.querySelectorAll(`.${roundNumber}`);
        if (round.classList.contains("winner")) {


          roundSelected.forEach(e => {
            e.classList.remove("winner");
            e.classList.remove("loser");
          })
          saveData();
          return;
        }

        roundSelected.forEach(e => {
          e.classList.remove("winner");
          e.classList.add("loser");
        })
        round.classList.add("winner");
        round.classList.remove("loser");
        saveData();
      });
    }
  });

  let side = document.querySelectorAll(".column");
  Array.from(side).map((side) => {
    side.addEventListener('click', function (event) {
      if (event.ctrlKey) return;

      counter();


    });
  });
})();
