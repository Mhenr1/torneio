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

      };
      reader.readAsDataURL(file)
    } else {
      alert('Por favor, solte apenas arquivos de imagem.');
    }
  }
}