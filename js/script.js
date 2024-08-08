// Seleciona os elementos do DOM
const btnUploadImage = document.getElementById("btnUploadImage");
const inputFile = document.querySelector("input[type=file]");
const imgDisplay = document.querySelector(".image-container img");
const filterButtons = document.querySelectorAll(".filter-controls button");
const rangeInput = document.querySelector("input[type=range]");
const rangeValueDisplay = document.getElementById("rangeValueDisplay");
const btnResetFilters = document.getElementById("btnResetFilters");
const btnSave = document.getElementById("btnSave");

// Variáveis para controle de transformação da imagem
let rotationDegree = 0;
let verticalFlip = 1;
let horizontalFlip = 1;

// Armazena os filtros ativos
let activeFilter;
let filterSettings;

// Inicializa os componentes
btnResetFilters.onclick = () => initialize();

initialize();

function initialize() {
  // Configura os parâmetros dos filtros
  filterSettings = {
    Brilho: { value: 100, max: 200 },
    Contraste: { value: 100, max: 200 },
    Saturação: { value: 100, max: 200 },
    Cinza: { value: 0, max: 100 },
    Inversão: { value: 0, max: 100 },
  };

  rotationDegree = 0;
  verticalFlip = 1;
  horizontalFlip = 1;

  activeFilter = "Brilho";

  rangeValueDisplay.innerHTML = 100;
  rangeInput.max = 200;
  rangeInput.value = 100;

  imgDisplay.style.transform = "";
  imgDisplay.style.filter = "";

  document.querySelector(".active").classList.remove("active");
  document.getElementById("filterBrightness").classList.add("active");
}

// Adiciona evento de clique nos botões de filtro
filterButtons.forEach((button) => {
  button.onclick = () => {
    document.querySelector(".active").classList.remove("active");
    button.classList.add("active");

    activeFilter = button.innerHTML;

    rangeInput.max = filterSettings[activeFilter].max;
    rangeInput.value = filterSettings[activeFilter].value;

    rangeValueDisplay.innerHTML = rangeInput.value;
  };
});

// Aciona o input de arquivo ao clicar no botão de nova imagem
btnUploadImage.onclick = () => inputFile.click();

// Carrega a nova imagem selecionada
inputFile.onchange = () => loadNewImage();

function loadNewImage() {
  let file = inputFile.files[0];

  if (file) {
    imgDisplay.src = URL.createObjectURL(file);
  }

  initialize();
}

// Atualiza os filtros da imagem ao alterar o valor do range
rangeInput.oninput = () => {
  filterSettings[activeFilter].value = rangeInput.value;
  rangeValueDisplay.innerHTML = rangeInput.value;

  imgDisplay.style.filter = `
    brightness(${filterSettings["Brilho"].value}%) 
    contrast(${filterSettings["Contraste"].value}%) 
    saturate(${filterSettings["Saturação"].value}%) 
    grayscale(${filterSettings["Cinza"].value}%) 
    invert(${filterSettings["Inversão"].value}%)
  `;
};

// Manipula as transformações da imagem
function handleTransformation(type) {
  switch (type) {
    case "rotateRight":
      rotationDegree += 90;
      break;
    case "rotateLeft":
      rotationDegree -= 90;
      break;
    case "flipVertical":
      verticalFlip = verticalFlip === 1 ? -1 : 1;
      break;
    case "flipHorizontal":
      horizontalFlip = horizontalFlip === 1 ? -1 : 1;
      break;
  }

  imgDisplay.style.transform = `rotate(${rotationDegree}deg) scale(${verticalFlip}, ${horizontalFlip})`;
}

// Salva a imagem editada
btnSave.onclick = () => downloadImage();

function downloadImage() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = imgDisplay.naturalWidth;
  canvas.height = imgDisplay.naturalHeight;

  ctx.filter = `
    brightness(${filterSettings["Brilho"].value}%) 
    contrast(${filterSettings["Contraste"].value}%) 
    saturate(${filterSettings["Saturação"].value}%) 
    grayscale(${filterSettings["Cinza"].value}%) 
    invert(${filterSettings["Inversão"].value}%)
  `;

  ctx.translate(canvas.width / 2, canvas.height / 2);
  if (rotationDegree !== 0) ctx.rotate((rotationDegree * Math.PI) / 180);

  ctx.scale(verticalFlip, horizontalFlip);
  ctx.drawImage(
    imgDisplay,
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height
  );

  const link = document.createElement("a");
  link.download = "imagem_editada.png";
  link.href = canvas.toDataURL();
  link.click();
}