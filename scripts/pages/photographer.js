//Mettre le code JavaScript lié à la page photographer.html

// 1ere chose a faire = http get /data/photographers.json
// resultat = string => la passer ds la fonction JSON.parse
// objet aura 2 keys photographers et media
// objectif = merger
// iterer avec foreach ou for ... of
// photographers find media.photographersId
// maniere plus rapide = table de hash
// chaque id c la key et chq objet c le photogapher
// ds le cas d une table pour acceder a un element, on passe par une key
// => d abord construire une table photographers
//

async function computePhotographers() {
  const photographers = {}

  {
    const resp = await fetch('/data/photographers.json')
    const data = await resp.json()

    // Create photographers object

    data.photographers.forEach(photographer => {
      photographers[photographer.id] = photographer
      photographer.media = {}
    })

    // Merge media into photographers
    data.media.forEach(media => {
      if (photographers[media.photographerId])
        photographers[media.photographerId].media[media.id] = media
    })
  }

  console.log(photographers)
}

computePhotographers()
