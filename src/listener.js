class Listener {
  constructor(mailSender, playlistsService) {
    this._mailSender = mailSender;
    this._playlistsService = playlistsService;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const parsedContent = JSON.parse(message.content.toString());
      const { playlistId, targetEmail } = parsedContent;
      const { id, name } = await this._playlistsService.getPlaylistDetails(
        playlistId
      );
      const songs = await this._playlistsService.getSongsByPlaylistId(
        playlistId
      );

      const content = {
        playlist: {
          id,
          name,
          songs,
        },
      };

      const result = await this._mailSender.sendMail(
        targetEmail,
        JSON.stringify(content)
      );

      console.log(content);

      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Listener;
