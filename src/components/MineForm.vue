<template>
    <div class="mineFormBox">
        <input class="box" type="number" placeholder="가로" :value="row" @change="onChangeRow" />
        <input class="box" type="number" placeholder="세로" :value="cell" @change="onChangeCell" />
        <input class="box" type="number" placeholder="지뢰" :value="mine" @change="onChangeMine" />
        <button class="button btnPush btnRed" @click="onClickBtn">시작</button>
    </div>
</template>

<script>
import { START_GAME } from "../store";
export default {
    data() {
        return {
            row: null,
            cell: null,
            mine: null,
        };
    },
    methods: {
        onChangeRow(e) {
            this.row = e.target.value;
        },
        onChangeCell(e) {
            this.cell = e.target.value;
        },
        onChangeMine(e) {
            this.mine = e.target.value;
        },
        onClickBtn() {
            this.$store.commit(START_GAME, { row: this.row, cell: this.cell, mine: this.mine });
        },
    },
};
</script>
<style scoped>
.mineFormBox {
    display: flex;
    justify-content: center;
    align-items: center;
}
.box {
    margin: 0 3px;
    height: 40px;
    border-radius: 5px;
}
.button {
    display: block;
    position: relative;
    float: left;
    width: 120px;
    padding: 0;
    margin: 10px 20px 10px 2px;
    font-weight: 600;
    text-align: center;
    line-height: 50px;
    color: #fff;
    border-radius: 5px;
    transition: all 0.2s;
    border: 0;
    outline: 0;
    cursor: pointer;
    font-size: 20px;
}
.btnRed.btnPush {
    box-shadow: 0px 5px 0px 0px #a2151a;
}
.btnPush:hover {
    margin-top: 15px;
    margin-bottom: 5px;
}
.btnRed.btnPush:hover {
    box-shadow: 0px 0px 0px 0px #a2151a;
}
.btnRed {
    background: #e81e25;
}

input:focus {
    outline: none;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
./store ../store/store
