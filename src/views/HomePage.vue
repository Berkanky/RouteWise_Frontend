<template>
  <div>
    home page

    {{ JSON.stringify(this.store.UserData) }}
  </div>
</template>

<script>
import {UseStore} from '../stores/store';
export default {
  setup(){
    const store = UseStore();
    return{
      store
    }
  }
}
</script>