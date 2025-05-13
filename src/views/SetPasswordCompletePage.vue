<template>
  <ion-page>
    <ion-content :fullscreen="true" class="secure-journey-content" color="light">
      <BackButton />

      <div class="content-container">
        <div class="logo-wrapper">
          <img :src="SetPasswordLogo" alt="Lock Icon" class="logo" />
        </div>

        <h1 class="title">Secure your journey</h1>
        <p class="subtitle">Reset your password and unlock smarter travel with Routewise.</p>

        <ion-item class="input-container" lines="none">
          <ion-input label="Email" label-placement="floating" class="custom-input"
            v-model="this.store.SetPasswordData.EMailAddress" type="email" required disabled></ion-input>
        </ion-item>

        <ion-item lines="none" class="input-container">
          <ion-input label="Password" label-placement="floating" type="password"
            v-model="store.SetPasswordData.Password" @ionInput="validatePassword" class="custom-input">
            <ion-input-password-toggle color="medium" slot="end" v-if="this.store.SetPasswordData.Password"></ion-input-password-toggle>
          </ion-input>
        </ion-item>

        <ion-item lines="none" class="input-container">
          <ion-input label="Password Confirm" label-placement="floating" @ionInput="validatePasswordConfirm"
            type="password" v-model="store.SetPasswordData.PasswordConfirm" class="custom-input">
            <ion-input-password-toggle color="medium" slot="end" v-if="this.store.SetPasswordData.PasswordConfirm"></ion-input-password-toggle>
          </ion-input>
        </ion-item>

        <div class="requirements-list">
          <p v-for="(data, key) in PasswordRegexOptions" :key="key" class="requirement-item"
            :class="{ 'requirement-valid': data.isValid, 'requirement-invalid-text': !data.isValid }">

            <ion-icon :icon="data.isValid ? checkmarkOutline : closeOutline"
              :class="data.isValid ? 'ion-icon-requirement-valid' : 'ion-icon-requirement-error'"></ion-icon>

            {{ data.label }}
          </p>
        </div>

        <ion-button :disabled="!isFormValid" expand="block" shape="round"
          :class="isFormValid ? 'continue-button' : 'continue-button-disabled'" v-on:click="this.SetPasswordComplete()">
          Complete
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import BackButton from '@/components/BackButton.vue';
import { checkmarkOutline, closeOutline } from 'ionicons/icons';
import SetPasswordLogo from '../Images/SetPasswordPageLogo.png';
import { UseStore } from '../stores/store';
import { defineComponent } from 'vue';
import axios from 'axios';
import {
  IonPage,
  IonContent,
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
    IonItem,
    IonInput,
    IonButton,
    IonIcon,
    IonInputPasswordToggle,
    BackButton
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
        { id: 5, label: 'The passwords do not match.', isValid: false },
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
    checkPasswords(password) {
      var passwordConfirm = this.store.SetPasswordData.PasswordConfirm || '';
      if (password !== '' && passwordConfirm !== '' && password === passwordConfirm) return true;
      return false;
    },
    validatePasswordConfirm() {
      var Password = this.store.SetPasswordData.Password || '';
      var PasswordConfirm = this.store.SetPasswordData.PasswordConfirm || '';
      var IsPasswordConfirmValid = false;
      if (Password === PasswordConfirm) IsPasswordConfirmValid = true;
      console.log("IsPasswordConfirmValid : ", IsPasswordConfirmValid);
      var findedRegexOption = this.PasswordRegexOptions.find(function (item) { return item.id === 5 });

      if (IsPasswordConfirmValid) {
        if (findedRegexOption) findedRegexOption.isValid = true;
      }
      else {
        if (findedRegexOption) findedRegexOption.isValid = false;
      }
    },
    validatePassword() {
      var currentPassword = this.store.SetPasswordData.Password || '';
      this.PasswordRegexOptions = this.PasswordRegexOptions.map(option => {
        var isValid = false;
        switch (option.id) {
          case 1: isValid = this.checkMinLength(currentPassword); break;
          case 2: isValid = this.checkUppercase(currentPassword); break;
          case 3: isValid = this.checkLowercase(currentPassword); break;
          case 4: isValid = this.checkNumber(currentPassword); break;
          case 5: isValid = this.checkPasswords(currentPassword); break;
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

      axios.put(`${ServerRoot}/set/password/${EMailAddress}`, { Password: Password, PasswordConfirm: PasswordConfirm }, {
        headers: {
          "Authorization": "Bearer " + Token
        }
      })
        .then(res => {
          console.log(res);
          if (res.status === 200) {
            this.store.LoginData.EMailAddress = EMailAddress;
            this.store.SetPasswordData = {};
            this.$router.push({ path: '/login' });
          } else {
            console.log("Şifre yenilenemedi, tekrar deneyiniz. ");
          }
        })
        .catch(err => {
          console.log(err);
          if (err.status === 504) return this.SetPasswordComplete();
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

}

.custom-input {
  --placeholder-color: #999;
  --placeholder-opacity: 1;
  --highlight-color-focused: #000000;
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

.requirement-error {
  color: red;
  font-weight: bold;
}

.ion-icon-requirement-valid {
  margin-right: 5px;
  color: green;
  font-size: 15px;
}

.ion-icon-requirement-error {
  margin-right: 5px;
  color: red;
  font-size: 15px;
}

ion-toolbar {
  --background: transparent;
  --border-width: 0;
}

</style>