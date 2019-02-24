import React, { Component } from 'react';
import {
  Text,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';

export default class Button extends Component {
  render() {
    return (
      <TouchableHighlight style={styles.button} onPress={() => this.props.onPress()}>
        <Text>{this.props.children}</Text>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'green',
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
  },
});
