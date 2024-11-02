import ApplicationState from "../state/ApplicationState";
import { instance } from "../state/Interceptors";
import UserState from "../state/UserState";

class SalesforceAPI {
    static CreateUser = async (user, firstName, lastName, description, phone, date) => {
        if (!user) return;

        let form = new FormData();
        let result = false;

        form.append('FirstName', firstName);
        form.append('LastName', lastName);
        form.append('Description', description);
        form.append('Phone', phone);
        form.append('Birthdate', date);

        await instance
            .post('/api/salesforce', form)
            .then(_ => {
                UserState.GetUserData();
                result = true;
            })
            .catch(error => {
                ApplicationState.AddErrorInQueue("Attention!", "Error while trying to connect to Salesforce");
                console.error(error);
            });


        return result;
    }

    static GetUser = async (user) => {
        
    }
}

export default SalesforceAPI;