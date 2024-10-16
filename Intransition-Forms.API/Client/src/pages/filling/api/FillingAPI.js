import { instance } from "../../../state/Interceptors";

class FillingAPI {
    static SendFillRequest = async (id, answers, thenHandler = () => {}) => {
        let answersAsArray = [];

        Object.keys(answers).forEach(key => {
            if (answers[key].value !== undefined) {
                answersAsArray.push(answers[key]);
            }
        });

        await instance
            .post(`/api/fillings/${id}`, JSON.stringify(answersAsArray), {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                thenHandler(response);
            })
            .catch(error => {
                console.error(error);
                alert('Someting went wrong')
            });
    }
}

export default FillingAPI;