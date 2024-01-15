export class StorageVersion {
  static isActualVersionStorage(){
    const version = localStorage.getItem('v_storage');
    const actualVersionStorage = '1';

    if(actualVersionStorage !== version){
      console.log("Reset Storage");
      localStorage.clear();
      localStorage.setItem('v_storage', actualVersionStorage);
    }


  }
}
