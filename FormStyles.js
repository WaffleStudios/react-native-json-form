// @flow

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  header: {
    fontSize: 16,
    fontWeight: "bold"
  },
  container: {
    margin: 10
  },
  simpleButton: {
    backgroundColor: "#CCCCCC",
    padding: 5,
    alignItems: "center",
    maxWidth: 100
  },
  indent: {
    margin: 10
  },
  card: {
    minHeight: 100,
    justifyContent: "center",
    margin: 5,
    padding: 10,
    borderColor: "lightgray",
    borderWidth: 0.5,
    backgroundColor: "white"
  },
  submitButton: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    marginTop: 10,
    marginBottom: 25,
    borderColor: "lightgray",
    borderWidth: 0.5,
    backgroundColor: "green"
  },
  submitButtonText: {
    color: "white",
    fontSize: 30
  }
});
