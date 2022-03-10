//create array of objects
//link photographers and media from .json
//compute total likes
//add 2 keys each photographer

async function fetchPhotographers() {
  const resp = await fetch('/data/photographers.json')
  /** @type {import('../../data/photographers').Data} */
  const photographersData = await resp.json()
  console.log(photographersData)
  return photographersData
}

/** @param {import('../../data/photographers').Data} photographersData */
function computePhotographers(photographersData) {
  const newPhotographers = []

  for (const photographer of photographersData.photographers) {
    const mediasTargeted = photographersData.media.filter(
      media => media.photographerId === photographer.id
    )

    const mediasTransformed = mediasTargeted.map(media => {
      return { ...media, userHasLiked: false }
    })

    //compute total likes
    let likes = 0
    for (const media of mediasTransformed) {
      likes += media.likes
    }

    //add 2 keys each photographer
    newPhotographers.push({
      ...photographer,
      likes: likes,
      medias: mediasTransformed,
    })
  }

  console.log(newPhotographers)
  return newPhotographers
}

function insertPhotographersIntoLocalStorage(photographers) {
  photographers.forEach(photographer => {
    localStorage.setItem(photographer.id, JSON.stringify(photographer))
  })
}

function isLocalStorageIsValid(newPhotographers) {
  const storageLength = localStorage.length
  //console.log(storageLength)
  const photographerLocalStorageKeys = []

  const photographersKeys = newPhotographers.map(photographer => {
    return photographer.id.toString()
  })

  for (let i = 0; i < storageLength; i++) {
    const keyPhotographer = localStorage.key(i)
    photographerLocalStorageKeys.push(keyPhotographer)
  }
  console.log('photographerLocalStorageKeys', photographerLocalStorageKeys)
  console.log('photographersKeys', photographersKeys)

  if (photographerLocalStorageKeys.length !== photographersKeys.length)
    return false

  for (const localStorageKey of photographerLocalStorageKeys) {
    if (!photographersKeys.includes(localStorageKey)) {
      return false
    } else {
      return true
    }
  }
}

function insertAllPhotographersIntoLocalStorage(photographersComputed) {
  for (const photographer of photographersComputed) {
    if (!localStorage.getItem(photographer.id)) {
      insertPhotographersIntoLocalStorage([photographer])
    }
  }
}

async function getPhotographers() {
  const photographersJSON = await fetchPhotographers()
  const photographersComputed = computePhotographers(photographersJSON)
  console.log('comment', localStorage)

  // vérifier s'il faut rajouter n nouveau photographe (si l'id n'est pas présent dans le local storage)
  // insére
  insertAllPhotographersIntoLocalStorage(photographersComputed)

  const isValid = isLocalStorageIsValid(photographersComputed)

  if (!isValid) {
    console.error('local storage error')
  }
  console.log(photographersComputed)
  return photographersComputed
}

async function getPhotographer(id) {
  const photographers = await getPhotographers()

  for (const photographer of photographers) {
    if (photographer.id === id) {
      return photographer
    }
  }

  return undefined
}
