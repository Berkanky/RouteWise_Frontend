import { defineStore } from "pinia";
import axios from "axios";
export const UseStore = defineStore("UseStore", {
  state: () => ({
    DeviceId:'',
    UserData: {},

    LoginData: {
      IsRemindDeviceActive: true,
      Verified: false,
      VerifySended: false,
    },
    RegisterData: { VerifySended: false },
    SetPasswordData: {},

    Token: '',
    ServerRoot: 'https://api.routewiseapp.com', //"https://routewisebackend-production.up.railway.app",

    OnboardingStep:1,
    AppStarted: false,

    VerificationPageType:'',

    ServiceRequestData:{}
  }),
  actions: {
    WatchServices() {

      axios.interceptors.request.use(
        (config) => {
          return config;
        },
        (err) => {
          return Promise.reject(err);
        }
      );

      axios.interceptors.response.use(
        (res) => {
          this.ServiceRequestData.message = res.data.message;
          this.ServiceRequestData.status = res.status;

          return res;
        },
        (err) => {

          this.ServiceRequestData.message = err.response?.data?.message ?? err.message ?? 'Error, please try again.';
          this.ServiceRequestData.status = err.response?.status ?? 500;

          return Promise.reject(err);
        }
      );
    },
    ResetPiniaStore() {
      this.$reset();
    },
    RegisterEmailVerificationSend() {
      
      var ServerRoot = this.ServerRoot;
      var EMailAddress = this.RegisterData.EMailAddress;
      this.RegisterData.VerifySended = false;

      axios
        .post(`${ServerRoot}/register/email/verification/${EMailAddress}`)
        .then((res) => {
          console.log(res);
          if (res.status === 200) this.RegisterData.VerifySended = true;
        })
        .catch((err) => {
          console.log(err);
          if (err.status === 504) return this.RegisterEmailVerificationSend();
        });
    },
    LoginEmailVerificationSend() {

      var ServerRoot = this.ServerRoot;
      var EMailAddress = this.LoginData.EMailAddress;
      var Password = this.LoginData.Password;
      this.LoginData.VerifySended = false;

      axios
        .post(`${ServerRoot}/login/email/verification/${EMailAddress}`, {
          Password: Password,
        })
        .then((res) => {
          console.log(res);
          if (res.status === 200) this.LoginData.VerifySended = true;
            
        })
        .catch((err) => {
          console.log(err);
          if (err.status === 504) this.ContinueEmailVerificationStep();
        });
    },
    SetPasswordEmailVerificationSend(){
      var EMailAddress = this.SetPasswordData.EMailAddress;
      var ServerRoot = this.ServerRoot;

      this.SetPasswordData.VerifySended = false;

      axios.post(`${ServerRoot}/set/password/email/verification/${EMailAddress}`, {}, {})
        .then(res => {
          console.log(res);
          if( res.status === 200) this.SetPasswordData.VerifySended = true;
        })  
        .catch(err => {
          console.log(err);
          if( err.status === 504) return this.SetPasswordEmailVerificationSend();
        })

    },
    PasswordRegex(Password){
      var pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      return pattern.test(Password);
    },
    EMailAddressRegex(EMailAddress) {
      var EMailAddressRegex =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; //RFC5322
      return EMailAddressRegex.test(EMailAddress);
    },
  },
  persist: {
    storage: sessionStorage,
    paths: ["Token", "UserData", "DeviceId"],
  },
});
