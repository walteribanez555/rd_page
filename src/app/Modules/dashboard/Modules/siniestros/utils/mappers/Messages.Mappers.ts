export enum signalString{
  signal_exclamation = "(exclamation)",
  signal_exclamation_inverse = "(exclamationinverse)",
  signal_interrogation = "(interrogation)",
  signal_interrogation_inverse = "(interrogationinverse)",

}



export function transformSignalstoString(input: string): string {
  const transformedString = input
  .replace(/!/g, signalString.signal_exclamation)
  .replace(/¡/g, signalString.signal_exclamation_inverse)
  .replace(/\?/g, signalString.signal_interrogation)
  .replace(/¿/g, signalString.signal_interrogation_inverse);

return transformedString;


}


export function trasnformStringtoSignals(input: string): string {
  const reversedString = input
    .replace(/\(exclamationinverse\)/g, "!")
    .replace(/\(exclamation\)/g, "¡")
    .replace(/\(interrogation\)/g, "?")
    .replace(/\(interrogationinverse\)/g, "¿");

  return reversedString;
}

