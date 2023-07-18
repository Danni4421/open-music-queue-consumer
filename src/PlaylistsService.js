const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();

    this.getPlaylistDetails = this.getPlaylistDetails.bind(this);
    this.getSongsByPlaylistId = this.getSongsByPlaylistId.bind(this);
  }

  async getPlaylistDetails(playlistId) {
    const playlistQuery = {
      text: `
        SELECT 
        id,
        name
        FROM playlists 
          WHERE playlists.id = $1
      `,
      values: [playlistId],
    };

    const result = await this._pool.query(playlistQuery);

    if (!result.rows.length) {
      throw new Error('Gagal mendapatkan playlist, Id tidak ditemukan.');
    }

    return result.rows[0];
  }

  async getSongsByPlaylistId(playlistId) {
    const query = {
      text: `
        SELECT 
          s.id,
          s.title,
          s.performer
          FROM playlist_songs ps
            LEFT JOIN songs s ON s.id = ps.song_id
            WHERE ps.playlist_id = $1
      `,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = PlaylistsService;
