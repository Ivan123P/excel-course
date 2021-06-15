import { defaultStyles } from "@/constants";
import { defaultTitle } from "@/constants";
import { clone } from "@/core/utils";

const defaultState = {
  title: defaultTitle,
  dateOpen: new Date().toJSON(),
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

export function normalizeInitialState(state) {
  return state ? normalize(state) : clone(defaultState);
};