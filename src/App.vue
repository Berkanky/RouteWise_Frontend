<template>
  <ion-app>
    <ion-menu content-id="main-content" v-if="!this.IsMenuDisable()">
      <ion-header>
        <ion-toolbar>
          <ion-title>Menu Content</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <p>This is the menu content.</p>
      </ion-content>

      <ion-footer>
        <ion-toolbar>
          <ion-button expand="full" fill="clear" color="danger" @click="this.LogoutService()">
            <ion-icon :icon="logOutOutline" slot="start"></ion-icon>
            Logout
          </ion-button>
        </ion-toolbar>
      </ion-footer>
    </ion-menu>
    <ion-page id="main-content">
      <ion-header v-if="!this.IsMenuDisable()">
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
          <ion-title>Menu</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-header v-if="this.IsProgressBarActive()" class="ion-no-border">
        <ion-toolbar>
          <progress-bar />
        </ion-toolbar>
        <ion-toolbar>
          <back-button />
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding myApp">
        <router-view></router-view>
      </ion-content>
    </ion-page>
  </ion-app>
</template>

<script>
import BackButton from './components/BackButton.vue';
import ProgressBar from './components/ProgressBar.vue';
import {  IonApp, IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonPage, IonTitle, IonToolbar, IonFooter, IonButton, IonIcon } from '@ionic/vue';
import { logOutOutline } from 'ionicons/icons';
import { UseStore } from './stores/store';
import axios from 'axios';
export default {
  components: {
    ProgressBar,
    IonApp,
    IonButtons,
    IonContent,
    IonHeader,
    IonMenu,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar,
    IonFooter,
    IonButton,
    IonIcon,
    BackButton
  },
  setup() {
    const store = UseStore();
    return {
      store,
      logOutOutline
    }
  },
  data: function () {
    return {
      socket: '',
      UserData: {}
    }
  },
  methods: {
    IsProgressBarActive() {
      var hideMenuList = ["register", "setPassword", "verification", "registerComplete", "setPasswordComplete"];
      var routeName = this.$route.name;
      var VerificationPageType = this.store.VerificationPageType;
      if( VerificationPageType === "Login") hideMenuList = hideMenuList.filter(function(item){ return item !== 'verification'});
      return hideMenuList.some(function (row) { return row === routeName });
    },
    IsMenuDisable() {
      var routeName = this.$route.name;
      var hideMenuList = ["login", "welcome", "register", "setPassword", "verification", "registerComplete", "setPasswordComplete"];

      return hideMenuList.some(function (row) { return row === routeName });
    },
    LogoutService() {
      var ServerRoot = this.store.ServerRoot;
      var EMailAddress = this.store.UserData.EMailAddress;
      var Token = this.store.Token;

      axios.put(`${ServerRoot}/logout/${EMailAddress}`, {}, {
        headers: {
          "Authorization": "Bearer " + Token
        }
      })
        .then(res => {
          console.log(res);
          this.$router.replace({ path: '/login' });
          this.store.ResetPiniaStore();
        })
        .catch(err => {
          console.log(err);
          if (err.status === 504) return this.LogoutService();
        })
    },
    IsAuthenticated() {
      var UserData = this.UserData;

      return 'Active' in UserData && UserData["Active"] ? true : false
    },
    WebSocketForWatchAuth() {
      //var localWS = 'ws://localhost:3000';
      var RailwayWS = 'wss://routewisebackend-production.up.railway.app';
      this.socket = new WebSocket(RailwayWS);

      var dataSendToServer = {
        UserData: {
          _id: this.store.UserData._id
        },
      };

      this.socket.onopen = () => {
        this.socket.send(JSON.stringify(dataSendToServer));
      };

      this.socket.onmessage = (event) => {
        console.log('Sunucudan Gelen Data', JSON.parse(event.data));

        var UserData = JSON.parse(event.data).payload;

        if (Object.keys(UserData).length) {
          for (var key in UserData) {
            this.store.UserData[key] = UserData[key];
          }
        }
      };

      this.socket.onclose = () => {
        console.log('WebSocket bağlantısı kapandı!');
        this.WebSocketForWatchAuth();
      };

      this.socket.onerror = (error) => {
        console.log("WebSocket hatası: " + error.message);
      };
    },
  },
  mounted() {
    this.WebSocketForWatchAuth();

    this.store.AppStarted = true;
    console.log("App Started.");
  },
  watch: {
    'store.Token': {
      handler(newVal) {
        if (newVal) console.log("Token : ", newVal);
      },
      immediate: true, deep: true
    },
    'store.UserData': {
      handler(newVal) {
        if (newVal) {
          console.log('Store UserData :  ', newVal);
          this.UserData = newVal;
          if ("Active" in newVal) {
            if (!newVal["Active"]) return this.$router.replace({ path: '/welcome' });
          } else {
            return this.$router.replace({ path: '/welcome' });
          }
        }
      },
      immediate: true, deep: true
    }
  }
}
</script>


<style scoped>
.myApp{
  font-family: "Open Sans", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
  font-variation-settings:"wdth" 100;
}
ion-menu ion-content {
  --background: var(--ion-item-background, var(--ion-background-color, #fff));
}

ion-menu.md ion-content {
  --padding-start: 8px;
  --padding-end: 8px;
  --padding-top: 20px;
  --padding-bottom: 20px;
}

ion-menu.md ion-list {
  padding: 20px 0;
}

ion-menu.md ion-note {
  margin-bottom: 30px;
}

ion-menu.md ion-list-header,
ion-menu.md ion-note {
  padding-left: 10px;
}

ion-menu.md ion-list#inbox-list {
  border-bottom: 1px solid var(--ion-background-color-step-150, #d7d8da);
}

ion-menu.md ion-list#inbox-list ion-list-header {
  font-size: 22px;
  font-weight: 600;

  min-height: 20px;
}

ion-menu.md ion-list#labels-list ion-list-header {
  font-size: 16px;

  margin-bottom: 18px;

  color: #757575;

  min-height: 26px;
}

ion-menu.md ion-item {
  --padding-start: 10px;
  --padding-end: 10px;
  border-radius: 4px;
}

ion-menu.md ion-item.selected {
  --background: rgba(var(--ion-color-primary-rgb), 0.14);
}

ion-menu.md ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.md ion-item ion-icon {
  color: #616e7e;
}

ion-menu.md ion-item ion-label {
  font-weight: 500;
}

ion-menu.ios ion-content {
  --padding-bottom: 20px;
}

ion-menu.ios ion-list {
  padding: 20px 0 0 0;
}

ion-menu.ios ion-note {
  line-height: 24px;
  margin-bottom: 20px;
}

ion-menu.ios ion-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --min-height: 50px;
}

ion-menu.ios ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.ios ion-item ion-icon {
  font-size: 24px;
  color: #73849a;
}

ion-menu.ios ion-list#labels-list ion-list-header {
  margin-bottom: 8px;
}

ion-menu.ios ion-list-header,
ion-menu.ios ion-note {
  padding-left: 16px;
  padding-right: 16px;
}

ion-menu.ios ion-note {
  margin-bottom: 8px;
}

ion-note {
  display: inline-block;
  font-size: 16px;

  color: var(--ion-color-medium-shade);
}

ion-item.selected {
  --color: var(--ion-color-primary);
}
</style>