import { relocateElementToStart } from "./utils";

test('should relocate element to the start of the array', () => {
  const arr = [1, 2, 3];
  relocateElementToStart(arr, 2);
  expect(arr).toEqual([3, 1, 2]);
})

export default {};