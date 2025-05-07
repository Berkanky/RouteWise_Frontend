<template>
    <ion-header>
        <ion-toolbar>
            <ion-title>{{ currentTitle }}</ion-title>
            <ion-buttons slot="end">
                <ion-button @click="closeModal">
                    <ion-icon slot="icon-only" :icon="ioniconsCloseSharp"></ion-icon>
                </ion-button>
            </ion-buttons>
        </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
        <div v-if="currentStep === 1">
            <ion-segment v-model="bookingDetails.rideType" @ionChange="rideTypeChanged">
                <ion-segment-button value="carRide">
                    <ion-icon :icon="carOutline" class="segment-icon"></ion-icon>
                    <ion-label>Car Ride</ion-label>
                </ion-segment-button>
                <ion-segment-button value="deliveryBike">
                    <ion-icon :icon="carOutline" class="segment-icon"></ion-icon>
                    <ion-label>Delivery Bike</ion-label>
                </ion-segment-button>
            </ion-segment>

            <ion-list lines="none" class="location-inputs">
                <ion-item>
                    <ion-icon :icon="carOutline" slot="start" color="secondary"
                        class="location-icon"></ion-icon>
                    <ion-input v-model="bookingDetails.pickupLocation" placeholder="Alış konumu"
                        @click="selectPickupLocation" readonly></ion-input>
                </ion-item>
                <ion-item>
                    <ion-icon :icon="carOutline" slot="start" color="danger"
                        class="location-icon"></ion-icon>
                    <ion-input v-model="bookingDetails.destinationLocation" placeholder="Varış konumu"
                        @click="selectDestinationLocation" readonly></ion-input>
                </ion-item>
            </ion-list>

            <ion-item button @click="goToStep(2)" detail="true" class="price-range-item">
                <ion-icon :icon="carOutline" slot="start" color="success"></ion-icon>
                <ion-label>Fiyat Aralığı</ion-label>
                <ion-note slot="end" color="medium">
                    {{ formattedPriceRange || 'Belirtilmedi' }}
                </ion-note>
            </ion-item>

            <ion-button expand="block" @click="findRider" class="action-button">
                Find Rider
                <ion-icon slot="end" :icon="carOutline"></ion-icon>
            </ion-button>
        </div>

        <div v-if="currentStep === 2">
            <ion-item lines="none">
                <ion-label position="stacked">Minimum Fiyat ($)</ion-label>
                <ion-input type="number" v-model="priceRangeInput.min" placeholder="Örn: 10"></ion-input>
            </ion-item>
            <ion-item lines="none">
                <ion-label position="stacked">Maksimum Fiyat ($)</ion-label>
                <ion-input type="number" v-model="priceRangeInput.max" placeholder="Örn: 50"></ion-input>
            </ion-item>

            <ion-item lines="none" class="range-item">
                <ion-range :dual-knobs="true" :min="0" :max="100" :pin="true" :value="currentRangeValue"
                    @ionChange="rangeChanged($event)" color="primary">
                </ion-range>
            </ion-item>
            <p class="ion-text-center range-display">
                Min: ${{ priceRangeInput.min || 0 }} - Max: ${{ priceRangeInput.max || 100 }}
            </p>

            <ion-button expand="block" @click="applyPriceRange" class="action-button">
                Apply Price Range
            </ion-button>
            <ion-button expand="block" fill="clear" @click="clearPriceRangeAndGoBack" class="clear-button">
                Clear All
            </ion-button>
            <ion-button expand="block" fill="outline" @click="goToStep(1)" class="clear-button">
                Geri Dön
            </ion-button>
        </div>

        <div v-if="currentStep === 3">
            <ion-list v-if="availableVehicles.length > 0">
                <ion-item-divider>
                    <ion-label>Fiyat Aralığınızdaki Araçlar</ion-label>
                </ion-item-divider>
                <ion-item v-for="vehicle in availableVehicles" :key="vehicle.id" button @click="selectVehicle(vehicle)">
                    <ion-thumbnail slot="start">
                        <img :src="vehicle.imageUrl || 'https://via.placeholder.com/80x80.png?text=Araç'"
                            alt="vehicle image" />
                    </ion-thumbnail>
                    <ion-grid>
                        <ion-row class="ion-align-items-center">
                            <ion-col size="7">
                                <ion-label class="vehicle-name">{{ vehicle.name }}</ion-label>
                                <p class="vehicle-details">{{ vehicle.passengerCapacity }} Yolcu</p>
                            </ion-col>
                            <ion-col size="5" class="ion-text-end">
                                <ion-label color="primary" class="vehicle-price">${{ vehicle.price }}</ion-label>
                                <p class="vehicle-details">Varış {{ vehicle.arrivalTime }}</p>
                            </ion-col>
                        </ion-row>
                    </ion-grid>
                </ion-item>
            </ion-list>
            <div v-else class="ion-text-center ion-padding-top">
                <ion-icon :icon="carOutline" size="large" color="medium"></ion-icon>
                <p>Bu fiyat aralığında uygun araç bulunamadı.</p>
                <ion-button fill="outline" @click="goToStep(2)">Fiyat Aralığını Değiştir</ion-button>
            </div>

            <ion-button expand="block" @click="continueToNextStep" :disabled="!selectedVehicleId" class="action-button">
                Continue
            </ion-button>
            <ion-button expand="block" fill="outline" @click="goToStep(1)" class="clear-button">
                Rezervasyonu Değiştir
            </ion-button>
        </div>

    </ion-content>
</template>

<script>
import {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonList,
    IonItem,
    IonIcon,
    IonInput,
    IonLabel,
    IonNote,
    IonRange,
    IonThumbnail,
    IonGrid,
    IonRow,
    IonCol,
    IonItemDivider,
} from '@ionic/vue';
import {
    carOutline,
} from 'ionicons/icons';

export default {
    name: 'RideBookingComponent',
    components: {
        IonHeader,
        IonToolbar,
        IonTitle,
        IonButtons,
        IonButton,
        IonContent,
        IonSegment,
        IonSegmentButton,
        IonList,
        IonItem,
        IonIcon,
        IonInput,
        IonLabel,
        IonNote,
        IonRange,
        IonThumbnail,
        IonGrid,
        IonRow,
        IonCol,
        IonItemDivider,
    },
    emits: ['closeModal'],
    setup(){
        return{
            carOutline
        }
    },
    data() {
        return {
            currentStep: 1, // 1: Book, 2: Price Range, 3: Vehicles
            bookingDetails: {
                rideType: 'carRide', // 'carRide' or 'deliveryBike'
                pickupLocation: '',
                destinationLocation: '',
                priceRange: { min: 10, max: 50 },
            },
            priceRangeInput: { // Adım 2 için geçici girişler
                min: 10, // bookingDetails.priceRange.min ile senkronize olacak
                max: 50, // bookingDetails.priceRange.max ile senkronize olacak
            },
            currentRangeValue: { // ion-range için
                lower: 10,
                upper: 50
            },
            availableVehicles: [
                // Örnek veri, API'den gelecek
            ],
            selectedVehicleId: null,
        };
    },
    computed: {
        currentTitle() {
            if (this.currentStep === 1) return 'Book a ride';
            if (this.currentStep === 2) return 'Enter Price Range';
            if (this.currentStep === 3) return 'Cars in Your Price Range';
            return 'Book a Ride';
        },
        formattedPriceRange() {
            if (this.bookingDetails.priceRange.min === null || this.bookingDetails.priceRange.max === null) {
                return 'Belirtilmedi';
            }
            return `$${this.bookingDetails.priceRange.min} - $${this.bookingDetails.priceRange.max}`;
        },
    },
    watch: {
        currentRangeValue: {
            handler(newVal) {
                this.priceRangeInput.min = newVal.lower;
                this.priceRangeInput.max = newVal.upper;
            },
            deep: true // obje içindeki değişiklikleri de izlemesi için
        },
        'bookingDetails.priceRange': {
            handler(newVal) {
                this.priceRangeInput.min = newVal.min;
                this.priceRangeInput.max = newVal.max;
                this.currentRangeValue = { lower: newVal.min, upper: newVal.max };
            },
            deep: true,
            immediate: true // bileşen oluşturulduğunda da çalışsın
        }
    },
    methods: {
        closeModal() {
            this.$emit('closeModal');
        },
        goToStep(step) {
            this.currentStep = step;
            if (step === 2) {
                // Fiyat aralığı ekranına giderken mevcut değerleri inputlara ve range'e yükle
                this.priceRangeInput.min = this.bookingDetails.priceRange.min;
                this.priceRangeInput.max = this.bookingDetails.priceRange.max;
                this.currentRangeValue = {
                    lower: this.bookingDetails.priceRange.min,
                    upper: this.bookingDetails.priceRange.max
                };
            }
        },
        rideTypeChanged(event) {
            this.bookingDetails.rideType = event.detail.value;
            console.log('Ride type changed to:', this.bookingDetails.rideType);
        },
        selectPickupLocation() {
            console.log('Selecting pickup location...');
            this.bookingDetails.pickupLocation = '123 Ana Cadde, Merkez (Örnek)';
        },
        selectDestinationLocation() {
            console.log('Selecting destination location...');
            this.bookingDetails.destinationLocation = '456 Yan Sokak, Hedef (Örnek)';
        },
        applyPriceRange() {
            const min = Number(this.priceRangeInput.min);
            const max = Number(this.priceRangeInput.max);

            if (!isNaN(min) && !isNaN(max) && min <= max) {
                this.bookingDetails.priceRange.min = min;
                this.bookingDetails.priceRange.max = max;
                this.goToStep(1);
            } else {
                console.error("Geçersiz fiyat aralığı");
                // Kullanıcıya hata mesajı göstermek için bir alert veya toast eklenebilir
            }
        },
        clearPriceRangeAndGoBack() {
            const defaultMin = 10;
            const defaultMax = 50;
            this.priceRangeInput.min = defaultMin;
            this.priceRangeInput.max = defaultMax;
            this.currentRangeValue = { lower: defaultMin, upper: defaultMax };
            this.bookingDetails.priceRange.min = defaultMin;
            this.bookingDetails.priceRange.max = defaultMax;
            // Genellikle kullanıcıyı bir önceki ekrana (Adım 1) geri götürür,
            // ama tasarımda "Clear All" sonrası direkt geri dönmeyebilir, bu yüzden goToStep(1) yorumda.
            // İsterseniz this.goToStep(1); satırını aktif edebilirsiniz.
        },
        rangeChanged(event) {
            const { lower, upper } = event.detail.value;
            // Bu değerler zaten currentRangeValue watcher'ı tarafından priceRangeInput'a aktarılacak.
            // Eğer direkt bookingDetails'i güncellemek isterseniz:
            // this.bookingDetails.priceRange.min = lower;
            // this.bookingDetails.priceRange.max = upper;
            // Ama genellikle "Apply" butonu ile bu işlem yapılır.
            // Şimdilik sadece currentRangeValue güncelleniyor, watcher bunu priceRangeInput'a yansıtıyor.
        },
        async findRider() {
            console.log('Finding rider with details:', this.bookingDetails);
            // TODO: API çağrısı yaparak araçları/sürücüleri bul

            // Demo için örnek araçlar:
            this.availableVehicles = [
                { id: 1, name: 'Toyota Camry', passengerCapacity: 4, price: 12, arrivalTime: '1-2m', imageUrl: 'https://via.placeholder.com/80x80.png?text=Car1' },
                { id: 2, name: 'Honda Civic', passengerCapacity: 4, price: 10, arrivalTime: '2-4m', imageUrl: 'https://via.placeholder.com/80x80.png?text=Car2' },
                { id: 3, name: 'Ford Focus', passengerCapacity: 3, price: 15, arrivalTime: '3-5m', imageUrl: 'https://via.placeholder.com/80x80.png?text=Car3' },
            ];
            this.selectedVehicleId = null; // Yeni aramada seçimi sıfırla
            this.goToStep(3);
        },
        selectVehicle(vehicle) {
            this.selectedVehicleId = vehicle.id;
            console.log('Vehicle selected:', vehicle);
        },
        continueToNextStep() {
            if (!this.selectedVehicleId) {
                console.error('Please select a vehicle.');
                // Kullanıcıya bir uyarı gösterilebilir
                return;
            }
            console.log('Continuing with selected vehicle ID:', this.selectedVehicleId);
            // TODO: Ödeme veya rezervasyon onayı gibi bir sonraki adıma geçiş
            this.closeModal(); // Veya modalı kapatıp ana sayfada bir sonraki adıma geç
        },
    },
    created() {
        // Başlangıçta priceRangeInput ve currentRangeValue'nun bookingDetails ile senkronize olmasını sağla
        this.priceRangeInput.min = this.bookingDetails.priceRange.min;
        this.priceRangeInput.max = this.bookingDetails.priceRange.max;
        this.currentRangeValue = {
            lower: this.bookingDetails.priceRange.min,
            upper: this.bookingDetails.priceRange.max
        };
    }
};
</script>

<style scoped>
ion-segment-button {
    text-transform: none;
}

.segment-icon {
    margin-right: 6px;
}

.location-inputs {
    margin-top: 16px;
    margin-bottom: 16px;
}

.location-icon {
    margin-right: 8px;
}

.price-range-item {
    margin-bottom: 20px;
}

.action-button {
    margin-top: 20px;
    height: 48px;
    font-weight: bold;
}

.clear-button {
    margin-top: 10px;
}

ion-range {
    padding-top: 10px;
    padding-bottom: 10px;
}

.range-item {
    margin-top: 10px;
    margin-bottom: 0px;
    padding-bottom: 0px;
}

.range-display {
    font-size: 0.9em;
    color: var(--ion-color-medium);
}

ion-thumbnail {
    --size: 60px;
    margin-right: 12px;
}

.vehicle-name {
    font-weight: bold;
    font-size: 1.1em;
    margin-bottom: 2px;
}

.vehicle-details {
    font-size: 0.85em;
    color: var(--ion-color-medium-shade);
    margin: 2px 0;
}

.vehicle-price {
    font-size: 1.1em;
    font-weight: bold;
}
</style>