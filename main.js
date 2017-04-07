import Expo from 'expo';
import React from 'react';
import { StyleSheet, Text, View, Button, Image} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

Expo.Audio.setIsEnabledAsync(true);

var playing = false;
var rate = 1.0;

class App extends React.Component {
  constructor() {
      super();
      this.state = {
          podcasts: 'Podcasts Loading',
          playing: {}
      }
    this.sound = '';
  }

  componentDidMount() {
    this.getPodcasts();
  }

  getPodcasts () {
    fetch('https://itunes.apple.com/search?term=black+astronauts+podcast')
      .then(response => response.json())
      .then(response => {
        this.setState({
          podcasts: response.results
        });
        console.warn(JSON.stringify(this.state.podcasts))
        this.postFeed(this.state.podcasts[0].feedUrl);
      })
      .catch(console.log);
  }

  postFeed (feedUrl) {
    console.warn(feedUrl)
    fetch('https://expo-tut-server.herokuapp.com/api/podcastParse', {
      method: 'post',
      body: JSON.stringify({
        url: feedUrl
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then(response => {console.warn('response: ', response);
      return response.json()})
    .then(podcastObj => {
      console.warn(podcastObj);
      this.setState({
        playing: podcastObj
      }, () => {this.sound = new Expo.Audio.Sound({
        source: this.state.playing.enclosure.url
      });
      console.warn(this.state.playing.enclosure.url);
      });
    })
    .catch(console.log);
  }


  _handlePlaySoundAsync () {
    if (playing) {
      this.sound.pauseAsync()
      playing = false;
    } else {
    this.sound.loadAsync()
    .then(() => {
      playing = true;
      this.sound.playAsync();
    })
    }
  }

  _handleIncreaseSpeed () {
    if (rate < 32) {
      rate += 0.25;
    }
    this.sound.setRateAsync(rate, true)
  }

  _handleDecreaseSpeed () {
    if (rate > 0) {
      rate -= 0.25;
    }
    this.sound.setRateAsync(rate, true)
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
          {this.state.playing.subtitle}
        </Text>
        <Button style={styles.controlButtons}
          title="Play/Pause"
          onPress={this._handlePlaySoundAsync}
        />
        <Button style={styles.controlButtons}
          title="Increase Speed"
          onPress={this._handleIncreaseSpeed}
        />
        <Button style={styles.controlButtons}
          title="Decrease Speed"
          onPress={this._handleDecreaseSpeed}
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
