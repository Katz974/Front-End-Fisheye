// CONCATENATED MODULE: ./src/services/dataManager.js
let data
let photographer
let mediasChosen = []
async function fetchPhotographers() {
  const res = await fetch('./data/FishEyeData.json')
  data = await res.json()
  return data.photographers
}

/**
 * @param {any} id
 */
async function fetchChosenPhotographer(id) {
  await fetchPhotographers()
  data.photographers.forEach(data => {
    if (data.id == id) {
      photographer = data
    }
  })
  return photographer
}

/**
 * @param {any} id
 */
async function fetchChosenMedia(id) {
  const res = await fetch('./data/FishEyeData.json')
  data = await res.json()
  data.media.forEach(data => {
    if (data.photographerId == id) {
      mediasChosen.push(data)
    }
  })
  return mediasChosen
} // CONCATENATED MODULE: ./src/components/photographer-card/photographer-card.js

/**
 * Carte du photographe dans le lobby
 */
class PhotographerCard {
  /**
   * @param {HTMLElement} domTarget
   * @param {{ tags: any; portrait?: any; name?: any; city?: any; country?: any; tagline?: any; price?: any; id?: any; }} props
   */
  constructor(domTarget, props) {
    this.imgLink = './img/PhotographersIDPhotos/' + props.portrait
    this.name = props.name
    this.location = props.city + ', ' + props.country
    this.tagline = props.tagline
    this.price = props.price + '€/jour'
    this.tags = props.tags
    this.id = props.id
    this.render(domTarget)
  }

  /**
   * @param {HTMLElement} domTarget
   */
  render(domTarget) {
    this.DOM = document.createElement('article')
    this.DOM.classList.add('photographer-card')
    domTarget.appendChild(this.DOM)
    this.button = document.createElement('a')
    this.button.tabIndex = 0
    this.button.classList.add('photographer-card-link')
    this.button.id = this.id
    this.DOM.appendChild(this.button)
    this.goPhotographerPageWithEnter()
    this.goPhotographerPage()
    this.imgContainer = document.createElement('div')
    this.imgContainer.classList.add('photographer-card-link-imgContainer')
    this.button.appendChild(this.imgContainer)
    this.insertImg()
    this.imgContainer.appendChild(this.img)
    this.h2 = document.createElement('h2')
    this.h2.textContent = this.name
    this.button.appendChild(this.h2)
    this.insertLocationElm()
    this.insertTagline()
    this.priceElm = document.createElement('p')
    this.priceElm.classList.add('price')
    this.priceElm.textContent = this.price
    this.DOM.appendChild(this.priceElm)
    this.nav = document.createElement('nav')
    this.nav.title = this.name + ' Tags'
    this.tags.forEach((/** @type {any} */ tag) => {
      new Tags(this.nav, '', tag, 'tags')
    })
    this.DOM.appendChild(this.nav)
  }

  /**
   * THis is a doc
   * @param {Number} x - This is description
   *
   * value of {@link PhotographerCard.goPhotographerPage}
   */
  goPhotographerPageWithEnter() {
    this.button.onkeyup = e => {
      if (e.keyCode === 13) {
        window.location.href = './photographer.html?id=' + this.button.id
        return this.id
      }
    }
  }

  goPhotographerPage() {
    this.button.onclick = () => {
      window.location.href = './photographer.html?id=' + this.button.id
      return this.id
    }
  }

  insertTagline() {
    this.taglineElm = document.createElement('p')
    this.taglineElm.classList.add('tagline')
    this.taglineElm.textContent = this.tagline
    this.DOM.appendChild(this.taglineElm)
  }

  insertImg() {
    this.img = document.createElement('img')
    this.img.src = this.imgLink
    this.img.alt = ''
    // this.img.setAttribute("width", "208px");
    // this.img.setAttribute("height", "208px");
  }

  insertLocationElm() {
    this.locationElm = document.createElement('p')
    this.locationElm.classList.add('location')
    this.locationElm.textContent = this.location
    this.DOM.appendChild(this.locationElm)
  }
} // CONCATENATED MODULE: ./src/components/main-lobby/main-lobby.js

class MainLobby {
  /**
   * @param {HTMLElement} domTarget
   * @param {{ photographers: any; tagsChecked: any; }} props
   */
  constructor(domTarget, props) {
    this.photographers = props.photographers
    this.tagsChecked = props.tagsChecked

    this.DOM = document.createElement('main')
    this.DOM.setAttribute('id', 'main')
    domTarget.appendChild(this.DOM)
    this.photographers.forEach(
      (/** @type {{ tags: any[]; }} */ photographer) => {
        if (this.tagsChecked === undefined || this.tagsChecked.length === 0) {
          new PhotographerCard(this.DOM, {
            ...photographer,
          })
        } else {
          const test = photographer.tags.some(tag =>
            this.tagsChecked.includes('#' + tag)
          )
          if (test) {
            new PhotographerCard(this.DOM, {
              ...photographer,
            })
          }
        }
      }
    )
  }
} // CONCATENATED MODULE: ./src/components/tags/tags.js

class Tags {
  /**
   * @param {HTMLElement} domTarget
   * @param {string | any[]} photographers
   * @param {string} tag
   * @param {string} className
   * @param {string} [className2]
   * @param {any[]} [tagsChecked]
   */
  constructor(
    domTarget,
    photographers,
    tag,
    className,
    className2,
    tagsChecked
  ) {
    this.photographers = photographers
    this.tag = tag
    this.className = [className]
    if (className2) {
      this.className.push(className2)
    }
    this.tagsChecked = tagsChecked
    this.DOM = document.createElement('button')
    this.className.forEach(newClass => {
      this.DOM.classList.add(newClass)
    })
    this.DOM.textContent = '#' + this.tag
    this.DOM.title = 'tag'
    domTarget.appendChild(this.DOM)
    this.DOM.onclick = () => this.tagsManage(this.DOM)
    this.addDisabled(this.DOM)
  }

  /**
   * @param {HTMLButtonElement} element
   */
  tagsManage(element) {
    this.tagsCheckedManager(element)
    this.pagesManager()
  }

  pagesManager() {
    if (window.location.pathname.split('/').pop() == '') {
      const body = document.querySelector('body')
      if (document.querySelector('main')) {
        body.removeChild(document.querySelector('main'))
      }
      new MainLobby(body, {
        photographers: this.photographers,
        tagsChecked: this.tagsChecked,
      })
    } else {
      window.location.href = './?tag=' + this.tag
    }
  }

  /**
   * @param {HTMLButtonElement} element
   */
  tagsCheckedManager(element) {
    if (!element.hasAttribute('isChecked')) {
      element.setAttribute('isChecked', 'true')
      this.tagsChecked.push(element.innerHTML)
    } else {
      element.removeAttribute('isChecked')
      this.tagsChecked.splice(this.tagsChecked.indexOf(element.innerHTML), 1)
    }
  }

  /**
   * @param {HTMLButtonElement} button
   */
  addDisabled(button) {
    if (this.className.length === 1) {
      button.disabled = true
    }
  }
} // CONCATENATED MODULE: ./src/components/header/header.js

/**
 * Composant header
 */
class Header {
  /**
   * @param   {HTMLElement}  domTarget  Element parent du composant
   * @param {array} photographers Tableau des photographes
   * @param {array} tagsChecked Tableau contenant les tags sélectionnés
   * @param   {String}  className  Class
   * @param   {String}  [className2]  Seconde class(optionnel)
   */
  constructor(domTarget, photographers, tagsChecked, className, className2) {
    this.photographers = photographers
    this.tagsChecked = tagsChecked
    this.className = [className]
    if (className2) this.className.push(className2)
    this.tagsValueArray = [
      'portrait',
      'art',
      'fashion',
      'architecture',
      'travel',
      'sports',
      'animals',
      'events',
    ]
    this.DOM = document.createElement('header')
    this.className.forEach(newClass => {
      this.DOM.classList.add(newClass)
    })
    domTarget.appendChild(this.DOM)
    this.logoBt = document.createElement('button')
    this.logoBt.classList.add('logo')
    this.logoBt.title = 'logo'
    this.DOM.appendChild(this.logoBt)
    this.logoBt.onclick = this.goHome
    this.logoImg = document.createElement('img')
    this.logoImg.src = './img/logo/logo.svg'
    this.logoImg.alt = 'Fisheye Home page'
    this.logoBt.appendChild(this.logoImg)
    if (this.className.length === 1) {
      this.h1 = document.createElement('h1')
      this.h1.classList.add('lobbyH1')
      this.h1.textContent = 'Nos photographes'
      this.DOM.appendChild(this.h1)
      this.nav = document.createElement('nav')
      this.tagsValueArray.forEach(tagValue => {
        new Tags(
          this.nav,
          this.photographers,
          tagValue,
          'tags',
          'tags-link',
          this.tagsChecked
        )
      })
      this.DOM.appendChild(this.nav)
      this.tags = document.querySelectorAll('.tags-link')
      this.tagsChecked.forEach(tagChecked => {
        this.tags.forEach(tag => {
          if (tag.innerHTML == tagChecked) {
            tag.setAttribute('isChecked', 'true')
          }
        })
      })
    }
  }
  /**
   * Retour accueil
   */
  goHome() {
    window.location.href = './'
  }
} // CONCATENATED MODULE: ./src/components/btContact/btContact.js

/**
 * Composants boutons de constact et "GoToContent"
 */
class BtContact {
  /**
   * @param {{ appendChild: (arg0: HTMLButtonElement) => void; }} domtarget
   * @param {{ className: string | any[]; className2: string | any; type: string; text: string; name: string; }} props
   */
  constructor(domtarget, props) {
    this.DOM = document.createElement('button')
    if (typeof props.className === 'string') props.className = [props.className]
    if (props.className2) props.className.push(props.className2)
    props.className.forEach(newClass => {
      this.DOM.classList.add(newClass)
    })
    this.DOM.type = props.type
    this.DOM.textContent = props.text
    this.name = props.name
    if (this.DOM.classList.contains('goToContent')) {
      window.onscroll = () => this.scrollHandler()
      this.DOM.onclick = this.goToContent
    }
    if (this.DOM.classList.contains('btContact')) {
      this.DOM.title = 'Contact me ' + this.name
      this.DOM.onclick = this.goFormContact
    }
    domtarget.appendChild(this.DOM)
    this.visible = false
  }
  /**
   * Ouverture du formulaire de contact
   */
  goFormContact() {
    const bground = document.querySelector('.bground')
    bground.setAttribute('visible', 'true')
    bground.parentElement.style.overflow = 'hidden'
    this.buttons = document.querySelectorAll('button')
    for (let i = 0; i < this.buttons.length - 3; i++) {
      const elm = this.buttons[i]
      elm.setAttribute('disabled', '')
    }
    this.widgetLabel = document.getElementById('select')
    this.widgetLabel.removeAttribute('tabindex')
  }
  /**
   * Dirige vers le "main"
   */
  goToContent() {
    window.location.href = '#main'
  }
  /**
   * Affichage de "GoToContent" lors du scroll vers le bas
   */
  scrollHandler() {
    const shouldBeVisible = window.scrollY > 20
    if (this.visible === shouldBeVisible) return
    this.DOM.setAttribute('visible', shouldBeVisible.toString())
    this.visible = shouldBeVisible
    console.log(this)
  }
} // CONCATENATED MODULE: ./src/components/index/index.js

class Index {
  constructor(domTarget, props) {
    this.photographers = props.photographers
    this.tagsChecked = []
    this.url = new URL(window.location.href)
    this.tag = this.url.searchParams.get('tag')
    if (this.tag) {
      this.tagsChecked.push('#' + this.tag)
    }
    new Header(domTarget, this.photographers, this.tagsChecked, 'header')
    new BtContact(domTarget, {
      className: 'goToContent',
      className2: null,
      type: 'button',
      text: 'Passer au contenu',
      name: '',
    })
    new MainLobby(domTarget, {
      photographers: this.photographers,
      tagsChecked: this.tagsChecked,
    })
  }
} // CONCATENATED MODULE: ./src/components/photographer-card-big/photographer-card-big.js

/**
 * Carte du photographe dans sa page perso
 */
class PhotographerCardBig extends PhotographerCard {
  /**
   * @param {HTMLElement} domTarget
   * @param {{ tags: any; portrait?: any; name?: any; city?: any; country?: any; tagline?: any; price?: any; id?: any; }} props
   */
  constructor(domTarget, props) {
    super(domTarget, props)
  }

  /**
   * @param {HTMLElement} domTarget
   */
  render(domTarget) {
    this.tagsChecked = []
    this.DOM = document.createElement('article')
    this.DOM.classList.add('photographer-card-big')
    domTarget.appendChild(this.DOM)
    this.photographerCardBigImgContainer = document.createElement('div')
    this.photographerCardBigImgContainer.classList.add(
      'photographer-card-link-imgContainer',
      'photographer-card-big-imgContainer'
    )
    this.DOM.appendChild(this.photographerCardBigImgContainer)
    this.insertImg()
    this.photographerCardBigImgContainer.appendChild(this.img)
    this.h2 = document.createElement('h2')
    this.h2.textContent = this.name
    this.DOM.appendChild(this.h2)
    this.insertLocationElm()
    this.insertTagline()
    this.nav = document.createElement('nav')
    this.tags.forEach((/** @type {any} */ tag) => {
      new Tags(this.nav, '', tag, 'tags', 'tags-link', this.tagsChecked)
    })
    this.DOM.appendChild(this.nav)
    this.insertBtContactDesktop(this.DOM)
    this.insertBtContactMobile(this.DOM)
  }

  insertTagline() {
    this.taglineElm = document.createElement('p')
    this.taglineElm.classList.add('tagline')
    this.taglineElm.textContent = this.tagline
    this.DOM.appendChild(this.taglineElm)
  }

  insertImg() {
    this.img = document.createElement('img')
    this.img.src = this.imgLink
    this.img.alt = ''
  }

  insertLocationElm() {
    this.locationElm = document.createElement('p')
    this.locationElm.classList.add('location')
    this.locationElm.textContent = this.location
    this.DOM.appendChild(this.locationElm)
  }

  /**
   * @param {HTMLElement} article
   */
  insertBtContactDesktop(article) {
    new BtContact(article, {
      className: 'btContact',
      className2: 'btContact-desktop',
      type: 'button',
      text: 'Contactez moi',
      name: this.name,
    })
  }

  /**
   * @param {HTMLElement} article
   */
  insertBtContactMobile(article) {
    new BtContact(article, {
      className: 'btContact',
      className2: 'btContact-mobile',
      type: 'button',
      text: 'Contactez moi',
      name: this.name,
    })
  }
} // CONCATENATED MODULE: ./src/components/widget/widget.js

// @ts-nocheck
class Widget {
  /**
   * @param {HTMLElement} domTarget
   */
  constructor(domTarget) {
    this.DOM = document.createElement('div')
    this.DOM.classList.add('no-widget')
    this.DOM.id = 'widget'
    domTarget.appendChild(this.DOM)
    this.render()
  }
  render() {
    this.DOM.innerHTML += /* html */ `
			<label>Trier par</label>
				<form>
				<label for="popularite" id="label">Tri</label>
					<select name="popularite" id="popularite">
						<option>Popularité</option>
						<option>Date</option>
						<option>Titre</option>
					</select>
					<div class="select" tabindex="0" id="select" role="listbox" aria-label="Toggle blue light">
						<!-- Ce containeur sera utilisé pour afficher la valeur courante du widget -->
						<span class="value">Popularité</span>
						<!-- Ce conteneur contiendra toutes les options disponibles pour le widget.
						Comme c'est une liste, il y sens à utiliser l'élément ul. -->
						<ul class="optList hidden" role="presentation">
							<!-- Chaque option ne contient que la valeur à afficher, Nous verrons plus loin
							comment gérer la valeur réelle qui sera envoyée avec les données du formulaire -->
							<li class="option" onclick="refreshMediaList('Popularité')" role="option" aria-label="Popularité">Popularité</li>
							<li class="option" onclick="refreshMediaList('Date')" role="option"aria-label="Date">Date</li>
							<li class="option" onclick="refreshMediaList('Titre')" role="option"aria-label="Titre">Titre</li>
						</ul>
					</div>
				</form>
		`
    // const widget = document.getElementById("widget");
    this.DOM.classList.remove('no-widget')
    this.DOM.classList.add('widget')

    // Cette fonction est utilisée chaque fois que nous voulons désactiver un
    // widget personnalisé. Elle prend un paramètre
    // select : le nœud DOM avec la classe select à désactiver
    /**
     * @param {Element} select
     */
    function deactivateSelect(select) {
      // Si le widget n'est pas actif, il n'y a rien à faire
      if (!select.classList.contains('active')) return
      // Nous devons obtenir la liste des options pour le widget personnalisé
      let optList = select.querySelector('.optList')
      // Nous cachons la liste des options
      optList.classList.add('hidden')
      // et nous désactivons le widget personnalisé lui-même
      select.classList.remove('active')
    }

    // Cette fonction sera utilisée chaque fois que l'utilisateur veut (des)activer le widget
    // Elle prend deux paramètres :
    // select : le nœud DOM de la classe `select` à activer
    // selectList : la liste de tous les nœuds DOM de la classe `select`
    /**
     * @param {Element} select
     * @param {NodeListOf<Element> | Element[]} selectList
     */
    function activeSelect(select, selectList) {
      // Si le widget est déjà actif il n'y a rien à faire
      if (select.classList.contains('active')) return
      // Nous devons désactiver tous les widgets personnalisés
      // comme la fonction deactivateSelect remplit toutes les fonctionnalités de la
      // fonction de rappel forEach, nous l'utilisons directement sans utiliser
      // une fonction anonyme intermédiaire.
      selectList.forEach(deactivateSelect)
      // Et nous activons l'état du widget donné
      // select.classList.add("active");
    }

    // Cette fonction sera utilisée chaque fois que l'utilisateur veut enrouler/dérouler la
    // liste des options
    // Elle prend un paramètre :
    // select : le nœud DOM de la liste à basculer
    /**
     * @param {Element} select
     */
    function toggleOptList(select) {
      // La liste est prise à partir du widget
      let optList = select.querySelector('.optList')
      // Nous changeons la classe de la liste pour l'enrouler/dérouler
      optList.classList.toggle('hidden')
      select.classList.toggle('active')
    }

    // Cett fonction sera utilisée chaque fois qu'il faut mettre en surbrillance
    // une option.  Elle prend deux paramètres :
    // select : le nœud DOM de la classe `select`
    //          contenant l'option à mettre en surbrillance
    // option : le nœud DOM de la classe `option` à mettre en surbrillance
    /**
     * @param {Element} select
     * @param {Element} option
     */
    function highlightOption(select, option) {
      // Obtenir la liste de toutes les options disponibles pour l'élémént sélectionné
      let optionList = select.querySelectorAll('.option')
      // Supprimer la surbrillance pour toutes les options
      optionList.forEach(function (other) {
        other.classList.remove('highlight')
      })
      // Mettre en surbrillance l'option correcte
      option.classList.add('highlight')
    }

    // Nous lions le widget aux événements dès le chargement du document
    let selectList = document.querySelectorAll('.select')
    // Chaque widget personnalisé doit être initialisé
    selectList.forEach(function (select) {
      // de même que tous les éléments `option`
      let optionList = select.querySelectorAll('.option')
      // Chaque fois que l'utilisateur passe le pointeur de souris
      // sur une option, nous mettons en surbrillance la dite option
      optionList.forEach(function (option) {
        option.addEventListener('mouseover', function () {
          // Note : les variables `select` et `option` sont des "closures"
          // disponibles dans la portée de notre appel de fonction.
          highlightOption(select, option)
        })
      })
      // Chaque fois que l'utilisateur clique sur un élément personnalisé
      select.addEventListener('click', function () {
        // Note : la variable `select` est une "closure"
        // available dans la portée de notre appel de fonction.
        // Nous basculons la visibilité de la liste des options
        toggleOptList(select)
      })
      // Dans le cas où le widget obtient le focus
      // Le widget obtient le focus chaque fois que l'utilisateur clique dessus
      // ou presse la touche Tab pour avoir accès au widget
      select.addEventListener('focus', function () {
        // Note : les variable `select` et `selectList` sont des "closures"
        // disponibles dans la portée de notre appel de fonction.
        // Nous activons le widget
        activeSelect(select, selectList)
      })
      // Dans le cas où le widget perd le focus
      select.addEventListener('blur', function () {
        // Note : la variable `select` est une "closure"
        // disponible dans la portée de notre appel de fonction.
        // Nous désactivons le widget
        deactivateSelect(select)
      })
    })
    // Cette fonction met à jour la valeur affichée et la synchronise avec celle
    // du widget natif. Elle prend deux paramètres :
    // select : le nœud DOM de la classe `select` contenant la valuer à mettre à jour
    // index  : l'index de la valeur choisie
    /**
     * @param {Element} select
     * @param {number} index
     */
    function updateValue(select, index) {
      // Nous devons obtenir le widget natif correspondant au widget personnalisé
      // Dans notre exemple, le widget natif est un parent du widget personnalisé
      let nativeWidget = select.previousElementSibling
      // Nou devons aussi obtenir la valeur de remplacement du widget personnalisé
      let value = select.querySelector('.value')
      // Et nous avons besoin de toute la liste des options
      let optionList = select.querySelectorAll('.option')
      // Nous nous assurons qu'aucune option n'est sélectionnée
      optionList.forEach(function (other) {
        other.setAttribute('aria-selected', 'false')
      })
      // Nous nous assurons que l'option choisie est sélectionnée
      optionList[index].setAttribute('aria-selected', 'true')
      // Nous définissons l'index choisi à l'index du choix
      nativeWidget.selectedIndex = index
      // Nous mettons à jour la valeur de remplacement en accord
      value.innerHTML = optionList[index].innerHTML
      // Et nous mettons en surbrillance l'option correspondante du widget personnalisé
      highlightOption(select, optionList[index])
    }

    // Cette fonction renvoie l'index courant dans le widget natif
    // Elle prend un paramètre :
    // select : le nœud DOM avec la classe `select` relative au widget natif
    /**
     * @param {Element} select
     */
    function getIndex(select) {
      // Nous avons besoin d'avoir accès au widget natif pour le widget personnalisé
      // Dans notre exemple, le widget natif est un parent du widget personnalisé

      let nativeWidget = select.previousElementSibling
      return nativeWidget.selectedIndex
    }

    // Nous lions le widget aux événements dès le chargement du document

    // let selectList = document.querySelectorAll(".select");
    // Chaque widget personnalisé doit être initialisé
    selectList.forEach(function (select) {
      let optionList = select.querySelectorAll('.option'),
        selectedIndex = getIndex(select)
      // Nous rendons le widget personnalisé capable d'avoir le focus
      select.tabIndex = 0
      // Nous faisons en sorte que le widget natif ne puisse plus avoir le focus
      select.previousElementSibling.tabIndex = -1
      // Nous nous assurons que la valeur sélectionnée par défaut est bien affichée
      updateValue(select, selectedIndex)
      // Chaque fois que l'utilisateur clique sur une option, nous mettons à
      // jour la valeur en accord
      optionList.forEach(function (option, index) {
        option.addEventListener('click', function () {
          updateValue(select, index)
        })
      })
      // Chaque fois que l'utilisateur utilise le clavier sur un widget
      // avec focus, les valeurs sont mises à jour en accord
      select.addEventListener('keyup', function (e) {
        let length = optionList.length,
          index = getIndex(select)
        // Quand l'utilisateur presse ⇓, nous allons à l'option suivante
        if (e.keyCode === 40 && index < length - 1) {
          index++
        }
        // Quand l'utilisateur presse ⇑, nous sautons à l'option suivante
        if (e.keyCode === 38 && index > 0) {
          index--
        }
        // Quand l'utilisateur presse enter, nous mettons à jour la valeur en accord
        if (e.keyCode === 13) {
          let optList = select.querySelector('.optList')
          // Nous changeons la classe de la liste pour l'enrouler/dérouler
          optList.classList.toggle('hidden')
          select.classList.toggle('active')
          if (!select.classList.contains('active')) {
            let valueElm = document.querySelector('.value')
            // @ts-ignore
            window.refreshMediaList(valueElm.innerHTML)
          }
        }

        updateValue(select, index)
      })
    })
    const label = document.querySelector('label')
    const select = document.querySelector('.select')
    label.addEventListener('click', () => {
      toggleOptList(select)
    })
  }
} // CONCATENATED MODULE: ./src/components/lightBox/lightBox.js

class LightBox {
  /**
   * @param {{ appendChild: (arg0: HTMLElement) => void; }} domTarget
   * @param {{ imgTitle: any; medias: any; }} props
   */
  constructor(domTarget, props) {
    this.imgTitle = props.imgTitle
    this.medias = props.medias
    this.DOM = document.createElement('section')
    this.DOM.id = 'lightBox'
    this.DOM.setAttribute('aria-hidden', 'false')
    this.DOM.setAttribute('role', 'dialog')
    domTarget.appendChild(this.DOM)
    this.displayCard = document.createElement('nav')
    this.displayCard.id = 'displayCard'
    this.DOM.appendChild(this.displayCard)
    this.close = document.createElement('button')
    this.close.type = 'button'
    this.close.classList.add('close')
    this.close.title = 'Close dialog'
    this.close.focus()
    this.displayCard.appendChild(this.close)
    this.close.onclick = () => {
      this.closeLightbox()
    }
    this.leftArrow = document.createElement('button')
    this.leftArrow.type = 'button'
    this.leftArrow.classList.add('arrow')
    this.leftArrow.id = 'leftArrow'
    this.leftArrow.title = 'Previous image'
    this.displayCard.appendChild(this.leftArrow)

    this.imgContainer = document.createElement('div')
    this.imgContainer.id = 'imgContainer'
    this.displayCard.appendChild(this.imgContainer)
    this.rightArrow = document.createElement('button')
    this.rightArrow.type = 'button'
    this.rightArrow.classList.add('arrow')
    this.rightArrow.id = 'rightArrow'
    this.rightArrow.title = 'Next image'
    this.displayCard.appendChild(this.rightArrow)
    this.p = document.createElement('p')
    this.DOM.appendChild(this.p)

    for (let i = 0; i < this.medias.length; i++) {
      if (this.medias[i].title === this.imgTitle) {
        if (this.medias[i].image) {
          this.displayImage(i)
        } else {
          this.displayVideo(i)
        }
        i = this.changeImage(i)
      }
    }
  }

  /**
   * @param {number} i
   */
  displayVideo(i) {
    this.deletePreviousImage()
    this.createVideo(i)
  }

  /**
   * @param {number} i
   */
  createVideo(i) {
    this.video = document.createElement('video')
    this.video.controls = true
    this.video.autoplay = true
    this.video.setAttribute('aria-label', this.medias[i].description)
    this.imgContainer.appendChild(this.video)
    this.source = document.createElement('source')
    this.source.src = './img/videos/' + this.medias[i].video
    this.source.type = 'video/mp4'
    this.video.appendChild(this.source)
    this.p.textContent = this.medias[i].title
  }

  deletePreviousImage() {
    let video = this.DOM.querySelector('video')
    let image = this.DOM.querySelector('img')
    if (video) {
      this.video.parentElement.removeChild(this.video)
    }
    if (image) {
      this.img.parentElement.removeChild(this.img)
    }
  }

  /**
   * @param {number} i
   */
  displayImage(i) {
    this.deletePreviousImage()
    this.createImg(i)
  }

  /**
   * @param {number} i
   */
  createImg(i) {
    this.img = document.createElement('img')
    this.img.alt = ''
    this.imgContainer.appendChild(this.img)
    this.img.src = './img/photos/' + this.medias[i].image
    this.img.title = this.medias[i].title
    this.img.alt = this.medias[i].description
    this.img.setAttribute('aria-label', 'Lilac breasted roller')
    this.img.setAttribute('tabindex', '0')
    this.p.textContent = this.medias[i].title
  }

  /**
   * @param {number} i
   */
  changeImage(i) {
    this.rightArrow.onclick = () => {
      i = this.goRight(i)
    }
    this.leftArrow.onclick = () => {
      i = this.goLeft(i)
    }
    document.onkeyup = e => {
      i = this.keyManager(e, i)
    }
    return i
  }

  /**
   * @param {KeyboardEvent} e
   * @param {number} i
   */
  keyManager(e, i) {
    if (e.keyCode === 37) {
      i = this.goLeft(i)
    }
    if (e.keyCode === 39) {
      i = this.goRight(i)
    }
    if (e.keyCode === 27) {
      this.closeLightbox()
    }
    return i
  }

  /**
   * @param {number} i
   */
  goLeft(i) {
    if (i !== 0) {
      i--
      if (this.medias[i].image) {
        this.displayImage(i)
      } else {
        this.displayVideo(i)
      }
    } else {
      i = this.medias.length - 1
      if (this.medias[i].image) {
        this.displayImage(i)
      } else {
        this.displayVideo(i)
      }
    }
    return i
  }

  /**
   * @param {number} i
   */
  goRight(i) {
    if (i !== this.medias.length - 1) {
      i++
      if (this.medias[i].image) {
        this.displayImage(i)
      } else {
        this.displayVideo(i)
      }
    } else {
      i = 0
      if (this.medias[i].image) {
        this.displayImage(i)
      } else {
        this.displayVideo(i)
      }
    }
    return i
  }

  closeLightbox() {
    this.DOM.parentElement.style.overflow = 'auto'
    this.DOM.parentElement.setAttribute('aria-hidden', 'false')
    this.DOM.parentNode.removeChild(this.DOM)
    this.buttons = document.querySelectorAll('button')
    for (let i = 0; i < this.buttons.length; i++) {
      const elm = this.buttons[i]

      elm.removeAttribute('disabled')
    }
    this.widgetLabel = document.getElementById('select')
    this.widgetLabel.setAttribute('tabindex', '0')
  }
} // CONCATENATED MODULE: ./src/components/mediaCard/mediaCard.js

class MediaCard {
  constructor(domTarget, props) {
    // this.DOM = domTarget;
    this.imgLink = props.imgLink
    this.videoLink = props.videoLink
    this.imgTitle = props.imgTitle
    this.like = props.like
    this.medias = props.medias
    this.description = props.description

    this.DOM = document.createElement('article')
    this.DOM.classList.add('mediaCard')
    domTarget.appendChild(this.DOM)
    this.buttonImg = document.createElement('button')
    this.buttonImg.classList.add('imgContainer')
    this.buttonImg.setAttribute('aria-label', 'image closeup view')
    this.buttonImg.title = this.imgTitle
    this.openLightBox(domTarget)
    this.DOM.appendChild(this.buttonImg)
    this.displayImgOrVideo(this.buttonImg)
    this.infoContainer = document.createElement('div')
    this.infoContainer.classList.add('infoContainer')
    this.DOM.appendChild(this.infoContainer)
    this.imgTitleElm = document.createElement('h2')
    this.imgTitleElm.classList.add('imgTitle')
    this.imgTitleElm.textContent = this.imgTitle
    this.infoContainer.appendChild(this.imgTitleElm)
    this.likeBt = document.createElement('button')
    this.likeBt.classList.add('like')
    this.likeBt.setAttribute('aria-label', 'likes')
    this.likeBt.textContent = this.like
    this.infoContainer.appendChild(this.likeBt)
    this.incrementLike(this.likeBt)
  }

  openLightBox(domTarget) {
    this.buttonImg.onclick = () => {
      this.body = domTarget.parentNode.parentNode
      this.body.setAttribute('aria-hidden', 'true')

      new LightBox(this.body, {
        medias: this.medias,
        imgTitle: this.imgTitle,
      })
      window.scroll(0, 0)
      this.body.style.overflow = 'hidden'
      this.buttons = document.querySelectorAll('button')
      for (let i = 0; i < this.buttons.length - 3; i++) {
        const elm = this.buttons[i]
        elm.setAttribute('disabled', '')
      }

      this.widgetLabel = document.getElementById('select')
      this.widgetLabel.removeAttribute('tabindex')
    }
  }

  incrementLike(like) {
    like.addEventListener('click', () => {
      if (!like.hasAttribute('bold')) {
        like.setAttribute('bold', true)
        this.like++
        this.newLike = this.like
      } else {
        like.removeAttribute('bold')
        this.like--
      }
      like.textContent = this.like
    })
  }

  displayImgOrVideo(button) {
    if (this.imgLink.indexOf('.jpg') !== -1) {
      this.img = document.createElement('img')
      this.img.src = this.imgLink
      this.img.alt = this.description
      button.appendChild(this.img)
    } else {
      this.video = document.createElement('video')
      button.appendChild(this.video)
      this.source = document.createElement('source')
      this.source.src = this.videoLink
      this.source.type = 'video/mp4'
      this.video.appendChild(this.source)
    }
  }
} // CONCATENATED MODULE: ./src/components/mediaCardsSection/mediaCardsSection.js

class MediaCardsSection {
  /**
   * @param {{ appendChild: (arg0: HTMLElement) => void; }} domTarget
   * @param {{ photographerMedias: any; target: any; }} props
   */
  constructor(domTarget, props) {
    this.DOM = document.createElement('section')
    this.DOM.id = 'mediaCardsSection'
    domTarget.appendChild(this.DOM)
    this.h2 = document.createElement('h2')
    this.h2.textContent = 'Media Cards'
    this.h2.id = 'mediaCards'
    this.DOM.appendChild(this.h2)
    this.photographerMedias = props.photographerMedias
    this.target = props.target
    this.totalLikes = 0
    this.popularArray = []
    this.dateArray = []
    this.titreArray = []

    this.displayMediaCardsWithFilter()
  }

  displayMediaCardsWithFilter() {
    if (this.target === 'Popularité') {
      this.createPopularArray(this.photographerMedias)
      this.displayMediaCard(this.DOM, this.popularArray)
    }
    if (this.target === 'Date') {
      this.createDateArray(this.photographerMedias)
      this.displayMediaCard(this.DOM, this.dateArray)
    }
    if (this.target === 'Titre') {
      this.createTitreArray(this.photographerMedias)
      this.displayMediaCard(this.DOM, this.titreArray)
    }
  }

  /**
   * @param {any[]} medias
   */
  createTitreArray(medias) {
    let arrayTitre = []
    medias.forEach(media => {
      arrayTitre.push(media.title)
    })
    arrayTitre.sort()
    arrayTitre.forEach(title => {
      medias.forEach(media => {
        if (title === media.title) {
          this.titreArray.push(media)
        }
      })
    })
    this.titreArray = [...new Set(this.titreArray)]
  }

  /**
   * @param {any[]} medias
   */
  createDateArray(medias) {
    let arrayDate = []
    medias.forEach(media => {
      arrayDate.push(media.date)
    })
    arrayDate.sort().reverse()
    arrayDate.forEach(date => {
      medias.forEach(media => {
        if (date === media.date) {
          this.dateArray.push(media)
        }
      })
    })
    this.dateArray = [...new Set(this.dateArray)]
  }

  createPopularArray(medias) {
    let arrayLikes = []
    medias.forEach(media => {
      arrayLikes.push(media.likes)
    })
    arrayLikes.sort(function (a, b) {
      return b - a
    })
    arrayLikes.forEach(likes => {
      medias.forEach(media => {
        if (likes === media.likes) {
          this.popularArray.push(media)
        }
      })
    })
    this.popularArray = [...new Set(this.popularArray)]
  }

  /**
   * @param {HTMLElement} section
   * @param {any[]} medias
   */
  displayMediaCard(section, medias) {
    medias.forEach(
      (
        /** @type {{ photographerId: any; image: string; video: string; title: any; likes: any; description: string}} */ media
      ) => {
        let mediaCard = new MediaCard(section, {
          medias: medias,
          imgLink: './img/photos/' + media.image,
          videoLink: 'img/videos/' + media.video,
          imgTitle: media.title,
          like: media.likes,
          description: media.description,
        })
        this.totalLikes += mediaCard.like
      }
    )
  }
} // CONCATENATED MODULE: ./src/components/aside/aside.js

/**
 * Composant "Aside" contenant le nombre de like total et le tarif journalier
 */
class Aside {
  /**
   * @param {{ appendChild: (arg0: HTMLElement) => void; }} domTarget
   * @param {{ price: string; totalLikes: string; }} props
   */
  constructor(domTarget, props) {
    this.DOM = document.createElement('aside')
    domTarget.appendChild(this.DOM)
    this.price = parseInt(props.price)
    this.totalLike = parseInt(props.totalLikes)
    this.likeElm = document.createElement('p')
    this.likeElm.classList.add('like')
    this.likeButtons = document.querySelectorAll('button[class=like]')
    this.likeElm.textContent = this.totalLike.toString()
    this.totalLikesManager()
    this.DOM.appendChild(this.likeElm)
    this.priceElm = document.createElement('p')
    this.priceElm.classList.add('price')
    this.priceElm.textContent = this.price + '€/jour'
    this.DOM.appendChild(this.priceElm)
  }
  /**
   * Gestion des likes totaux
   */
  totalLikesManager() {
    this.likeButtons.forEach(button => {
      button.addEventListener('click', () => {
        if (!button.hasAttribute('bold')) {
          this.totalLike--
        } else {
          this.totalLike++
        }
        this.likeElm.textContent = this.totalLike.toString()
      })
    })
  }
} // CONCATENATED MODULE: ./src/services/utils.js

function exposeMethod(methodName, method) {
  window[methodName] = method
} // CONCATENATED MODULE: ./src/components/photographer-main/photographer-main.js

class PhotographerMain {
  /**
   * @param {{ appendChild: (arg0: HTMLElement) => void; }} domTarget
   * @param {{ id: any; photographer: any; mediasChosen: any; }} props
   */
  constructor(domTarget, props) {
    this.DOM = document.createElement('main')
    this.DOM.id = 'photographer-main'
    domTarget.appendChild(this.DOM)
    this.id = props.id
    this.photographer = props.photographer
    this.mediasChosen = props.mediasChosen
    this.widgetValue = ''
    new PhotographerCardBig(this.DOM, {
      ...this.photographer,
    })
    new Widget(this.DOM)
    let mediaCardsSection = new MediaCardsSection(this.DOM, {
      photographerMedias: this.mediasChosen,
      target: 'Popularité',
    })
    new Aside(this.DOM, {
      ...this.photographer,
      photographerMedias: this.mediasChosen,
      totalLikes: mediaCardsSection.totalLikes,
    })

    exposeMethod('refreshMediaList', (/** @type {any} */ filter) => {
      this.refresh(filter)
    })
  }

  /**
   * @param {any} filter
   */
  refresh(filter) {
    this.DOM.removeChild(document.getElementById('mediaCardsSection'))
    this.DOM.removeChild(document.querySelector('aside'))
    let mediaCardsSection = new MediaCardsSection(this.DOM, {
      photographerMedias: this.mediasChosen,
      target: filter,
    })
    new Aside(this.DOM, {
      ...this.photographer,
      photographerMedias: this.mediasChosen,
      totalLikes: mediaCardsSection.totalLikes,
    })
  }
} // CONCATENATED MODULE: ./src/components/form-modal/form-modal.js

/**
 * Composant formulaire de contact
 */
class FormModal {
  /**
   * @param {{ appendChild: (arg0: HTMLDivElement) => void; }} domTarget
   * @param {{ name: any; }} props
   */
  constructor(domTarget, props) {
    this.name = props.name
    this.DOM = document.createElement('div')
    this.DOM.classList.add('bground')
    domTarget.appendChild(this.DOM)
    this.content = document.createElement('div')
    this.content.classList.add('content')
    this.DOM.appendChild(this.content)
    this.insertBtClose()
    this.insertFormModal()
  }
  /**
   * Insertion du formulaire
   */
  insertFormModal() {
    this.formModal = document.createElement('div')
    this.formModal.classList.add('form-modal')
    this.content.appendChild(this.formModal)
    this.insertName()
    this.insertForm()
    this.createInput(
      'first',
      'Prénom',
      'text',
      'First name',
      this.name.slice(0, this.name.indexOf(' '))
    )
    this.createInput(
      'last',
      'Nom',
      'text',
      'Last name',
      this.name.slice(this.name.indexOf(' ') + 1, this.name.length)
    )
    this.createInput(
      'email',
      'Email',
      'email',
      'Email',
      this.name.replace(' ', '_') + '@photo.com'
    )
    this.createTextArea('message')
    this.insertBtSubmit('mobile')
    this.insertBtSubmit('desktop')
  }

  /**
   * @param {string} screenSize
   */
  insertBtSubmit(screenSize) {
    this.btSubmit = document.createElement('button')
    this.btSubmit.classList.add(
      'btContact',
      'btContact-' + screenSize,
      'btContact-' + screenSize + '-modal'
    )
    this.btSubmit.type = 'submit'
    this.btSubmit.textContent = 'Envoyer'
    this.btSubmit.setAttribute('aria-label', 'Send')
    this.form.appendChild(this.btSubmit)
    this.btSubmit.onclick = e => {
      this.btSubmitManager(e)
    }
  }

  /**
   * @param {MouseEvent} e
   */
  btSubmitManager(e) {
    e.preventDefault()
    this.formChildrens = this.form.children
    this.formDatas = []
    for (let i = 0; i < this.formChildrens.length; i++) {
      let elm = this.formChildrens[i]
      if (elm.classList.contains('formData')) {
        this.formDatas.push(elm)
      }
    }
    if (this.verifDataValid(this.formDatas) === undefined) {
      const prenom = this.formDatas[0].children[1].value
      const nom = this.formDatas[1].children[1].value
      const email = this.formDatas[2].children[1].value
      const message = this.formDatas[3].children[1].value
      console.log(
        `Prenom: ${prenom}, Nom: ${nom}, Email: ${email}, Message: ${message}`
      )
      this.content.removeChild(this.formModal)
      this.validDiv = document.createElement('div')
      this.validDiv.classList.add('validDiv')
      this.validDiv.textContent =
        'Votre message a bien été envoyé à ' + this.name
      this.content.appendChild(this.validDiv)

      this.close.onclick = () => {
        this.closeFormContact()
        this.content.removeChild(this.validDiv)
        this.insertFormModal()
      }
    }
  }

  /**
   * @param {string | any[]} formDatas
   * @return {boolean} return true si aucune erreur
   */
  verifDataValid(formDatas) {
    for (let i = 0; i < formDatas.length; i++) {
      const elm = formDatas[i]
      if (!elm.hasAttribute('data-valid')) {
        elm.setAttribute('data-error-visible', 'true')
        return false
      }
    }
  }

  /**
   * @param {string} forClassIdNameValue
   */
  createTextArea(forClassIdNameValue) {
    this.insertFormData()
    this.label = document.createElement('label')
    this.label.setAttribute('for', forClassIdNameValue)
    this.label.classList.add(forClassIdNameValue)
    this.label.textContent = 'Votre message'
    this.formData.appendChild(this.label)
    this.textArea = document.createElement('textarea')
    this.textArea.classList.add('text-area', 'text-control')
    this.textArea.id = forClassIdNameValue
    this.textArea.name = forClassIdNameValue
    this.textArea.rows = 10
    this.textArea.cols = 38
    this.textArea.placeholder = 'Minimum: 8 caractéres'
    this.textArea.required = true
    this.textArea.setAttribute('aria-required', 'true')
    this.formData.appendChild(this.textArea)
    this.verifMessage()
  }
  /**
   * Verification de la bonne saisie du message
   */
  verifMessage() {
    this.textArea.oninput = e => {
      // @ts-ignore
      let textAreaValue = e.target.value.trim()
      let cible = this.textArea.parentElement
      if (textAreaValue.length < 8) {
        this.showError(cible, 'Veuillez entrer 8 caractéres minimum')
      } else {
        this.hideError(cible)
      }
    }
  }
  /**
   * @param {string} forIdNameValue	 Valeur du "for", "id", "name" des elements
   * @param {string} labelText			 Texte du "label"
   * @param {string} inputType			 Attribut "type" de l'input
   * @param {string} ariaLabel			 Attribut "aria-label" de l'element
   * @param {string} placeholder	Attribut "placeholder"
   */
  createInput(forIdNameValue, labelText, inputType, ariaLabel, placeholder) {
    this.insertFormData()
    this.label = document.createElement('label')
    this.label.setAttribute('for', forIdNameValue)
    this.label.textContent = labelText
    this.formData.appendChild(this.label)
    this.input = document.createElement('input')
    this.input.classList.add('text-control')
    this.input.setAttribute('aria-label', ariaLabel)
    this.input.type = inputType
    this.input.id = forIdNameValue
    this.input.name = forIdNameValue
    this.input.placeholder = placeholder
    this.input.required = true
    this.input.setAttribute('aria-required', 'true')
    this.formData.appendChild(this.input)
    this.verifInput(inputType)
  }
  /**
   * Verification saisie de l'input selon son type
   *
   * @param {string} inputType
   */
  verifInput(inputType) {
    if (inputType === 'text') {
      return this.verifNameSurname()
    }
    this.verifEmail()
  }
  verifNameSurname() {
    /**
     * Regex (< 2 characters; Pas de chiffres)
     */
    const firstLastRegex = /^[^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/
    this.input.oninput = e => {
      // @ts-ignore
      let textValue = e.target.value.trim()
      // @ts-ignore
      let cible = e.target.parentNode
      if (textValue.length < 2) {
        this.showError(cible, 'Veuillez entrer 2 caractéres minimum')
      } else if (!firstLastRegex.test(textValue)) {
        this.showError(
          cible,
          'Veuillez entrez seulement des caractéres litterales'
        )
      } else {
        this.hideError(cible)
      }
    }
    return
  }
  verifEmail() {
    /**
     * Regex de vérification d'email
     */
    const emailRegex =
      /^(([^<>()[]\.,;:s@]+(.[^<>()[]\.,;:s@]+)*)|(.+))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/ // Vérification d'email
    this.input.oninput = e => {
      // @ts-ignore
      let textValue = e.target.value.trim()
      // @ts-ignore
      let cible = e.target.parentNode
      if (!emailRegex.test(textValue)) {
        this.showError(cible, 'Veuillez entrez une adresse email valide')
      } else {
        this.hideError(cible)
      }
    }
  }

  /**
   * @param {HTMLElement} cible	Element avec erreur
   * @param {string} errorText	Texte correspondant à l'erreur
   */
  showError(cible, errorText) {
    cible.removeAttribute('data-valid')
    cible.setAttribute('data-error-visible', 'true')
    cible.setAttribute('data-error', errorText)
  }

  /**
   * @param {HTMLElement} cible		Element sans erreur
   */
  hideError(cible) {
    cible.removeAttribute('data-error-visible')
    cible.removeAttribute('data-error')
    cible.setAttribute('data-valid', 'true')
  }
  /**
   * Insertion div "formData" qui est le container de chaque input/textArea
   */
  insertFormData() {
    this.formData = document.createElement('div')
    this.formData.classList.add('formData')
    this.form.appendChild(this.formData)
  }
  /**
   * Insertion de la balise form
   */
  insertForm() {
    this.form = document.createElement('form')
    this.form.name = 'reserve'
    this.form.action = 'index.html'
    this.form.method = 'get'
    this.formModal.appendChild(this.form)
  }
  /**
   * Insertion du nom
   */
  insertName() {
    this.h1 = document.createElement('h1')
    this.h1.innerHTML = `Contactez-moi<br>${this.name}`
    this.formModal.appendChild(this.h1)
  }
  /**
   * Affichage du bouton de fermeture (croix)
   */
  insertBtClose() {
    this.close = document.createElement('button')
    this.close.classList.add('close')
    this.close.type = 'button'
    this.close.title = 'Close Contact form'
    this.close.onclick = () => {
      this.closeFormContact()
    }
    this.content.appendChild(this.close)
  }
  /**
   * Gestion du bouton close (croix)
   */
  closeFormContact() {
    this.DOM.removeAttribute('visible')
    this.DOM.parentElement.style.overflow = 'auto'
    this.reactivBackgroundBoutons()
  }
  /**
   * Réactivation des boutons d'arriére plan du formulaire lors de sa fermeture
   */
  reactivBackgroundBoutons() {
    this.buttons = document.querySelectorAll('button')
    for (let i = 0; i < this.buttons.length; i++) {
      const elm = this.buttons[i]
      elm.removeAttribute('disabled')
    }
    this.widgetLabel = document.getElementById('select')
    this.widgetLabel.setAttribute('tabindex', '0')
  }
} // CONCATENATED MODULE: ./src/components/photographerPage/photographerPage.js

class PhotographerPage {
  constructor(domTarget, props) {
    this.tagsChecked = []
    this.id = props.id
    this.photographer = props.photographer
    this.mediasChosen = props.mediasChosen
    new Header(
      domTarget,
      null,
      this.tagsChecked,
      'header',
      'header-photographer'
    )
    new PhotographerMain(domTarget, {
      photographer: this.photographer,
      mediasChosen: this.mediasChosen,
      id: this.id,
    })
    new FormModal(domTarget, { name: this.photographer.name })
  }
} // CONCATENATED MODULE: ./src/app.js

// /* *************************************************************************************************************************************************************************************************************************************************************** */
const body = document.body

/**
 * Gestion de l'affichage des pages
 *
 * @return  {promise}  Affiche la page demandé
 */
async function PagesMahager() {
  if (window.location.pathname.split('/').pop() == '') {
    const photographers = await fetchPhotographers()
    new Index(body, {
      photographers,
    })
  } else if (window.location.pathname.split('/').pop() == 'photographer.html') {
    const url = new URL(window.location.href)
    const id = url.searchParams.get('id')
    const photographer = await fetchChosenPhotographer(id)
    const mediasChosen = await fetchChosenMedia(id)
    new PhotographerPage(body, {
      id,
      photographer,
      mediasChosen,
    })
  }
}

PagesMahager()

//# sourceURL=webpack://p6/./src/app.js_+_17_modules?
