<template>
    <capacitor-google-map ref="mapRef" style="display: inline-block; width: 100%; height: 100%">
    </capacitor-google-map>
</template>

<script>
import { GoogleMap } from "@capacitor/google-maps";

export default {
    name: 'GoogleMaps', 
    props: {
        markerData: {
            type: Array,
            required: true,
            default: () => [] 
        }
    },
    emits: ['onMarkerClicked', 'onMapClicked'],
    data() {
        return {
            markerIds: [],
            newMap: null 
        };
    },
    async mounted() {
        console.log("mounted, mapRef:", this.$refs.mapRef);
        await this.$nextTick();
        await this.createMap();
    },
    async beforeUnmount() { 
        console.log("Map component'i kaldırılıyor (beforeUnmount)...");
        if (this.newMap) {
            try {

                if (this.markerIds && this.markerIds.length > 0) {
                    await this.newMap.removeMarkers(this.markerIds);
                    console.log("Marker'lar kaldırıldı.");
                }
                await this.newMap.destroy();
                this.newMap = null;
                console.log("Harita başarıyla yok edildi.");
            } catch (error) {
                console.error("Harita temizlenirken hata oluştu:", error);
            }
        } else {
            console.log("Temizlenecek bir harita örneği bulunamadı.");
        }
    },
    methods: {
        async addSomeMarkers(currentMapInstance) {
            if (!currentMapInstance) {
                console.error("addSomeMarkers: Harita örneği bulunamadı.");
                return;
            }

            if (this.markerIds && this.markerIds.length > 0) {
                try {
                    await currentMapInstance.removeMarkers(this.markerIds);
                    console.log("Önceki marker'lar kaldırıldı.");
                    this.markerIds = []; 
                } catch (error) {
                    console.error("Mevcut marker'lar kaldırılırken hata:", error);
                }
            }

            const markersToAdd = this.markerData.map(({ coordinate, title, snippet }) => ({
                coordinate,
                title,
                snippet,
            }));

            if (markersToAdd.length > 0) {
                try {
                    this.markerIds = await currentMapInstance.addMarkers(markersToAdd);
                    console.log("Yeni marker'lar eklendi:", this.markerIds);
                } catch (error) {
                    console.error("Yeni marker'lar eklenirken hata:", error);
                    this.markerIds = []; 
                }
            } else {
                console.log("Eklenecek yeni marker bulunmuyor.");
                this.markerIds = [];
            }
        },
        async createMap() {
            if (!this.$refs.mapRef) {
                console.error("Harita elementi (mapRef) bulunamadı.");
                return;
            }

            try {
                this.newMap = await GoogleMap.create({
                    id: "my-cool-map",
                    element: this.$refs.mapRef,
                    apiKey: 'AIzaSyCM0jsiLje96wa8_A7M8LLutftfnkoSsqY',
                    config: {
                        center: {
                            lat: 41.015137,
                            lng: 28.979530,
                        },
                        zoom: 1,
                    },
                });

                console.log("Harita örneği oluşturuldu.");

                await this.addSomeMarkers(this.newMap);

                if (this.newMap && typeof this.newMap.setOnMarkerClickListener === 'function') {
                    this.newMap.setOnMarkerClickListener((event) => {
                        console.log('Marker tıklandı:', event);
                        this.$emit("onMarkerClicked", event);
                    });
                }

                if (this.newMap && typeof this.newMap.setOnMapClickListener === 'function') {
                    this.newMap.setOnMapClickListener(() => {
                        console.log('Harita tıklandı');
                        this.$emit("onMapClicked");
                    });
                }
                console.log("Harita oluşturuldu ve yapılandırıldı.");

            } catch (error) {
                console.error("Harita oluşturulurken hata:", error);
            }
        }
    }
};
</script>