<template>
    <div>
        <mine-form />
        <div class="timeStyle">{{ timer }}</div>
        <table-component />
        <div class="resultStyle">{{ result }}</div>
    </div>
</template>

<script>
import MineForm from "./MineForm.vue";
import TableComponent from "./TableComponent.vue";
import store, { INCREMENT_TIMER } from "../store";
import { mapState } from "vuex";

let interval;
export default {
    components: { TableComponent, MineForm },
    store,
    computed: {
        ...mapState(["timer", "result", "halted"]),
    },
    watch: {
        halted(value, oldValue) {
            //false 일 때 게임 시작
            if (value === false) {
                interval = setInterval(() => {
                    this.$store.commit(INCREMENT_TIMER);
                }, 1000);
            } else {
                // 게임 중단
                clearInterval(interval);
            }
        },
    },
};
</script>

<style>
table {
    border-collapse: collapse;
    margin: auto;
    margin-top: 5vh;
}
td {
    border: 1px solid #000;
    width: 40px;
    height: 40px;
    text-align: center;
}
.timeStyle {
    margin-top: 15px;
    text-align: center;
    font-size: 56px;
}
.resultStyle {
    font-size: 24px;
    text-align: center;
    margin-top: 5%;
}
</style>
