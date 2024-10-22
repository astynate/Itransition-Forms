import { makeAutoObservable } from "mobx";

class ApplicationState {
    isDarkMode = false;

    constructor() {
        const defaultDarkModeValue = localStorage.getItem('darkMode');
        this.isDarkMode = defaultDarkModeValue === 'true';
        
        makeAutoObservable(this);
    }

    SetDarkModeState(state) {
        state = !!state;

        this.isDarkMode = state;
        localStorage.setItem('darkMode', state);
    }
}

export default new ApplicationState();