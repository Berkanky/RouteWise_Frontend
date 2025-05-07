<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <my-map :markerData="markerData" @onMapClicked="mapClicked" @onMarkerClicked="markerClicked"></my-map>
      <ion-popover :is-open="markerIsOpen" size="cover" @did-dismiss="markerIsOpen = false">
        <ion-content class="ion-padding">
          <div>{{ markerInfo?.title }}</div>
        </ion-content>
      </ion-popover>

      <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button @click="isRideBookingModalOpen = true">
          <ion-icon :icon="carSportOutline"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <ion-modal :is-open="isRideBookingModalOpen" @didDismiss="isRideBookingModalOpen = false"
        :initial-breakpoint="0.5" :breakpoints="[0, 0.5, 0.75, 1]" backdrop-breakpoint="0.5">
        <ride-booking-component @closeModal="isRideBookingModalOpen = false"></ride-booking-component>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonContent,
  IonPage,
  IonPopover,
  modalController,
  IonFab,
  IonFabButton,
  IonIcon,
  IonModal
} from "@ionic/vue";
import RideBookingComponent from "@/components/RideBookingComponent.vue";
import MyMap from "../components/GoogleMaps.vue";
import MarkerInfoWindow from "../components/MarkerInfoWindow.vue";
import { Capacitor } from "@capacitor/core";
import { carSportOutline } from 'ionicons/icons';

export default {
  name: 'HomePage',
  components: {
    IonContent,
    IonPage,
    IonPopover,
    MyMap,
    IonFab,
    IonFabButton,
    IonIcon,
    IonModal,
    RideBookingComponent
  },
  setup(){
    return{
      carSportOutline
    }
  },
  data() {
    return {
      isRideBookingModalOpen: false,
      markerInfo: null,
      markerIsOpen: false,
      markerData: [
        /* {
          coordinate: { lat: 37.769, lng: -122.446 },
          title: "title one",
          snippet: "title one snippet content will be presented here",
        }, */],
    };
  },
  methods: {
    async openModal(marker) {
      const modal = await modalController.create({
        component: MarkerInfoWindow,
        componentProps: {
          marker,
        },
        initialBreakpoint: 0.2,
        breakpoints: [0, 0.2],
        backdropBreakpoint: 0,
        showBackdrop: false,
        backdropDismiss: true,
      });
      modal.present();
      await modal.onWillDismiss();
    },
    mapClicked() {
      console.log("mapClicked");
      this.markerIsOpen = false;
    },
    getMarkerInfo(markerLocation) {
      return this.markerData.find(
        (m) =>
          m.coordinate.lat === markerLocation.latitude &&
          m.coordinate.lng === markerLocation.longitude
      );
    },
    markerClicked(markerEventPayload) {
      console.log("markerClicked payload:", markerEventPayload);
      const markerDetails = this.getMarkerInfo(markerEventPayload);

      if (!markerDetails) {
        console.warn("Marker details not found for coordinates:", markerEventPayload);
        this.markerInfo = null;
        this.markerIsOpen = false;
        return;
      }

      if (!Capacitor.isNativePlatform()) {
        this.openModal(markerDetails);
        this.markerIsOpen = false;
      } else {
        this.markerInfo = markerDetails;
        this.markerIsOpen = true;
      }
    }
  }
};
</script>

<style scoped>
/* Gerekirse buraya özel stiller eklenebilir */
</style>