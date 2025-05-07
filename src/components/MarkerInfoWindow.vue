<template>
    <ion-content style="--width: 90%">
        <p>{{ JSON.stringify(marker, null, 2) }}</p>
    </ion-content>
</template>

<script>
import { IonContent } from "@ionic/vue";

export default {
    name: 'MarkerInfoWindow',
    components: {
        IonContent,
    },
    props: {
        marker: {
            type: Object,
            required: true,
        }
    },
    emits: ['onDismiss'],
    watch:{
        marker:{
            handler(newVal){
                if( newVal) console.log("Marker Info : ", JSON.stringify(newVal));
            },
            immediate:true, deep:true
        }
    }
};
</script>