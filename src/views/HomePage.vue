<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <!-- <my-map ref="googleMapInstance" :markerData="markerData" @onMapClicked="mapClicked"
        @onMarkerClicked="markerClicked"></my-map> -->
      <Suspense>
        <template #default>
          <my-map ref="googleMapInstance" :markerData="markerData" @onMapClicked="mapClicked"
            @onMarkerClicked="markerClicked" :is-visible="!isRideBookingModalOpen"></my-map>
        </template>
        <template #fallback>
          <div style="display: flex; justify-content: center; align-items: center; height: 100%;">
            <ion-spinner name="crescent"></ion-spinner>
            <span style="margin-left: 10px;">Harita Yükleniyor...</span>
          </div>
        </template>
      </Suspense>
      <ion-popover :is-open="markerIsOpen" size="cover" @did-dismiss="markerIsOpen = false">
        <ion-content class="ion-padding">
          <div>{{ markerInfo?.title }}</div>
        </ion-content>
      </ion-popover>
      <ion-modal :is-open="isRideBookingModalOpen" @willPresent="handleModalWillPresent"
        @didDismiss="handleModalDidDismiss" :initial-breakpoint="1" :breakpoints="[0, 0.5, 0.75, 1]"
        backdrop-breakpoint="0.5">
        <ride-booking-component @closeModal="isRideBookingModalOpen = false"></ride-booking-component>
      </ion-modal>
    </ion-content>
    <ion-footer class="action-bar-footer ion-no-border">
      <ion-toolbar class="thin-action-toolbar" @click="isRideBookingModalOpen = true" role="button" tabindex="0">
        <ion-icon :icon="removeOutline" class="drag-handle-icon" style="font-size:70px;"></ion-icon>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script>
import {
  IonContent,
  IonPage,
  IonPopover,
  modalController,
  IonIcon,
  IonModal,
} from "@ionic/vue";
import RideBookingComponent from "@/components/RideBookingComponent.vue";
import MarkerInfoWindow from "../components/MarkerInfoWindow.vue";
import { Capacitor } from "@capacitor/core";
import { removeOutline } from 'ionicons/icons';
import { defineAsyncComponent, Suspense } from 'vue'; // <<< defineAsyncComponent ve Suspense'ı import et


export default {
  name: 'HomePage',
  components: {
    IonContent,
    IonPage,
    IonPopover,
    IonIcon,
    IonModal,
    RideBookingComponent,
    MyMap: defineAsyncComponent(() =>
      import('../components/GoogleMaps.vue')
    ),
    Suspense,

  },
  setup() {
    return {
      removeOutline
    }
  },
  data() {
    return {
      isRideBookingModalOpen: false,
      markerInfo: null,
      markerIsOpen: false,
      markerData: [],
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
      const markerDetails = this.getMarkerInfo(markerEventPayload);
      if (!markerDetails) {
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
    },
    async handleModalWillPresent() {
      if (this.$refs.googleMapInstance) {
        //await this.$refs.googleMapInstance.destroyMapInstance();
      }
    },
    async handleModalDidDismiss() {
      this.isRideBookingModalOpen = false;
      /* await this.$nextTick();
      if (this.$refs.googleMapInstance) {
        await this.$refs.googleMapInstance.createMapInstance();
      }  */
    }
  }
};
</script>

<style scoped>
.thin-action-toolbar {
  --background: var(--ion-color-light, #f4f5f8);
  --min-height: 30px;
  height: 30px;
  --padding-start: 0;
  --padding-end: 0;
  --padding-top: 0;
  --padding-bottom: 0;
  cursor: pointer;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  position: relative;
}

.action-bar-footer {
  background: #fff;
}

.thin-action-toolbar:active {
  --background: var(--ion-color-light-shade, #d7d8da);
}

.drag-handle-icon {
  font-size: 24px;
  color: var(--ion-color-medium-shade, #737373);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  padding: 0;

}
</style>