"use strict";

import "core-js/stable";
import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;

import { VisualSettings } from "./settings";
import { json } from "d3";
export class Visual implements IVisual {
    private target: HTMLElement;
    private settings: VisualSettings;
    storage: powerbi.extensibility.ILocalVisualStorageService;
    paragraph: HTMLParagraphElement;

    // 1. Using the same GUID as our Zebra BI Tables Visual so that local storage is enabled
    // 2. PBI_approvedResourcesDisabled set to true, so that we can load this test

    constructor(options: VisualConstructorOptions) {
        this.target = options.element;
        this.storage = options.host.storageService;
        let input = <HTMLInputElement>document.createElement('input');
        this.target.appendChild(input);
        this.paragraph = document.createElement('p');
        let button = <HTMLButtonElement>document.createElement('button');
        button.textContent = "Save";
        this.target.appendChild(button);
        button.addEventListener('click', () => {
            // tslint:disable-next-line: no-backbone-get-set-outside-model
            this.storage.set('key', input.value);
            this.paragraph.textContent = "Value from storage: " + input.value;
        });
        this.target.appendChild(this.paragraph);
    }

    public update(options: VisualUpdateOptions) {
        // tslint:disable-next-line: no-backbone-get-set-outside-model
        this.storage.get('key')
            .then(data => {
                this.paragraph.textContent = "Value from storage: " + data;
            })
            .catch(error => {
                this.paragraph.textContent = "Error: " + JSON.stringify(error);
            })
    }

    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
        return VisualSettings.enumerateObjectInstances(this.settings || VisualSettings.getDefault(), options);
    }
}