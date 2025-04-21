import { defineStore } from "pinia";
export const UseStore = defineStore("UseStore", {
  state: () => ({
    UserData: {},
    Token: "",

    LoginData: { IsRemindDeviceActive: true, Verified: false},
    RegisterData: {},
    SetPasswordData: {},

    ServerRoot: 'https://routewisebackend-production.up.railway.app'
  }),
  actions: {
    ResetPiniaStore() {
      console.log("Pinia Store Resetlendi. ");
      console.log( 'Resetleme Öncesi : ', JSON.stringify(this.UserData));
      this.$reset();
      console.log('Resetleme Sonrası : ', JSON.stringify(this.UserData));
    },
    EMailAddressRegex(EMailAddress) {
      var EMailAddressRegex =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; //RFC5322
      return EMailAddressRegex.test(EMailAddress);
    }
  },
  persist: {
    storage: sessionStorage,
    paths: ["Token", "UserData"],
  },
});
