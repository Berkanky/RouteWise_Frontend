<template>
    <div class="requirements-list" v-if="this.RequirementType !== 'PasswordConfirm'">
        <p 
            :class="this.IsValid ? 'requirement-item requirement-valid' : 'requirement-item requirement-error'" 
        >
            <ion-icon 
                :icon="this.IsValid ? checkmarkOutline : closeOutline"
                :class="this.IsValid ? 'ion-icon-requirement-valid' : 'ion-icon-requirement-error'"
            ></ion-icon>
            {{ this.message }}
        </p>
    </div>
    <div class="requirements-list" v-if="this.RequirementType === 'PasswordConfirm'">
        <p 
            :class="this.IsValid ? 'requirement-item requirement-valid' : 'requirement-item requirement-error'" 
        >
            <ion-icon 
                :icon="this.IsValid ? checkmarkOutline : closeOutline"
                :class="this.IsValid ? 'ion-icon-requirement-valid' : 'ion-icon-requirement-error'"
            ></ion-icon>
            {{ this.message }}
        </p>
        <p 
            v-if="!this.IsPasswordsIsValid()"
            class="requirement-item requirement-error"
        >
            <ion-icon 
                :icon="closeOutline"
                class="ion-icon-requirement-error"
            ></ion-icon>
            The passwords you have entered do not match, please make sure that you have entered the password again correctly.
        </p>
    </div>
</template>

<script>
import { closeOutline, checkmarkOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/vue';
import { UseStore } from '../stores/store';

export default {
    props: {
        Type: {
            type: String
        },
        RequirementType:{
            type: String
        },
        IsValid:{
            type: Boolean
        }
    },
    components: {
        IonIcon
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
            message: '',
            EMailAddress: ''
        }
    },
    methods:{
        IsPasswordsIsValid(){
            var Password = this.store.RegisterData?.Password;
            var PasswordConfirm = this.store.RegisterData?.PasswordConfirm;

            if(!Password || !PasswordConfirm) return false;
            if(Password !== PasswordConfirm) return false;

            return true
        }
    },
    created() {
        var EMailAddress, message;

        if ( this.Type === "Login") EMailAddress = this.store.LoginData.EMailAddress;
        if ( this.Type === "Register") EMailAddress = this.store.RegisterData.EMailAddress;
        if( this.Type === "RegisterComplete") EMailAddress = this.store.RegisterData.EMailAddress;
        if ( this.Type === "setPassword") EMailAddress = this.store.SetPasswordData.EMailAddress;

        if( this.RequirementType === "EMailAddress") message = "Please enter a valid email address.";
        if( this.RequirementType === "Password") message = "Please enter a valid password. ";
        if( this.RequirementType === "PasswordConfirm") message = "Please enter a valid password. ";

        this.EMailAddress = EMailAddress; 
        this.message = message;
    }
}
</script>

<style scoped>
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

.requirement-error {
    color: red;
    font-weight: bold;
}

.requirement-valid {
    color: green;
}

.ion-icon-requirement-error {
    margin-right:5px;
    color:red;
    font-size:15px;
}

.ion-icon-requirement-valid {
    margin-right:5px;
    color:green;
    font-size:15px;
}

</style>