<template>
    <ion-page class="signup-page">
        <ion-content fullscreen>
            <!-- Logo -->
            <div class="logo-wrapper">
                <img src="../Images/Vector.png" alt="Routewise Logo" class="logo" />
            </div>

            <!-- Başlık -->
            <h1 class="title">Welcome to Routewise</h1> 
            <p class="subtitle">
                Login and unlock the smarter travel with RouteWise
            </p>

            <!-- Form -->
            <form @submit.prevent="onSubmit" class="form">
                <ion-item class="input-item" lines="none">
                    <ion-label position="stacked" class="inputLabels">Email Address</ion-label>
                    <ion-input v-model="this.store.LoginData.EMailAddress" type="email" placeholder="username@example.com" required></ion-input>
                </ion-item>

                <ion-item class="input-item" lines="none">
                    <ion-label position="stacked" class="inputLabels">Password</ion-label>
                    <ion-input v-model="this.store.LoginData.Password" type="password" placeholder="min. 6 characters" minlength="6"
                        required></ion-input>
                </ion-item>

                <ion-item class="input-item remember-item" lines="none">
                    <ion-checkbox v-model="this.store.LoginData.IsRemindDeviceActive" slot="start" class="remember-checkbox"></ion-checkbox>
                    <ion-label class="remember-label">Remember this device</ion-label>
                </ion-item>

                <ion-button 
                    v-if="!this.store.LoginData.Verified"
                    v-on:click="this.ContinueEmailVerificationStep()" type="submit" expand="block" class="continue-button" :disabled="!isValid()">
                    Continue
                </ion-button>
                <ion-button 
                    v-if="this.store.LoginData.Verified"
                    v-on:click="this.LoginService()" type="submit" expand="block" class="continue-button" :disabled="!isValid()">
                    Login
                </ion-button>
            </form>
        </ion-content>
    </ion-page>
</template>

<script>
import { UseStore } from '../stores/store';
import { IonPage, IonContent, IonItem, IonLabel, IonInput, IonButton, IonCheckbox  } from '@ionic/vue';
import { Device } from '@capacitor/device';
import axios from 'axios';
export default {
    components: {
        IonPage,
        IonContent,
        IonItem,
        IonLabel,
        IonInput,
        IonButton,
        IonCheckbox 
    },
    setup() {
        const store = UseStore();
        return {
            store
        }
    },
    data: function () {
        return {

        }
    },
    methods: {
        isValid(){
            var EMailAddress = this.store.LoginData?.EMailAddress;
            var Password = this.store.LoginData.Password;
            return this.store.EMailAddressRegex(EMailAddress) && Password ? true : false
        },
        async ContinueEmailVerificationStep(){
            ///login/email/verification/:EMailAddress

            var ServerRoot = this.store.ServerRoot;
            var EMailAddress = this.store.LoginData.EMailAddress;
            var Password = this.store.LoginData.Password;
            var Type = 'Login';

            axios.post(`${ServerRoot}/login/email/verification/${EMailAddress}`, {Password: Password})
                .then(res => {
                    console.log(res);
                    if(res.status === 200) this.$router.push({path:'/verification/' + this.store.LoginData.EMailAddress + '/' + Type});
                })
                .catch(err => {
                    console.log(err);
                    if(err.status === 504) this.ContinueEmailVerificationStep();
                })
        },
        async LoginService(){
            await this.GetDeviceDetails();
            var ServerRoot = this.store.ServerRoot;
            var EMailAddress = this.store.LoginData.EMailAddress;
            var Password = this.store.LoginData.Password;
            console.log("Login Data : ", JSON.stringify(this.store.LoginData));

            axios.post(`${ServerRoot}/login/${EMailAddress}`, { LoginData: this.store.LoginData, Password: Password})
                .then(res => {
                    console.log(res);
                    if(res.status === 200) {
                        this.store.UserData = res.data.UserData;
                        this.store.Token = res.data.Token;
                        this.$router.push({path:'/Home'});
                    }
                })
                .catch(err => {
                    console.log(err);
                    if(err.status === 504) this.ContinueEmailVerificationStep();
                })
        },
        async GetDeviceDetails() {
            const info = await Device.getInfo();
            const idResult = await Device.getId();
            console.log('Cihaz Bilgileri : ', JSON.stringify(info));
            console.log('Device.getId() sonucu:', JSON.stringify(idResult));
            console.log('Cihaz ID : ', idResult.identifier);

            var IsRemindDeviceActive = this.store.LoginData?.IsRemindDeviceActive;
            if (IsRemindDeviceActive) {
                var DeviceDetails = {
                    DeviceName: info.name || '',
                    Platform: info.platform || '',
                    Model: info.model || '',
                    OperatingSystem: info.operatingSystem || '',
                    Manufacturer: info.manufacturer || '',
                    DeviceId: idResult?.identifier || '',
                };

                this.store.LoginData.DeviceDetails = DeviceDetails;
            }
        }
    },
    watch:{
        'store.LoginData':{
            handler(newVal){
                if(newVal) console.log("Store LoginData NewVal : ", JSON.stringify(newVal));
            },
            immediate:true, deep:true
        }
    }
}
</script>

<style scoped>
.inputLabels{
    font-weight: bold;
}
.signup-page {
    --background: #ffffff;
}

.logo-wrapper {
    text-align: center;
    margin-top: 60px;
}

.logo {
    width: 80px;
    height: auto;
}

.title {
    text-align: center;
    margin: 24px 16px 8px;
    font-size: 24px;
    font-weight: 600;
    color: #000;
}

.subtitle {
    text-align: center;
    margin: 0 32px 24px;
    font-size: 14px;
    color: #666;
}

.form {
    padding: 0 16px;
}

.input-item {
    margin-bottom: 16px;
    --background: transparent;
}

ion-input {
    --padding-start: 12px;
    --padding-end: 12px;
    --border-radius: 8px;
}

.continue-button {
    --background: #e4002b;
    --border-radius: 24px;
    color:#fff;
    margin-top: 16px;
    font-size: 16px;
    font-weight: 500;
}

.remember-item {
    border: none; 
    --inner-padding-start: 4px;
    margin-top: 8px; 
    margin-bottom: 20px; 
}

.remember-checkbox {
    --size: 20px;
    --color-checked: #e4002b !important; 
    margin-right: 10px; 
}

.remember-label {
     font-size: 14px;
     color: #333;
}
</style>