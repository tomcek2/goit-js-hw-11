import axios from 'axios';

const searchInput = document.querySelector('input[name="searchQuery"]');
const searchButton = document.querySelector('.button-submit');
const gallery = document.querySelector('.gallery');

async function searchPhoto(e) {
  e.preventDefault();
  const query = searchInput.value;
  if (query) {
    try {
      const response = await axios.get('https://pixabay.com/api/', {
        params: {
          key: '39394747-fa1f159daeb12a76c3032126a',
          q: query,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: 'true',
        },
      });
      const data = response.data;
      displayImages(data.hits);
    } catch (error) {
      console.log('Błąd podczas pobierania danych:', error);
    }
  } else {
    alert('Proszę wpisać frazę do wyszukiwania.');
  }
}

searchButton.addEventListener('click', searchPhoto);

//  Funkcja do tworzenie elemnetów strony  //
const createElement = ({
  type = 'div',
  classList = [],
  text = '',
  content = [],
  attributes = {},
}) => {
  const el = document.createElement(type);
  el.classList.add(...classList);
  if (text) {
    el.textContent = text;
  }
  if (content) {
    el.prepend(...content);
  }
  Object.entries(attributes).forEach(([key, value]) => {
    el.setAttribute(key, value);
  });
  return el;
};

function displayImages(images) {
  gallery.innerHTML = ''; // Czyszczenie galerii przed dodaniem nowych obrazków

  images.forEach(image => {
    // Tworzenie elementu karty obrazka
    const photoCard = createElement({
      type: 'div',
      classList: ['photo-card'],
      content: [
        createElement({
          type: 'img',
          attributes: {
            src: image.webformatURL,
            alt: image.tags,
            loading: 'lazy',
          },
        }),
        createElement({
          type: 'div',
          classList: ['info'],
          content: [
            createElement({
              type: 'p',
              classList: ['info-item'],
              text: image.likes,
              content: [
                createElement({
                  type: 'b',
                  text: 'Likes:',
                }),
              ],
            }),
            createElement({
              type: 'p',
              classList: ['info-item'],
              text: image.views,
              content: [
                createElement({
                  type: 'b',
                  text: 'Views:',
                }),
              ],
            }),
            createElement({
              type: 'p',
              classList: ['info-item'],
              text: image.comments,
              content: [
                createElement({
                  type: 'b',
                  text: 'Comments:',
                }),
              ],
            }),
            createElement({
              type: 'p',
              classList: ['info-item'],
              text: image.downloads,
              content: [
                createElement({
                  type: 'b',
                  text: 'Downloads:',
                }),
              ],
            }),
          ],
        }),
      ],
    });

    // Dodawanie karty do galerii
    gallery.append(photoCard);
  });
}
