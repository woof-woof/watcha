import { TfImageRecognition } from 'react-native-tensorflow';
let tfImageRecognition;

function init () {
  return new TfImageRecognition({
    model: { uri: 'tensorflow_inception_graph.pb' },
    labels: { uri: 'tensorflow_labels.txt' },
    imageMean: 117, // Optional, defaults to 117
    imageStd: 1 // Optional, defaults to 1
  });
}


if (!tfImageRecognition) tfImageRecognition = init();

export async function recognize(image) {
  if (!tfImageRecognition) tfImageRecognition = init();
  
  try {
    const results = await tfImageRecognition.recognize({
      image,
      inputName: "input",
      inputSize: 224,
      outputName: "output",
      maxResults: 1000,
      threshold: 0.1,
    });

    // await tfImageRecognition.close();

    console.log('@results', results.map(x => x.confidence));
    return results;
  } catch (err) {
    console.warn(err);
  }
}

export default {
  recognize,
};
