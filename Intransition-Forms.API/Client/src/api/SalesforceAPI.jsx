import ApplicationState from "../state/ApplicationState";
import { instance } from "../state/Interceptors";

class SalesforceAPI {
    static consumerKey = '3MVG9k02hQhyUgQAoqFvSNtOcdCwuWiQt08z0ocb_3CAmU39.zPoiD76lKujrviDdpDbld420kLOQJ9zQGl41';
    static consumerSecret = '2C312AC741BCA4FEC72AEED4A51281CC6ECD8A72FF582D03F6E29E88DDD97C65';
    static domain = 'https://instend-dev-ed.develop.lightning.force.com';

    static CreateUser = async (user) => {
        const data = {
            grant_type: 'passport',
            client_id: SalesforceAPI.consumerKey,
            clinet_secret: SalesforceAPI.consumerSecret,
            username: user.email,
            password: user.password
        };

        await instance
            .post(`${domain}/services/oauth2/token`, data)
            .then(response => {
                console.log(response.data);
            })
            .catch(error =>{
                ApplicationState.AddErrorInQueueByError(error);
                console.error(error);
            });
    }

    static GetUser = async (user) => {
        
    }
}

export default SalesforceAPI;