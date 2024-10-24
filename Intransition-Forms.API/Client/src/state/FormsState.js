import { makeAutoObservable } from "mobx";
import { instance } from "./Interceptors";

class FormsState {
    popularForms = [];
    latestForms = [];
    isHasMore = true;
    isPopularTemplatesLoading = true;

    constructor() {
        makeAutoObservable(this);
    }

    getPopularForms = async (tag) => {
        this.popularForms = [];
        this.setLoadingState(true);

        await instance
            .get(`/api/forms?tag=${tag}`)
            .then(response => {
                if (response.data) {
                    this.popularForms = response.data;
                }
            })
            .catch(error => {
                console.error(error);
            });

        this.setLoadingState(false);
    }

    setHasMoreState(state) {
        this.isHasMore = state;
    }

    setLoadingState(state) {
        this.isPopularTemplatesLoading = state;
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

    Delete(id) {
        this.latestForms = this.latestForms
            .filter(form => form.id !== id);
    }
}

export default new FormsState();