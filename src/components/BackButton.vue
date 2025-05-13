<template>
    <ion-button fill="clear" class="back-button" v-on:click="this.goBack()">
      <ion-icon :icon="chevronBackOutline"></ion-icon>
    </ion-button>
  </template>
  
  <script>
  import { IonButton, IonIcon, useIonRouter } from '@ionic/vue';
  import { chevronBackOutline } from 'ionicons/icons';
  
  export default {
    components: {
      IonButton,
      IonIcon,
    },
    setup() {
      const ionRouter = useIonRouter();
      return {
        chevronBackOutline,
        ionRouter
      }
    },
    methods: {
        async goBack(){
          if ( this.ionRouter.canGoBack()) this.ionRouter.back();
          else this.ionRouter.replace('/welcome');
        }
    }
  }
  </script>
  
  <style scoped>
  .back-button {
    --color: gray;
    margin-top:25px;
  }
  
  .back-button ion-icon {
    font-size: 25px;
    opacity: 1;
  }
  </style>