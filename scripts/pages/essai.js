async function fetchPhotographers() {
  const resp = await fetch('/data/photographers.json')
  const photographersData = await resp.json()
  const photographers = []

  for (const photographer of photographersData.photographers) {
    const mediasTargeted = photographersData.media.filter(
      media => media.photographersID === photographer.id
    )

    let likes = 0
    for (const media of mediasTargeted) {
      likes += media.likes
    }

    photographers.push({
      ...photographer,
      likes: likes,
      userHasLikes: false,
      medias: mediasTargeted,
    })
  }

  console.log(photographers)
  console.log(photographersData.photographers)

  return photographers
}

fetchPhotographers()

async function getPhotographers() {
  if (localStorage.length === 0) {
    let photographers = await fetchPhotographers()
    photographers.forEach(element => {
      localStorage.setItem(element.id, JSON.stringify(element))
    })
  }
}

getPhotographers()
