export class Validate {
  static email(mail: string) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return true;
    }
    return false;
  }

  static Password = (val: string) => {
    return val.length >= 6;
  };

  static phoneNumber = (phonenumber: string) => {
    const regExp = /(84|0(?:3|5|7|8|9))+([0-9]{8})\b/g
  
    const validPhoneNumber = regExp.test(phonenumber)
  
    return validPhoneNumber
  }
  
}
