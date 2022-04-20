async function fetchPhotographers() {
  const resp = await fetch('/data/photographers.json')
  const photographersData = await resp.json()
  // console.log(photographersData)
  return photographersData
}

/**
//  * @param {import('../../data/photographers').Photographer} data
  */

function photographerFactory(data) {
  const { name, portrait, city, tagline, price, id } = data

  const likes = data.medias.reduce((acc, media) => {
    console.log(media)
    acc += media.likes
    return acc
  }, 0)

  const picture = `Sample Photos/Photographers ID Photos/${portrait}`

  const stickBox = document.createElement('div')
  stickBox.classList.add('stickBox')
  const photographerMain = document.getElementById('photographer-main')
  photographerMain?.appendChild(stickBox)

  const photographerLikesInStickBox = document.createElement('label')
  photographerLikesInStickBox.classList.add('photographerLikesInStickBox')
  stickBox.appendChild(photographerLikesInStickBox)

  photographerLikesInStickBox.innerHTML = likes + '   '

  const heartInStickyBox = document.createElement('div')
  heartInStickyBox.classList.add('heartInStickyBox')
  heartInStickyBox.classList.add('fa-heart')
  heartInStickyBox.classList.add('fa-solid')
  photographerLikesInStickBox.appendChild(heartInStickyBox)

  const dayPrice = document.createElement('label')
  dayPrice.classList.add('dayPrice')
  stickBox.appendChild(dayPrice)
  dayPrice.innerHTML = data.price + '€ / jour'

  /**
   * Render photos grid
   */
  function renderMediasGrid() {
    const div = document.createElement('div')

    data.medias.forEach(media => {
      const isImg = !!media.image
      const isVideo = !!media.video
      const mediaURL = isImg
        ? `/Sample Photos/${name}/${media.image}`
        : `/Sample Photos/${name}/${media.video}`

      const encodedMediaURL = encodeURI(mediaURL)
      console.log(encodedMediaURL)

      if (!isImg && !isVideo) {
        return
      }
      const article = document.createElement('article')
      // article.textContent = mediaURL
      article.classList.add('picBox')

      if (!isVideo) {
        const image = document.createElement('img')
        image.setAttribute('src', encodedMediaURL)
        article.appendChild(image)
        div.appendChild(article)
      }

      if (!isImg) {
        const video = document.createElement('video')
        video.setAttribute('src', encodedMediaURL)
        article.appendChild(video)
        div.appendChild(article)
      }

      const divContainer = document.createElement('div')
      article.appendChild(divContainer)
      divContainer.classList.add('picLegend')

      const label = document.createElement('label')
      label.textContent = media.title
      divContainer.appendChild(label)

      const numberOfLikes = document.createElement('div')
      numberOfLikes.classList.add('numberOfLikes')
      numberOfLikes.innerHTML = media.likes
      divContainer.appendChild(numberOfLikes)

      function countClicksOnHeart() {
        // Retrieve the photographer owning the current media
        const photographer = JSON.parse(
          localStorage.getItem(media.photographerId)
        )

        // Update the media
        let userHasLiked = false
        for (let i = 0; i < photographer.medias.length; i++) {
          if (photographer.medias[i].id === media.id) {
            userHasLiked = !photographer.medias[i].userHasLiked
            photographer.medias[i].userHasLiked = userHasLiked
            photographer.medias[i].likes += userHasLiked ? 1 : -1
            numberOfLikes.innerHTML = photographer.medias[i].likes

            break
          }
        }

        // Save back the photographer
        localStorage.setItem(media.photographerId, JSON.stringify(photographer))

        // console.log(media)
        // console.log(photographer)

        // Update UI
        if (userHasLiked) {
          heartI.classList.add('fa-solid')
          heartI.classList.remove('fa-regular')
        } else {
          heartI.classList.add('fa-regular')
          heartI.classList.remove('fa-solid')
        }
      }

      const heartBut = document.createElement('button')
      const heartButId = media.id
      heartBut.type = 'button'
      heartBut.classList.add('heartBut')
      heartBut.addEventListener('click', countClicksOnHeart)

      heartBut.id = heartButId

      divContainer.appendChild(heartBut)

      // document
      //   .getElementById(heartButId)
      //   .addEventListener('click', countClicksOnHeart)

      // const heartId = document.getElementById(media.id)
      // heartId.addEventListener('click', countClicksOnHeart)
      // heartBut.onclick = function () {
      //   media.userHasLiked = true
      //   media.likes += 1
      // }

      // heartBut.addEventListener('click', countClicksOnHeart)
      // heartBut.onclick = countClicksOnHeart

      const heartI = document.createElement('i')

      heartI.classList.add('fa-heart')
      // console.table(media)
      if (media.userHasLiked) {
        heartI.classList.add('fa-solid')
        heartI.classList.remove('fa-regular')
      } else {
        heartI.classList.add('fa-regular')
        heartI.classList.remove('fa-solid')
      }

      heartBut.appendChild(heartI)
    })

    return div
  }

  function getUserCardDOM() {
    const article = document.createElement('article')

    const linkCard = document.createElement('a')
    article.appendChild(linkCard)
    linkCard.setAttribute('id', 'toPhotographerPage')
    const href = `/photographer.html?id=${id}`
    linkCard.setAttribute('href', href)

    const divPhoto = document.createElement('div')
    divPhoto.classList.add('photographerPic')
    linkCard.appendChild(divPhoto)

    const img = document.createElement('img')
    img.setAttribute('src', picture)
    divPhoto.appendChild(img)

    const h2 = document.createElement('h2')
    h2.textContent = name
    linkCard.appendChild(h2)

    const place = document.createElement('p')
    place.textContent = city
    place.classList.add('city')
    article.appendChild(place)

    const punchLine = document.createElement('p')
    punchLine.textContent = tagline
    punchLine.classList.add('tagline')
    article.appendChild(punchLine)

    const howMuch = document.createElement('p')
    howMuch.textContent = price + '€/jour'
    howMuch.classList.add('pricePerDay')
    article.appendChild(howMuch)

    return article
  }

  function renderPageHeader(displayModal) {
    const { name, portrait, city, country, tagline } = data
    // console.log(data)
    const picture = `/Sample Photos/Photographers ID Photos/${portrait}`

    const article = document.createElement('article')
    article.classList.add('photographer-idCard-global')

    const divIdPhoto = document.createElement('div')
    divIdPhoto.classList.add('photographerIdDiv')
    article.appendChild(divIdPhoto)

    const h2 = document.createElement('h2')
    h2.textContent = name
    h2.classList.add('name-photographer-page')
    divIdPhoto.appendChild(h2)

    const place = document.createElement('p')
    place.textContent = `${city}, ${country}`
    place.classList.add('city')
    divIdPhoto.appendChild(place)

    const punchLine = document.createElement('p')
    punchLine.textContent = tagline
    punchLine.classList.add('tagline')
    divIdPhoto.appendChild(punchLine)

    const contact = document.createElement('button')
    contact.classList.add('contact_button')
    contact.textContent = 'Contactez-moi'
    contact.onclick = displayModal
    article.appendChild(contact)

    const divPicPhoto = document.createElement('div')
    divPicPhoto.classList.add('photographerPicDiv')

    article.appendChild(divPicPhoto)

    const img = document.createElement('img')
    img.setAttribute('src', picture)
    img.classList.add('photographerPic')

    divPicPhoto.appendChild(img)

    return article
  }

  // insert photographer's name in modal's title

  function getContactModal() {
    const { name } = data
    const contactPhotographer = document.querySelector('.contactName')
    contactPhotographer.textContent = name
    // console.log(contactPhotographer)
    return contactPhotographer
  }

  return {
    name,
    picture,
    city,
    tagline,
    price,
    likes,
    getUserCardDOM,
    renderPageHeader,
    renderMediasGrid,
    getContactModal,
    // countAllLikes,
  }
}
