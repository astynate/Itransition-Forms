import { makeAutoObservable } from "mobx";

class FormsState {
    popularForms = [];
    isPopularTemplatesLoading = true;

    constructor() {
        makeAutoObservable(this);
    }

    setLoadingState(state) {
        this.isPopularTemplatesLoading = state;
    }

    SetPopularForms(forms) {
        this.popularForms = forms;
    }
}

export default new FormsState();