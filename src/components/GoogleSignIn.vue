<template>
    <ion-button v-on:click="this.TriggerGoogleSignIn()" type="submit" expand="block" class="continue-button">
        <ion-icon slot="start" :icon="logoGoogle" />
        Google Sign In
    </ion-button>
</template>

<script>
import { logoGoogle } from 'ionicons/icons';
import { IonButton } from '@ionic/vue';
import { UseStore } from '../stores/store';
export default {
    components: {
        IonButton
    },
    setup() {
        const store = UseStore();
        return {
            store,
            logoGoogle
        }
    },
    data: function () {
        return {

        }
    },
    methods: {
    },
    created() {
        
    }
}
</script>

<style scoped>
.continue-button {
    --background: ##fff;
    --border-radius: 24px;
    color: black;
    margin-top: 16px;
    font-size: 16px;
    font-weight: 500;
}
</style>