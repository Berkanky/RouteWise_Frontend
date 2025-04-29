<template>
    <ion-page class="signup-page">
        <ion-content fullscreen color="light">
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
                    <!-- <ion-label position="stacked" class="inputLabels">Email Address</ion-label> -->
                    <ion-input class="custom-input" v-model="this.store.LoginData.EMailAddress" type="email"
                        placeholder="username@example.com" required
                        :disabled="this.store.LoginData.Verified"></ion-input>
                </ion-item>

                <RequirementContainerVue Type="Login" RequirementType="EMailAddress"
                    :IsValid="this.store.EMailAddressRegex(this.store.LoginData.EMailAddress)" />

                <ion-item class="input-container" lines="none">
                    <!-- <ion-label position="stacked" class="inputLabels">Password</ion-label> -->
                    <ion-input :disabled="this.store.LoginData.Verified" class="custom-input"
                        v-model="this.store.LoginData.Password" type="password" placeholder="Password" minlength="6"
                        required>
                        <ion-input-password-toggle color="danger" slot="end"></ion-input-password-toggle>
                    </ion-input>
                </ion-item>

                <RequirementContainerVue Type="Login" RequirementType="Password"
                    :IsValid="this.store.PasswordRegex(this.store.LoginData.Password)" />

                <ion-item class="input-item remember-item" lines="none">
                    <ion-checkbox color="routematic-red" v-model="store.LoginData.IsRemindDeviceActive" slot="start"
                        class="remember-checkbox">
                    </ion-checkbox>

                    <ion-label class="remember-label">Remember this device</ion-label>

                    <ion-label class="remember-label forgot-password-link" slot="end" @click="goSetPassword()"> Forgot
                        Password ?
                    </ion-label>
                </ion-item>

                <ion-button v-if="!this.store.LoginData.Verified" v-on:click="this.store.LoginEmailVerificationSend()"
                    type="submit" expand="block" class="continue-button" :disabled="!isValid()">
                    Continue
                </ion-button>
                <ion-button v-if="this.store.LoginData.Verified" v-on:click="this.LoginService()" type="submit"
                    expand="block" class="continue-button" :disabled="!isValid()">
                    Login
                </ion-button>
            </form>
        </ion-content>
    </ion-page>
</template>

<script>
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
        RequirementContainerVue
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
    created() {
        if (!this.store.LoginData.Verified) this.store.OnboardingStep = 1;
    },
    methods: {
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

                if (newVal && 'VerifySended' in newVal && newVal['VerifySended']) {
                    this.$router.push({ path: "/verification/" + this.store.LoginData.EMailAddress + "/" + Type });
                }

                if (newVal && 'Verified' in newVal && newVal['Verified']) this.store.OnboardingStep = 3;
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
    margin-bottom: 15px;
    width: 100%;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    --border-style: solid;
}

.custom-input {
    --placeholder-color: #999;
    --placeholder-opacity: 1;
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

.continue-button {
    --background: #e4002b;
    --border-radius: 24px;
    color: #fff;
    margin-top: 16px;
    font-size: 16px;
    font-weight: 500;
    text-transform: none;
}

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