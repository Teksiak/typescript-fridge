import { Magnet } from "./Magnet";

// ----------- FRIDGE -----------

export class Fridge {
    private name: string;
    private magnets: Array<Magnet>;
    private currentMagnets: number;
    private allMagnets: number;
    private current_counter = document.querySelector(".current_counter");
    private alltime_counter = document.querySelector(".alltime_counter");
    public static activeMagnet: Magnet;

    constructor(
        name: string,
        params: {
            counter: number;
            magnets: Array<{
                id: number;
                height: number;
                width: number;
                text: string;
                x: number;
                y: number;
                current_index: number;
            }>;
        }
    ) {
        this.name = name;
        this.magnets = new Array<Magnet>();
        params.magnets.forEach((el: any) => {
            this.magnets.push(new Magnet(this, el));
        });
        this.currentMagnets = this.magnets.length;
        this.allMagnets = params.counter;
        this.showFridge();
    }

    public updateJSON() {
        const xhttp = new XMLHttpRequest();
        const input: HTMLInputElement = document.querySelector("#name")!;
        let json_data = JSON.stringify(this.getData());
        xhttp.open("POST", "./src/save.php");

        xhttp.setRequestHeader(
            "Content-type",
            "application/x-www-form-urlencoded"
        );
        xhttp.send(
            `name=${this.name}&jsondata=${encodeURIComponent(json_data)}`
        );
    }

    public getData() {
        return {
            counter: this.allMagnets,
            magnets: this.magnets.map((el) => {
                return el.getData();
            }),
        };
    }

    public getCounter() {
        return this.allMagnets;
    }

    public addMagnet(magnet: Magnet) {
        this.magnets.push(magnet);
        this.displayMagnet(magnet);
        this.allMagnets += 1;
        this.currentMagnets += 1;
        this.updateCounters();
        this.updateJSON();
    }

    public changeOrder(magnet: Magnet) {
        // const n = this.currentMagnets;
        // if(magnet.z_index != 0) {
        //     if(magnet.z_index != n) {
        //         for(let i=0; i<n; i++) {
        //             const temp: HTMLDivElement = document.querySelector(`._${this.magnets[i].id}`)!
        //             if(this.magnets[i] != magnet) {
        //                 if(this.magnets[i].z_index > 1) {
        //                     this.magnets[i].z_index--
        //                 }
        //                 this.magnets[i].z_index 
        //                 temp.style.zIndex = this.magnets[i].z_index.toString()
        //             }
        //             else {
        //                 this.magnets[i].z_index = n;
        //                 temp.style.zIndex = this.magnets[i].z_index.toString()
        //             }
        //         }
        //     }
        // }
        // else {
        //     this.magnets[this.magnets.indexOf(magnet)].z_index = n
        //     const temp: HTMLDivElement = document.querySelector(`._${magnet.id}`)!
        //     temp.style.zIndex = n.toString()
        // }
        for(let i=0; i<this.magnets.length; i++) {
            var temp: HTMLDivElement = document.querySelector(`._${this.magnets[i].id}`)!
            if(this.magnets[i].z_index >= magnet.z_index) {
                this.magnets[i].z_index -= 1;
                temp.style.zIndex = this.magnets[i].z_index.toString()
            }
        }
        magnet.z_index = this.currentMagnets
        temp = document.querySelector(`._${magnet.id}`)!
        temp.style.zIndex = magnet.z_index.toString()
    }

    public displayMagnet(magnet: Magnet) {
        const fridge = document.querySelector(".fridge");
        const temp = magnet.visualMagnet();

        // Remove button
        const remove_button = document.createElement("button");
        remove_button.classList.add("remove_button");
        remove_button.addEventListener("click", () => {
            this.removeMagnet(magnet);
        });
        temp.appendChild(remove_button);

        fridge!.appendChild(temp);
    }

    private removeMagnet(magnet: Magnet) {
        const index = this.magnets.indexOf(magnet);
        if (index != -1) {
            this.magnets.splice(index, 1);
        }
        this.currentMagnets -= 1;
        const element = document.querySelector(`._${magnet.id}`);
        element?.remove();
        this.updateCounters();
        this.updateJSON();
    }

    private updateCounters() {
        this.current_counter!.innerHTML = `Na lodówce: ${this.currentMagnets}`;
        this.alltime_counter!.innerHTML = `Przebieg: ${this.allMagnets}`;
    }

    public showFridge() {
        const fridge = document.querySelector(".fridge");
        fridge!.innerHTML = "";
        for (let i = 0; i < this.magnets.length; i++) {
            this.displayMagnet(this.magnets[i]);
        }
        this.updateCounters();
    }
}
