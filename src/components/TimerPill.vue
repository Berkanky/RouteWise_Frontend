<template>
    <div class="timer-pill">
        {{ minutes }}:{{ secondsPadded }}
    </div>
</template>

<script>
import { UseStore } from '../stores/store';
export default {
    setup() {
        const store = UseStore();
        return { store };
    },
    props: ['VerifySendedCount'],
    data() {
        return {
            minutes: 15,
            seconds: 0,
            timerId: null
        };
    },
    computed: {
        secondsPadded() {
            return String(this.seconds).padStart(2, '0');
        }
    },
    methods: {
        Reset() {
            // Mevcut interval'i temizle
            if (this.timerId) {
                clearInterval(this.timerId);
            }
            // Süreyi başa al
            this.minutes = 15;
            this.seconds = 0;
            // Yeni interval başlat
            this.timerId = setInterval(() => {
                if (this.seconds > 0) {
                    this.seconds--;
                } else if (this.minutes > 0) {
                    this.minutes--;
                    this.seconds = 59;
                } else {
                    clearInterval(this.timerId);
                    this.$emit("VerificationIdExpired", true);
                }
            }, 1000);
        }
    },
    created() {
        this.Reset();
    },
    beforeUnmount() {
        clearInterval(this.timerId);
    },
    watch: {
        VerifySendedCount(newVal) {
            if (newVal != null) {
                this.Reset();
            }   
        }
    }
};
</script>

<style scoped>
.timer-pill {
    display: inline-block;
    padding: 0.3em 1em;
    font-size: 1rem;
    font-weight: bold;
    color: #fff;
    background: linear-gradient(90deg, #ff4d4d, #e60000);
    border-radius: 999px;
    text-align: center;
    font-family: sans-serif;
}
</style>