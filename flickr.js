const searchButton = document.getElementById('search_button');
const searchField = document.getElementById('search_text');
const mainElement = document.querySelector('main');
const overlay = document.getElementById('overlay');
const overlayImg = document.querySelector('#overlayy img');
const overlayTitle = document.querySelector('#overlay figcaption');

let currentPage = 1;
let isLoading = false;

searchButton.addEventListener('click', async () => {

    clearPage();

    loadPage();

})

const clearPage = () => {
    mainElement.innerHTML = '';
    currentPage = 1;
}

const loadPage = async () => {
    isLoading = true;
    //Fetch image from API
    const imageData = await getImages();

    // update UI, create images in a grid
    updateUI(imageData);

    isLoading = false;
}

const updateUI = (data) => {
    data.photos.photo.forEach(img => {
        const imgElement = document.createElement('img');
        imgElement.setAttribute('src', imgUrl(img, 'thumb'));
        imgElement.setAttribute('alt', img.title);

        imgElement.addEventListener('click', () => {
            openLightBox(img.title, imgUrl(img, 'large'));
        })
        mainElement.appendChild(imgElement);
    });
}

const openLightBox = (title, url) => {
    overlayImg.setAttribute('src', url);
    overlayImg.setAttribute('alt', title);

    overlayTitle.innerHTML = title;
    overlay.classList.toggle('show');



}
overlay.addEventListener('click', () => {
    overlay.classList.toggle('show');

})

const getImages = async () => {

    const baseUrl = 'https://www.flickr.com/services/rest';
    const method = 'flickr.photos.search';
    const text = searchField.value;
    const apiKey = '076b2338e575240ec735cee082c0b5b5';

    const url = `${baseUrl}?method=${method}&page=${currentPage}&text=${text}&api_key=${apiKey}&format=json&nojsoncallback=1`;

    const response = await fetch(url);
    const imageData = await response.json();

    return imageData;


}


const imgUrl = (img, size) => {
    let sizeSuffix = 'q';
    if(size == 'large') {sizeSuffix= 'b'};

    const url = `https://live.staticflickr.com/${img.server}/${img.id}_${img.secret}_${sizeSuffix}.jpg
    `
    return url;
}

const nextPage = async () => {
    currentpage++;

    loadPage();

}

window.addEventListener('scroll', () => {
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;

    if (scrollTop + ClientHeight >= scrollHeight) {
        if(!isLoading) {
            nextPage();
        }
    }
})