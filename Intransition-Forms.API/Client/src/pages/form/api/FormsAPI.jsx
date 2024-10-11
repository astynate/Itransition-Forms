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
                console.error(error);
                alert("Something went wrong");
            })
    }
}

export default FormsAPI;