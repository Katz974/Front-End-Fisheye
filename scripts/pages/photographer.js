//create array of objects
//link photographers and media from .json
//compute total likes
//add 2 keys each photographer
async function fetchPhotographers() {
  const resp = await fetch('/data/photographers.json')
  const photographersData = await resp.json()
  const photographers = []

  for (const photographer of photographersData.photographers) {
    const mediasTargeted = photographersData.media.filter(
      media => media.photographerID === photographer.id
    )

    //compute total likes
    let likes = 0
    for (const media of mediasTargeted) {
      likes += media.likes
    }

    //add 2 keys each photographer
    photographers.push({
      ...photographer,
      likes: likes,
      userHasLiked: false,
      medias: mediasTargeted,
    })
  }

  console.log(photographers)
  console.log(photographersData.photographers)

  return photographers
}

fetchPhotographers()

//store each photographer by id with the values in the local storage
async function getPhotographers() {
  if (localStorage.length === 0) {
    let photographers = await fetchPhotographers()
    photographers.forEach(element => {
      localStorage.setItem(element.id, JSON.stringify(element))
    })
  }
}

getPhotographers()
