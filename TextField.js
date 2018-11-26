import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import styles from './FormStyles';

export default class TextField extends React.Component {
  render() {
    if(this.props.disabled) {
      return (
        <View>
          <Text style={styles.header}>{this.props.title}</Text>
          <Text>{this.props.value}</Text>
        </View>
      );
    } else {
      return (
        <View>
          <Text style={styles.header}>{this.props.title}</Text>
          <TextInput value={this.props.value} onChangeText={(newValue) => this.props.onChangeText(newValue)} placeholder="Type here..." selectTextOnFocus={true} multiline={this.props.multiline} />
        </View>
      );
    }
  }
}
