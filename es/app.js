document.addEventListener('DOMContentLoaded', () => {
    const changeLanguageButton = document.querySelector('.change-language-button');
    changeLanguageButton.addEventListener('click', () => {
        const languageSelection = document.querySelector('.language-selection');
        languageSelection.classList.toggle('hidden');
        changeLanguageButton.appendChild(selection);
    });

    const refreshButton = document.querySelector('.refresh-button');
    refreshButton.addEventListener('click', () => {
        clearSongContainer(true);
    });

    let songs = [];
    const searchSongButton = document.querySelector('#searchSongButton');
    const searchSongInput = document.querySelector('#searchSongInput');
    const animation = document.querySelector('.animation');
    animation.addEventListener('click', () => {
        searchSongInput.focus();
    })

    searchSongButton.addEventListener('click', async () => {
        clearSongContainer(false);
        animation.classList.add('hidden');
        const songTitle = searchSongInput.value;

        fetch(`https://api.lyrics.ovh/suggest/${songTitle}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                songs = data.data;
                if (songs.length === 0) {
                    const notificationDiv = document.createElement('div');
                    // No songs found
                    notificationDiv.classList.add('alert', 'alert-danger');
                    notificationDiv.innerHTML = '<i class="fa-solid fa-music-note-slash"></i>¡No se encontraron canciones!';
                    document.body.appendChild(notificationDiv);

                    setTimeout(() => {
                        notificationDiv.remove();
                    }
                        , 3000);
                }

                for (let i = 0; i < songs.length; i++) {
                    const song = songs[i];
                    const card = makeSongCard(song);
                    const songContainer = document.querySelector('#songContainer');
                    songContainer.appendChild(card);
                }
            })
            .catch(err => {
                const notificationDiv = document.createElement('div');
                // No songs found
                notificationDiv.classList.add('alert', 'alert-danger');
                notificationDiv.innerHTML = '<i class="fa-solid fa-music-note-slash"></i>No songs found!';
                document.body.appendChild(notificationDiv);

                setTimeout(() => {
                    notificationDiv.remove();
                }
                    , 3000);
            });
    });
});

const clearSongContainer = (notification = false) => {
    const songContainer = document.querySelector('#songContainer');
    songContainer.innerHTML = '';
    const animation = document.querySelector('.animation');
    animation.classList.remove('hidden');
    if (notification) {
        const notificationDiv = document.createElement('div');
        // Successfully cleared container
        notificationDiv.classList.add('alert', 'alert-success');
        notificationDiv.innerText = 'Actualización realizada!';
        document.body.appendChild(notificationDiv);

        setTimeout(() => {
            notificationDiv.remove();
        }, 3000);
    }
}

const makeSongCard = (song) => {
    const card = document.createElement('div');
    card.classList.add('card');
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    const title = document.createElement('h5');
    title.classList.add('card-title');
    title.innerText = song.title;
    const artist = document.createElement('p');
    artist.classList.add('card-text');
    artist.innerText = song.artist.name;
    const album = document.createElement('p');
    album.classList.add('card-text');
    album.innerText = song.album.title;
    const albumCover = document.createElement('img');
    albumCover.classList.add('card-img-top');
    albumCover.src = song.album.cover;
    const linkToVideo = document.createElement('a');
    linkToVideo.classList.add('btn', 'btn-primary');
    linkToVideo.innerText = 'Listen';
    linkToVideo.href = song.link;
    linkToVideo.target = '_blank';
    linkToVideo.style.marginRight = '10px';
    cardBody.appendChild(title);
    cardBody.appendChild(artist);
    cardBody.appendChild(album);
    cardBody.appendChild(linkToVideo);
    card.appendChild(albumCover);
    card.appendChild(cardBody);
    return card;
}