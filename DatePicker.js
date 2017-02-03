import React, { Component, PropTypes } from 'react';

import {
  DatePickerAndroid,
  DatePickerIOS,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import {
  Button,
  CheckBox,
  Container,
  Content,
  Header,
  Input,
  InputGroup,
  List,
  ListItem,
} from 'native-base';

import styles from './FormStyles';

export default class JSONForm extends Component {
  propTypes: {
    date: PropTypes.date,
    setDate: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {}
  }

  // Android and iOS do date picker handling differently.  iOS displays the picker inline, and Android has a separate popup to handle it.
  // In an attempt to unify the functionality, I use a button that, when pressed, displays the date picker.
  // On Android, it's handled by the window.
  // On iOS, I have added "submit" and "clear" buttons to set and remove the dates.
  datePicker() {
    if(Platform.OS === 'ios') {
      if(!this.state.showPicker) {
        return(
          <View style={styles.indent}>
            <Button
              onPress={() => this.setState({showPicker: true})}>
              {this.props.date != undefined ? this.formattedDate() : "Add Date"}
            </Button>
          </View>
        );
      } else {
        return(
          <View>
            <DatePickerIOS
              date={this.props.date != undefined ? this.props.date : new Date()}
              mode="date"
              onDateChange={ this.props.setDate }
            />
            <View style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
              <Button danger
                onPress={() => {
                  this.props.setDate(undefined);
                  this.setState({showPicker: false})
              }}>Clear</Button>
              <Button
                onPress={() => this.setState({showPicker: false})}>Submit</Button>
            </View>
          </View>
        );
      }
    } else {
      return (
        <View style={styles.indent}>
          <Button
            onPress={this.showPicker.bind(this, {date: this.state.simpleDate})}>
            {this.props.date != undefined ? this.formattedDate() : "Add Date"}
          </Button>
        </View>
      );
    }
  }

  // Date.toLocaleDateString() causes issues past the year 2038 (https://en.wikipedia.org/wiki/Year_2038_problem ?)
  // This formats a date string in a way that is compatible to the year 9999.
  // By that point, I am dead, and this code is someone else's problem
  formattedDate() {
    var mm = this.props.date.getMonth() + 1;
    var dd = this.props.date.getDate();
    var yyyy = this.props.date.getFullYear();
    var date = mm + '/' + dd + '/' + yyyy;

    return date;
  }

  // Android only.  Handles date picking.  Selecting a date, then hitting "OK" will save the date, selecting "Cancel" will clear the date.
  showPicker = async (options) => {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open(options);
      if (action === DatePickerAndroid.dismissedAction) {
        this.props.setDate(undefined);
      } else {
        var date = new Date(year, month, day);
        this.props.setDate(date);
      }
    } catch ({code, message}) {
      console.warn(`Error in example '${stateKey}': `, message);
    }
  };

  render() {
    return this.datePicker();
  }
}
