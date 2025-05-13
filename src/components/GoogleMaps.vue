<template>
    <capacitor-google-map ref="mapRef" style="display: inline-block; width: 100%; height: 100%">
    </capacitor-google-map>
</template>

<script>
import { GoogleMap } from "@capacitor/google-maps";
import { UseStore } from '../stores/store';
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
    setup(){
        const store = UseStore();
        return{
            store
        }
    },
    async mounted() {
        await this.$nextTick();
        await this.createMap();
    },
    async beforeUnmount() {
        if (this.newMap) {
            try {
                if (this.markerIds && this.markerIds.length > 0) {
                    await this.newMap.removeMarkers(this.markerIds);
                }
                await this.newMap.destroy();
                this.newMap = null;
            } catch (error) {
                // console.error("Harita temizlenirken hata oluştu:", error); // Yorumu kaldırdık
            }
        }
    },
    methods: {
        async addSomeMarkers(currentMapInstance) {
            if (!currentMapInstance) {
                return;
            }

            if (this.markerIds && this.markerIds.length > 0) {
                try {
                    await currentMapInstance.removeMarkers(this.markerIds);
                    this.markerIds = [];
                } catch (error) {
                    // console.error("Mevcut marker'lar kaldırılırken hata:", error); // Yorumu kaldırdık
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
                } catch (error) {
                    // console.error("Yeni marker'lar eklenirken hata:", error); // Yorumu kaldırdık
                    this.markerIds = [];
                }
            } else {
                this.markerIds = [];
            }
        },
        async createMap() {
            if (!this.$refs.mapRef) {
                return;
            }
            if (this.newMap) { // Harita zaten varsa tekrar oluşturma
                return;
            }
            try {
                this.newMap = await GoogleMap.create({
                    id: "my-cool-map",
                    element: this.$refs.mapRef,
                    apiKey: 'AIzaSyCM0jsiLje96wa8_A7M8LLutftfnkoSsqY', // API Anahtarınızı buraya girin
                    config: {
                        center: {
                            lat: 41.015137,
                            lng: 28.979530,
                        },
                        zoom: 1,
                    },
                });

                await this.addSomeMarkers(this.newMap);

                if (this.newMap && typeof this.newMap.setOnMarkerClickListener === 'function') {
                    this.newMap.setOnMarkerClickListener((event) => {
                        this.$emit("onMarkerClicked", event);
                    });
                }

                if (this.newMap && typeof this.newMap.setOnMapClickListener === 'function') {
                    this.newMap.setOnMapClickListener(() => {
                        this.$emit("onMapClicked");
                    });
                }
            } catch (error) {
                // console.error("Harita oluşturulurken hata:", error); // Yorumu kaldırdık
            }
        },
        async destroyMapInstance() {
            if (this.newMap) {
                try {
                    if (this.markerIds && this.markerIds.length > 0) {
                        await this.newMap.removeMarkers(this.markerIds);
                        this.markerIds = [];
                    }
                    await this.newMap.destroy();
                    this.newMap = null;
                } catch (error) {
                    // console.error("destroyMapInstance hata:", error); // Yorumu kaldırdık
                }
            }
        },
        async createMapInstance() {
            if (this.newMap) {
                return;
            }
            if (!this.$refs.mapRef) {
                await this.$nextTick();
                if (!this.$refs.mapRef) {
                    return;
                }
            }
            await this.createMap();
        },
        async drawRouteOnMap(mapInstance, decodedCoordinates, optionalRouteId = 'current_route') {
            if (!mapInstance || typeof mapInstance.addPolylines !== 'function') {
                console.error("Harita nesnesi geçerli değil veya addPolylines metodunu desteklemiyor.");
                return null;
            }
            if (!decodedCoordinates || decodedCoordinates.length < 2) {
                console.error("Rota çizmek için yetersiz koordinat bilgisi.");
                return null;
            }

            console.log(`Haritaya ${decodedCoordinates.length} noktadan oluşan bir rota çiziliyor...`);

            try {
                try {
                    await mapInstance.removePolylines([optionalRouteId]);
                    console.log(`Varsa, önceki '${optionalRouteId}' rotası temizlendi.`);
                } catch (removeError) {
                    console.warn(`'${optionalRouteId}' ID'li polyline temizlenirken hata veya bulunamadı:`, removeError);
                }
                const result = await mapInstance.addPolylines([
                    {
                        path: decodedCoordinates,
                        strokeColor: '#3880FF',
                        strokeWidth: 35,
                        geodesic: true,
                        tappable: false,
                        zIndex: 1,
                    }
                ]);
                const routeId = result[0];
                console.log("result : ", result);
                console.log(`Rota başarıyla çizildi. ID: ${routeId}`);
                return routeId;

            } catch (error) {
                console.error("Rota haritaya çizilirken hata oluştu:", error);
                return null;
            }
        },
        async handleRouteResponse(decoded_overview_polyline_points) {
            const decodedCoordinates = decoded_overview_polyline_points
            const map = this.newMap;

            if (map && decodedCoordinates) {
                const drawnRouteId = await this.drawRouteOnMap(map, decodedCoordinates);
                if (drawnRouteId) {
                    //
                }
            }
        }
    },
    watch: {
        'store.CalculatedRoute': {
            handler(newVal) {
                if (newVal) {
                    console.log(" CalculatedRoute : ", newVal);
                    this.handleRouteResponse(newVal.decoded_overview_polyline_points)
                }
            },
            immediate: true, deep: true
        }
    }
};
</script>