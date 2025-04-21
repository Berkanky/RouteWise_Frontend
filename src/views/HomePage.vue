<template>
  <div>
    home page
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