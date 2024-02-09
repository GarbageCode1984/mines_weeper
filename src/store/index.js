import { createStore } from "vuex";

export const START_GAME = "START_GAME";
export const OPEN_CELL = "OPEN_CELL";
export const CLICK_MINE = "CLICK_MINE";
export const FLAG_CELL = "FLAG_CELL";
export const QUESTION_CELL = "QUESTION_CELL";
export const NORMALIZE_CELL = "NORMALIZE_CELL";
export const INCREMENT_TIMER = "INCREMENT_TIMER";

export const CODE = {
    NORMAL: -1, //닫힌 칸(지뢰 없음)
    QUESTION: -2,
    FLAG: -3,
    QUESTION_MINE: -4,
    FLAG_MINE: -5,
    CLICKED_MINE: -6,
    MINE: -7,
    OPENED: 0, //0 이상이면 다 모두 열린 칸
};

const plantMine = (row, cell, mine) => {
    // row * cell 만큼 배열 생성
    const candidate = Array(row * cell)
        .fill()
        .map((arr, i) => {
            return i;
        });

    // 지뢰를 랜덤하게 생성
    const shuffle = [];
    while (candidate.length > row * cell - mine) {
        const chosen = candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0];
        shuffle.push(chosen);
    }

    // 2차원 배열 격자판 만들기, 기본적으로 전부 닫힌 상태로
    const data = [];
    for (let i = 0; i < row; i++) {
        const rowData = [];
        data.push(rowData);
        for (let j = 0; j < cell; j++) {
            rowData.push(CODE.NORMAL);
        }
    }
    console.log(data);

    // 지뢰를 2차원 배열에 심는다.
    for (let k = 0; k < shuffle.length; k++) {
        const ver = Math.floor(shuffle[k] / cell);
        const hor = shuffle[k] % cell;
        data[ver][hor] = CODE.MINE;
    }
    return data;
};

export default createStore({
    state: {
        tableData: [],
        data: {
            row: 0,
            cell: 0,
            mine: 0,
        },
        timer: null,
        halted: true,
        result: "",
        openedCount: 0,
    },
    mutations: {
        [START_GAME](state, { row, cell, mine }) {
            state.data = {
                row,
                cell,
                mine,
            };
            state.tableData = plantMine(row, cell, mine);
            state.timer = 0;
            state.result = "";
            state.halted = false;
            state.openedCount = 0;
        },
        [OPEN_CELL](state, { row, cell }) {
            let openedCount = 0;
            const checked = [];

            //주변 8칸이 지뢰인지 검색
            function checkAround(row, cell) {
                const checkRowOrCellIsUndefined = row < 0 || row >= state.tableData.length || cell < 0 || cell >= state.tableData[0].length;
                if (checkRowOrCellIsUndefined) {
                    return;
                }
                if ([CODE.OPENED, CODE.FLAG, CODE.FLAG_MINE, CODE.QUESTION_MINE, CODE.QUESTION].includes(state.tableData[row][cell])) {
                    return;
                }
                if (checked.includes(row + "/" + cell)) {
                    return;
                } else {
                    checked.push(row + "/" + cell);
                }

                let around = [];
                if (state.tableData[row - 1]) {
                    around = around.concat([state.tableData[row - 1][cell - 1], state.tableData[row - 1][cell], state.tableData[row - 1][cell + 1]]);
                }
                around = around.concat([state.tableData[row][cell - 1], state.tableData[row][cell + 1]]);
                if (state.tableData[row + 1]) {
                    around = around.concat([state.tableData[row + 1][cell - 1], state.tableData[row + 1][cell], state.tableData[row + 1][cell + 1]]);
                }

                const counted = around.filter(function (v) {
                    return [CODE.MINE, CODE.FLAG_MINE, CODE.QUESTION_MINE].includes(v);
                });

                // 주변칸에 지뢰가 하나도 없으면
                if (counted.length === 0 && row > -1) {
                    const near = [];
                    if (row - 1 > -1) {
                        near.push([row - 1, cell - 1]);
                        near.push([row - 1, cell]);
                        near.push([row - 1, cell + 1]);
                    }
                    near.push([row, cell - 1]);
                    near.push([row, cell + 1]);
                    if (row + 1 < state.tableData.length) {
                        near.push([row + 1, cell - 1]);
                        near.push([row + 1, cell]);
                        near.push([row + 1, cell + 1]);
                    }
                    near.forEach(n => {
                        if (state.tableData[n[0]][n[1]] !== CODE.OPENED) {
                            checkAround(n[0], n[1]);
                        }
                    });
                }

                if (state.tableData[row][cell] === CODE.NORMAL) {
                    openedCount += 1;
                }
                state.tableData[row][cell] = counted.length;
            }
            checkAround(row, cell);

            let halted = false;
            let result = "";
            if (state.data.row * state.data.cell - state.data.mine === state.openedCount + openedCount) {
                halted = true;
                result = `${state.timer}초안에 성공했습니다. `;
            }
            state.openedCount += openedCount;
            state.halted = halted;
            state.result = result;
        },
        [CLICK_MINE](state, { row, cell }) {
            state.halted = true;
            state.tableData[row][cell] = CODE.CLICKED_MINE;
        },
        [FLAG_CELL](state, { row, cell }) {
            if (state.tableData[row][cell] === CODE.MINE) {
                state.tableData[row][cell] = CODE.FLAG_MINE;
            } else {
                state.tableData[row][cell] = CODE.FLAG;
            }
        },
        [QUESTION_CELL](state, { row, cell }) {
            if (state.tableData[row][cell] === CODE.FLAG_MINE) {
                state.tableData[row][cell] = CODE.QUESTION_MINE;
            } else {
                state.tableData[row][cell] = CODE.QUESTION;
            }
        },
        [NORMALIZE_CELL](state, { row, cell }) {
            if (state.tableData[row][cell] === CODE.QUESTION_MINE) {
                state.tableData[row][cell] = CODE.MINE;
            } else {
                state.tableData[row][cell] = CODE.NORMAL;
            }
        },
        [INCREMENT_TIMER](state) {
            state.timer += 1;
        },
    },
});
