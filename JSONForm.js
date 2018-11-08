import React from 'react';
import {
  AppRegistry,
  DatePickerIOS,
  Picker,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  View
} from 'react-native';
import {
  CheckBox,
  List,
  ListItem,
  Radio
} from 'native-base';

import DatePicker from './DatePicker';

import styles from './FormStyles';

export default class JSONForm extends React.Component {
  static defaultProps = {
    submitButtonText: "Submit"
  }

  constructor(props) {
      super(props);

      // Map the initial values, if set, to their respective state values.
      // This allows the correct values to be passed if the form is submitted with no edits made.
      var initialProps = {};
      this.props.data.map((data, key) => initialProps[data.name] = data.value );

      this.state = initialProps;
  }

  getElement(title, name, type, from, required, key) {
    switch(type) {
      case("text"):
      case("textarea"):
        return(
          <View key={key} style={styles.card}>
            <View style={styles.innerCard}>
              <Text style={styles.header}>{title}</Text>
              <TextInput value={this.state[name]} onChangeText={(newValue) => this.updateField(name, newValue)} placeholder={title} selectTextOnFocus={true} multiline={type == "textarea"} />
            </View>
          </View>
        );
      case("select"):
        return(
          <View key={key} style={styles.card}>
            <View style={styles.innerCard}>
              <Text style={styles.header}>{title}</Text>
              <Picker
                selectedValue={this.state[name]}
                onValueChange={(newValue) => this.updateField(name, newValue)}>
                {from.map((item, index) => {
                    return <Picker.Item key={index} label={item.key} value={item.value} />
                  })}
              </Picker>
            </View>
          </View>
        );
      case("date"):
      case("time"):
      case("datetime"):
        return(
          <View key={key} style={styles.card}>
            <View style={styles.innerCard}>
              <Text style={styles.header}>{title}</Text>
              <DatePicker
                mode={type}
                date={this.state[name] ? new Date(this.state[name]) : undefined}
                setDate={(date) => this.updateField(name, date) } />
            </View>
          </View>
        );
      case("checkbox"):
        return(
          <View key={key} style={styles.card}>
            <View style={styles.innerCard}>
              <CheckBox ref={name} checked={this.state[name]} onPress={() => this.updateField(name, !this.state[name])} />
              <Text>{title}</Text>
            </View>
          </View>
        );
      case("radio"):
        return(
          <View key={key} style={styles.card}>
            <View style={styles.innerCard}>
              <Text style={styles.header}>{title}</Text>
              <List dataArray={from}
                  renderRow={(item) =>
                      <ListItem>
                          <Radio selected={this.state[name] == item.key} onPress={() => this.updateField(name, item.key)} />
                          <Text>{item.value}</Text>
                      </ListItem>
                  }>
              </List>
            </View>
          </View>
        )
    }
  }

  updateField(name, value) {
    var props = this.state;
    props[name] = value
    if(this.props.submitOnChange) {
      this.props.formHandler(props);
    }

    this.setState(props);
  }

  render() {
    return (
      <View style={this.props.style}>
        <ScrollView>
          {
            this.props.data.map((data, key) => {
              return this.getElement(data.title, data.name, data.type, data.from, data.required, key);
            })
          }
        </ScrollView>
        <TouchableOpacity onPress={() => this.props.formHandler(this.state)} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>{this.props.submitButtonText}</Text>
        </TouchableOpacity>
      </View>
    );
  }

}
