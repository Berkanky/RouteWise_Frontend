<template>
    <ion-tabs>
        <ion-tab-bar slot="bottom">
            <ion-tab-button v-for="(data, key) in this.Options" :key="key" :tab="data.label">
                <ion-icon :icon="data.icon" />
                {{ data.label }}
            </ion-tab-button>
        </ion-tab-bar>
    </ion-tabs>
</template>

<script>
import {
    IonTabs,
    IonTab,
    IonToolbar,
    IonTabBar,
    IonTabButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonIcon,
} from '@ionic/vue';

import { gridOutline, homeOutline, personOutline } from 'ionicons/icons';
import { UseStore } from '../stores/store';
export default {
    components: {
        IonTabs,
        IonTab,
        IonToolbar,
        IonTabBar,
        IonTabButton,
        IonContent,
        IonHeader,
        IonTitle,
        IonIcon,
    },
    setup() {
        const store = UseStore();
        return {
            store,
            gridOutline,
            homeOutline,
            personOutline
        }
    },
    data: function () {
        return {
            Options: [
                {
                    id: 1, label: 'Menu', icon: gridOutline
                },
                {
                    id: 2, label: 'Home', icon: homeOutline
                },
                {
                    id: 3, label: 'Profile', icon: personOutline
                }
            ]
        }
    },
    methods: {

    }
}
</script>

<style></style>