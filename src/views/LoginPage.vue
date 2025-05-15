<template>
    <ion-page >
        <ion-content fullscreen color="light">
            <BackButton />
            <!-- Logo -->
            <div class="logo-wrapper">
                <img src="../Images/RouteWise-3D-İcon.png" alt="Routewise Logo" class="logo" />
            </div>

            <!-- Başlık -->
            <h1 class="title">Welcome to RouteWise</h1>
            <p class="subtitle">
                Login and unlock the smarter travel with RouteWise
            </p>

            <!-- Form -->
            <form @submit.prevent="onSubmit" class="form">
                <ion-item class="input-container" lines="none">
                    <ion-input
                        label="Email" label-placement="floating"
                        class="custom-input" v-model="this.store.LoginData.EMailAddress" type="email"
                        required
                        :disabled="this.store.LoginData.Verified"></ion-input>
                </ion-item>

                <RequirementContainerVue 
                    v-if="this.store.LoginData.EMailAddress && !this.store.EMailAddressRegex(this.store.LoginData.EMailAddress)"
                    Type="Login" RequirementType="EMailAddress"
                    :IsValid="this.store.EMailAddressRegex(this.store.LoginData.EMailAddress)" />

                <ion-item class="input-container" lines="none">   
                    <ion-input 
                        label="Password" 
                        label-placement="floating"
                        :disabled="this.store.LoginData.Verified" 
                        class="custom-input"
                        v-model="this.store.LoginData.Password" type="password" 
                        required>
                        <ion-input-password-toggle v-if="this.store.LoginData.Password" color="medium" slot="end"></ion-input-password-toggle>
                    </ion-input>
                </ion-item>

                <RequirementContainerVue 
                    v-if="this.store.LoginData.Password && !this.store.PasswordRegex(this.store.LoginData.Password)"
                    Type="Login" RequirementType="Password"
                    :IsValid="this.store.PasswordRegex(this.store.LoginData.Password)" />

                <ion-item class="input-item remember-item" lines="none">
                    <ion-checkbox color="routematic-red" v-model="store.LoginData.IsRemindDeviceActive" slot="start"
                        class="remember-checkbox">
                    </ion-checkbox>

                    <ion-label class="remember-label">Remember this device</ion-label>

                    <ion-label 
                        v-if="!this.store.LoginData.Verified"
                        class="remember-label forgot-password-link" slot="end" @click="goSetPassword()"> Forgot
                        Password ?
                    </ion-label>
                </ion-item>

                <div v-if="!this.store.LoginData.Verified">
                    <ion-button 
                        :disabled="!isValid()"
                        v-on:click="goVerificationOptionsPage()" 
                        type="submit"
                        expand="block"
                        :class="!isValid() ? 'continue-button-disabled' : 'continue-button'"
                    >
                        Continue
                    </ion-button>
                    
                </div>
                <ion-button v-if="this.store.LoginData.Verified" v-on:click="this.LoginService()" type="submit"
                    expand="block" 
                    :class="!isValid() ? 'continue-button-disabled' : 'continue-button'"
                    :disabled="!isValid()">
                    Login
                </ion-button>
            </form>
        </ion-content>
    </ion-page>
</template>

<script>
import BackButton from '@/components/BackButton.vue';
import { callOutline, mailOpenOutline } from 'ionicons/icons';
import { UseStore } from '../stores/store';
import { IonPage, IonContent, IonItem, IonLabel, IonInput, IonButton, IonCheckbox, IonInputPasswordToggle } from '@ionic/vue';
import { Device } from '@capacitor/device';
import { Preferences } from '@capacitor/preferences';
import axios from 'axios';
import RequirementContainerVue from '@/components/RequirementContainer.vue';
export default {
    components: {
        IonPage,
        IonContent,
        IonItem,
        IonLabel,
        IonInput,
        IonButton,
        IonCheckbox,
        IonInputPasswordToggle,
        RequirementContainerVue,
        BackButton
    },
    setup() {
        const store = UseStore();
        return {
            store,
            callOutline,
            mailOpenOutline
        }
    },
    data: function () {
        return {
            EMailAddressVerificationActive: true,
        }
    },
    created() {
        if (!this.store.LoginData.Verified) this.store.OnboardingStep = 1;
    },
    methods: {
        goVerificationOptionsPage(){
            var ServerRoot = this.store.ServerRoot;
            var LoginData = this.store.LoginData;
            var EMailAddress = LoginData.EMailAddress;

            var Type = 'Login';

            axios.put(`${ServerRoot}/password/check/${EMailAddress}`, { LoginData: LoginData }, {})
                .then(res => {
                    console.log(res);
                    if( res.status === 200) {
                        this.store.LoginData.PhoneNumber = res.data.PhoneNumber;
                        this.store.LoginData.DialCode = res.data.DialCode;
                        
                        this.$router.push({ path:'/verification/options/' + EMailAddress + '/' + Type});
                    }
                })
                .catch(err => {
                    console.log(err);
                    if( err.status === 504) this.goVerificationOptionsPage();
                })
        },
        goSetPassword() {
            var EMailAddress = this.store.LoginData.EMailAddress;
            if (this.store.EMailAddressRegex(EMailAddress)) this.store.SetPasswordData.EMailAddress = EMailAddress;
            this.$router.push({ path: '/set/password' });
        },
        async saveRefreshToken(RefreshToken) {
            try {
                await Preferences.set({
                    key: 'RefreshToken',
                    value: RefreshToken,
                });
            } catch (error) {
                console.error('İsim kaydedilirken hata:', error);
            }
        },
        async deleteRefreshToken() {
            try {
                await Preferences.remove({ key: 'RefreshToken' });
                console.log('Refresh Token başarıyla silindi.');
            } catch (error) {
                console.error('Refresh Token silinirken hata:', error);
            }
        },
        isValid() {
            var EMailAddress = this.store.LoginData?.EMailAddress;
            var Password = this.store.LoginData.Password;
            return this.store.EMailAddressRegex(EMailAddress) && this.store.PasswordRegex(Password) ? true : false
        },
        async LoginService() {
            await this.GetDeviceDetails();
            var ServerRoot = this.store.ServerRoot;
            var EMailAddress = this.store.LoginData.EMailAddress;

            axios.post(`${ServerRoot}/login/${EMailAddress}`, { LoginData: this.store.LoginData })
                .then(res => {
                    console.log(res);
                    if (res.status === 200) {
                        this.store.GoogleAPIKey = res.data.GoogleAPIKey;
                        this.store.UserData = res.data.UserData;
                        this.store.Token = res.data.Token;
                        if ('RefreshToken' in res.data && res.data.RefreshToken) {
                            var RefreshToken = res.data.RefreshToken;
                            this.saveRefreshToken(RefreshToken);
                        } else {
                            this.deleteRefreshToken();
                        }
                        this.$router.push({ path: '/Home' });
                    }
                })
                .catch(err => {
                    console.log(err);
                    if (err.status === 504) this.LoginService();
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
    watch: {
        'store.LoginData': {
            handler(newVal) {

                var Type = 'Login';
                var VerificationType = this.EMailAddressVerificationActive ? 'Email' : 'SMS';

                if ( 'VerifySended' in newVal && newVal['VerifySended'] === true) {
                    this.$router.push({ path: "/verification/" + this.store.LoginData.EMailAddress + "/" + Type + '/' + VerificationType});
                }

                if ('Verified' in newVal && newVal['Verified']) this.store.OnboardingStep = 3;
            },
            immediate: true, deep: true
        }
    }
}
</script>

<style scoped>
.remember-item {
    border: none;
    --inner-padding-start: 4px;
    margin-top: 8px;
    margin-bottom: 20px;
}

.remember-checkbox {
    --size: 20px;
    margin-right: 10px;
}

.remember-label {
    font-size: 14px;
    color: #333;
}
</style>