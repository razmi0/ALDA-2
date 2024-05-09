## TODO

#### DATA MAP

- [x] prepare data for map
- [x] add latitute longitude matrice on top of map
- [x] implement way to get data(lat, long) => point rendered on map
- [x] implement related information (blog like)
- [x] implement next/prev button command to navigate through points

const ctn = document.querySelector("#grid") as HTMLElement;
const marks = Array.from(document.querySelectorAll("[data-coor]")) as HTMLButtonElement[];

const cells = 30;
const dimensions = {
width: ctn.clientWidth,
height: ctn.clientHeight,
cellWidth: Math.floor(ctn.clientWidth / cells),
cellHeight: Math.floor(ctn.clientHeight / cells),
update: function () {
this.width = ctn.clientWidth;
this.height = ctn.clientHeight;
this.cellWidth = Math.floor(this.width / cells);
this.cellHeight = Math.floor(this.height / cells);
},
};

const placeMarks = (mark: HTMLElement) => {
/\*\*
_ x => column
_ y => row
_/
const [x, y] = (mark.dataset.coor as string).split(",").map((n) => parseInt(n)) as [number, number];
mark.style.top = `${y _ dimensions.cellHeight}px`;
    mark.style.left = `${x \* dimensions.cellWidth}px`;
};

marks.map((mark) => placeMarks(mark));

window.onresize = () => {
dimensions.update();
marks.map((mark) => placeMarks(mark));
};

/\*\*

- Button script
  \*/
  const buttons = Array.from(document.querySelectorAll("[data-is='btn-nav']")) as HTMLElement[];
  const frames = Array.from(document.querySelectorAll("[data-is='frame']")) as HTMLElement[];
  const output = document.querySelector("[data-page]")?.firstChild as HTMLElement;
  const totalPages = parseInt(output.dataset.total as string, 10);

const handleNavigation = (e: MouseEvent) => {
const [action, currentTarget] = extractDataAction(e);
const targetIndex = calculateIndex(action, currentTarget, totalPages);
updateDom(targetIndex);
};

const handleMarkClick = (e: MouseEvent) => {
const mark = e.currentTarget as HTMLElement;
const targetIndex = parseInt(mark.dataset.index as string, 10);
updateDom(targetIndex);
};

const updateDom = (index: number) => {
updateFrames(frames, index);
updateButtons(buttons, index, totalPages);
updateOutput(output, index);
updateMarks(marks, index);
};

buttons &&
buttons.map((btn) => {
btn.addEventListener("click", handleNavigation as EventListener);
});

marks &&
marks.map((mark) => {
mark.addEventListener("click", handleMarkClick as EventListener);
});
