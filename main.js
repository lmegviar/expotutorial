import Expo from 'expo';
import React from 'react';
import { StyleSheet, Text, View, Button, Image} from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

Expo.Audio.setIsEnabledAsync(true);

const sound = new Expo.Audio.Sound({
  source: 'http://traffic.libsyn.com/blackastronautspodcast/HWHAP-_Dianne_Bruce.mp3?dest-id=138957',
});

var playing = false;
var rate = 1.0;

var _handlePlaySoundAsync = () => {
  if (playing) {
    sound.pauseAsync()
    playing = false;
  } else {
  sound.loadAsync()
  .then(() => {
    playing = true;
    sound.playAsync();
  })
  }
};

var _handleIncreaseSpeed = () => {
  if (rate < 32) {
    rate += 0.25;
  }
  sound.setRateAsync(rate, true)
}

var _handleDecreaseSpeed = () => {
  if (rate > 0) {
    rate -= 0.25;
  }
  sound.setRateAsync(rate, true)
}


class App extends React.Component {
  constructor() {
      super();
      this.state = {
          podcasts: 'Podcasts Loading',
          playing: {}
      }
  }

  componentDidMount() {
    this.getPodcasts()
    .then(this.postFeed)
    .catch(console.log);
  }

  getPodcasts () {
    return fetch('https://itunes.apple.com/search?term=black+astronauts+podcast')
      .then(response => response.json())
      .then(response => {
        this.setState({
          podcasts: response.results
        });
        return response.results[0].feedUrl;
      });
  }

  postFeed (feedUrl) {

    console.warn(feedUrl);

    return fetch('http://10.0.2.2:3000/api/podcastParse', {
      method: 'post',
      data: JSON.stringify({
        feedUrl: feedUrl
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.json())
    .then(podcastObj => {
      console.warn(podcastObj);
      this.setState({
        playing: podcastObj
      });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={{uri: this.state.podcasts[0].artworkUrl100 }} style={{width: 100, height: 100}}/>
        <Text style={styles.title}>
          {this.state.podcasts[0].collectionName}
        </Text>
        <Text style={styles.artist}>
          {this.state.podcasts[0].artistName}
        </Text>
        <Text style={styles.track}>
          {this.state.podcasts[0].trackName}
        </Text>
        <Text style={styles.description}>
          {this.state.playing.description}
        </Text>
        <Button style={styles.controlButtons}
          title="Play/Pause"
          onPress={_handlePlaySoundAsync}
        />
        <Button style={styles.controlButtons}
          title="Increase Speed"
          onPress={_handleIncreaseSpeed}
        />
        <Button style={styles.controlButtons}
          title="Decrease Speed"
          onPress={_handleDecreaseSpeed}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6e6e6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  artist: {
    fontSize: 15,
    fontWeight: "600",
    color: '#262626'
  },
  track: {
    fontSize: 12,
    fontWeight: "400",
    color: '#333333',
  },
  // controlButtons: {
  //   display: 'flex',
  // },
});

Expo.registerRootComponent(App);
