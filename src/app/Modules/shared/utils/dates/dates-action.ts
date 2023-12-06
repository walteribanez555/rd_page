export class DatesAction {
  quantityBetweenDates(initialDate: string, finalDate: string) {
    const mappedInitialDate = new Date(initialDate);
    const mappedFinalDate = new Date(finalDate);

    const differenceMiliseconds = Math.abs(
      mappedFinalDate.getTime() - mappedInitialDate.getTime()
    );

    const diferenciaDays = Math.ceil(
      differenceMiliseconds / (1000 * 60 * 60 * 24)
    );

    return diferenciaDays + 1;
  }
}
