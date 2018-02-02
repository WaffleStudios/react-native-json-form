import React from 'react';

import {
  DatePickerAndroid,
  DatePickerIOS,
  Platform,
  ScrollView,
  Text,
  TimePickerAndroid,
  TouchableOpacity,
  View
} from 'react-native';

import styles from './FormStyles';

export default class JSONForm extends React.Component {
  static defaultProps = {
    mode: "date"
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
            <TouchableOpacity
              onPress={() => this.setState({showPicker: true})}>
              <Text>{this.props.date != undefined ? this.formattedDate() : "Add Date"}</Text>
            </TouchableOpacity>
          </View>
        );
      } else {
        return(
          <View>
            <DatePickerIOS
              date={this.props.date != undefined ? this.props.date : new Date()}
              mode={this.props.mode}
              onDateChange={ this.props.setDate }
            />
            <View style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
              <TouchableOpacity
                onPress={() => {
                  this.props.setDate(undefined);
                  this.setState({showPicker: false})
              }}>
                  <Text style={{color: "red"}}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.setState({showPicker: false})}>
                <Text>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      }
    } else {
      return(
        <View style={styles.indent}>
          <TouchableOpacity
            onPress={this.showPicker.bind(this, {date: this.props.date})}>
            <Text>{this.props.date != undefined ? this.formattedDate() : "Add Date"}</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  // Date.toLocaleDateString() causes issues past the year 2038 (https://en.wikipedia.org/wiki/Year_2038_problem ?)
  // This formats a date string in a way that is compatible to the year 9999.
  // By that point, I am dead, and this code is someone else's problem
  formattedDate() {
    var month = this.props.date.getMonth() + 1;
    var day = this.props.date.getDate();
    var year = this.props.date.getFullYear();
    var date = month + '/' + day + '/' + year;

    var hours = this.props.date.getHours();
    var minutes = this.props.date.getMinutes();
    var amPm = hours < 12 ? "AM" : "PM"
    if(hours == 0) {
      hours = 12
    } else if(hours > 12) {
      hours -= 12
    }

    if(minutes < 10) {
      minutes = "0" + minutes
    }

    var time = hours + ':' + minutes + ' ' + amPm

    if(this.props.mode == "date") {
      return date;
    } else if(this.props.mode == "time") {
      return time;
    } else {
      return date + " " + time;
    }
  }

  // Android only.  Handles date picking.  Selecting a date, then hitting "OK" will save the date, selecting "Cancel" will clear the date.
  showPicker(options) {
    if(["date", "datetime"].includes(this.props.mode)) {
      this.showDatePicker(options);
    } else {
      this.showTimePicker(options);
    }
  }

  showDatePicker = async (options) => {
    if(["date", "datetime"].includes(this.props.mode)) {
      try {
        const {action, year, month, day} = await DatePickerAndroid.open(options);
        if (action === DatePickerAndroid.dismissedAction) {
          this.props.setDate(undefined);
        } else {
          var date = new Date(year, month, day);
          if(this.props.mode == "date") {
            this.props.setDate(date);
          } else {
            this.showTimePicker({date: date});
          }
        }
      } catch ({code, message}) {
        console.warn('Cannot Open Date Picker: ', message);
      }
    }
  }

  showTimePicker = async (options) => {
    try {
      var date = options.date;
      if(!date) {
        date = new Date();
      }

      const {action, hour, minute} = await TimePickerAndroid.open({
        hour: date.getHours(),
        minute: date.getMinutes(),
        is24Hour: false
      });

      if (action == TimePickerAndroid.dismissedAction) {
        if(this.props.mode == "time") {
          this.props.setDate(undefined)
        } else {
          this.showDatePicker({date: date})
        }
      } else {
        date.setHours(hour);
        date.setMinutes(minute);
        date.setSeconds(0);
        date.setMilliseconds(0);
        this.props.setDate(date);
      }
    } catch ({code, message}) {
      console.warn('Cannot Open Time Picker: ', message);
    };
  }

  render() {
    return this.datePicker();
  }
}
