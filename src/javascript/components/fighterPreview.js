import { createElement } from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
  const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
  const fighterElement = createElement({
    tagName: 'div',
    className: `fighter-preview___root ${positionClassName}`,
  });
  const {name, health, attack, defense, source} = fighter;
  const fighterNameElement = createElement({
    tagName: 'div',
    className: 'fighter-preview__name',
  });
  fighterNameElement.innerText = name;

  const fighterImageElement = createElement({
    tagName: 'div',
    className: 'fighter-preview__image',
  });
  fighterImageElement.append(createFighterImage(fighter));

  const fighterDetailsElement = createElement({
    tagName: 'div',
    className: 'fighter-preview__details',
  });
  fighterDetailsElement.append(
      createDetailElement(health, 'health'),
      createDetailElement(attack, 'attack'),
      createDetailElement(defense, 'defense')
  )

  fighterElement.append(fighterNameElement, fighterImageElement, fighterDetailsElement);

  return fighterElement;
}

function createDetailElement(ability, abilityName) {
  const fighterDetailElement = createElement({
    tagName: 'div',
    className: `fighter-preview__${abilityName} fighter-preview__detail`,
  });
  const fighterDetailProgressElement = createElement({
    tagName: 'div',
    className: `fighter-preview__progress`,
  });
  let width;
  if(abilityName === 'health') width = ability / 60 * 100;
  if(abilityName === 'attack') width = ability / 5 * 100;
  if(abilityName === 'defense') width = ability / 4 * 100;
  fighterDetailProgressElement.style.width = width + '%';

  const fighterDetailTitleElement = createElement({
    tagName: 'div',
    className: `fighter-preview__detail-title`,
  });
  fighterDetailTitleElement.innerHTML = abilityName;

  fighterDetailElement.append(fighterDetailProgressElement, fighterDetailTitleElement);

  return fighterDetailElement;
}

export function createFighterImage(fighter) {
  const { source, name } = fighter;
  const attributes = { 
    src: source, 
    title: name,
    alt: name 
  };
  const imgElement = createElement({
    tagName: 'img',
    className: 'fighter-preview___img',
    attributes,
  });

  return imgElement;
}
