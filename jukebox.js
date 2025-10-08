const albums = [
  {
    "albumCover": "https://f4.bcbits.com/img/a3409719243_10.jpg",
    "albumUrl": "https://therealmightymagician.bandcamp.com/album/well-make-it-someday",
    "albumName": "We'll Make It Someday",
    "albumGenres": ["Instrumental Hip Hop", "Cloud Rap"],
    "albumDescription": "<i>We'll Make It Someday</i> de facto was my first full album. It is kind of a mess, i was relatively new to music making when i made it, but it still showcases some really cool hip hop beats with a light, airy touch."
  },
  {
    "albumCover": "https://f4.bcbits.com/img/a0251668676_10.jpg",
    "albumUrl": "https://therealmightymagician.bandcamp.com/album/assorted-machine-music",
    "albumName": "Assorted Machine Music",
    "albumGenres": ["Electronica", "IDM", "Drum and Bass"],
    "albumDescription": "One of my most creative projects for sure, with colorful songs ranging from techno to brazilian funk."
  },
  {
    "albumCover": "https://f4.bcbits.com/img/a4287340678_10.jpg",
    "albumUrl": "https://therealmightymagician.bandcamp.com/album/experiments-on-internet-brainrot-music",
    "albumName": "Experiments on Internet Brainrot Music",
    "albumGenres": ["Dariacore", "Mashcore"],
    "albumDescription": "Stripping anything that music has of objectively good and making a hyper parody of 00s/10s pop music. Copyright fears this album."
  },
  {
    "albumCover": "https://f4.bcbits.com/img/a0441114245_10.jpg",
    "albumUrl": "https://therealmightymagician.bandcamp.com/album/copper-wires-and-electricity-for-the-expression-of-nothing",
    "albumName": "Copper Wires for the Expression of Nothing",
    "albumGenres": ["Hardcore Electronic", "Breakcore"],
    "albumDescription": "Walls of distorted synthesizers and glitchy breakbeats create an experience that's equal parts disturbing and exciting."
  },
  {
    "albumCover": "https://f4.bcbits.com/img/a0437579972_10.jpg",
    "albumUrl": "https://therealmightymagician.bandcamp.com/album/another-night-at-the-comfort-of-home",
    "albumName": "Another Night at the Comfort of Home",
    "albumGenres": ["House", "Dream Trance", "Progressive Techno"],
    "albumDescription": "Inspired by The Field and Underworld — four songs flow seamlessly for an interstellar rave experience."
  },
  {
    "albumCover": "https://f4.bcbits.com/img/a3941614963_10.jpg",
    "albumUrl": "https://therealmightymagician.bandcamp.com/album/the-human-spirit",
    "albumName": "The Human Spirit",
    "albumGenres": ["Post-Rock", "Noise Rock", "Art Rock"],
    "albumDescription": "A twenty minute epic inspired by the growth of AI in music and the fear it imposes on creatives."
  },
  {
    "albumCover": "https://f4.bcbits.com/img/a4029652682_10.jpg",
    "albumUrl": "https://therealmightymagician.bandcamp.com/album/discomfort-says-it-all",
    "albumName": "Discomfort Says It All",
    "albumGenres": ["Alternative Rock", "Dream Pop"],
    "albumDescription": "An intimate rock record filled with confessional songs. Includes the 10-minute rager <i>‘Exhaustion (Let Me Rest)’</i>."
  },
  {
    "albumCover": "https://f4.bcbits.com/img/a4024084121_10.jpg",
    "albumUrl": "https://therealmightymagician.bandcamp.com/album/1982-volkswagen-passat-b1",
    "albumName": "1982 Volkswagen Passat B1",
    "albumGenres": ["Synthwave", "Retrowave"],
    "albumDescription": "A chill record about cars and racing. That's it."
  },
];

// Panel elements
const panelEl = document.getElementById("album-panel");
const backdropEl = document.getElementById("backdrop");
const btnClose = document.getElementById("panel-close");
const coverEl = document.getElementById("panel-cover");
const titleEl = document.getElementById("panel-title");
const genresEl = document.getElementById("panel-genres");
const linkEl = document.getElementById("panel-link");
const descriptionEl = document.getElementById("panel-description");

function openPanel(album) {
  coverEl.src = album.albumCover;
  coverEl.alt = `${album.albumName} cover`;
  titleEl.textContent = album.albumName;
  genresEl.textContent = album.albumGenres.join(", ");
  descriptionEl.innerHTML = album.albumDescription;
  linkEl.href = album.albumUrl;

  panelEl.classList.add("open");
  panelEl.setAttribute("aria-hidden", "false");
  backdropEl.classList.add("show");
  backdropEl.setAttribute("aria-hidden", "false");
}

function closePanel() {
  panelEl.classList.remove("open");
  panelEl.setAttribute("aria-hidden", "true");
  backdropEl.classList.remove("show");
  backdropEl.setAttribute("aria-hidden", "true");
}

btnClose.addEventListener("click", closePanel);
backdropEl.addEventListener("click", closePanel);

function createAlbumGrid() {
  const grid = document.getElementById("album-grid");
  albums.reverse().forEach(album => {
    const card = document.createElement("div");
    card.classList.add("album-card");
    card.innerHTML = `
      <img src="${album.albumCover}" alt="${album.albumName} cover" class="album-cover" />
      <h3 class="album-title">${album.albumName}</h3>
    `;
    card.addEventListener("click", () => openPanel(album));
    grid.appendChild(card);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  createAlbumGrid();
  document.body.classList.add("fade-in");
});
