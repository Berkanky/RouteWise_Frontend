import { defineStore } from "pinia";
import axios from "axios";
export const UseStore = defineStore("UseStore", {
  state: () => ({

    GoogleAPIKey:'',
    DeviceId: "",
    UserData: {},

    LoginData: {
      IsRemindDeviceActive: true,
      Verified: false,
      VerifySended: false,
    },
    RegisterData: { VerifySended: false },
    SetPasswordData: {},

    CurrentLocation:{ latitude: 40.985496058, longitude: 29.035333192},
    DestinationLocation:{},
    CalculatedRoute:{},

    Token: "",
    ServerRoot: "https://api.routewiseapp.com", //"https://routewisebackend-production.up.railway.app",

    OnboardingStep: 1,
    AppStarted: false,

    VerificationPageType: "",

    ServiceRequestData: {},
  }),
  actions: {
    WatchServices() {
      axios.interceptors.request.use(
        (config) => {
          return Promise.resolve(config);
        },
        (err) => {
          return Promise.reject(err);
        }
      );

      axios.interceptors.response.use(
        (res) => {
          this.ServiceRequestData = {};
          this.ServiceRequestData.message = res.data.message;
          this.ServiceRequestData.status = res.status;

          return Promise.resolve(res);
        },
        (err) => {
          this.ServiceRequestData = {};
          this.ServiceRequestData.message =
            err.response?.data?.message ??
            err.message ??
            "Error, please try again.";
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
    SMSVerify(param) {
      var { EMailAddress, PhoneNumber, DialCode, Type, VerificationId } = param;
      var ServerRoot = this.ServerRoot;
      console.log("Param : ", JSON.stringify(param));
      axios
        .put(
          `${ServerRoot}/verify/otp/sms/${EMailAddress}`,
          {
            EMailAddress: EMailAddress,
            PhoneNumber: PhoneNumber,
            DialCode: DialCode,
            Type: Type,
            VerificationId: VerificationId,
          },
          {}
        )
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            if (Type === "Login") {

              this.LoginData.Verified = true;
              this.LoginData.VerifySended = false;

            } else if (Type === "Register") {

              this.RegisterData.Verified = true;
              this.RegisterData.VerifySended = false;

            } else if (Type === "setPassword") {

              this.SetPasswordData.Verified = true;
              this.SetPasswordData.VerifySended = false;
              this.Token = res.data.Token;

            } else if(Type === "RegisterComplete") {
              this.RegisterData.PhoneNumberVerified = true;
              this.RegisterData.PhoneNumberVerifySended = false;
            }
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.status === 504) this.SMSVerify(param);
        });
    },
    SMSVerificationSend(Type) {
      var ServerRoot = this.ServerRoot;
      var EMailAddress, PhoneNumber, DialCode, Password;
      
      if (Type == "Register") {
        this.RegisterData.VerifySended = false;
        EMailAddress = this.RegisterData.EMailAddress;
        PhoneNumber = this.RegisterData.PhoneNumber;  
        DialCode = this.RegisterData.DialCode;
      }
      if (Type == "Login") {
        this.LoginData.VerifySended = false;
        EMailAddress = this.LoginData.EMailAddress;
        PhoneNumber = this.LoginData.PhoneNumber;
        DialCode = this.LoginData.DialCode;
        Password = this.LoginData.Password;
      }
      if (Type == "setPassword") {
        this.SetPasswordData.VerifySended = false;
        EMailAddress = this.SetPasswordData.EMailAddress;
        PhoneNumber = this.SetPasswordData.PhoneNumber;
        DialCode = this.SetPasswordData.DialCode;
      }
      if(Type == "RegisterComplete") {
        this.RegisterData.PhoneNumberVerifySended = false;
        EMailAddress = this.RegisterData.EMailAddress;
        PhoneNumber = this.RegisterData.PhoneNumber;  
        DialCode = this.RegisterData.DialCode;
      }
      console.log(EMailAddress, DialCode, PhoneNumber);
      axios
        .put(
          `${ServerRoot}/send/otp/sms/${EMailAddress}`,
          { EMailAddress, PhoneNumber, DialCode, Type, Password },
          {}
        )
        .then((res) => {
          console.log(res);
          if (res.status === 201) {
            if (Type == "Register") this.RegisterData.VerifySended = true;
            if (Type == "Login") this.LoginData.VerifySended = true;
            if (Type == "setPassword") this.SetPasswordData.VerifySended = true;
            if (Type == "RegisterComplete") this.RegisterData.PhoneNumberVerifySended = true;
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.status === 504) return this.RegisterSMSVerificationSend();
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
    SetPasswordEmailVerificationSend() {
      var EMailAddress = this.SetPasswordData.EMailAddress;
      var ServerRoot = this.ServerRoot;

      this.SetPasswordData.VerifySended = false;

      axios
        .post(
          `${ServerRoot}/set/password/email/verification/${EMailAddress}`,
          {},
          {}
        )
        .then((res) => {
          console.log(res);
          if (res.status === 200) this.SetPasswordData.VerifySended = true;
        })
        .catch((err) => {
          console.log(err);
          if (err.status === 504)
            return this.SetPasswordEmailVerificationSend();
        });
    },
    PasswordRegex(Password) {
      var pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      return pattern.test(Password);
    },
    EMailAddressRegex(EMailAddress) {
      var EMailAddressRegex =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; //RFC5322
      return EMailAddressRegex.test(EMailAddress);
    },
    PhoneNumberRegex(DialCode, PhoneNumber) {
      var CustomerPhoneNumber = DialCode + PhoneNumber;

      var phoneNumberRegex =
        /^(?=(\D*\d){7,15}$)\+?[\s().-]*\d+([\s().-]*\d+)*[\s().-]*$/;
      return phoneNumberRegex.test(CustomerPhoneNumber);
    },
    isValid(VerificationId) {
      var VerificationIdRegex = /^\d{6}$/;
      return VerificationIdRegex.test(VerificationId);
    },
  },
  persist: {
    storage: sessionStorage,
    paths: ["Token", "UserData", "DeviceId", "GoogleAPIKey"],
  },
});
