import axios from 'axios';
import SimpleLightbox from 'simplelightbox'; // Zaimportuj bibliotekę SimpleLightbox
import 'simplelightbox/dist/simple-lightbox.min.css'; // Zaimportuj styl CSS dla SimpleLightbox

const searchInput = document.querySelector('input[name="searchQuery"]');
const searchButton = document.querySelector('.button-submit');
const gallery = document.querySelector('.gallery');

let currentPage = 1;
const perPage = 40; // Ilość zdjęć do pobrania na stronę
let totalHits = 0;
let lightbox; // Zmienna przechowująca instancję SimpleLightbox

async function photoFetch(query, page) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '39394747-fa1f159daeb12a76c3032126a',
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: page,
        per_page: perPage,
      },
    });

    const data = response.data;
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      alert(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      alert(`Hooray! We found ${totalHits} images.`);
      displayImages(data.hits);

      // Inicjalizuj SimpleLightbox po dodaniu nowych zdjęć do galerii
      if (!lightbox) {
        lightbox = new SimpleLightbox('.gallery a', {
          /* opcje konfiguracyjne */
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function createElement({
  type = 'div',
  classList = [],
  text = '',
  content = [],
  attributes = {},
}) {
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
}

function displayImages(images) {
  images.forEach(image => {
    const photoCard = createElement({
      type: 'div',
      classList: ['photo-card'],
      content: [
        createElement({
          type: 'a',
          attributes: {
            href: image.largeImageURL, // Ustaw href na duży obrazek
          },
          content: [
            createElement({
              type: 'img',
              attributes: {
                src: image.webformatURL,
                alt: image.tags,
                loading: 'lazy',
              },
            }),
          ],
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
          ],
        }),
      ],
    });

    gallery.appendChild(photoCard);
  });
}

function infiniteScroll() {
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;
  const bodyHeight = document.body.offsetHeight;
  const offset = 200; // Próg od końca strony do wczytania nowych zdjęć

  if (
    scrollY + windowHeight >= bodyHeight - offset &&
    gallery.children.length < totalHits
  ) {
    currentPage++;
    photoFetch(searchInput.value, currentPage);
  } else if (gallery.children.length >= totalHits) {
    infoText.textContent =
      "We're sorry, but you've reached the end of search results.";
  }
}
function photoSearch(e) {
  e.preventDefault();
  currentPage = 1; // Zresetuj stronę do pierwszej przy nowym wyszukiwaniu
  gallery.innerHTML = ''; // Wyczyść galerię przed nowymi wynikami
  const query = searchInput.value;
  if (query) {
    photoFetch(query, currentPage);
  } else {
    alert('Proszę wpisać frazę do wyszukiwania.');
  }
}

searchButton.addEventListener('click', photoSearch);

// Obsługa Infinite Scroll
window.addEventListener('scroll', infiniteScroll);
