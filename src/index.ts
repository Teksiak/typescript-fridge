import tinymce from "tinymce";
import { Magnet } from "./Magnet"
import { Fridge } from "./Fridge"

// ----------- SCRIPT -----------

function send() {
    const input: HTMLInputElement = document.querySelector("#name")!;
    if(input.value != "") {
        document.querySelector(".login")?.remove()
        document.querySelector('.main')?.setAttribute('style', 'display: inherit;')
        const xhttp = new XMLHttpRequest();
        let name = encodeURIComponent(input.value);
        xhttp.open("POST", "./src/login.php");
    
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let json = JSON.parse(this.responseText);
                json = JSON.parse(json.json_data);
    
                const params = json
                const fridge: Fridge = new Fridge(name, params);
                
                const add_button = document.querySelector(".add_magnet")
                add_button?.addEventListener('click', () => {
                    const params = {
                        id: fridge.getCounter(),
                        height: 50,
                        width: 50,
                        text: "NEW JOB",
                        x: 0,
                        y: 0,
                        z_index: 0
                    }
                    const magnet: Magnet = new Magnet(fridge, params);
                    fridge.addMagnet(magnet)
                })

                const statusbar = document.querySelector('.tox-statusbar__text-container')
            
                const save_button = document.createElement('button')
                save_button.id = 'save_button'
                save_button.addEventListener('click', () => {
                    const temp_text: string = tinymce.activeEditor!.getContent()
                    Fridge.activeMagnet.setText(temp_text)
                    document.querySelector(`._${Fridge.activeMagnet.id} div`)!.innerHTML = temp_text
                    document.querySelector('.editor-display')?.setAttribute('style', 'position: inherit;')
                    tinymce.activeEditor?.hide()
                    fridge.updateJSON()
                })
                statusbar?.append(save_button)
            
                const cancel_button = document.createElement('button')
                cancel_button.id = 'cancel_button'
                cancel_button.addEventListener('click', () => {
                    document.querySelector('.editor-display')?.setAttribute('style', 'position: inherit;')
                    tinymce.activeEditor?.hide()
                })
                statusbar?.append(cancel_button)
                tinymce.activeEditor?.hide()
                document.querySelector('.editor-display')?.setAttribute('style', 'display: inherit;')
            }
        }
    
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("name=" + name);
    }
}
document.getElementById("send")!.onclick = send;


tinymce.init({
    selector: 'textarea#editor'
});