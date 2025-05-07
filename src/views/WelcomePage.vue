<template>
  <ion-page>
    <ion-content fullscreen color="light" class="welcome-content">

      <div class="logo-section ion-padding-top ion-text-center">
        <img src="../Images/RouteWise-3D-İcon.png" alt="Logo" class="logo" />
        <h1 class="title">RouteWise</h1>
        <p class="subtitle">Plan smarter journeys, save on every mile with RouteWise.</p>
      </div>

      <div class="map-container">
        <img src="../Images/RouteWiseMapV2.png" alt="Map Background" class="map-bg" />
        </div>

      <div class="action-section ion-padding">
        <ion-button expand="block" class="get-started" @click="goRegisterPage()">Get Started</ion-button>
        <p class="login-link ion-text-center" v-on:click="this.GoLoginPage()">
          Already have an account ? <b>Login</b>
        </p>
      </div>

    </ion-content>
  </ion-page>
</template>

<script>

import {
  IonPage,
  IonContent,
  IonButton
} from '@ionic/vue';
import { Device } from '@capacitor/device';
import { UseStore } from '../stores/store';
import axios from 'axios';
import { Preferences } from '@capacitor/preferences';

export default {
  components: {
    IonPage,
    IonContent,
    IonButton,
  },
  setup() {
    const store = UseStore();
    return {
      store
    }
  },
  data:function(){
    return{
      //
    }
  },
  created(){
    //this.store.ResetPiniaStore();
  },
  mounted(){
    if( this.store.AppStarted && !this.store.DeviceId) this.GetDeviceId();
  },
  methods: {
    GoLoginPage(){
      this.$router.push({path:'/login'});
    },
    goRegisterPage(){
      this.$router.push({path:'/Register'});
    },
    async GetDeviceId(){
      const idResult = await Device.getId();
      var DeviceId = idResult.identifier;
      this.store.DeviceId = DeviceId;

      this.CheckRefreshToken(DeviceId);
    },
    AutoLoginService(DeviceId, RefreshToken){

      var ServerRoot = this.store.ServerRoot;
      axios.put(`${ServerRoot}/auto/login`, { DeviceId:  DeviceId, Token: RefreshToken}, {})
        .then( res => {
          console.log(res);
          if(res.status === 200){
            this.store.Token = res.data.Token;
            this.store.UserData = res.data.Auth;
            this.$router.push({path:'/Home'});
          }
        })
        .catch(err => {
          console.log(err);
          if( err.status === 504) this.AutoLoginService(DeviceId, RefreshToken);
        })
    },
    async CheckRefreshToken(DeviceId) {
      try {
        var { value } = await Preferences.get({ key: 'RefreshToken' });

        if (value) {
          console.log("Yakalanan refresh token. ", value);
          this.AutoLoginService(DeviceId, value);
        }
      } catch (error) {
        console.error('Refresh token yakalanamadı. ', error);
      }
    },
  }
}
</script>

<style scoped>
ion-content::part(scroll) {
  overflow: hidden; 
}
.welcome-content {
  --background: #ffffff;
  --padding-bottom: 150px;
}

.logo-section {
  padding-top: 8vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  background: #ffffff;
}

.logo {
  width: 100px;
  height: auto;
  margin-bottom: 16px;
}

.title {
  margin: 0;
  margin-bottom: 12px;
  font-size: 36px;
  font-weight: 700;
  color: #000000;
}

.subtitle {
  margin: 0 40px;
  margin-bottom: 3vh;
  font-size: 15px;
  color: #6c757d;
  line-height: 1.4;
  max-width: 300px;
}

.map-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  line-height: 0;
  margin-top: -5vh;
  z-index: 1;
}

.map-bg {
  width: 100%;
  height: auto;
  object-fit: cover;
  display: block;
}

.map-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 40%;
  background: linear-gradient(
    to bottom,
    #ffffff 30%,
    rgba(255, 255, 255, 0) 100%
  );
  pointer-events: none;
  z-index: 2;
}

.map-container::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40%;
  background: linear-gradient(
    to top,
    #ffffff 30%,
    rgba(255, 255, 255, 0) 100%
  );
  pointer-events: none;
  z-index: 2;
}

.action-section {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  padding: 20px 25px 40px 25px;
  box-sizing: border-box;
  z-index: 3;
  background: transparent;
}

.get-started {
  --background: #e4002b;
  --background-hover: #c00024;
  --background-activated: #a0001d;
  --border-radius: 30px;
  --padding-top: 16px;
  --padding-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  text-transform: none;
  height: 55px;
  margin: 0;
}

.login-link {
  margin-top: 20px;
  font-size: 14px;
  color: #888888;
}

.login-link a {
  color: #e4002b;
  font-weight: 700;
  text-decoration: none;
}
</style>