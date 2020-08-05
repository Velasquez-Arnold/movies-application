const $ = require('jquery');
// const {deleteMovie} = require('./api.js');
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
const renderMovies = function() {
    getMovies().then((movies) => {
        console.log('Here are all the movies:');
        movies.forEach(({title, image, rating, year, genre, id}) => {
            console.log(`id#${id} - ${title} - rating: ${rating}`);
            $('#insertProducts').append(`<tr>
                      <td scope="row"> ${id} </td>
                      <td>${title}</td>
                      <td><img class="movie-poster" src="${image}" alt=""></td>
                      <td> ${rating} </td>
                      <td> ${genre}</td>
                      <td> ${year}</td>
                      <td><a href="#" class="deleteMovieButton" data-id="${id}"><img class="trash-icon" src="img/cute-trash-can.png" alt="cute lil trashcan"></a></td>
                      </tr>`);
        });
    }).catch((error) => {
        alert('Oh no! Something went wrong.\nCheck the console for details.');
        console.log(error);
    });
}

//Initial movie rendering
renderMovies()

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
    })
// Updates Table using callback function
        .done(renderMovies);
});


//Edit Movie Start
$('#editMovieButton').click(function () {
    const movieID = $('#editMovieId');
    const newMovieName = $('#editMovieName');
    const newMovieGenre = $('#editMovieGenre');
    const newMovieYear = $('#editMovieYear');
    const newMovieRating = $('#edit-rating-hidden');
    const moviePost = {
        id: movieID.val(),
        title: newMovieName.val(),
        rating: newMovieRating.val(),
        genre: newMovieGenre.val(),
        year: newMovieYear.val()
    };
    console.log(moviePost);
    const url = '/api/movies/' + movieID.val();
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(moviePost),
    };
    fetch(url, options).then(response => response.json());
    $('#insertProducts').empty();
// Updates Table using callback function
    renderMovies();

});


// //Delete movie button

$(document).on("click", '.deleteMovieButton', function () {
console.log('test')
    $.ajax({
        url: `/api/movies/${$(this).attr('data-id')}`,
        type: "DELETE",
        dataType: "json",
    })
        .done(location.reload());
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

function editStarEvents() {
    [...document.querySelectorAll('span.editStar')].map(editStar => {
        editStar.addEventListener('click', e => {
            let clicked = e.currentTarget;
            let input = document.querySelector('#edit-rating-hidden');
            input.value = clicked.getAttribute('data-edit-star');
            [...document.querySelectorAll('span.editStar')].map(editStar => {
                let val = editStar.getAttribute('data-edit-star');
                let active = val > input.value ? 'editStar' : 'editStar-active';
                editStar.classList.remove('editStar-active');
                editStar.classList.add(active);
            });
        });
    });
}
editStarEvents();
