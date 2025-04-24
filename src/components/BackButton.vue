<template>
    <ion-button fill="clear" class="flat-kirmizi-ikon" v-on:click="this.goBack()">
      <ion-icon :icon="chevronBackCircleOutline"></ion-icon>
    </ion-button>
  </template>
  
  <script>
  import { IonButton, IonIcon } from '@ionic/vue';
  import { chevronBackCircleOutline } from 'ionicons/icons';
  import { UseStore } from '../stores/store';
  
  export default {
    components: {
      IonButton,
      IonIcon,
    },
    setup() {
      const store = UseStore();
      return {
        store,
        chevronBackCircleOutline
      }
    },
    data: function () { return {} },
    methods: {
        goBack(){
            this.$router.go(-1);
        }
    }
  }
  </script>
  
  <style scoped>
  .flat-kirmizi-ikon {
    --color: #f14b4b;
  }
  
  .flat-kirmizi-ikon ion-icon {
    font-size: 40px;
    opacity: 1;
  }
  </style>