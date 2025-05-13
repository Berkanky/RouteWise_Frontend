<template>
    <div>
        <ion-item class="input-container" lines="none">
            <ion-select
                slot="start" placeholder="Code" interface="action-sheet"
                @ionChange="HandleChangeSelectCountry($event)"
                style="max-width: 100px;">
                <ion-select-option v-for="(country, key) in this.Countries" :key="key" :value="country.dial_code">
                    <span>
                        {{ country.dial_code }} {{ country.name }} 
                    </span>
                </ion-select-option>
            </ion-select>
            <ion-input class="custom-input" v-model="this.UserData.PhoneNumber" type="tel"
                placeholder="Please enter phone number." required></ion-input>
        </ion-item>
    </div>
</template>

<script>
import { 
    IonItem, 
    IonInput, 
    IonSelect, 
    IonSelectOption,
} from '@ionic/vue';
import { UseStore } from '../stores/store';
import axios from 'axios';
export default {
    props: {
        Type: {
            type: String
        }
    },
    components: {
        IonItem,
        IonInput,
        IonSelect,
        IonSelectOption
    },
    setup() {
        const store = UseStore();
        return {
            store
        }
    },
    data: function () {
        return {
            Countries: [],
            UserData: {},
        }
    },
    created() {
        this.GetCountries();
    },
    methods: {
        HandleChangeSelectCountry(event) {
            this.UserData.DialCode = event.detail.value;
        },
        GetCountries() {
            var ServerRoot = this.store.ServerRoot;

            axios.get(`${ServerRoot}/country/codes`)
                .then(res => {
                    console.log(res);
                    this.Countries = res.data.Countries;
                })
                .catch(err => {
                    console.log(err);
                    if (err.status === 504) return this.GetCountries();
                })
        },
    },
    watch: {
        UserData: {
            handler(newVal) {
                if (newVal) {
                    var Type = this.Type;
                    console.log("Type : ", Type);
                    console.log("UserData : ", newVal);
                    if (Type === 'Login') {
                        this.store.LoginData.DialCode = newVal.DialCode;
                        this.store.LoginData.PhoneNumber = newVal.PhoneNumber;

                    }
                    else if (Type === 'Register') {
                        this.store.RegisterData.DialCode = newVal.DialCode;
                        this.store.RegisterData.PhoneNumber = newVal.PhoneNumber;
                    }
                    else if (Type === 'setPassword') {
                        this.store.SetPasswordData.DialCode = newVal.DialCode;
                        this.store.SetPasswordData.PhoneNumber = newVal.PhoneNumber;
                    }
                }
            },
            immediate: true, deep: true
        }
    }
}
</script>

<style scoped>
.input-container {
    --background: #ffffff;
    --border-radius: 25px;
    --border-color: #e0e0e0;
    --border-width: 1px;
    --padding-start: 15px;
    --padding-end: 15px;
    width: 100%;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    --border-style: solid;
}

.custom-input {
    --placeholder-color: #999;
    --placeholder-opacity: 1;
}
</style>