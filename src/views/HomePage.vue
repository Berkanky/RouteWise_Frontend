<template>
  <ion-page>
    home page

    {{ JSON.stringify(this.store.UserData) }}
  </ion-page>
</template>

<script>
import {
  IonPage,
} from '@ionic/vue';
import {UseStore} from '../stores/store';
export default {
  components:{
    IonPage
  },
  setup(){
    const store = UseStore();
    return{
      store
    }
  }
}
</script>