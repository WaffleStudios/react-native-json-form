import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  DatePickerIOS,
  Picker,
  StyleSheet,
  Text,
  ScrollView,
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

import DatePicker from './DatePicker';

import styles from './FormStyles';

export default class JSONForm extends Component {
  constructor(props) {
      super(props);
      var initialProps = {};
      this.props.data.map((data, key) => initialProps[data.name] = data.value );

      this.state = initialProps;
  }

  getElement(title, name, type, from, required, key) {
    switch(type) {
      case("text"):
        return(
          <ListItem key={key}>
            <View>
              <Text style={styles.header}>{title}</Text>
              <InputGroup borderType='regular' style={styles.container}>
                <Input value={this.state[name]} onChangeText={(val) => this.setState({[name]: val})} placeholder={title}/>
              </InputGroup>
            </View>
          </ListItem>
        );
      case("select"):
        return(
          <ListItem key={key}>
            <View>
              <Text style={styles.header}>{title}</Text>
              <Picker
                selectedValue={this.state[name]}
                onValueChange={(lang) => this.setState({[name]: lang})}>
                {from.map((item, index) => {
                    return <Picker.Item key={index} label={item.value} value={item.key} />
                  })}
              </Picker>
            </View>
          </ListItem>
        );
      case("date"):
        return(
          <ListItem key={key}>
            <View>
              <Text style={styles.header}>{title}</Text>
              <DatePicker
                date={this.state[name] ? new Date(this.state[name]) : undefined}
                setDate={(date) => this.setState({[name]: date}) } />
            </View>
          </ListItem>
        );
      case("checkbox"):
        return(
          <ListItem key={key}>
            <CheckBox ref={name} checked={this.state[name]} onPress={() => this.setState({[name]: !this.state[name]})} />
            <Text>{title}</Text>
          </ListItem>
        );
    }
  }

  render() {
    return (
      <View>
        <List>
          {this.props.data.map((data, key) => {
            return this.getElement(data.title, data.name, data.type, data.from, data.required, key);
          })}
          <ListItem>
            <Button block success ref={(submit) => this._submitButton = submit} onPress={() => this.props.formHandler(this.state)}>Submit</Button>
          </ListItem>
        </List>
      </View>
    );
  }
}

JSONForm.propTypes = {
    data: React.PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['text', 'select', 'date', 'checkbox']).isRequired,
      required: PropTypes.bool
    })).isRequired,
    formHandler: PropTypes.func.isRequired
}
