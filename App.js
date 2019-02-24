import React, { Component } from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  Image,
  StyleSheet,
} from 'react-native';
import { RNCamera as Camera } from 'react-native-camera';
import Button from 'watcha/src/components/Button';
const hotdog = require('./src/assets/hotdog.jpg') ;

import { recognize } from './src/utils/image-recognition';
export default class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      results: [],
      loading: false,
      image: null,
      looping: false,
    };
    
  }
  
  async loop() {
    do {
      this.setState({ looping: true });
      try {
        const work = await this.refresh();
        console.log('loop done');
      } catch (error) {
        console.warn('loop error', error);
      }
      this.setState({ looping: false });
    } while (true);
  }

  async takePicture() {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      console.log('@data', data);
      return data;
    }
  }

  async analyze(image) {
    console.log('analyze');
    const results = await recognize(image.uri || image);
    this.setState({ results: results || [], image, loading: false });
    console.log('@results', results);
    return results;
  }

  async refresh() {
    let picture;
    this.setState({ loading: true });
    try {
      picture = await this.takePicture();
      console.log('@picture', picture);;
    } catch (error) {
      return console.warn('refresh error', error);
    }
    try {
      const analysis = await this.analyze(picture);
      console.log('@analyze', analysis);
    } catch (error) {
      console.warn('analyze error', error);
    }
  }


  render() {
    const { loading, image, results } = this.state;

    return (
      <View style={styles.container}>
        {loading && <ActivityIndicator />}
        
        <Camera
          ref={ref => this.camera = ref}
          style={styles.preview}
          permissionDialogTitle={'Permission to use camera'}
          permissionDialogMessage={'We need your permission to use your camera phone'}
        />
        <View style={styles.overlay}>
          {image && <Image source={image} style={styles.image} />}
          
          {<Button onPress={() => this.loop()}>Watch-a</Button>}
          <Text>
            {results
              .sort((a, b) => a.confidence > b.confidence)
              .map(({ name, confidence }) => `${(confidence * 100).toFixed(3)}% ${name}`).join('\n')}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 80,
    alignContent: 'center',
    flex: 1,
    width: '100%',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  image: {
    width: 64,
    height: 64,
  },
  overlay: {
    position: 'absolute',
    backgroundColor: 'grey',
    left: 0,
    right: 0,
    bottom: 20,
    padding: 20,
  }
})
