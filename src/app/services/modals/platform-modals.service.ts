import { Injectable } from '@angular/core';
import { HexToCssConfiguration, hexToCSSFilter } from 'hex-to-css-filter';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PlatformModalsService {
    // DISCLAIMER: Do not delete those properties that appear to have no use, THEY DO HAVE A USE, but they're used dinamically so the IDE does not recognize them as used, Capiche?
    private colorConverterConfig: HexToCssConfiguration = {
        acceptanceLossPercentage: 1,
        maxChecks: 10,
    };

    private messageModalState = false;
    private decisionModalState = false;
    private loadingModalState = false;

    private messageModalState$ = new BehaviorSubject(false);
    private decisionModalState$ = new BehaviorSubject(false);
    private loadingModalState$ = new BehaviorSubject(false);

    private defaultModal = {
        message: '',
        icon_existence: true,
        custom_icon: '',
        icon_color: '',
        text_size: '',
        text_color: '',
        button_foward: '',
        button_backward: '',
        handlers: {
            forward: () => {},
            backward: () => {},
            finally: () => {}
        }
    };

    messageModal = { ...this.defaultModal };
    decisionModal = { ...this.defaultModal };
    loadingModal = { ...this.defaultModal };

    constructor() {}

    toggle(type, params: any = {}, handlers = {}) {
        if (!params) params = {};

        // reset modalParams
        if (typeof type !== 'string') throw new Error(`Platform Modals Service | Function 'toggle' > The first argument is the modal type and it should be of type string, not ${typeof type}. The known modal types are: 'message', 'decision'.`);
        else if (this[`${type}Modal`]) this[`${type}Modal`] = { ...this.defaultModal };
        else throw new Error(`Platform Modals Service | Function 'toggle' > The first argument, is the modal type. '${this.firstCharUpperCase(type)}' Modal does not exist. The known modal types are: 'message', 'decision'.`);

        // converting hex to css filter
        if (params?.icon_color?.length) params.icon_color = this.hexToCSSFilter(params.icon_color);

        // setting the verified params to the modal
        const verifiedParams = this.getVerifiedParams(type, params);

        Object.keys(verifiedParams).forEach((param) => {
            this[`${type}Modal`][param] = verifiedParams[param];
        });

        // setting the verified fnHandlers to the modal
        const verifiedHandlers = this.getVerifiedHandlers(type, handlers);

        Object.keys(verifiedHandlers).forEach((fnName) => {
            this[`${type}Modal`].handlers[fnName] = verifiedHandlers[fnName];
        });

        if (this[`${type}Modal`]) {
            // invert the state
            this[`${type}ModalState`] = !this[`${type}ModalState`];

            // take that state and pass it throughout the behaviorSubject
            this[`${type}ModalState$`].next(this[`${type}ModalState`]);
        }
    }

    close(type) {
        if (typeof type !== 'string') throw new Error(`Platform Modals Service | Function 'toggle' > The first argument is the modal type and it should be of type string, not ${typeof type}. The known modal types are: 'message', 'decision'.`);
        else if (this[`${type}Modal`]) {
            // invert the state
            this[`${type}ModalState`] = false;

            // take that state and pass it throughout the behaviorSubject
            this[`${type}ModalState$`].next(this[`${type}ModalState`]);
        } else throw new Error(`Platform Modals Service | Function 'close' > '${this.firstCharUpperCase(type)}' Modal does not exist. The known modal types are: 'message', 'decision'.`);
    }

    private getVerifiedParams(type: string, params: string | object) {
        const verifiedParams = {};

        if (typeof params === 'string') params = { message: params };
        else if (typeof params !== 'object') throw new Error(`Platform Modals Service | Function 'toggle' > The second argument is the params. The only accepted type of params are 'string', that will be interpreted as the message you want to display in the modal or an 'object' with the params [you passed a ${typeof params}], the known params are: ${this.objectKeysToString(this[`${type}Modal`], true)}.`);

        Object.keys(params).forEach((param) => {
            const obj_reference = this[`${type}Modal`][param];

            if (obj_reference !== undefined && typeof obj_reference === typeof params[param]) {
                verifiedParams[param] = params[param];
            } else if (obj_reference === undefined) {
                throw new Error(`Platform Modals Service | Function 'toggle' > Param '${param}' is not valid for ${this.firstCharUpperCase(type)}modal, the known params are: ${this.objectKeysToString(this[`${type}Modal`], true)}.`);
            } else if (typeof obj_reference !== typeof params[param]) {
                throw new Error(`Platform Modals Service | Function 'toggle' > Param '${param}' should be of type ${typeof obj_reference}, not ${typeof params[param]}.`);
            }
        });

        return verifiedParams;
    }

    private getVerifiedHandlers(type: string, handlers: string | object) {
        const verifiedHandlers = {};

        // exceptions
        if (handlers === 'close') handlers = { finally: this.close.bind(this, type) };
        else if (typeof handlers !== 'object') throw new Error(`Platform Modals Service | Function 'toggle' > The third argument is the handlers. The only accepted values are 'close' (string), to close the modal right after any button click or an object with handlers functions, the known function names are: ${this.objectKeysToString(this[`${type}Modal`].handlers)}.`);

        Object.keys(handlers).forEach((handler) => {
            const obj_reference = this[`${type}Modal`].handlers[handler];

            if (obj_reference !== undefined && typeof obj_reference === typeof handlers[handler]) {
                verifiedHandlers[handler] = handlers[handler];
            } else if (obj_reference === undefined) {
                throw new Error(`Platform Modals Service | Function 'toggle' > Handler function '${handler}' is not valid for ${this.firstCharUpperCase(type)}modal, the known functions are: ${this.objectKeysToString(this[`${type}Modal`].handlers)}.`);
            } else if (typeof obj_reference !== typeof handlers[handler]) {
                throw new Error(`Platform Modals Service | Function 'toggle' > The handler '${handler}' should be of type ${typeof obj_reference}, not ${typeof handlers[handler]}.`);
            }
        });

        return verifiedHandlers;
    }

    getModalState(type) {
        if (this[`${type}ModalState$`]) {
            return this[`${type}ModalState$`].asObservable();
        }
        throw new Error(`Platform Modals Service | Function 'getModalState' > '${this.firstCharUpperCase(type)}' Modal does not exist. The known modal types are: 'message', 'decision'.`);
    }

    public hexToCSSFilter(color) {
        return hexToCSSFilter(color, this.colorConverterConfig).filter.slice(0, -1);
    }

    public firstCharUpperCase(word) {
        if (word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }
    }

    private objectKeysToString(object: object, removeLastWord?: boolean) {
        const convertedObject = Object.keys(object).map((word) => `'${word}'`);

        removeLastWord === true
            ? (convertedObject.pop(), convertedObject.join(', '))
            : convertedObject.join(', ');

        return convertedObject;
    }
}
