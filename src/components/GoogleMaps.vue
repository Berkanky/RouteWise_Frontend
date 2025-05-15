<template>
    <capacitor-google-map ref="mapRef" style="display: inline-block; width: 100%; height: 100%"></capacitor-google-map>
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
            newMap: null,
            clickMarkerId: null,
            originLocationId: null,
            currentRouteId: null,
            CurrentLocation:{}
        };
    },
    setup() {
        const store = UseStore();
        return {
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
                if (this.markerIds && this.markerIds.length > 0) await this.newMap.removeMarkers(this.markerIds);
                await this.newMap.destroy();
                this.newMap = null;
            } catch (error) {
                console.error("Harita temizlenirken hata oluştu:", error);
            }
        }
    },
    methods: {
        async AddMarkerToOriginLocation(lat, lng) {
            if (this.originLocationId) {
                try {
                    await this.newMap.removeMarkers([this.originLocationId]);
                    this.originLocationId = null;
                } catch (err) {
                    this.originLocationId = null;
                }
            }

            try {
                const markerResult = await this.newMap.addMarker({
                    coordinate: {
                        lat: lat,
                        lng: lng
                    },
                    title: 'Origin location.',
                });

                var newMarkerId = null;
                if (markerResult) newMarkerId = markerResult;

                if (newMarkerId) {

                    this.originLocationId = newMarkerId;
                    console.log("originLocationId : ", this.originLocationId);
                } else {
                    console.warn("Marker eklendi ancak ID alınamadı.", markerResult);
                }

            } catch (error) {
                console.error('Haritaya tıklama markeri eklenirken hata:', error);
            }
        },
        async AddMarkerToClickedLocation(lat, lng) {
            if (this.clickMarkerId) {
                try {
                    await this.newMap.removeMarkers([this.clickMarkerId]);
                    this.clickMarkerId = null;
                } catch (err) {

                    console.error("Eski tıklama markeri silinirken hata:", err);
                    this.clickMarkerId = null;
                }
            }

            try {
                const markerResult = await this.newMap.addMarker({
                    coordinate: {
                        lat: lat,
                        lng: lng
                    },
                    title: 'Destination Location.',
                });

                var newMarkerId = null;
                if (markerResult) newMarkerId = markerResult;

                if (newMarkerId) {

                    this.clickMarkerId = newMarkerId;
                    console.log("clickMarkerId : ", this.clickMarkerId);
                    this.store.DestinationLocation.latitude = lat;
                    this.store.DestinationLocation.longitude = lng;
                } else {
                    console.warn("Marker eklendi ancak ID alınamadı.", markerResult);
                }

            } catch (error) {
                console.error('Haritaya tıklama markeri eklenirken hata:', error);
            }
        },
        async createMap() {
            var latitude = this.store.CurrentLocation.latitude;
            var longitude = this.store.CurrentLocation.longitude;
            if (!this.$refs.mapRef) return
            if (this.newMap) return
            try {
                this.newMap = await GoogleMap.create({
                    id: "my-cool-map",
                    element: this.$refs.mapRef,
                    apiKey: this.store.GoogleAPIKey,
                    config: {
                        center: {
                            lat: latitude,
                            lng: longitude,
                        },
                        zoom: 12,
                    },
                });

                if (this.newMap && typeof this.newMap.setOnMarkerClickListener === 'function') {
                    this.newMap.setOnMarkerClickListener((event) => {
                        this.$emit("onMarkerClicked", event);
                    });
                }

                if (this.newMap && typeof this.newMap.setOnMapClickListener === 'function') {
                    this.newMap.setOnMapClickListener((mapClickEvent) => {

                        var latitude = mapClickEvent.latitude;
                        var longitude = mapClickEvent.longitude;
                        this.AddMarkerToClickedLocation(latitude, longitude);

                        this.$emit("onMapClicked", { latitude, longitude });
                    });
                }
            } catch (error) {
                console.error("Harita oluşturulurken hata:", error); 
            }
        },
        async drawRouteOnMap(mapInstance, decodedCoordinates, currentRouteId) {

            if (!mapInstance || typeof mapInstance.addPolylines !== 'function') return null;
            if (!decodedCoordinates || decodedCoordinates.length < 2) return null;

            try {
                try {
                    await mapInstance.removePolylines([currentRouteId]);
                } catch (removeError) {
                    console.warn(`'${currentRouteId}' ID'li polyline temizlenirken hata veya bulunamadı:`, removeError);
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
                console.log("routeId : ", result);
                var routeId = result[0];
                this.currentRouteId = routeId;
                return routeId;

            } catch (error) {
                console.error("Rota haritaya çizilirken hata oluştu:", error);
                return null;
            }
        },
        async handleRouteResponse(decoded_overview_polyline_points) {

            var decodedCoordinates = decoded_overview_polyline_points
            var map = this.newMap;

            if (map && decodedCoordinates) await this.drawRouteOnMap(map, decodedCoordinates, this.currentRouteId);
        }
    },
    watch: {
        'store.CalculatedRoute': {
            handler(newVal) {
                if (newVal && 'decoded_overview_polyline_points' in newVal) this.handleRouteResponse(newVal.decoded_overview_polyline_points);
            },
            immediate: true, deep: true
        },
        'store.CurrentLocation':{
            handler(newVal){
                if( newVal ) {

                    this.CurrentLocation.latitude = newVal.latitude;
                    this.CurrentLocation.longitude = newVal.longitude;
                    this.AddMarkerToOriginLocation(this.CurrentLocation.latitude, this.CurrentLocation.longitude);
                }
            },
            immediate: true, deep: true
        }
    }
};
</script>