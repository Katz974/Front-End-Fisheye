async function fetchPhotographers() {
  const resp = await fetch('/data/photographers.json')
  const photographersData = await resp.json()
  console.log(photographersData)
  return photographersData
}

/**
 *
 */
function photographerFactory(data) {
  const { name, portrait, country, city, tagline, price, id } = data

  const picture = `Sample Photos/Photographers ID Photos/${portrait}`

  /**
   * Render photos grid
   */
  function renderPhotosGrid() {
    const div = document.createElement('div')

    data.medias.forEach(media => {
      const mediaURL = media?.image && `/Sample Photos/${name}/${media.image}`
      if (!mediaURL) {
        return
      }
      const article = document.createElement('article')
      // article.textContent = mediaURL
      article.classList.add('picBox')

      const image = document.createElement('img')
      image.setAttribute('src', mediaURL)
      article.appendChild(image)
      div.appendChild(article)

      const divContainer = document.createElement('div')
      article.appendChild(divContainer)

      const label = document.createElement('label')
      label.textContent = media.title
      divContainer.appendChild(label)
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
    console.log(data)
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
    place.textContent = city + ', ' + country
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

    // divPicPhoto.addEventListener('click', function () {
    //   document.getElementById('divPicPhoto').innerHTML = 'Hello World'
    // })

    return article
  }

  // insert photographer's name in modal's title

  function getContactModal() {
    const { name } = data
    const contactPhotographer = document.querySelector('.contactName')
    contactPhotographer.textContent = name
    console.log(contactPhotographer)
    return contactPhotographer
  }

  return {
    name,
    picture,
    city,
    tagline,
    price,
    getUserCardDOM,
    renderPageHeader,
    renderPhotosGrid,
    getContactModal,
  }
}
