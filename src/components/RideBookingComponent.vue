<template>
    <ion-header>
        <ion-toolbar>
            <ion-title></ion-title>
        </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding"></ion-content>
</template>

<script>
import { Geolocation } from '@capacitor/geolocation';
import axios from 'axios';
import { UseStore } from '../stores/store';
import {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent
} from '@ionic/vue';

export default {
    components: {
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent
    },
    emits: ['closeModal'],
    setup(){
        const store = UseStore();
        return{
            store
        }
    },
    methods: {
        async GetCurrentLocation(){
            this.store.CurrentLocation = (await Geolocation.getCurrentPosition()).coords;
        },
        closeModal() {
            this.$emit('closeModal');
        },
        GoogleDirectionsService() {
            var TravelMode = "Driving";

            this.store.CalculatedRoute = {};

            var ServerRoot = this.store.ServerRoot;
            var EMailAddress = this.store.UserData.EMailAddress;
            var Token = this.store.Token;

            var Latitude = this.store.CurrentLocation.latitude;
            var Longitude = this.store.CurrentLocation.longitude;
            
            var DestinationLocationLatitude = this.store.DestinationLocation.latitude;
            var DestinationLocationLongitude = this.store.DestinationLocation.longitude;

            axios.post(`${ServerRoot}/google/directions/${EMailAddress}`, { Latitude, Longitude, TravelMode, DestinationLocationLatitude, DestinationLocationLongitude }, {
                headers:{
                    "Authorization":"Bearer " + Token
                }
            })
            .then(res => {
                console.log(res);
                if(res.status === 200) {
                    this.store.CalculatedRoute.decoded_overview_polyline_points = res.data.decoded_overview_polyline_points;
                }
            })
            .catch(err => {
                console.log(err);
                if( err.status === 504) return this.GoogleDirectionsService();
            })
        }
    }
};
</script>