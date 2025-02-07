const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');
console.log(productId);

if (productId) {
  const productDetailsUrl = `https://japceibal.github.io/emercado-api/products/${productId}.json`;
  console.log(productDetailsUrl);
  const productCommentsUrl = `https://japceibal.github.io/emercado-api/products_comments/${productId}.json`;
  function cargarComentarios (product) {
    fetch(productCommentsUrl)
      .then(response => response.json())
      .then(comments => {
        const commentsContainer = document.getElementById('comments-container');
        comments.forEach(comment => {
          const commentDiv = document.createElement('div');
          commentDiv.classList.add('comment');
          const scoreElement = document.createElement('div');
          scoreElement.textContent = `Puntuación: ${comment.score} estrellas`;

          const userElement = document.createElement('div');
          userElement.textContent = `Usuario: ${comment.user}`;

          const dateElement = document.createElement('div');
          dateElement.textContent = `Fecha: ${comment.dateTime}`;

          commentDiv.appendChild(scoreElement);
          commentDiv.appendChild(userElement);
          commentDiv.appendChild(dateElement);
          commentDiv.appendChild(document.createElement('hr'));

          commentsContainer.appendChild(commentDiv);
        });
      })
      .catch(error => {
        console.error('Error al obtener comentarios:', error);
      });
  }

  fetch(productDetailsUrl)
    .then(response => response.json())
    .then(product => {
      const titleElement = document.getElementById('product-title');
      const descriptionElement = document.getElementById('product-description');
      const costElement = document.getElementById('product-cost');
      const soldCountElement = document.getElementById('product-soldCount');
      const categoryElement = document.getElementById('product-category');
      const relatedProductsContainer = document.getElementById('related-products');
      titleElement.textContent = product.name;
      descriptionElement.textContent = product.description;
      costElement.textContent = `Precio: ${product.cost} ${product.currency}`;
      soldCountElement.textContent = `Vendidos: ${product.soldCount}`;
      categoryElement.textContent = `Categoría: ${product.category}`;

      const carouselInner = document.querySelector('#imageCarousel .carousel-inner');

      // Limpia el carrusel actual
      carouselInner.innerHTML = '';

      // Agrega las imágenes al carrusel y la imagen principal
      product.images.forEach((imageUrl, index) => {
        const slideDiv = document.createElement('div');
        slideDiv.classList.add('carousel-item');
        if (index === 0) {
          slideDiv.classList.add('active'); // La primera imagen se establece como activa
        }

        const image = document.createElement('img');
        image.src = imageUrl;
        image.alt = 'Imagen de producto';
        image.classList.add('d-block', 'w-100'); // Estilos de Bootstrap

        slideDiv.appendChild(image);
        carouselInner.appendChild(slideDiv);
      });

      product.relatedProducts.forEach(relatedProduct => {
        const relatedProductElement = document.createElement('div');
        relatedProductElement.classList.add("col-md-6");
        relatedProductElement.innerHTML = `
          <h3>${relatedProduct.name}</h3>
          <img src="${relatedProduct.image}" alt="${relatedProduct.name}">
        `;
        relatedProductsContainer.appendChild(relatedProductElement);
      });
      cargarComentarios(product);

      // ...
    })
    .catch(error => {
      console.error('Error al obtener detalles del producto:', error);
    });

} else {
  console.error('ID de producto no válido.');
}

// Comentarios
const commentForm = document.getElementById('comment-form');
commentForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const commentText = document.getElementById('comment').value;
  const rating = document.getElementById('rating').value;

  if (rating < 1 || rating > 5) {
    alert('La puntuación debe estar entre 1 y 5.');
    return;
  }

  const currentUser = localStorage.getItem('currentUser');
  const currentDateTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

  const commentsContainer = document.getElementById('comments-container');
  const commentDiv = document.createElement('div');
  commentDiv.classList.add('comment');
  const scoreElement = document.createElement('div');
  scoreElement.textContent = `Puntuación: ${rating} estrellas`;
  const userElement = document.createElement('div');
  userElement.textContent = `Usuario: ${currentUser}`;
  const dateElement = document.createElement('div');
  dateElement.textContent = `Fecha: ${currentDateTime}`;
  const commentTextElement = document.createElement('div');
  commentTextElement.textContent = `Comentario: ${commentText}`;
  commentDiv.appendChild(scoreElement);
  commentDiv.appendChild(userElement);
  commentDiv.appendChild(dateElement);
  commentDiv.appendChild(commentTextElement);
  commentDiv.appendChild(document.createElement('hr'));
  commentsContainer.appendChild(commentDiv);
  document.getElementById('comment').value = '';
  document.getElementById('rating').value = '';

  alert('Comentario agregado con éxito. (Este mensaje es solo para demostración, no se envía al servidor)');
});