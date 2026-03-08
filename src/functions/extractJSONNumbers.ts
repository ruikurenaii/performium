export async function getAllNumberValues(data: any): Promise<number[]> {
  let numbers: number[] = [];

  if (typeof data === 'number') {
    numbers.push(data);
  } else if (typeof data === 'object' && data !== null) {
    if (Array.isArray(data)) {
      for (const item of data) {
        numbers = numbers.concat(await getAllNumberValues(item));
      }
    } else {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          numbers = numbers.concat(await getAllNumberValues(data[key]));
        }
      }
    }
  }

  return numbers;
}
