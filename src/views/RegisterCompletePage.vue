<template>
    <ion-page class="signup-page">
        <ion-content fullscreen color="light">
            <BackButton/>

            <div class="logo-wrapper">
                <img src="../Images/RouteWise-3D-İcon.png" alt="Routewise Logo" class="logo" />
            </div>

            <!-- Başlık -->
            <h1 class="title">Register</h1>
            <p class="subtitle">
                Please fill in the necessary information to complete the registration process.
            </p>

            <!-- Form -->
            <form @submit.prevent="onSubmit" class="form">
                
                <ion-item class="input-container" lines="none">
                    <ion-input 
                        label="Email" label-placement="floating"
                        class="custom-input" v-model="this.store.RegisterData.EMailAddress" type="email"
                        required disabled></ion-input>
                </ion-item>

                <ion-item class="input-container" lines="none">
                    <ion-input 
                        label="Password" label-placement="floating"
                        :disabled="this.IsRegisterCompleted" class="custom-input"
                        v-model="this.store.RegisterData.Password" type="password"
                        required>
                        <ion-input-password-toggle color="medium" slot="end" v-if="this.store.RegisterData.Password"></ion-input-password-toggle>
                    </ion-input>
                </ion-item>

                <RequirementContainerVue
                    v-if="this.store.RegisterData.Password && !this.store.PasswordRegex(this.store.RegisterData.Password) "
                    Type="RegisterComplete"
                    RequirementType="Password"
                    :IsValid="this.store.PasswordRegex(this.store.RegisterData.Password)"
                />

                <ion-item class="input-container" lines="none">

                    <ion-input 
                        label="Password Confirm" label-placement="floating"
                        :disabled="this.IsRegisterCompleted" class="custom-input"
                        v-model="this.store.RegisterData.PasswordConfirm" type="password"
                        required>
                        <ion-input-password-toggle color="medium" slot="end" v-if="this.store.RegisterData.PasswordConfirm"></ion-input-password-toggle>
                    </ion-input>
                </ion-item>

                <RequirementContainerVue
                    Type="RegisterComplete"
                    RequirementType="PasswordConfirm"
                    :IsValid="this.store.PasswordRegex(this.store.RegisterData.PasswordConfirm)"
                />

                <div>
                    <ion-item v-if="this.PhoneNumberVerifyActive" class="input-container" lines="none" style="margin-top:16px;">
                        <ion-input
                            label="Digit Code" label-placement="floating"
                            v-model="this.VerificationId" type="tel" inputmode="numeric" maxlength="6"
                            class="custom-input" />
                    </ion-item>
                    <PhoneNumberInput Type="Register" v-if="!this.PhoneNumberVerifyActive && !this.PhoneNumberVerified"/>

                    <ion-item v-if="this.PhoneNumberVerified" class="input-container" lines="none" style="margin-top:16px;">
                        <ion-input 
                            :placeholder="this.store.RegisterData.DialCode + this.store.RegisterData.PhoneNumber"
                            class="custom-input" />
                    </ion-item>

                    <div class="requirements-list" v-if="this.PhoneNumberVerified">
                        <p class="requirement-item requirement-valid">
                            <ion-icon 
                                :icon="checkmarkOutline"
                                class="ion-icon-requirement-valid"
                            ></ion-icon>
                            The phone number was successfully confirmed.
                        </p>
                    </div>

                    <div class="button-container" v-if="!this.PhoneNumberVerified">

                        <ion-button 
                            :class="!this.store.PhoneNumberRegex(this.store.RegisterData.DialCode, this.store.RegisterData.PhoneNumber) ? 'continue-button-disabled' : 'continue-button'"
                            v-if="!this.PhoneNumberVerifyActive"
                            v-on:click="this.SendSMSVerification();"
                            :disabled="!this.store.PhoneNumberRegex(this.store.RegisterData.DialCode, this.store.RegisterData.PhoneNumber)" 
                            style="width:100%;">Verify</ion-button>
                        
                            <ion-button 
                            :class="!this.store.isValid(this.VerificationId) ? 'continue-button-disabled' : 'continue-button'"
                            :disabled="!this.store.isValid(this.VerificationId)"
                            v-if="this.PhoneNumberVerifyActive"
                            v-on:click="this.confirmPhoneNumber()"
                            style="width:100%;">Confirm</ion-button>
                        
                        <ion-button 
                            class="continue-button"
                            v-if="this.PhoneNumberVerifyActive"
                            v-on:click="this.cancelPhoneVerification()"
                            color="danger" style="width:100%;">Cancel</ion-button>
                    </div>
                </div>

                <ion-item class="input-container" lines="none">
                    <!-- <ion-label position="stacked" class="inputLabels">Name</ion-label> -->
                    <ion-input 
                        label="Name" label-placement="floating"
                        class="custom-input" :disabled="this.IsRegisterCompleted"
                        v-model="this.store.RegisterData.Name" type="text"
                        required></ion-input>
                </ion-item>

                <ion-item class="input-container" lines="none">
                    <!-- <ion-label position="stacked" class="inputLabels">Surname</ion-label> -->
                    <ion-input 
                        label="Surname" label-placement="floating"
                        class="custom-input" :disabled="this.IsRegisterCompleted"
                        v-model="this.store.RegisterData.Surname" type="text"
                        required></ion-input>
                </ion-item>
                
                <ion-button
                    v-if="!this.IsRegisterCompleted" v-on:click="this.CompleteRegister()" type="submit"
                    expand="block" :class="this.isValid() && this.PhoneNumberVerified ? 'continue-button' : 'continue-button-disabled'"
                    :disabled="!this.isValid() || !this.PhoneNumberVerified">
                    Complete
                </ion-button>
            </form>
        </ion-content>
    </ion-page>
</template>

<script>
import { closeOutline, checkmarkOutline } from 'ionicons/icons';
import BackButton from '@/components/BackButton.vue';
import RequirementContainerVue from '@/components/RequirementContainer.vue';
import PhoneNumberInput from '../components/PhoneNumberInput.vue';

import { UseStore } from '../stores/store';
import {
    IonPage,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonInputPasswordToggle,
    IonIcon
} from '@ionic/vue';
import axios from 'axios';
export default {
    components: {
        IonPage,
        IonContent,
        IonItem,
        IonInput,
        IonButton,
        IonInputPasswordToggle,
        RequirementContainerVue,
        PhoneNumberInput,
        IonIcon,
        BackButton
    },
    setup() {
        const store = UseStore();
        return {
            store,
            closeOutline, 
            checkmarkOutline
        }
    },
    data: function () {
        return {
            IsRegisterCompleted: false,
            PhoneNumberVerifyActive: false,
            VerificationId: '',
            PhoneNumberVerified: false
        }
    },
    created() {
        this.store.OnboardingStep = 3;
        this.store.RegisterData.VerifySended = false;
        this.store.RegisterData.Verified = false;
    },
    methods: {
        confirmPhoneNumber(){
            
            var EMailAddress = this.store.RegisterData.EMailAddress;
            var PhoneNumber = this.store.RegisterData.PhoneNumber;
            var DialCode = this.store.RegisterData.DialCode;
            var Type = 'RegisterComplete';
            var VerificationId = this.VerificationId;

            this.store.SMSVerify({EMailAddress: EMailAddress, PhoneNumber: PhoneNumber, DialCode: DialCode, Type: Type, VerificationId: VerificationId});
        },
        cancelPhoneVerification(){
            this.store.RegisterData.VerifySended = false;
        },
        SendSMSVerification(){
            var Type = 'RegisterComplete';
            this.store.SMSVerificationSend(Type);
        },
        IsPasswordConfirmRegex() {
            var PasswordConfirm = this.store.RegisterData?.PasswordConfirm;
            var isPasswordConfirmRegex = this.store.PasswordRegex(PasswordConfirm);
            console.log("Password Confirm Regex : ", isPasswordConfirmRegex);
            return isPasswordConfirmRegex
        },
        IsPasswordValid() {
            var Password = this.store.RegisterData.Password;
            var PasswordConfirm = this.store.RegisterData.PasswordConfirm;

            return Password === PasswordConfirm && this.store.PasswordRegex(Password) && this.store.PasswordRegex(PasswordConfirm) ? true : false;
        },
        goLoginPage() {
            this.store.LoginData.EMailAddress = this.store.RegisterData.EMailAddress;
            this.store.LoginData.Password = this.store.RegisterData.Password;

            this.store.RegisterData = {};

            this.$router.push({ path: '/login' });
        },
        async CompleteRegister() {
            var ServerRoot = this.store.ServerRoot;
            var EMailAddress = this.store.RegisterData.EMailAddress;
            axios.post(`${ServerRoot}/register/complete/${EMailAddress}`, { RegisterData: this.store.RegisterData })
                .then(res => {
                    console.log(res);
                    if (res.status === 200) this.IsRegisterCompleted = true, this.goLoginPage();
                })
                .catch(err => {
                    console.log(err);
                    if (err.status === 504) return this.CompleteRegister();
                })

        },
        isValid() {
            var Name = this.store.RegisterData.Name;
            var Surname = this.store.RegisterData.Surname;

            if (Name && Surname && this.IsPasswordValid()) return true
            return false
        },
    },
    watch:{
        'store.RegisterData':{
            handler(newVal){
                if( 'PhoneNumberVerifySended' in newVal && newVal["PhoneNumberVerifySended"] === true) this.PhoneNumberVerifyActive = true;
                else this.PhoneNumberVerifyActive = false;

                if( 'PhoneNumberVerified' in newVal && newVal['PhoneNumberVerified'] === true ) this.PhoneNumberVerified = true;
                else this.PhoneNumberVerified = false;
            },
            immediate: true, deep: true
        }
    }
}
</script>

<style scoped>
.button-container {
  display: flex;
  justify-content: center; 
  align-items: center;
  height: 100%;
  margin-bottom:15px;
}

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
    --highlight-color-focused: #000000;
}

.PasswordWarningCard {
    --border-width: 0 !important;
    --box-shadow: none !important;
    border: none !important;
    box-shadow: none !important;
}

.PasswordClass {
    border-radius: 30px;
    border: 1px solid #F00;
}

.signup-page {
    --background: #ffffff;
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

.requirements-list {
    width: 100%;
    padding-left: 15px;
    margin-top: 5px;
    margin-bottom: 30px;
}

.requirement-item {
    font-size: 0.8em;
    color: #888;
    margin-top: 5px;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
}

.requirement-invalid-text {
    color: #888;
}
.requirement-valid {
    color: green;
}


.ion-icon-requirement-valid {
    margin-right:5px;
    color:green;
    font-size:15px;
}

</style>