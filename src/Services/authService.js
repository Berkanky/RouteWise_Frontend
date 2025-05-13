import axios from "axios";
import { UseStore } from "../stores/store";

async function AuthService(){
    const store = UseStore();

    var ServerRoot = store.ServerRoot;
    var EMailAddress = store.UserData.EMailAddress;
    var Token = store.Token;
      try {
        const response = await axios.put(`${ServerRoot}/session/control/${EMailAddress}`, {}, {
            headers: {
                "Authorization": "Bearer " + Token
            }
        });
        console.log(response);
        if (response.status === 200) return true;
        return false;
    } catch (err) {
        console.log(err);
        if (err.response && err.response.status === 504) await AuthService();
        return false
    }
}

export default AuthService