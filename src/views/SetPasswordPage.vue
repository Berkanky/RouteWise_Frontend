<template>
    <ion-page class="signup-page">
        <ion-content fullscreen color="light">
            <BackButton />
            <!-- Logo -->
            <div class="logo-wrapper">
                <img src="../Images/RouteWise-3D-İcon.png" alt="Routewise Logo" class="logo" />
            </div>

            <!-- Başlık -->
            <h1 class="title">RouteWise</h1>
            <p class="subtitle">
                Reset your password and go on an adventure with RouteWise. Choose how you'd like to verify your profile.
            </p>
            
            <div class="container"><!-- 
                <p class="description">Choose how you'd like to verify your profile</p> -->

                <ion-list>
                    <ion-item 
                        v-for="(data, key) in this.Options" :key="key"
                        :class="this.SelectedOption.id === data.Id ? 'selected-item' : ''"
                        button @click="this.SelectedOption.id = data.Id;">
                        <ion-icon slot="start" :icon="data.Icon"></ion-icon>
                        <ion-label>
                            <h2> {{ data.Title }} </h2> 
                            <p>{{ data.Label}} </p>
                        </ion-label>
                        <ion-icon slot="end" :icon="chevronForward"></ion-icon>
                    </ion-item>
                </ion-list>

            </div>

            <form @submit.prevent="onSubmit" class="form" v-if="this.EmailVerificationActive()">

                <ion-item class="input-container" lines="none">
                    <!-- <ion-label position="stacked" class="inputLabels">Email Address</ion-label> -->
                    <ion-input
                        label="Email" label-placement="floating"
                        class="custom-input"
                        v-model="this.store.SetPasswordData.EMailAddress" type="email"
                        required></ion-input>
                </ion-item>

                <RequirementContainerVue
                    v-if="this.store.SetPasswordData.EMailAddress"
                    Type="setPassword"
                    RequirementType="EMailAddress"
                    :IsValid="this.store.EMailAddressRegex(this.store.SetPasswordData.EMailAddress)"
                />

                <ion-button v-on:click="this.store.SetPasswordEmailVerificationSend()" type="submit" expand="block"
                    class="continue-button" :disabled="!this.store.EMailAddressRegex(this.store.SetPasswordData.EMailAddress)">
                    Continue
                </ion-button>
            </form>

            <form @submit.prevent="onSubmit" class="form" v-if="!this.EmailVerificationActive()">

                <ion-item class="input-container" lines="none">
                    <!-- <ion-label position="stacked" class="inputLabels">Email Address</ion-label> -->
                    <ion-input 
                        label="Email" label-placement="floating"
                        class="custom-input"
                        v-model="this.store.SetPasswordData.EMailAddress" type="email"
                        required
                    >
                    </ion-input>
                </ion-item>

                <RequirementContainerVue
                    v-if="this.store.SetPasswordData.EMailAddress"
                    Type="setPassword"
                    RequirementType="EMailAddress"
                    :IsValid="this.store.EMailAddressRegex(this.store.SetPasswordData.EMailAddress)"
                />

                <PhoneNumberInput Type="setPassword"/>

                <RequirementContainerVue
                    v-if="this.store.SetPasswordData.DialCode && this.store.SetPasswordData.PhoneNumber"
                    Type="setPassword"
                    RequirementType="PhoneNumber"
                    :IsValid="this.store.PhoneNumberRegex(this.store.SetPasswordData.DialCode, this.store.SetPasswordData.PhoneNumber)"
                />

                <ion-button v-on:click="this.store.SMSVerificationSend(this.Type)" type="submit" expand="block"
                    :class="!this.store.PhoneNumberRegex(this.store.SetPasswordData.DialCode, this.store.SetPasswordData.PhoneNumber) || !this.store.EMailAddressRegex(this.store.SetPasswordData.EMailAddress) ? 'continue-button-disabled' : 'continue-button'"
                    :disabled="!this.store.PhoneNumberRegex(this.store.SetPasswordData.DialCode, this.store.SetPasswordData.PhoneNumber) || !this.store.EMailAddressRegex(this.store.SetPasswordData.EMailAddress)">
                    Continue
                </ion-button>
                </form>
        </ion-content>
    </ion-page>
</template>

<script>
import RequirementContainerVue from '@/components/RequirementContainer.vue';
import PhoneNumberInput from '@/components/PhoneNumberInput.vue';
import BackButton from '@/components/BackButton.vue';
import { UseStore } from '../stores/store';

import { mailOutline, callOutline, mailUnreadOutline } from "ionicons/icons";
import { IonPage, IonContent, IonItem, IonLabel, IonInput, IonButton, IonIcon, IonList } from '@ionic/vue';
export default {
    components: {
        IonList,
        IonIcon,
        IonPage,
        IonContent,
        IonItem,
        IonLabel,
        IonInput,
        IonButton,
        RequirementContainerVue,
        PhoneNumberInput,
        BackButton
    },
    setup() {
        const store = UseStore();
        return {
            store,
            callOutline,
            mailOutline,
            mailUnreadOutline,
        }
    },
    data: function () {
        return {
            Options:[
                {
                    Id: 1, Title:' Email', Label:"We'll send a verification code your email address.", Icon: mailOutline,
                },
                {
                    Id: 2, Title:' Phone', Label:"We'll send an SMS with a verification code to your phone.", Icon: callOutline,
                }
            ],
            SelectedOption:{ id: 1 },
            Type: 'setPassword'
        }
    },
    created(){
        this.store.OnboardingStep = 1;
    },
    methods: {
        EmailVerificationActive(){
            return this.SelectedOption.id === 1 ? true : false;
        }
    },
    watch:{
        'store.SetPasswordData':{
            handler(newVal){
                if(newVal) {
                    var Type = 'setPassword';
                    var VerificationType = this.SelectedOption.id === 1 ? 'Email' : 'SMS';
                    if( 'VerifySended' in newVal && newVal['VerifySended']){
                        this.$router.push({ path: '/verification/' + this.store.SetPasswordData.EMailAddress + '/' + Type + '/' + VerificationType});
                    }
                }
            },
            immediate:true, deep:true
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
  --highlight-color-focused: #000000;
}

.inputLabels {
    font-weight: bold;
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
    margin: 0 32px 0px;
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

.container {
    padding: 16px;
}

.description {
    color: gray;
}

.selected-item {
    --background: #e0e0e0;
    border-radius: 8px;
}
</style>