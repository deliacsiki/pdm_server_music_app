import dataStore from 'nedb-promise';
import SongValidator from './validator';

export class SongStore {
  constructor({ filename, autoload }) {
    this.store = dataStore({ filename, autoload });
    this.validator = new SongValidator();
  }
  
  async find(props) {
    return this.store.find(props);
  }
  
  async findOne(props) {
    return this.store.findOne(props);
  }
  
  async insert(song) {
    const validationResults = this.validator.validate(song);
    if(validationResults.hasError){
      throw new Error(validationResults.message);
    }
    return this.store.insert(validationResults.song);
  };
  
  async update(props, note) {
    return this.store.update(props, note);
  }
  
  async remove(props) {
    return this.store.remove(props);
  }
}

export default new SongStore({ filename: './db/songs.json', autoload: true });