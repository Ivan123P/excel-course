import { storage } from "@/core/utils"
import { defaultStyles } from "@/constants";
import { defaultTitle } from "@/constants";

const defaultState = {
  title: defaultTitle,
  colState: {},
  rowState: {},
  dataState: {}, // {'0:1': 'some text'}
  stylesState: {},
  currentText: '',
  currentStyles: defaultStyles,
}

const normalize = state => ({
  ...state,
  currentStyles: defaultStyles,
  currentText: ''
});

export const initialState = storage('excel-state') 
  ? normalize(storage('excel-state')) 
  : defaultState;