import { makeAutoObservable } from "mobx";

class FormsState {
    popularForms = [];
    latestForms = [];
    isHasMore = true;
    isPopularTemplatesLoading = true;

    constructor() {
        makeAutoObservable(this);
    }

    setHasMoreState(state) {
        this.isHasMore = state;
    }

    setLoadingState(state) {
        this.isPopularTemplatesLoading = state;
    }

    SetPopularForms(forms) {
        this.popularForms = forms;
    }

    setLatestForms(forms) {
        this.latestForms = forms;
    }

    UpdateLatestForms(form) {
        if (form === null || form === undefined)
            return;

        if (form.id === null || form.id === undefined)
            return;

        this.latestForms = this.latestForms
            .map(element => {
                if (element.id === form.id) {
                    return form; 
                }

                return element;
            });
    }
}

export default new FormsState();