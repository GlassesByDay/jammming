import React, { Component } from 'react';
import './Track.css';
import { Track } from '../Track/Track';

export class TrackList extends Component {
  render() {
    return (
      <div className="TrackList">
        {this.props.tracks.map(track => {
          return <Track track={track} key={track.id} />;
        })}
      </div>
    );
  }
}
