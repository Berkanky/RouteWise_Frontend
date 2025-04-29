<template>
    <div></div>
</template>

<script>
import { Dialog } from '@capacitor/dialog';

export default {
    props: {
        AlertBarActive: {
            type: Boolean,
        },
        ServiceRequestData: {
            type: Object
        }
    },
    emits: {
        AlertBarClosed:{
            type: Boolean
        }
    },
    setup() {
        return {};
    },
    data() {
        return {
            ServiceRequestDataLocal: {},
            AlertBarActiveLocal: false
        }
    },
    methods: {
        async ErrorMessage(data) {
            console.log(data);
            if (!data) return;
            Dialog.alert({
                title:  data.status + ' Hata',
                message: data.message
            });

            setTimeout(() => { 

                this.$emit("AlertBarClosed", true);
                
             }, 3000);
        },
        async SuccessfullMesage(data) {
            console.log(data);
            if (!data) return;
            Dialog.alert({
                title: data.status + ' Başarılı',
                message: data.message
            });

            setTimeout(() => { 

                this.$emit("AlertBarClosed", true); 
            }, 3000);
        }
    },
    created() {
        console.log("AlertBar Active (created): ", this.AlertBarActive);
        console.log("Service Request Data (created): ", this.ServiceRequestData);

        this.AlertBarActiveLocal = this.AlertBarActive;
        this.ServiceRequestDataLocal = this.ServiceRequestData;

    },
    watch: {
        ServiceRequestDataLocal: {
            handler(newVal) {
                console.log("ServiceRequestData changed: ", newVal);
                console.log("AlertBarActive when changed: ", this.AlertBarActive);

                if ( newVal && Object.keys(newVal).length > 0) {
                    if (newVal.status > 199 && newVal.status < 300) {

                        //this.SuccessfullMesage(newVal);
                    } else {
                        this.ErrorMessage(newVal);
                    }
                }
            },
            immediate: true, deep: true,
        }
    }
}
</script>