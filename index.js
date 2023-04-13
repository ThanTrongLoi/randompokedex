// import poke from './pokemon.json' assert {type : 'json'}

async function getRandomPoke() {

  const url = `https://pokeapi.co/api/v2/pokemon/`

  const i = randomInt(1, 802)

  const data = (await getPokemon(url, i)).data
  const data_evo = (await getPokemon(url, i)).data_evo

  img.setAttribute('src', `${data.sprites.other.home.front_default}`)
  document.title = data.name + ' Pokemon'
  getPokemonDetails(data)
  getEvoPokemon(data_evo)


  const pokeEvo = document.querySelectorAll(".pokemon__evo--info")

  pokeEvo.forEach(el => el.addEventListener('click', async () => {
    const data = await (await fetch(url + `${el.getAttribute('data-id')}`)).json()
    img.setAttribute('src', `${data.sprites.other.home.front_default}`)
    getPokemonDetails(data)
    document.title = data.name + ' Pokemon'
  }))
}


const getImgIndx = (urlStr) => {
  let regex = /[^v]\d/;
  let searchIdx = urlStr.search(regex)
  let evoId = urlStr.slice(searchIdx + 1, -1)
  return evoId
}

const getPokemon = async (url, eId) => {
  const response = await fetch(url + `${eId}`)
  const data = await response.json()
  const evo_url = await fetch(data.species.url)
  const evo_chain = await evo_url.json()
  const evo_res = await fetch(evo_chain.evolution_chain.url)
  const data_evo = await evo_res.json()
  return { data, data_evo }
}

const getPokemonDetails = (data) => {
  const img2 = document.getElementById("img2")
  const name = document.querySelector("[pokemon-name]")
  const types = document.querySelector(".pokemon__type")
  const weight = document.querySelector("[pokemon-weight]")
  const height = document.querySelector("[pokemon-height]")
  const portal = document.querySelector(".pokemon__portal")

  img2.setAttribute('src', `${data.sprites.other.home.front_default}`)
  name.innerText = data.name
  types.innerHTML = data.types.map((type) => {
    return `<span class="${type.type.name}"><img class="types" src="${iconTypes(type.type.name)}"/>${type.type.name}</span>`
  }).join('')
  weight.innerText = "Weight: " + data.weight / 10 + " Kg"
  height.innerText = "Height: " + data.height / 10 + " m"

  portal.innerHTML = data.stats.map(stat => {
    return `
    <div class="portal">
      <div class="portal__name"><span>${stat.stat.name}</span></div>
      <div class="portal__progress"><div class="bar" data-text="${stat.base_stat}" data-value="${getDataValue(stat.stat.name, stat.base_stat)}"></div></div>
      <div class="portal__number"><span>${stat.base_stat}</span></div>
    </div>
    `
  }).join("")
  const bar = document.querySelectorAll(".bar")
  bar.forEach(progress => {
    let value = progress.getAttribute('data-value')
    if (window.innerWidth < 1024) {
      progress.style.width = `${value}%`
    } else {
      progress.style.height = `${value}%`
    }

  })


}


const iconTypes = (type) => {
  switch (type) {
    case 'bug':
      return 'icons/bug.svg';
    case 'dark':
      return 'icons/dark.svg';
    case 'dragon':
      return 'icons/dragon.svg';
    case 'electric':
      return 'icons/electric.svg';
    case 'fairy':
      return 'icons/fairy.svg';
    case 'fighting':
      return 'icons/fighting.svg';
    case 'fire':
      return 'icons/fire.svg';
    case 'flying':
      return 'icons/flying.svg';
    case 'ghost':
      return 'icons/ghost.svg';
    case 'grass':
      return 'icons/grass.svg';
    case 'ground':
      return 'icons/ground.svg';
    case 'ice':
      return 'icons/ice.svg';
    case 'normal':
      return 'icons/normal.svg';
    case 'poison':
      return 'icons/poison.svg';
    case 'psychic':
      return 'icons/psychic.svg';
    case 'rock':
      return 'icons/rock.svg';
    case 'steel':
      return 'icons/steel.svg';
    case 'water':
      return 'icons/water.svg';
  }
}

const getEvoPokemon = (data_evo) => {

  const evo = document.querySelector(".pokemon__evo")
  evo.innerHTML = setEvoChainArr(data_evo).map(evo => {
    if (evo.length) {
      let item = ""
      for (let i = 0; i < evo.length; i++) {
        item += `<div id="pokemon_evo" class="pokemon__evo--info" data-id=${evo[i].id}>
                  <div class="pokemon__evo--img pokedex">
                    <span></span>
                    <img class="" src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${evo[i].id}.png"/>
                  </div>
                  <p class="pokemon__evo--name">${evo[i].name}</p>
                </div>`

      }
      return item
    } else {
      return `<div class="pokemon__evo--info" data-id=${evo.id}>
          <div class="pokemon__evo--img pokedex">
            <span></span>
            <img class="" src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${evo.id}.png"/>
          </div>
          <p class="pokemon__evo--name">${evo.name}</p>
      </div>`
    }

  }).join("")


}

const percent = (value, maxValue) => {
  return Math.round((value * 100) / maxValue)
}

const getDataValue = (stat, statValue) => {

  const maxHp = 255
  const maxAttack = 165
  const maxDefend = 250
  const maxSActack = 180
  const maxSDefend = 230
  const maxSpeed = 180
  switch (stat) {
    case "hp":
      return percent(statValue, maxHp)
    case "attack":
      return percent(statValue, maxAttack)
    case "defense":
      return percent(statValue, maxDefend)
    case "special-attack":
      return percent(statValue, maxSActack)
    case "special-defense":
      return percent(statValue, maxSDefend)
    case "speed":
      return percent(statValue, maxSpeed)
  }

}


getRandomPoke()




const setEvoChainArr = (data) => {
  let trackingApiData = [data.chain]
  let evoId = getImgIndx(data.chain.species.url)
  let evoChainFormattedData = [{
    id: evoId,
    name: data.chain.species.name
  }]

  let maxEvo = 2
  for (let i = 0; i < maxEvo; i++)
    if (trackingApiData[i].evolves_to.length > 1) {
      let multiEvoPath = []
      trackingApiData[i].evolves_to.forEach(pokemon => {
        trackingApiData.push(pokemon)
        evoId = getImgIndx(pokemon.species.url)
        multiEvoPath.push({
          id: evoId,
          name: pokemon.species.name
        })
      });
      evoChainFormattedData.push(multiEvoPath)
    } else {
      if (trackingApiData[i].evolves_to.length) {
        let nextEvoData = trackingApiData[i].evolves_to[0]
        trackingApiData.push(nextEvoData)
        evoId = getImgIndx(nextEvoData.species.url)
        evoChainFormattedData.push({
          id: evoId,
          name: nextEvoData.species.name
        })
      } else {
        i = maxEvo
      }
    }
  return evoChainFormattedData
}







function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
document.getElementById("main__img").onclick = () => {
  document.querySelector(".popup").style.display = 'block'
}

document.getElementById("close").onclick = () => {
  document.querySelector(".popup").style.display = 'none'
}
