/**
 * Retrieve photographer ID from URL query parameter `id`
 * @returns {number}
 */
function getPhotographerId() {
  const getLocation = document.location.search
  const getParams = new URLSearchParams(getLocation)
  const photographerId = parseInt(getParams.get('id'))
  console.log(photographerId)

  return photographerId
}

/**
 * Render the current page
 */
async function render() {
  const photographerId = getPhotographerId()
  const photographerData = await getPhotographer(photographerId)

  if (!photographerData) {
    console.error(
      `Error: photographer with ID ${photographerId} not found... aborting`
    )
    // document.querySelector('.error').appendChild(...)
    return
  }

  const photographer = photographerFactory(photographerData)

  // Render photographer header
  const photographerHeader = photographer.renderPageHeader(displayModal)
  document.querySelector('.photograph-header').appendChild(photographerHeader)

  // Render photos grid
  const photosGrid = photographer.renderPhotosGrid()
  document.querySelector('.photographer-pictures').appendChild(photosGrid)

  // Render contact modal (hidden at first)
  photographer.getContactModal()

  // Setup displayModal on contact form's button click
  const button = document.querySelector('.contact_button')
  button.addEventListener('click', displayModal)
}

/**
 * Main entrypoint of the current page
 */
async function main() {
  await render()
}

main()
