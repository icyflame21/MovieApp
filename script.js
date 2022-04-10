let API_KEY = 'api_key=21f03053e26ab7eff71356d94e8eaca7';
let BASE_URL = 'https://api.themoviedb.org/3';
let API_URL =
  BASE_URL +
  '/trending/movie/day?' +
  API_KEY +
  '&language=en-US' +
  '&include_adult=false';
let IMG_URL = 'https://image.tmdb.org/t/p/w500/';
let SEARCH_URL = BASE_URL + '/search/movie?' + API_KEY + '&language=en-US';
let main = document.getElementById('main');
let form = document.getElementById('form');
var listresult = document.querySelector('.resultsList');
let search = document.querySelector('#search');

getMovies(API_URL);

form.addEventListener('submit', e => {
  e.preventDefault();
  let searchItem = search.value;
  if (searchItem) {
    getMovies(SEARCH_URL + '&query=' + searchItem + '&include_adult=false');
  } else {
    getMovies(API_URL);
  }
});
// Debouncing effect
let token = 0;
window.onload = () => {
  if (search.value.length == 0) {
    listresult.innerHTML = '';
  }
  search.onkeydown = event => {
    if (event.keyCode == 8 && search.value.length == 1) {
      listresult.innerHTML = '';
    }
    clearTimeout(token);
    if (search.value.trim().length === 0) {
      return;
    }
    token = setTimeout(() => {
      searchShow(search.value);
    }, 250);
  };
};
async function searchShow(query) {
  var res = await fetch(
    SEARCH_URL + '&query=' + query + '&include_adult=false'
  );
  var data = await res.json();
  // console.log(data.results);
  Render_results(data.results);
}

function Render_results(result) {
  listresult.innerHTML = '';
  result.forEach(movie => {
    const { title, poster_path } = movie;
    const searchEl = document.createElement('div');
    searchEl.classList.add('resultsList_items');
    searchEl.innerHTML = `<img
    src="${errorImg(poster_path)}"
    alt=""
  />
  <div class="Searchinfo">
    <h3>${title}</h3>
  </div>`;
    listresult.append(searchEl);
  });
}

var ignoreClickOnMeElement = document.getElementById('search');
document.addEventListener('click', function (event) {
  var isClickInsideElement = ignoreClickOnMeElement.contains(event.target);
  if (!isClickInsideElement) {
    //Do something click is outside specified element
    listresult.innerHTML = '';
  }
});

async function getMovies(url) {
  var res = await fetch(url);
  var data = await res.json();
  if (data.results.length == 0) {
    errorMsg();
  } else {
    showMovies(data.results);
  }
}
// let arr = localStorage.getItem('arr');
// if (arr == null) {
//   localStorage.setItem('arr', JSON.stringify([]));
// }

function showMovies(data) {
  main.innerHTML = '';
  data.forEach(movie => {
    const { title, poster_path, vote_average, overview } = movie;
    const movieEL = document.createElement('div');
    // movieEL.addEventListener('click', () => {
    //    location.href = 'http://127.0.0.1:5501/movies-debouncing/resultsDes.html';
    //   arr = JSON.parse(localStorage.getItem('arr'));
    //   arr.push(movie);
    //   localStorage.setItem('arr', JSON.stringify(arr));
    // });
    // var a = document.createElement('a');
    movieEL.classList.add('movie');
    movieEL.innerHTML = `
    <img
    src="${errorImg1(poster_path)}"
    alt="${title}"//>
  <div class="movieinfo">
    <h3>${title}</h3>
    <span class="${getColor(vote_average)}">${recommended(vote_average)}</span>
  </div>
  <div class="overview">
    <h3>Overview</h3>
    ${overview}
    </div>
    `;
    main.append(movieEL);
  });
}

function errorImg(banner) {
  if (banner === null) {
    return 'https://t4.ftcdn.net/jpg/03/08/68/19/240_F_308681935_VSuCNvhuif2A8JknPiocgGR2Ag7D1ZqN.jpg';
  } else return IMG_URL + banner;
}
function errorImg1(banner) {
  if (banner === null) {
    return 'https://images.unsplash.com/photo-1580265862291-4251b8c7e836?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80';
  } else return IMG_URL + banner;
}

function errorMsg() {
  document.body.innerHTML = `<div id="container">
<div class="content">
  <h2>404</h2>
  <h4>Oops! Page Not found</h4>
  <p>
    The page you were looking for doesn't exist.You may have mistyped the address or the image may have moved.
  </p>
  <a href="index.html">Back To Home</a>
</div>
</div>`;
  var container = document.getElementById('container');
  window.onmousemove = function (e) {
    var x = -e.clientX / 5,
      y = -e.clientY / 5;
    container.style.backgroundPositionX = x + 'px';
    container.style.backgroundPositionY = y + 'px';
  };
}

function getColor(vote) {
  if (vote >= 8) {
    return 'green';
  } else if (vote >= 5) {
    return 'orange';
  } else {
    return 'red';
  }
}

function recommended(vote) {
  if (vote > 8.5) {
    return 'Recommended';
  } else return vote;
}
