//generates a whole number that is within the range of number_of_skills
export function getNextInt(range: number): number {
	return Math.floor(Math.random() * range)  + 1;
}

export function createElement(tag: string, options: { content: string; classes?: string[] }): HTMLElement {
  let element: HTMLElement = document.createElement(tag)
  if(options.classes && options.classes.length) {
    options.classes.forEach(_class => {
      element.className += `${_class} `;
    });
  }
  if(options.content) element.innerHTML = options.content;
  return element;
}