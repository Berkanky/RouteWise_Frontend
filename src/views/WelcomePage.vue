<template>
    <ion-page class="login-page">
      <ion-content fullscreen color="light">
        <div class="map-container">
          <img src="../Images/RouteWiseMap.png" alt="Map Background" class="map-bg" />
        </div>

        <div class="logo-section">
          <img src="../Images/Vector.png" alt="Logo" class="logo" />
          <h2 class="welcome-title">Welcome to Routewise</h2>
          <p class="subtitle">Plan smarter journeys, save on every mile with Routewise.</p>
        </div>
  
        <div class="action-section">
          <ion-button expand="block" class="get-started" v-on:click="goRegisterPage()">Get Started</ion-button>
          <p class="login-link">
            Already have an account? <router-link to="/login" v-on:click="GoLoginPage()">Login</router-link>
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
import { UseStore } from '../stores/store';
export default {
    components: {
        IonPage,
        IonContent,
        IonButton
    },
    setup() {
        const store = UseStore();
        return {
            store
        }
    },
    data: function () {
        return {

        }
    },
    created(){
      this.store.ResetPiniaStore();
    },
    methods: {
        GoLoginPage(){
            this.$router.push({path:'/login'});
        },
        goRegisterPage(){
          this.$router.push({path:'/Register'});
        }
    }
}
</script>

<style scoped>
.login-page {
  --background: #ffffff !important;
  --color: #000000 !important;
}

.map-container {
  position: relative;
  width: 100%;
  height: 45vh;
  overflow: hidden;
}

.map-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.map-container::after {
  content: "";
  position: absolute;
  bottom: 0;
  left:   0;
  width:  100%;
  height: 40%; /* geçiş yüksekliği, yüzdeyle ayarla */
  background: linear-gradient(
    to top,
    #ffffff 0%,
    rgba(255,255,255,0) 100%
  );
  pointer-events: none;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  width: 80px;
  height: auto;
}

.title {
  margin: 16px 0 8px;
  font-size: 24px;
  font-weight: bold;
  color: #000000;
}

.subtitle {
  margin: 0 32px;
  margin-top:25px;
  font-size: 14px;
  text-align: center;
  color: #666666;
}

.action-section {
  position: absolute;
  bottom: 32px;
  width: 100%;
  padding: 0 16px;
}

.get-started {
  --background: #e4002b;
  --border-radius: 24px;
  --padding-top: 12px;
  --padding-bottom: 12px;
  font-size: 16px;
  font-weight: 500;
  color:#fff;
}

.login-link {
  text-align: center;
  margin-top: 12px;
  font-size: 14px;
  color: #888888;
}

.login-link a {
  color: #e4002b;
  font-weight: 500;
  text-decoration: none;
}
</style>