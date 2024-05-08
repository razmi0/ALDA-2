/**
 * @description Extracts the data-action attribute from the target element
 * @param {Event} e - The event object
 * @returns {Array} - [action, currentTarget, totalPages]
 */
export const extractDataAction = (e: Event): [string, number] => {
  const dataAction = (e.currentTarget as HTMLElement)?.dataset?.action;
  if (!dataAction) return ["next", 1];
  const [action, currentTarget] = dataAction.split("#") as [string, string];
  return [action, parseInt(currentTarget)];
};

/**
 * @description Calculates the target index based on the action
 */
export const calculateIndex = (action: string, currentTarget: number, totalPages: number): number => {
  let targetIndex: number;
  switch (action) {
    case "next":
      targetIndex = currentTarget + 1;
      break;
    case "prev":
      targetIndex = currentTarget - 1;
      break;
    default:
      targetIndex = currentTarget;
      break;
  }
  return targetIndex > totalPages ? 1 : targetIndex < 1 ? totalPages : targetIndex;
};

/**
 * @description Updates the frames (map and article) with the new positions inside the frame
 */
export const updateFrames = (frames: HTMLElement[], targetIndex: number) => {
  let i = 0;
  while (i < frames.length) {
    const frame = frames[i] as HTMLElement;
    const translation = parseInt(frame.dataset.translation as string, 10);
    frame.style.transform = `translateX(-${(targetIndex - 1) * translation}px)`;
    i++;
  }
};

/**
 *  @description Updates the [data-action] attribute of the buttons
 */
export const updateButtons = (buttons: HTMLElement[], targetIndex: number, totalPages: number) => {
  buttons.forEach((btn) => {
    const actiontype = btn.dataset.action?.split("#")[0] as string;
    btn.dataset.action = `${actiontype}#${targetIndex}#${totalPages}`;
  });
};

/**
 * @description Updates the output with new displayed page
 */
export const updateOutput = (output: HTMLElement, targetIndex: number) => {
  output.textContent = targetIndex < 10 ? `0${targetIndex}` : targetIndex.toString();
};

/**
 * @description Updates the marks with/without the selected class
 */
export const updateMarks = (marks: HTMLElement[], targetIndex: number) => {
  marks.forEach((mark) => {
    const firstChild = mark.firstElementChild as HTMLElement;
    if (mark.dataset.index === targetIndex.toString()) {
      firstChild.classList.add("selected");
    } else {
      firstChild.classList.remove("selected");
    }
  });
};
