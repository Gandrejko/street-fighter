import { createElement } from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
  const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
  const fighterElement = createElement({
    tagName: 'div',
    className: `fighter-preview___root ${positionClassName}`,
  });
  const {name, health, attack, defense, source} = fighter;
  fighterElement.innerHTML = `
    <div class="fighter-preview__name">${name}</div>
    <div class="fighter-preview__image">
        <img src="${source}">
    </div>
    <div class="fighter-preview__details">
        <div class="fighter-preview__detail-title">Health</div>
        <div class="fighter-preview__health fighter-preview__detail">            
            <div style="width: ${health / 60 * 100}%" class="fighter-preview__progress"></div>
        </div>
        <div class="fighter-preview__detail-title">Attack</div>
        <div class="fighter-preview__attack fighter-preview__detail">            
            <div style="width: ${attack / 5 * 100}%" class="fighter-preview__progress"></div>
        </div>
        <div class="fighter-preview__detail-title">Defence</div>
        <div class="fighter-preview__defence fighter-preview__detail">           
            <div style="width: ${defense / 4 * 100}%" class="fighter-preview__progress"></div>
        </div>
    </div>   
  `;
  return fighterElement;
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
