class Validator {
  constructor() {

  }
  errorMsg = "";
  getError() { return errorMsg; }

  isBodyValid() {
    if (req.body == null) {
      errorMsg = "Invalid request parameters";
      return false;
    }
    return true;
  }

  minlength(input, minValue, name) {
    let inputLength = input.length;

    if (inputLength < minValue) {
      errorMsg = `${name} must be minimum of ${minValue} characters`;
      return false;
    }
    return true
  }

  // verifica se um input passou do limite de caracteres
  maxlength(input, maxValue) {
    let inputLength = input.value.length;

    let errorMessage = `O campo precisa ter menos que ${maxValue} caracteres`;

    if (inputLength > maxValue) {
      this.printMessage(input, errorMessage);
    }
  }

  // verifica se um input só contém letras
  onlyletters(input) {
    let re = /^[A-Za-z]+$/;;

    let inputValue = input.value;

    let errorMessage = "Este campo não aceita números nem caracteres especiais";

    if (!re.test(inputValue)) {
      this.printMessage(input, errorMessage);
    }
  }

  // verifica se um email é válido
  emailvalidate(input) {
    let re = /\S+@\S+\.\S+/;

    let email = input.value;

    let errorMessage = "Insira um email válido";

    if (!re.test(email)) {
      this.printMessage(input, errorMessage);
    }
  }



}

module.exports = {
  Validator
}