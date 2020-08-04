const $ = require('jquery');
/**
 * es6 modules and imports
 */
import sayHello from './hello';

sayHello('World');

/**
 * require style imports
 */
// Retrieves Movie Info
const {getMovies} = require('./api.js');

// Generates Movies on Table with all info
getMovies().then((movies) => {
    console.log('Here are all the movies:');
    movies.forEach(({title, rating, year, genre, id}) => {
        console.log(`id#${id} - ${title} - rating: ${rating}`);
        $('#insertProducts').append(`<tr>
                      <td scope="row">${title}</td>
                      <td> ${rating} </td>
                      <td> ${genre}</td>
                      <td> ${year}</td>
                      </tr>`);
    });
}).catch((error) => {
    alert('Oh no! Something went wrong.\nCheck the console for details.');
    console.log(error);
});

// Adds Movie
$('#newMovieButton').click(function (event) {
    event.preventDefault();
    const movieName = $('#movieNameInput').val();
    const movieGenre = $('#addMovieGenre').val();
    const movieYear = $('#addMovieYear').val()
    const movieRating = $('#rating-hidden').val();
    $('#insertProducts').empty();

    // Stores Movies
    $.ajax("/api/movies", {
        type: "POST",
        data: {
            title: movieName,
            rating: movieRating,
            genre: movieGenre,
            year: movieYear
        }
    });

    // Updates Table
    getMovies().then((movies) => {
        console.log('Here are all the movies:');
        movies.forEach(({title, rating, year, genre, id}) => {
            console.log(`id#${id} - ${title} - rating: ${rating}`);
            $('#insertProducts').append(`<tr>
                      <td scope="row">${title}</td>
                      <td> ${rating} </td>
                      <td> ${genre}</td>
                      <td> ${year}</td>
                      </tr>`);
        });
    }).catch((error) => {
        alert('Oh no! Something went wrong.\nCheck the console for details.');
        console.log(error);
    });
});

// Binds Rating to Star Selection
function bindStarEvents() {
    [...document.querySelectorAll('span.star')].map(star => {
        star.addEventListener('click', e => {
            let clicked = e.currentTarget;
            let input = document.querySelector('#rating-hidden');
            input.value = clicked.getAttribute('data-star');
            [...document.querySelectorAll('span.star')].map(star => {
                let val = star.getAttribute('data-star');
                let active = val > input.value ? 'star' : 'star-active';
                star.classList.remove('star-active');
                star.classList.add(active);
            });
        });
    });
}
bindStarEvents();
