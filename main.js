console.log('Hello World!');

function changeColor(index) {
  const icons = document.querySelectorAll('.flaticon');
  icons.forEach(icon => {
    icon.classList.remove('active');
  });

  icons[index - 1].classList.add('active');
}

document.addEventListener('DOMContentLoaded', function () {
  // Adiciona um event listener para cada ícone na navbar
  var icons = document.querySelectorAll('nav ul li a');
  icons.forEach(function (icon) {
    icon.addEventListener('click', function (event) {
      event.preventDefault(); // Previne o comportamento padrão do link

      var sectionId = this.getAttribute('onclick').match(/\('.*?'\)/)[0].replace(/[()'"]/g, '');
      var contentSections = document.querySelectorAll('.content-section');

      // Esconde todos os conteúdos
      contentSections.forEach(function (section) {
        section.classList.remove('active');
      });

      // Mostra apenas o conteúdo correspondente ao ícone clicado
      document.getElementById(sectionId).classList.add('active');

      // Marca o ícone como ativo na navbar
      icons.forEach(function (icon) {
        icon.classList.remove('active');
      });
      this.classList.add('active');
    });
  });
});


