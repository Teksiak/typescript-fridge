import tinymce from "tinymce";
import { Fridge } from "./Fridge";

// ----------- MAGNET -----------

export class Magnet {
    readonly id: number;
    readonly fridge: Fridge;
    private height: number;
    private width: number;
    private text: string;
    private x: number;
    private y: number;
    public z_index: number;
    private static upper_index: number = 0;

    constructor(fridge: Fridge, params: {id: number, height: number, width: number, text: string, x: number, y: number, z_index: number}) {
        this.fridge = fridge;
        this.id = params.id;
        this.height = params.height;
        this.width = params.width;
        this.text = decodeURIComponent(params.text);
        this.x = params.x;
        this.y = params.y;
        this.z_index = params.z_index;
    }

    public getData() {
        return {
            "id": this.id,
            "height": this.height,
            "width": this.width,
            "text": encodeURIComponent(this.text),
            "x": this.x,
            "y": this.y,
            "z_index": this.z_index
        }
    }

    public visualMagnet() {
        const temp = {div: document.createElement("div"), magnet: this}
        temp["div"].classList.add("magnet", `_${this.id}`);
        temp["div"].setAttribute('style', `height: ${this.height}px; width: ${this.width}px; top: ${this.y}px; left: ${this.x}px; z-index: ${this.z_index}`)

        // Text
        this.createTextButton(temp)

        // Move and resize magnet
        this.changeMagnet(temp)

        return temp["div"];
    }

    public setText(text: string) {
        this.text = text;
    }

    private createTextButton(temp: {div: HTMLDivElement, magnet: Magnet}) {
        const text_button = document.createElement('button')
        text_button.classList.add('text_button')
        text_button.addEventListener('click', () => {
            Fridge.activeMagnet = temp["magnet"];
            document.querySelector('.editor-display')?.setAttribute('style', 'position: absolute; display: inherit;')
            tinymce.activeEditor?.show()
            tinymce.activeEditor!.setContent(Fridge.activeMagnet.text)
        })
        temp["div"].append(text_button)

        const temp_text = document.createElement('div')
        temp_text.innerHTML = temp["magnet"].text
        temp["div"].append(temp_text)
    }

    private changeMagnet(temp: {div: HTMLDivElement, magnet: Magnet}) {
        var resize = false;
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        temp["div"].addEventListener('mousedown', (e) => {
            Magnet.upper_index += 1;
            this.fridge.changeOrder(temp["magnet"])
            // temp["magnet"].z_index = Magnet.upper_index;
            // temp["div"].style.zIndex = temp["magnet"].z_index.toString()
            if (!resize) {
                e.preventDefault()
                pos3 = e.clientX;
                pos4 = e.clientY;

                document.onmousemove = (e) => {
                    pos1 = pos3 - e.clientX;
                    pos2 = pos4 - e.clientY;
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    temp["div"].style.top = (temp["div"].offsetTop - pos2) + "px";
                    temp["div"].style.left = (temp["div"].offsetLeft - pos1) + "px";
                    temp["magnet"].x = temp["div"].offsetLeft - pos1;
                    temp["magnet"].y = temp["div"].offsetTop - pos2;
                };

                document.onmouseup = () => {
                    this.fridge.updateJSON()
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            }
        })

        const resize_button = document.createElement("button");
        resize_button.classList.add("resize_button")
        resize_button.addEventListener('mousedown', (e) => {
            e.preventDefault()
            pos3 = e.clientX;
            pos4 = e.clientY;
            resize = true;
            var temp_height = temp["magnet"].height, temp_width = temp["magnet"].width;

            document.onmousemove = (e) => {
                pos1 = e.clientX;
                pos2 = e.clientY;
                if (temp["magnet"].height + pos2 - pos4 >= 50) {
                    temp["div"].style.height = (temp["magnet"].height + pos2 - pos4) + "px";
                    temp_height = parseInt(temp["div"].style.height.slice(0, -2))
                }
                if (temp["magnet"].width + pos1 - pos3 >= 50) {
                    temp["div"].style.width = (temp["magnet"].width + pos1 - pos3) + "px";
                    temp_width = parseInt(temp["div"].style.width.slice(0, -2))
                }
            };

            document.onmouseup = () => {
                document.onmousemove = null;
                document.onmouseup = null;
                resize = false;
                temp["magnet"].height = temp_height
                temp["magnet"].width = temp_width
                this.fridge.updateJSON()
            };
        });
        temp["div"].appendChild(resize_button);
    }
}
