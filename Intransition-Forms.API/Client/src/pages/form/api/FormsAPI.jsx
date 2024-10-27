import ApplicationState from "../../../state/ApplicationState";
import FormsState from "../../../state/FormsState";
import { instance } from "../../../state/Interceptors";

class FormsAPI {
    static SendRenameRequest = async (id, formTitle, onSuccess = () => {}) => {
        let formData = new FormData();

        formData.append('id', id);
        formData.append('title', formTitle);

        await instance
            .put('/api/forms', formData)
            .then(response => {
                if (response.data) {
                    FormsState.UpdateLatestForms(response.data);
                    onSuccess();
                }
            })
            .catch(error => {
                // ApplicationState.AddErrorInQueueByError("Attention!", error);
                console.error(error);
            })
    }

    static GetFormById = async (id, setForm, setLoadingState) => {
        setLoadingState(true);

        await instance
            .get(`/api/forms/${id}`)
            .then(response => {
                if (response.data) {
                    setForm(response.data);
                }
            })
            .catch(error => {
                // ApplicationState.AddErrorInQueueByError("Attention!", error);
                console.error(error);
            })

        setLoadingState(false);
    }
}

export default FormsAPI;