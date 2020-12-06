
export class SongValidator {
    constructor() {
        this.song = null;
    }

    setSong({song}){
        this.song = song;
    }

    validate(song){
        let validation = { hasError: false, message: null, song: null };
        const songValid = {...song};
      
        if (song.name === "") {
          validation.hasError = true;
          validation.message = "Song name is empty!";
        }
        else songValid.name = song.name;
      
        if (song.artist === "") {
          validation.hasError = true;
          validation.message = "Artist name is empty!";
        }
        else songValid.artist = song.artist;
      
        if (song.releaseDate === "") {
          validation.hasError = true;
          validation.message = "Release date is not a valid date!";
        }
        else songValid.releaseDate = new Date(Date.parse(song.releaseDate));
      
        if (song.downloaded === "") {
          validation.hasError = true;
          validation.message = "Downloaded field is empty!";
        }
        else songValid.downloaded = song.downloaded;
      
        validation.song = songValid;
        return validation;
      }
}

export default SongValidator;