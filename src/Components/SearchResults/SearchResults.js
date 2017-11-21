import React, { Component } from 'react';
import { Tracklist } from '../TrackList/TrackList';
import './SearchResults.css';

export class SearchResults extends Component {
  render() {
    return (
      <div className="SearchResults">
        <h2>Results</h2>
        <TrackList tracks={this.props.searchResults} />
      </div>
    );
  }
}
