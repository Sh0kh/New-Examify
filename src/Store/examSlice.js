import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: null,  // Изменим examData на data для consistency
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
};

const examSlice = createSlice({
    name: "exam",
    initialState,
    reducers: {
        examLoading: (state) => {
            state.status = 'loading';
        },
        examReceived: (state, action) => {
            state.status = 'succeeded';
            state.data = action.payload;
        },
        examFailed: (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        },
        resetExam: (state) => {
            state.data = null;
            state.status = 'idle';
            state.error = null;
        }
    },
});

export const { examLoading, examReceived, examFailed, resetExam } = examSlice.actions;
export default examSlice.reducer;