<template>
    <ion-grid class="steps-grid">
      <ion-row class="steps-row">
        <ion-col
          v-for="(item, key) in this.progress"
          :key="key"
          class="step-col"
        >
          <div class="step-bar">
            <div :class="this.stepCounter(item) ? 'step-fill-active' : 'step-fill'"/>
          </div>
        </ion-col>
      </ion-row>
    </ion-grid>
  </template>
  
  <script>
  import { UseStore } from '../stores/store';
  export default {
    name: 'StepsProgress',
    setup(){
        const store = UseStore();
        return{ 
            store
        }   
    },
    data:function(){
        return{
            progress:[
                {
                    id:1, step:1
                },
                {
                    id:2, step:2
                },
                {
                    id:3, step:3
                }
            ]
        }
    },
    methods:{
        stepCounter(item){
            console.log(this.store.OnboardingStep);
            return this.store.OnboardingStep === item.step ? true : false;
        }
    }
  };
  </script>
  
  <style scoped>
  .steps-grid {
    width: 60%;                   
    margin: 0 auto;               
    --ion-grid-padding: 0;        
    --ion-grid-column-padding: 0; 
  }
  .steps-row {
    align-items: center;
    justify-content: flex-start;  
    margin-top:15px;
  }
  .step-col {
    flex: 1;
    padding: 0 !important;       
  }
  .step-bar {
    width: 100%;
    height: 8px;
    overflow: hidden;
  }
  .step-fill {
    height: 100%;
    background: #fff;
    transition: width 0.3s ease;
  }
  .step-fill-active {
    height: 100%;
    background: #D10000;
    transition: width 0.3s ease;
  }
  </style>
