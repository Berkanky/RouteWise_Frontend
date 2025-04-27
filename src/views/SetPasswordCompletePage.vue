<template>
  <ion-page>
    <ion-content :fullscreen="true" class="secure-journey-content">
      <div class="content-container">
        <ion-img :src="SetPasswordLogo" alt="Lock Icon" class="lock-icon"></ion-img>

        <h1 class="title">Secure your journey</h1>
        <p class="subtitle">Login and unlock smarter travel with Routewise.</p>

        <ion-item class="input-container" lines="none">
          <ion-label position="stacked" class="inputLabels">Email Address</ion-label>
          <ion-input 
            class="custom-input"
            v-model="this.store.SetPasswordData.EMailAddress" type="email"
            required disabled></ion-input>
        </ion-item>

        <ion-item lines="none" class="input-container">
          <ion-input type="password" placeholder="Enter your new password" v-model="store.SetPasswordData.Password"
            @ionInput="validatePassword" class="custom-input">
            <ion-input-password-toggle color="danger" slot="end"></ion-input-password-toggle>
          </ion-input>
        </ion-item>

        <ion-item lines="none" class="input-container">
          <ion-input type="password" placeholder="Confirm password" v-model="store.SetPasswordData.PasswordConfirm"
            class="custom-input">
            <ion-input-password-toggle color="danger" slot="end"></ion-input-password-toggle>
          </ion-input>
        </ion-item>

        <div class="requirements-list">
          <p class="requirement-item requirement-error" v-if="store.SetPasswordData.PasswordConfirm && !passwordsMatch">
            <ion-icon :icon="closeOutline" style="margin-right:5px;color:red;font-size:15px;"></ion-icon>
            Passwords do not match.
          </p>
          <template v-if="store.SetPasswordData.Password">
            <p v-for="(data, key) in PasswordRegexOptions" :key="key" class="requirement-item"
              :class="{ 'requirement-valid': data.isValid, 'requirement-invalid-text': !data.isValid }">
              <ion-icon :icon="checkmarkOutline" v-if="data.isValid"
                style="margin-right:5px;color:green;font-size:15px;"></ion-icon>
              <ion-icon :icon="closeOutline" v-if="!data.isValid"
                style="margin-right:5px;color:red;font-size:15px;"></ion-icon>
              {{ data.label }}
            </p>
          </template>
        </div>

        <ion-button :disabled="!isFormValid" expand="block" shape="round"
          :class="isFormValid ? 'continue-button-active' : 'continue-button'" v-on:click="this.SetPasswordComplete()">
          Complete
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { checkmarkOutline, closeOutline } from 'ionicons/icons';
import SetPasswordLogo from '../Images/SetPasswordPageLogo.png';
import { UseStore } from '../stores/store';
import { defineComponent } from 'vue';
import axios from 'axios';
import {
  IonPage,
  IonContent,
  IonImg,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonInputPasswordToggle
} from '@ionic/vue';

export default defineComponent({
  name: 'SecureJourneyPage',
  components: {
    IonPage,
    IonContent,
    IonImg,
    IonItem,
    IonInput,
    IonButton,
    IonIcon,
    IonInputPasswordToggle
  },
  setup() {
    const store = UseStore();
    return {
      store,
      SetPasswordLogo,
      checkmarkOutline,
      closeOutline,
    }
  },
  data() {
    return {
      PasswordRegexOptions: [
        { id: 1, label: 'Minimum 8 characters', isValid: false },
        { id: 2, label: 'At least one uppercase letter', isValid: false },
        { id: 3, label: 'At least one lowercase letter', isValid: false },
        { id: 4, label: 'At least one number', isValid: false },
      ],
    };
  },
  created() {
    this.store.OnboardingStep = 3;
    
    this.store.SetPasswordData.Password = '';
    this.store.SetPasswordData.PasswordConfirm = '';
  },
  computed: {
    passwordsMatch() {
      var pwd = this.store.SetPasswordData.Password;
      var confirmPwd = this.store.SetPasswordData.PasswordConfirm;
      return pwd && confirmPwd && pwd === confirmPwd;
    },
    allRulesValid() {
      return this.PasswordRegexOptions.every(option => option.isValid);
    },
    isFormValid() {
      return this.allRulesValid && this.passwordsMatch;
    }
  },
  methods: {
    checkMinLength(password) { return /^.{8,}$/.test(password); },
    checkUppercase(password) { return /[A-Z]/.test(password); },
    checkLowercase(password) { return /[a-z]/.test(password); },
    checkNumber(password) { return /\d/.test(password); },

    validatePassword() {
      var currentPassword = this.store.SetPasswordData.Password || '';
      this.PasswordRegexOptions = this.PasswordRegexOptions.map(option => {
        let isValid = false;
        switch (option.id) {
          case 1: isValid = this.checkMinLength(currentPassword); break;
          case 2: isValid = this.checkUppercase(currentPassword); break;
          case 3: isValid = this.checkLowercase(currentPassword); break;
          case 4: isValid = this.checkNumber(currentPassword); break;
        }
        return { ...option, isValid: isValid };
      });
    },

    SetPasswordComplete() {
      if (!this.isFormValid) return

      var EMailAddress = this.store.SetPasswordData.EMailAddress;
      var ServerRoot = this.store.ServerRoot;
      var Token = this.store.Token;
      console.log(" Token : ", Token);
      var Password = this.store.SetPasswordData.Password;
      var PasswordConfirm = this.store.SetPasswordData.PasswordConfirm;

      axios.put(`${ServerRoot}/set/password/${EMailAddress}`, { Password: Password, PasswordConfirm: PasswordConfirm}, {
        headers:{
          "Authorization": "Bearer " + Token 
        }
      })
        .then(res => {
          console.log(res);
          if( res.status === 200) {
            this.store.LoginData.EMailAddress = EMailAddress;
            this.$router.push({ path: '/login'});
            this.store.SetPasswordData = {};
          }else{
            console.log("Şifre yenilenemedi, tekrar deneyiniz. ");
          }
        })
        .catch(err => {
          console.log(err);
          if( err.status === 504) return this.SetPasswordComplete();
        })
    }
  },
});
</script>

<style scoped>
.secure-journey-content {
  --background: #ffffff;
}

.content-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 27px;
  padding-right: 27px;
  box-sizing: border-box;
}

.lock-icon {
  width: 80px;
  height: auto;
  margin-bottom: 30px;
  margin-top: 70px;
}

.title {
  font-size: 1.6em;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  text-align: center;
}

.subtitle {
  font-size: 0.9em;
  color: #888;
  margin-bottom: 40px;
  text-align: center;
  max-width: 250px;
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
  /* Kenarlık için stil eklendi */
}

.custom-input {
  --placeholder-color: #999;
  --placeholder-opacity: 1;
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

.requirement-valid {
  color: green;
}

.requirement-invalid-text {
  color: #888;
}

.requirement-error {
  color: red;
  font-weight: bold;
}

.continue-button {
  --background: #cccccc;
  --background-activated: #b0b0b0;
  --color: #666666;
  --border-radius: 25px;
  height: 50px;
  font-weight: bold;
  text-transform: none;
  width: 100%;
  margin-top: 10px;
  box-shadow: none;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.continue-button-active {
  --background: #e4002b;
  --color: #fff;
  --border-radius: 25px;
  height: 50px;
  font-weight: bold;
  text-transform: none;
  width: 100%;
  margin-top: 10px;
  box-shadow: none;
  transition: background-color 0.3s ease, color 0.3s ease;
}

ion-toolbar {
  --background: transparent;
  --border-width: 0;
}
</style>